import { getPublicData } from "@/lib/sheets";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getPublicData();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Public data error:", err);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}
