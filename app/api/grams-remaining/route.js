import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getGramsRemainingMap } from "@/lib/sheets";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isOwner) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const map = await getGramsRemainingMap();
    return NextResponse.json(map);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
