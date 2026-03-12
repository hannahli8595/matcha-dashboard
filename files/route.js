import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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
