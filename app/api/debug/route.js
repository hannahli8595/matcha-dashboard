export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPrivateData } from "@/lib/sheets";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isOwner) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const data = await getPrivateData();
    const pendingRows = (data.raw_data || [])
      .filter(r => r.Status?.trim().toLowerCase() === "pending")
      .map(r => ({
        Tin_ID: r.Tin_ID,
        Brand: r.Brand,
        Status: r.Status,
        __rowIndex: r.__rowIndex,
        Date_received: r.Date_received,
        Product_Type: r.Product_Type,
      }));
    return NextResponse.json({ pendingRows, totalRawRows: data.raw_data?.length });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
