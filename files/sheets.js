import { google } from "googleapis";

// ── Column definitions ────────────────────────────────────────────────────────
// Public fields: safe to send to any visitor
export const PUBLIC_RAW_FIELDS = [
  "Tin_ID", "Brand", "Product_Name", "Product_Type", "Status",
  "Origin", "Disclosed_Cultivars_(Matcha)", "Tin_Weight_g", "How_I_obtained",
  "Date_received", "Expiration_Date",
];

// Private fields: only sent to owner
export const PRIVATE_RAW_FIELDS = [
  ...PUBLIC_RAW_FIELDS,
  "URL", "Owner", "Retail_Price", "Price/g",
  "Method_of_contact", "Obligation?", "Affiliate?",
  "Date_of_contact", "Due_date-Post", "Due_date-Post2",
  "_Ceremonial_advertised?_(Matcha)", "Organic?_(Matcha)", "First-harvest?_(Matcha)",
];

export const PUBLIC_DAILY_FIELDS = [
  // Daily consumption is always private — never sent publicly
];

export const PRIVATE_DAILY_FIELDS = [
  "Tin_ID", "Date", "Brand", "Type", "Name", "Grams_Used",
  "For_someone_else", "Latte", "Usucha", "Combo",
  "New_tin_opened", "Finished_tin_today", "Notes",
];

export const PRIVATE_POSTS_FIELDS = [
  "post_id", "post_date", "content_type", "post_category",
  "on_main_feed", "caption_text", "views", "likes",
  "saves", "shares", "comments", "follows",
];

// ── Auth ──────────────────────────────────────────────────────────────────────
function getAuth() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON not set");
  const credentials = JSON.parse(raw);
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
}

// ── Core fetch ────────────────────────────────────────────────────────────────
async function fetchSheet(sheetName) {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: sheetName,
  });
  const rows = res.data.values || [];
  if (rows.length < 2) return [];
  const headers = rows[0].map(h => h.trim());
  return rows.slice(1)
    .map(row => Object.fromEntries(headers.map((h, i) => [h, row[i] ?? ""])))
    .filter(r => Object.values(r).some(v => v && String(v).trim() !== ""));
}

// ── Write (for private/owner only) ───────────────────────────────────────────
function getWriteAuth() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON not set");
  const credentials = JSON.parse(raw);
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

export async function getHeaders(sheetName) {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: `${sheetName}!1:1`,
  });
  return (res.data.values?.[0] || []).map(h => h.trim());
}

export async function appendRowToSheet(sheetName, obj) {
  const auth = getWriteAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const headers = await getHeaders(sheetName);
  const row = headers.map(h => obj[h] ?? "");
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: sheetName,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });
}

export async function updateRowInSheet(sheetName, rowIndex, obj) {
  const auth = getWriteAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const headers = await getHeaders(sheetName);
  const row = headers.map(h => obj[h] ?? "");
  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: `${sheetName}!A${rowIndex}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });
}

export async function deleteRowFromSheet(sheetName, rowIndex) {
  const auth = getWriteAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const meta = await sheets.spreadsheets.get({ spreadsheetId: process.env.SPREADSHEET_ID });
  const sheet = meta.data.sheets.find(s => s.properties.title === sheetName);
  if (!sheet) throw new Error(`Sheet "${sheetName}" not found`);
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: process.env.SPREADSHEET_ID,
    requestBody: {
      requests: [{
        deleteDimension: {
          range: {
            sheetId: sheet.properties.sheetId,
            dimension: "ROWS",
            startIndex: rowIndex - 1,
            endIndex: rowIndex,
          },
        },
      }],
    },
  });
}

// ── Public data (field-filtered, no consumption, no prices) ──────────────────
export async function getPublicData() {
  const raw_data = await fetchSheet("raw_data");

  // Only expose public fields — strip everything else at the server
  const filteredRaw = raw_data.map(r =>
    Object.fromEntries(PUBLIC_RAW_FIELDS.map(f => [f, r[f] ?? ""]))
  );

  return { raw_data: filteredRaw };
}

// ── Private data (full, owner only) ──────────────────────────────────────────
export async function getPrivateData() {
  const [raw_data, daily, posts] = await Promise.all([
    fetchSheet("raw_data"),
    fetchSheet("Daily consumption"),
    fetchSheet("Posts"),
  ]);

  raw_data.forEach((r, i) => { r.__rowIndex = i + 2; });
  daily.forEach((r, i)   => { r.__rowIndex = i + 2; });
  posts.forEach((r, i)   => { r.__rowIndex = i + 2; });

  return { raw_data, daily, posts };
}
