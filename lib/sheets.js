import { google } from "googleapis";

// ── Column definitions ────────────────────────────────────────────────────────
// Public fields: safe to send to any visitor
export const PUBLIC_RAW_FIELDS = [
  "Tin_ID", "Brand", "Product_Name", "Product_Type", "Status",
  "Origin", "Disclosed_Cultivars_(Matcha)", "Single_Cultivar?_(Matcha)",
  "_Ceremonial_advertised?_(Matcha)", "Organic?_(Matcha)", "First-harvest?_(Matcha)",
  "Tin_Weight_g", "How_I_obtained", "Date_received", "Expiration_Date",
];

// Private fields: only sent to owner
export const PRIVATE_RAW_FIELDS = [
  "Tin_ID","Brand","URL","Owner","Product_Type","Product_Name","Origin",
  "Disclosed_Cultivars_(Matcha)","Single_Cultivar?_(Matcha)",
  "_Ceremonial_advertised?_(Matcha)","Organic?_(Matcha)","First-harvest?_(Matcha)",
  "Tin_Weight_g","Retail_Price","Price/g",
  "How_I_obtained","Method_of_contact","Obligation?","Affiliate?",
  "Date_of_contact","Date_received","Status","Expiration_Date",
  "Due_date-Post","Due_date-Post2",
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

export const PRIVATE_CASH_FIELDS = ["Date","Brand","Type","Amount","Method","Status"];
export const PRIVATE_CODES_FIELDS = ["Brand","Code","Link","Discount","Affiliate?","Dashboard_URL"];

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
export async function fetchSheetPublic(sheetName) { return fetchSheet(sheetName); }
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
    .map((row, i) => ({
      ...Object.fromEntries(headers.map((h, j) => [h, row[j] ?? ""])),
      __rowIndex: i + 2,  // actual sheet row number (1-indexed, +1 for header)
    }))
    .filter(r => Object.values(r).some((v, _, arr) =>
      // ignore __rowIndex when checking if row is empty
      Object.keys(r).filter(k => k !== "__rowIndex").some(k => r[k] && String(r[k]).trim() !== "")
    ));
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
  let headers = await getHeaders(sheetName);

  // If sheet has no headers yet, write them from the object keys
  if (headers.length === 0) {
    headers = Object.keys(obj).filter(k => k !== "__rowIndex");
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: `${sheetName}!A1`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [headers] },
    });
  }

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
  const [raw_data, daily, posts, cash, codes] = await Promise.all([
    fetchSheet("raw_data"),
    fetchSheet("daily_consumption"),
    fetchSheet("posts"),
    fetchSheet("cash_received").catch(()=>[]),
    fetchSheet("discount_codes").catch(()=>[]),
  ]);

  // __rowIndex is assigned in fetchSheet from actual sheet position

  return { raw_data, daily, posts, cash, codes };
}

// ── Share listings & claims ───────────────────────────────────────────────────
export const SHARE_LISTING_FIELDS = [
  "Tin_ID","Grams_Available","Notes","Active",
  "Suggestions", // JSON: [{name, grams}]
  // auto-filled from raw_data on write, stored for reads:
  "Brand","Product_Name","Origin","Disclosed_Cultivars_(Matcha)",
  "_Ceremonial_advertised?_(Matcha)","Organic?_(Matcha)","First-harvest?_(Matcha)",
  "Price/g","URL",
];

export const SHARE_CLAIM_FIELDS = [
  "Claim_ID","Tin_ID","Brand","Product_Name",
  "Name","Grams_Claimed","Timestamp","Status","Notes",
  "Order_Submitted",
];

export async function getShareData() {
  const [listings, claims, raw_data] = await Promise.all([
    fetchSheet("share_listings").catch(() => []),
    fetchSheet("share_claims").catch(() => []),
    fetchSheet("raw_data"),
  ]);

  // Enrich listings with latest raw_data fields (in case inventory updated)
  const rawMap = Object.fromEntries(raw_data.map(r => [r.Tin_ID, r]));
  const enriched = listings.map((l, i) => {
    const inv = rawMap[l.Tin_ID] || {};
    return {
      ...l,
      Brand: inv.Brand || l.Brand || "",
      Product_Name: inv.Product_Name || l.Product_Name || "",
      Origin: inv.Origin || l.Origin || "",
      "Disclosed_Cultivars_(Matcha)": inv["Disclosed_Cultivars_(Matcha)"] || l["Disclosed_Cultivars_(Matcha)"] || "",
      "_Ceremonial_advertised?_(Matcha)": inv["_Ceremonial_advertised?_(Matcha)"] || l["_Ceremonial_advertised?_(Matcha)"] || "",
      "Organic?_(Matcha)": inv["Organic?_(Matcha)"] || l["Organic?_(Matcha)"] || "",
      "First-harvest?_(Matcha)": inv["First-harvest?_(Matcha)"] || l["First-harvest?_(Matcha)"] || "",
      "Price/g": inv["Price/g"] || l["Price/g"] || "",
      URL: inv.URL || l.URL || "",
      Product_Type: inv.Product_Type || "",
      __rowIndex: l.__rowIndex,  // preserve actual sheet row from fetchSheet
    };
  });

  // __rowIndex already set in fetchSheet

  return { listings: enriched, claims };
}

// Generate a short edit code
export function generateEditCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

// ── Grams remaining per tin (tin_weight minus logged consumption) ──────────────
export async function getGramsRemainingMap() {
  const [raw, daily] = await Promise.all([
    fetchSheet("raw_data"),
    fetchSheet("daily_consumption").catch(() => []),
  ]);
  const consumed = {};
  daily.forEach(r => {
    const id = r.Tin_ID;
    if (!id) return;
    consumed[id] = (consumed[id] || 0) + (parseFloat(r.Grams_Used) || 0);
  });
  const map = {};
  raw.forEach(r => {
    const w = parseFloat(r.Tin_Weight_g) || 0;
    if (!w) return;
    map[r.Tin_ID] = Math.max(w - (consumed[r.Tin_ID] || 0), 0);
  });
  return map;
}
