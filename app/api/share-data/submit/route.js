import { getShareData, updateRowInSheet } from "@/lib/sheets";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { Name } = await req.json();
    if (!Name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });

    const { listings, claims } = await getShareData();
    const myClaims = claims.filter(c =>
      c.Name?.toLowerCase() === Name.trim().toLowerCase() &&
      c.Status?.toLowerCase() === "claimed" &&
      !c.Order_Submitted
    );

    if (myClaims.length === 0)
      return NextResponse.json({ error: "No unsubmitted claimed items found" }, { status: 400 });

    const submittedAt = new Date().toLocaleString("en-US");
    for (const claim of myClaims) {
      await updateRowInSheet("share_claims", claim.__rowIndex, {
        ...claim,
        Order_Submitted: submittedAt,
      });
    }

    const totalG = myClaims.reduce((s, c) => s + (parseFloat(c.Grams_Claimed) || 0), 0);
    return NextResponse.json({
      ok: true,
      submittedAt,
      claims: myClaims.map(c => ({
        Brand: c.Brand, Product_Name: c.Product_Name,
        Grams_Claimed: c.Grams_Claimed, Status: c.Status,
      })),
      totalG,
    });
  } catch (err) {
    console.error("Submit error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
