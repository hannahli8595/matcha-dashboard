export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { appendRowToSheet, updateRowInSheet, deleteRowFromSheet, fetchSheetPublic } from "@/lib/sheets";
import { NextResponse } from "next/server";
import { google } from "googleapis";

async function requireOwner() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isOwner) return null;
  return session;
}

function getDriveAuth() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  let credentials;
  if (raw) {
    try { credentials = JSON.parse(raw); } catch {}
  }
  if (!credentials) {
    const private_key = (process.env.GCP_PRIVATE_KEY || "");
    credentials = {
      type: "service_account",
      client_email: process.env.GCP_CLIENT_EMAIL,
      private_key,
      private_key_id: process.env.GCP_PRIVATE_KEY_ID,
      project_id: process.env.GCP_PROJECT_ID,
    };
  }
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  });
}

// POST — add expense row (+ optional file upload as base64)
export async function POST(req) {
  const session = await requireOwner();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { row, fileData, fileName, fileMime } = await req.json();
    let receiptUrl = row.Receipt_URL || "";

    // Upload file to Google Drive if provided
    if (fileData && fileName) {
      try {
        const auth = getDriveAuth();
        const drive = google.drive({ version: "v3", auth });
        const folderId = process.env.EXPENSE_RECEIPTS_FOLDER_ID || null;
        const buffer = Buffer.from(fileData, "base64");
        const res = await drive.files.create({
          requestBody: {
            name: fileName,
            mimeType: fileMime || "application/octet-stream",
            ...(folderId ? { parents: [folderId] } : {}),
          },
          media: { mimeType: fileMime || "application/octet-stream", body: require("stream").Readable.from(buffer) },
          fields: "id,webViewLink",
        });
        receiptUrl = res.data.webViewLink || "";
        // Make file viewable by anyone with link
        await drive.permissions.create({
          fileId: res.data.id,
          requestBody: { role: "reader", type: "anyone" },
        });
      } catch (uploadErr) {
        console.error("Drive upload failed (non-fatal):", uploadErr.message);
      }
    }

    const expenseRow = { ...row, Receipt_URL: receiptUrl };
    await appendRowToSheet("expenses", expenseRow);
    return NextResponse.json({ ok: true, receiptUrl });
  } catch (err) {
    console.error("Expense POST error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH — update expense row
export async function PATCH(req) {
  const session = await requireOwner();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { rowIndex, row, fileData, fileName, fileMime } = await req.json();
    let receiptUrl = row.Receipt_URL || "";

    if (fileData && fileName) {
      try {
        const auth = getDriveAuth();
        const drive = google.drive({ version: "v3", auth });
        const folderId = process.env.EXPENSE_RECEIPTS_FOLDER_ID || null;
        const buffer = Buffer.from(fileData, "base64");
        const res = await drive.files.create({
          requestBody: {
            name: fileName,
            mimeType: fileMime || "application/octet-stream",
            ...(folderId ? { parents: [folderId] } : {}),
          },
          media: { mimeType: fileMime || "application/octet-stream", body: require("stream").Readable.from(buffer) },
          fields: "id,webViewLink",
        });
        receiptUrl = res.data.webViewLink || "";
        await drive.permissions.create({
          fileId: res.data.id,
          requestBody: { role: "reader", type: "anyone" },
        });
      } catch (uploadErr) {
        console.error("Drive upload failed:", uploadErr.message);
      }
    }

    await updateRowInSheet("expenses", rowIndex, { ...row, Receipt_URL: receiptUrl });
    return NextResponse.json({ ok: true, receiptUrl });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE — delete expense row
export async function DELETE(req) {
  const session = await requireOwner();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { rowIndex } = await req.json();
    await deleteRowFromSheet("expenses", rowIndex);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
