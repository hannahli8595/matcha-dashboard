export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPrivateData, appendRowToSheet, updateRowInSheet, deleteRowFromSheet } from "@/lib/sheets";
import { NextResponse } from "next/server";

async function requireOwner() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isOwner) return null;
  return session;
}

// GET — fetch all private data
export async function GET() {
  const session = await requireOwner();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = await getPrivateData();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Private data error:", err);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}

// POST — append row
export async function POST(req) {
  const session = await requireOwner();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { sheetName, row } = await req.json();
    await appendRowToSheet(sheetName, row);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH — update row
export async function PATCH(req) {
  const session = await requireOwner();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { sheetName, rowIndex, row } = await req.json();
    await updateRowInSheet(sheetName, rowIndex, row);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE — delete row
export async function DELETE(req) {
  const session = await requireOwner();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { sheetName, rowIndex } = await req.json();
    await deleteRowFromSheet(sheetName, rowIndex);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT — bulk fix: clear Status for non-consumable rows that have Date_received
export async function PUT(req) {
  const session = await requireOwner();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const CONSUMABLE_TYPES = ["Matcha","Hojicha","Gyokuro","Sencha","Mugwort","Other Tea"];
    const data = await getPrivateData();
    const STATUS_CANONICAL = {
      "pending":"Pending","unopened":"Unopened","opened":"Opened",
      "finished":"Finished","gave away":"Gave Away","gifted away":"Gave Away",
      "received":"Unopened",  // "received" is not a valid status — map to Unopened
      "n/a":"","none":"","—":"",
    };
    const rowsToFix = [];
    for (const row of data.raw_data) {
      let fixed = { ...row };
      let changed = false;
      // Clear status for received non-consumables
      if (fixed.Status?.trim() && fixed.Date_received?.trim() && !CONSUMABLE_TYPES.includes(fixed.Product_Type)) {
        fixed.Status = "";
        changed = true;
      }
      // Normalise status casing for consumables
      const raw = fixed.Status?.trim();
      const canonical = STATUS_CANONICAL[raw?.toLowerCase()];
      if (canonical && canonical !== raw) {
        fixed.Status = canonical;
        changed = true;
      }
      if (changed) rowsToFix.push({ row: fixed, rowIndex: row.__rowIndex });
    }
    for (const { row, rowIndex } of rowsToFix) {
      await updateRowInSheet("raw_data", rowIndex, row);
    }
    return NextResponse.json({ fixed: rowsToFix.length });
  } catch (err) {
    console.error("Bulk fix error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
