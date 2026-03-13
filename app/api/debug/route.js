export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET() {
  try {
    const key = process.env.GCP_PRIVATE_KEY || "";
    const email = process.env.GCP_CLIENT_EMAIL || "";
    
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: "service_account",
        client_email: email,
        private_key: key,
        private_key_id: process.env.GCP_PRIVATE_KEY_ID,
        project_id: process.env.GCP_PROJECT_ID,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const res = await sheets.spreadsheets.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
    });

    return NextResponse.json({ ok: true, title: res.data.properties.title });
  } catch (err) {
    return NextResponse.json({
      error: err.message,
      key_length: (process.env.GCP_PRIVATE_KEY||"").length,
      key_start: (process.env.GCP_PRIVATE_KEY||"").slice(0,60),
      key_end: (process.env.GCP_PRIVATE_KEY||"").slice(-60),
      email: process.env.GCP_CLIENT_EMAIL,
    });
  }
}
