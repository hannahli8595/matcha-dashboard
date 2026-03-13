export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.GCP_PRIVATE_KEY || "";
  return NextResponse.json({
    has_json: !!process.env.GOOGLE_SERVICE_ACCOUNT_JSON,
    has_email: !!process.env.GCP_CLIENT_EMAIL,
    has_key: !!process.env.GCP_PRIVATE_KEY,
    key_length: key.length,
    key_has_real_newlines: key.includes("\n"),
    key_has_escaped_newlines: key.includes("\\n"),
    key_start: key.slice(0, 40),
    spreadsheet_id: !!process.env.SPREADSHEET_ID,
    owner_email: !!process.env.OWNER_EMAIL,
  });
}
