import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getShareData, appendRowToSheet, updateRowInSheet, deleteRowFromSheet,
  getHeaders, fetchSheetPublic,
} from "@/lib/sheets";
import { NextResponse } from "next/server";

// ── GET — owner sees all; public sees active only ─────────────────────────────
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    const isOwner = session?.user?.isOwner;
    const { listings, claims } = await getShareData();
    if (isOwner) return NextResponse.json({ listings, claims });
    const activeListings = listings.filter(l => l.Active?.toLowerCase() === "y");
    return NextResponse.json({ listings: activeListings, claims });
  } catch (err) {
    console.error("Share GET error:", err);
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}

// helper: write a daily_consumption row for a claim
async function writeConsumptionRow(listing, name, grams, date) {
  const row = {
    Tin_ID: listing.Tin_ID || "",
    Date: date,
    Brand: listing.Brand || "",
    Type: listing.Product_Type || "",
    Name: listing.Product_Name || "",
    Grams_Used: grams,
    For_someone_else: name,
    Latte: "", Usucha: "", Combo: "",
    New_tin_opened: "", Finished_tin_today: "", Notes: "share_claim",
  };
  await appendRowToSheet("daily_consumption", row);
  // Return the row index it was written to
  const { getShareData: _g, ...rest } = await import("@/lib/sheets");
  return null; // row index will be fetched by re-reading sheet
}

// helper: find and delete consumption rows written for a claim (by Tin_ID + For_someone_else + Notes=share_claim)
async function deleteConsumptionForClaim(tinId, name) {
  const { default: sheets } = await import("@/lib/sheets");
  // We re-read daily_consumption to find matching rows
  const { getPrivateData } = await import("@/lib/sheets");
  const data = await getPrivateData();
  const matches = (data.daily || []).filter(r =>
    r.Tin_ID === tinId &&
    r.For_someone_else?.toLowerCase() === name?.toLowerCase() &&
    r.Notes === "share_claim"
  );
  // Delete in reverse order to preserve row indices
  for (const row of matches.reverse()) {
    if (row.__rowIndex) await deleteRowFromSheet("daily_consumption", row.__rowIndex);
  }
}

// ── POST — public: submit a new claim (name-only, no codes) ──────────────────
export async function POST(req) {
  try {
    const { Tin_ID, Brand, Product_Name, Product_Type, Name, Grams_Claimed, Notes } = await req.json();
    if (!Tin_ID || !Name?.trim() || !Grams_Claimed) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { listings, claims } = await getShareData();
    const listing = listings.find(l => l.Tin_ID === Tin_ID && l.Active?.toLowerCase() === "y");
    if (!listing) return NextResponse.json({ error: "Listing not found or inactive" }, { status: 404 });

    // Check if this person already has a claim for this tin
    const existing = claims.find(c =>
      c.Tin_ID === Tin_ID &&
      c.Name?.toLowerCase() === Name.trim().toLowerCase() &&
      c.Status?.toLowerCase() !== "cancelled"
    );
    if (existing) {
      return NextResponse.json({ error: "You already have a claim for this tin. Use the update button." }, { status: 409 });
    }

    const available = parseFloat(listing.Grams_Available) || 0;
    const claimed = claims
      .filter(c => c.Tin_ID === Tin_ID && c.Status?.toLowerCase() === "claimed")
      .reduce((s, c) => s + (parseFloat(c.Grams_Claimed) || 0), 0);
    const remaining = available - claimed;
    const requested = parseFloat(Grams_Claimed) || 0;
    const status = requested > remaining ? "Waitlist" : "Claimed";
    const date = new Date().toLocaleDateString("en-US");

    const row = {
      Claim_ID: `CLM-${Date.now()}`,
      Tin_ID,
      Brand: Brand || listing.Brand,
      Product_Name: Product_Name || listing.Product_Name,
      Product_Type: Product_Type || listing.Product_Type || "",
      Name: Name.trim(),
      Grams_Claimed: requested,
      Timestamp: new Date().toLocaleString("en-US"),
      Status: status,
      Notes: Notes || "",
    };

    await appendRowToSheet("share_claims", row);

    // Write daily_consumption entry
    if (status === "Claimed") {
      await appendRowToSheet("daily_consumption", {
        Tin_ID,
        Date: date,
        Brand: row.Brand,
        Type: row.Product_Type,
        Name: row.Product_Name,
        Grams_Used: requested,
        For_someone_else: Name.trim(),
        Latte: "", Usucha: "", Combo: "",
        New_tin_opened: "", Finished_tin_today: "", Notes: "share_claim",
      });
    }

    return NextResponse.json({ ok: true, status, isWaitlist: status === "Waitlist" });
  } catch (err) {
    console.error("Share POST error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── PATCH — public: update or cancel a claim by name ─────────────────────────
export async function PATCH(req) {
  try {
    const { Name, Tin_ID, Grams_Claimed, Notes, cancel } = await req.json();
    if (!Name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });

    const { listings, claims } = await getShareData();

    // Find claim by name + tin_id (if provided) or just name if only one claim
    let match;
    if (Tin_ID) {
      match = claims.find(c =>
        c.Tin_ID === Tin_ID &&
        c.Name?.trim().toLowerCase() === Name.trim().toLowerCase() &&
        c.Status?.toLowerCase() !== "cancelled"
      );
    } else {
      const nameMatches = claims.filter(c =>
        c.Name?.trim().toLowerCase() === Name.trim().toLowerCase() &&
        c.Status?.toLowerCase() !== "cancelled"
      );
      if (nameMatches.length === 1) match = nameMatches[0];
      else if (nameMatches.length > 1) {
        return NextResponse.json({ error: "Multiple claims found — please specify which tin", claims: nameMatches.map(c=>({Tin_ID:c.Tin_ID,Brand:c.Brand,Product_Name:c.Product_Name})) }, { status: 409 });
      }
    }

    if (!match) return NextResponse.json({ error: "No claim found for that name" }, { status: 404 });

    const date = new Date().toLocaleDateString("en-US");

    if (cancel) {
      await updateRowInSheet("share_claims", match.__rowIndex, { ...match, Status: "Cancelled" });
      // Remove consumption entry
      const { getPrivateData } = await import("@/lib/sheets");
      const data = await getPrivateData();
      const toDelete = (data.daily || []).filter(r =>
        r.Tin_ID === match.Tin_ID &&
        r.For_someone_else?.toLowerCase() === match.Name?.toLowerCase() &&
        r.Notes === "share_claim"
      ).reverse();
      for (const r of toDelete) if (r.__rowIndex) await deleteRowFromSheet("daily_consumption", r.__rowIndex);
      return NextResponse.json({ ok: true, status: "Cancelled" });
    }

    // Update grams
    const listing = listings.find(l => l.Tin_ID === match.Tin_ID);
    const available = listing ? parseFloat(listing.Grams_Available) || 0 : 0;
    const alreadyClaimed = claims
      .filter(c => c.Tin_ID === match.Tin_ID && c.Status?.toLowerCase() === "claimed" && c.Claim_ID !== match.Claim_ID)
      .reduce((s, c) => s + (parseFloat(c.Grams_Claimed) || 0), 0);
    const requested = parseFloat(Grams_Claimed) || parseFloat(match.Grams_Claimed);
    const newStatus = requested > (available - alreadyClaimed) ? "Waitlist" : "Claimed";

    await updateRowInSheet("share_claims", match.__rowIndex, {
      ...match, Grams_Claimed: requested, Status: newStatus, Notes: Notes ?? match.Notes,
      Timestamp: new Date().toLocaleString("en-US"),
    });

    // Update consumption entry: delete old, write new
    const { getPrivateData } = await import("@/lib/sheets");
    const data = await getPrivateData();
    const oldEntries = (data.daily || []).filter(r =>
      r.Tin_ID === match.Tin_ID &&
      r.For_someone_else?.toLowerCase() === match.Name?.toLowerCase() &&
      r.Notes === "share_claim"
    ).reverse();
    for (const r of oldEntries) if (r.__rowIndex) await deleteRowFromSheet("daily_consumption", r.__rowIndex);

    if (newStatus === "Claimed") {
      await appendRowToSheet("daily_consumption", {
        Tin_ID: match.Tin_ID,
        Date: date,
        Brand: match.Brand,
        Type: match.Product_Type || "",
        Name: match.Product_Name,
        Grams_Used: requested,
        For_someone_else: match.Name,
        Latte: "", Usucha: "", Combo: "",
        New_tin_opened: "", Finished_tin_today: "", Notes: "share_claim",
      });
    }

    return NextResponse.json({ ok: true, status: newStatus });
  } catch (err) {
    console.error("Share PATCH error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── PUT — owner only: create/update a listing ─────────────────────────────────
export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isOwner) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { listing, rowIndex } = await req.json();
    if (rowIndex) {
      await updateRowInSheet("share_listings", rowIndex, listing);
    } else {
      await appendRowToSheet("share_listings", listing);
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── DELETE — owner only ───────────────────────────────────────────────────────
export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isOwner) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { rowIndex } = await req.json();
    await deleteRowFromSheet("share_listings", rowIndex);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
