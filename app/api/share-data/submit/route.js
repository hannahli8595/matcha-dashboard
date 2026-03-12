export const dynamic = "force-dynamic";
import { getShareData, updateRowInSheet, appendRowToSheet } from "@/lib/sheets";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { Name } = await req.json();
    if (!Name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });

    const { listings, claims } = await getShareData();

    // Only submit claimed (not waitlist, not already submitted)
    const toSubmit = claims.filter(c =>
      c.Name?.toLowerCase() === Name.trim().toLowerCase() &&
      c.Status?.toLowerCase() === "claimed" &&
      !c.Order_Submitted
    );

    if (toSubmit.length === 0)
      return NextResponse.json({ error: "No unsubmitted claimed items found" }, { status: 400 });

    const submittedAt = new Date().toLocaleString("en-US");
    const date = new Date().toLocaleDateString("en-US");

    for (const claim of toSubmit) {
      // 1. Mark claim as submitted in share_claims
      await updateRowInSheet("share_claims", claim.__rowIndex, {
        ...claim,
        Order_Submitted: submittedAt,
      });

      // 2. Write to daily_consumption — one row per claimed item
      const listing = listings.find(l => l.Tin_ID === claim.Tin_ID) || {};
      await appendRowToSheet("daily_consumption", {
        Tin_ID: claim.Tin_ID,
        Date: date,
        Brand: claim.Brand || listing.Brand || "",
        Type: claim.Product_Type || listing.Product_Type || "",
        Name: claim.Product_Name || listing.Product_Name || "",
        Grams_Used: claim.Grams_Claimed,
        For_someone_else: Name.trim(),
        Latte: "", Usucha: "", Combo: "",
        New_tin_opened: "", Finished_tin_today: "",
        Notes: "share_claim",
      });
    }

    const totalG = toSubmit.reduce((s, c) => s + (parseFloat(c.Grams_Claimed) || 0), 0);
    return NextResponse.json({
      ok: true,
      submittedAt,
      totalG,
      claims: toSubmit.map(c => ({
        Brand: c.Brand,
        Product_Name: c.Product_Name,
        Grams_Claimed: c.Grams_Claimed,
      })),
    });
  } catch (err) {
    console.error("Submit error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
