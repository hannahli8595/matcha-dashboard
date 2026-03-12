import { readFileSync } from "fs";
import { resolve } from "path";

// Manually load .env.local
const envPath = resolve(process.cwd(), ".env.local");
let envRaw;
try {
  envRaw = readFileSync(envPath, "utf8");
} catch (e) {
  console.error("❌ Could not read .env.local:", e.message);
  process.exit(1);
}

// Parse .env.local manually
const env = {};
for (const line of envRaw.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  const val = trimmed.slice(eqIdx + 1).trim();
  env[key] = val;
}

console.log("\n── ENV CHECK ──────────────────────────────");
const keys = ["GOOGLE_CLIENT_ID","GOOGLE_CLIENT_SECRET","NEXTAUTH_URL","NEXTAUTH_SECRET","SPREADSHEET_ID","OWNER_EMAIL","GOOGLE_SERVICE_ACCOUNT_JSON"];
for (const k of keys) {
  const v = env[k];
  if (!v) { console.log(`❌ ${k}: MISSING`); }
  else if (k === "GOOGLE_SERVICE_ACCOUNT_JSON") { console.log(`✓  ${k}: set (${v.length} chars)`); }
  else { console.log(`✓  ${k}: ${v.slice(0,40)}${v.length>40?"…":""}`); }
}

// Parse service account JSON
console.log("\n── SERVICE ACCOUNT JSON ───────────────────");
const raw = env["GOOGLE_SERVICE_ACCOUNT_JSON"];
if (!raw) { console.error("❌ Not set, cannot continue"); process.exit(1); }

let sa;
try {
  sa = JSON.parse(raw);
  console.log("✓  JSON parses OK");
  console.log("   type:         ", sa.type);
  console.log("   client_email: ", sa.client_email);
  console.log("   project_id:   ", sa.project_id);
  const hasKey = typeof sa.private_key === "string" && sa.private_key.includes("BEGIN");
  console.log("   private_key:  ", hasKey ? "✓ present" : "❌ MISSING or malformed");
} catch (e) {
  console.error("❌ JSON parse failed:", e.message);
  process.exit(1);
}

// Try hitting the Sheets API
console.log("\n── SHEETS API TEST ────────────────────────");
try {
  const { google } = await import("googleapis");
  const auth = new google.auth.GoogleAuth({
    credentials: sa,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: env["SPREADSHEET_ID"],
    range: "raw_data!A1:C3",
  });
  const rows = res.data.values || [];
  console.log("✓  Sheets API responded");
  console.log("   First row sample:", JSON.stringify(rows[0]?.slice(0,3)));
} catch (e) {
  console.error("❌ Sheets API error:", e.message);
  if (e.message.includes("invalid_grant")) console.log("   → Service account credentials are invalid or expired");
  if (e.message.includes("403")) console.log("   → Service account doesn't have access to this sheet — share the sheet with the service account email");
  if (e.message.includes("404")) console.log("   → SPREADSHEET_ID is wrong");
}

console.log("\n───────────────────────────────────────────\n");
