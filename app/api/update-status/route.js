export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPrivateData, updateRowInSheet } from "@/lib/sheets";
import { NextResponse } from "next/server";

// POST: { Tin_ID, newStatus }
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isOwner) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { Tin_ID, newStatus } = await req.json();
    const data = await getPrivateData();
    const tin = (data.raw_data || []).find(r => r.Tin_ID === Tin_ID);
    if (!tin) return NextResponse.json({ error: `Tin_ID ${Tin_ID} not found` }, { status: 404 });
    if (!tin.__rowIndex) return NextResponse.json({ error: "No __rowIndex on tin", tin }, { status: 400 });
    
    console.log("[update-status] Tin:", Tin_ID, "rowIndex:", tin.__rowIndex, "current:", tin.Status, "→", newStatus);
    
    await updateRowInSheet("raw_data", tin.__rowIndex, { ...tin, Status: newStatus });
    
    // Re-read to verify
    const data2 = await getPrivateData();
    const tin2 = (data2.raw_data || []).find(r => r.Tin_ID === Tin_ID);
    
    return NextResponse.json({ 
      ok: true, 
      rowIndex: tin.__rowIndex,
      before: tin.Status, 
      after: tin2?.Status,
      verified: tin2?.Status === newStatus
    });
  } catch (err) {
    console.error("[update-status] Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
