module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/querystring [external] (querystring, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("querystring", () => require("querystring"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/auth.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authOptions",
    ()=>authOptions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$providers$2f$google$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/providers/google.js [app-route] (ecmascript)");
;
const authOptions = {
    providers: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$providers$2f$google$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks: {
        async session ({ session }) {
            session.user.isOwner = session.user.email === process.env.OWNER_EMAIL;
            return session;
        }
    },
    pages: {
        signIn: "/private"
    }
};
}),
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/punycode [external] (punycode, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("punycode", () => require("punycode"));

module.exports = mod;
}),
"[externals]/node:events [external] (node:events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:events", () => require("node:events"));

module.exports = mod;
}),
"[externals]/node:process [external] (node:process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:process", () => require("node:process"));

module.exports = mod;
}),
"[externals]/node:util [external] (node:util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:util", () => require("node:util"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/http2 [external] (http2, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http2", () => require("http2"));

module.exports = mod;
}),
"[externals]/process [external] (process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("process", () => require("process"));

module.exports = mod;
}),
"[project]/lib/sheets.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PRIVATE_CASH_FIELDS",
    ()=>PRIVATE_CASH_FIELDS,
    "PRIVATE_CODES_FIELDS",
    ()=>PRIVATE_CODES_FIELDS,
    "PRIVATE_DAILY_FIELDS",
    ()=>PRIVATE_DAILY_FIELDS,
    "PRIVATE_POSTS_FIELDS",
    ()=>PRIVATE_POSTS_FIELDS,
    "PRIVATE_RAW_FIELDS",
    ()=>PRIVATE_RAW_FIELDS,
    "PUBLIC_DAILY_FIELDS",
    ()=>PUBLIC_DAILY_FIELDS,
    "PUBLIC_RAW_FIELDS",
    ()=>PUBLIC_RAW_FIELDS,
    "SHARE_CLAIM_FIELDS",
    ()=>SHARE_CLAIM_FIELDS,
    "SHARE_LISTING_FIELDS",
    ()=>SHARE_LISTING_FIELDS,
    "appendRowToSheet",
    ()=>appendRowToSheet,
    "deleteRowFromSheet",
    ()=>deleteRowFromSheet,
    "fetchSheetPublic",
    ()=>fetchSheetPublic,
    "generateEditCode",
    ()=>generateEditCode,
    "getGramsRemainingMap",
    ()=>getGramsRemainingMap,
    "getHeaders",
    ()=>getHeaders,
    "getPrivateData",
    ()=>getPrivateData,
    "getPublicData",
    ()=>getPublicData,
    "getShareData",
    ()=>getShareData,
    "updateRowInSheet",
    ()=>updateRowInSheet
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$googleapis$2f$build$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/googleapis/build/src/index.js [app-route] (ecmascript)");
;
const PUBLIC_RAW_FIELDS = [
    "Tin_ID",
    "Brand",
    "Product_Name",
    "Product_Type",
    "Status",
    "Origin",
    "Disclosed_Cultivars_(Matcha)",
    "Single_Cultivar?_(Matcha)",
    "_Ceremonial_advertised?_(Matcha)",
    "Organic?_(Matcha)",
    "First-harvest?_(Matcha)",
    "Tin_Weight_g",
    "How_I_obtained",
    "Date_received",
    "Expiration_Date"
];
const PRIVATE_RAW_FIELDS = [
    "Tin_ID",
    "Brand",
    "URL",
    "Owner",
    "Product_Type",
    "Product_Name",
    "Origin",
    "Disclosed_Cultivars_(Matcha)",
    "Single_Cultivar?_(Matcha)",
    "_Ceremonial_advertised?_(Matcha)",
    "Organic?_(Matcha)",
    "First-harvest?_(Matcha)",
    "Tin_Weight_g",
    "Retail_Price",
    "Price/g",
    "How_I_obtained",
    "Method_of_contact",
    "Obligation?",
    "Affiliate?",
    "Date_of_contact",
    "Date_received",
    "Status",
    "Expiration_Date",
    "Due_date-Post",
    "Due_date-Post2"
];
const PUBLIC_DAILY_FIELDS = [];
const PRIVATE_DAILY_FIELDS = [
    "Tin_ID",
    "Date",
    "Brand",
    "Type",
    "Name",
    "Grams_Used",
    "For_someone_else",
    "Latte",
    "Usucha",
    "Combo",
    "New_tin_opened",
    "Finished_tin_today",
    "Notes"
];
const PRIVATE_POSTS_FIELDS = [
    "post_id",
    "post_date",
    "content_type",
    "post_category",
    "on_main_feed",
    "caption_text",
    "views",
    "likes",
    "saves",
    "shares",
    "comments",
    "follows"
];
const PRIVATE_CASH_FIELDS = [
    "Date",
    "Brand",
    "Type",
    "Amount",
    "Method",
    "Status"
];
const PRIVATE_CODES_FIELDS = [
    "Brand",
    "Code",
    "Link",
    "Discount",
    "Affiliate?",
    "Dashboard_URL"
];
// ── Auth ──────────────────────────────────────────────────────────────────────
function getAuth() {
    const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    if (!raw) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON not set");
    const credentials = JSON.parse(raw);
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$googleapis$2f$build$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["google"].auth.GoogleAuth({
        credentials,
        scopes: [
            "https://www.googleapis.com/auth/spreadsheets.readonly"
        ]
    });
}
async function fetchSheetPublic(sheetName) {
    return fetchSheet(sheetName);
}
async function fetchSheet(sheetName) {
    const auth = getAuth();
    const sheets = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$googleapis$2f$build$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["google"].sheets({
        version: "v4",
        auth
    });
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: sheetName
    });
    const rows = res.data.values || [];
    if (rows.length < 2) return [];
    const headers = rows[0].map((h)=>h.trim());
    return rows.slice(1).map((row, i)=>({
            ...Object.fromEntries(headers.map((h, j)=>[
                    h,
                    row[j] ?? ""
                ])),
            __rowIndex: i + 2
        })).filter((r)=>Object.values(r).some((v, _, arr)=>// ignore __rowIndex when checking if row is empty
            Object.keys(r).filter((k)=>k !== "__rowIndex").some((k)=>r[k] && String(r[k]).trim() !== "")));
}
// ── Write (for private/owner only) ───────────────────────────────────────────
function getWriteAuth() {
    const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    if (!raw) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON not set");
    const credentials = JSON.parse(raw);
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$googleapis$2f$build$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["google"].auth.GoogleAuth({
        credentials,
        scopes: [
            "https://www.googleapis.com/auth/spreadsheets"
        ]
    });
}
async function getHeaders(sheetName) {
    const auth = getAuth();
    const sheets = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$googleapis$2f$build$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["google"].sheets({
        version: "v4",
        auth
    });
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: `${sheetName}!1:1`
    });
    return (res.data.values?.[0] || []).map((h)=>h.trim());
}
async function appendRowToSheet(sheetName, obj) {
    const auth = getWriteAuth();
    const sheets = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$googleapis$2f$build$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["google"].sheets({
        version: "v4",
        auth
    });
    let headers = await getHeaders(sheetName);
    // If sheet has no headers yet, write them from the object keys
    if (headers.length === 0) {
        headers = Object.keys(obj).filter((k)=>k !== "__rowIndex");
        await sheets.spreadsheets.values.update({
            spreadsheetId: process.env.SPREADSHEET_ID,
            range: `${sheetName}!A1`,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [
                    headers
                ]
            }
        });
    }
    const row = headers.map((h)=>obj[h] ?? "");
    await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: sheetName,
        valueInputOption: "USER_ENTERED",
        requestBody: {
            values: [
                row
            ]
        }
    });
}
async function updateRowInSheet(sheetName, rowIndex, obj) {
    const auth = getWriteAuth();
    const sheets = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$googleapis$2f$build$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["google"].sheets({
        version: "v4",
        auth
    });
    const headers = await getHeaders(sheetName);
    const row = headers.map((h)=>obj[h] ?? "");
    await sheets.spreadsheets.values.update({
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: `${sheetName}!A${rowIndex}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
            values: [
                row
            ]
        }
    });
}
async function deleteRowFromSheet(sheetName, rowIndex) {
    const auth = getWriteAuth();
    const sheets = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$googleapis$2f$build$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["google"].sheets({
        version: "v4",
        auth
    });
    const meta = await sheets.spreadsheets.get({
        spreadsheetId: process.env.SPREADSHEET_ID
    });
    const sheet = meta.data.sheets.find((s)=>s.properties.title === sheetName);
    if (!sheet) throw new Error(`Sheet "${sheetName}" not found`);
    await sheets.spreadsheets.batchUpdate({
        spreadsheetId: process.env.SPREADSHEET_ID,
        requestBody: {
            requests: [
                {
                    deleteDimension: {
                        range: {
                            sheetId: sheet.properties.sheetId,
                            dimension: "ROWS",
                            startIndex: rowIndex - 1,
                            endIndex: rowIndex
                        }
                    }
                }
            ]
        }
    });
}
async function getPublicData() {
    const raw_data = await fetchSheet("raw_data");
    // Only expose public fields — strip everything else at the server
    const filteredRaw = raw_data.map((r)=>Object.fromEntries(PUBLIC_RAW_FIELDS.map((f)=>[
                f,
                r[f] ?? ""
            ])));
    return {
        raw_data: filteredRaw
    };
}
async function getPrivateData() {
    const [raw_data, daily, posts, cash, codes] = await Promise.all([
        fetchSheet("raw_data"),
        fetchSheet("daily_consumption"),
        fetchSheet("posts"),
        fetchSheet("cash_received").catch(()=>[]),
        fetchSheet("discount_codes").catch(()=>[])
    ]);
    // __rowIndex is assigned in fetchSheet from actual sheet position
    return {
        raw_data,
        daily,
        posts,
        cash,
        codes
    };
}
const SHARE_LISTING_FIELDS = [
    "Tin_ID",
    "Grams_Available",
    "Notes",
    "Active",
    "Suggestions",
    // auto-filled from raw_data on write, stored for reads:
    "Brand",
    "Product_Name",
    "Origin",
    "Disclosed_Cultivars_(Matcha)",
    "_Ceremonial_advertised?_(Matcha)",
    "Organic?_(Matcha)",
    "First-harvest?_(Matcha)",
    "Price/g",
    "URL"
];
const SHARE_CLAIM_FIELDS = [
    "Claim_ID",
    "Tin_ID",
    "Brand",
    "Product_Name",
    "Name",
    "Grams_Claimed",
    "Timestamp",
    "Status",
    "Notes",
    "Order_Submitted"
];
async function getShareData() {
    const [listings, claims, raw_data] = await Promise.all([
        fetchSheet("share_listings").catch(()=>[]),
        fetchSheet("share_claims").catch(()=>[]),
        fetchSheet("raw_data")
    ]);
    // Enrich listings with latest raw_data fields (in case inventory updated)
    const rawMap = Object.fromEntries(raw_data.map((r)=>[
            r.Tin_ID,
            r
        ]));
    const enriched = listings.map((l, i)=>{
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
            __rowIndex: l.__rowIndex
        };
    });
    // __rowIndex already set in fetchSheet
    return {
        listings: enriched,
        claims
    };
}
function generateEditCode() {
    return Math.random().toString(36).slice(2, 8).toUpperCase();
}
async function getGramsRemainingMap() {
    const [raw, daily] = await Promise.all([
        fetchSheet("raw_data"),
        fetchSheet("daily_consumption").catch(()=>[])
    ]);
    const consumed = {};
    daily.forEach((r)=>{
        const id = r.Tin_ID;
        if (!id) return;
        consumed[id] = (consumed[id] || 0) + (parseFloat(r.Grams_Used) || 0);
    });
    const map = {};
    raw.forEach((r)=>{
        const w = parseFloat(r.Tin_Weight_g) || 0;
        if (!w) return;
        map[r.Tin_ID] = Math.max(w - (consumed[r.Tin_ID] || 0), 0);
    });
    return map;
}
}),
"[project]/app/api/private-data/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "PATCH",
    ()=>PATCH,
    "POST",
    ()=>POST,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sheets$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/sheets.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
;
;
;
async function requireOwner() {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authOptions"]);
    if (!session?.user?.isOwner) return null;
    return session;
}
async function GET() {
    const session = await requireOwner();
    if (!session) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "Unauthorized"
    }, {
        status: 401
    });
    try {
        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sheets$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPrivateData"])();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(data);
    } catch (err) {
        console.error("Private data error:", err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to load data"
        }, {
            status: 500
        });
    }
}
async function POST(req) {
    const session = await requireOwner();
    if (!session) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "Unauthorized"
    }, {
        status: 401
    });
    try {
        const { sheetName, row } = await req.json();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sheets$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["appendRowToSheet"])(sheetName, row);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true
        });
    } catch (err) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: err.message
        }, {
            status: 500
        });
    }
}
async function PATCH(req) {
    const session = await requireOwner();
    if (!session) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "Unauthorized"
    }, {
        status: 401
    });
    try {
        const { sheetName, rowIndex, row } = await req.json();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sheets$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateRowInSheet"])(sheetName, rowIndex, row);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true
        });
    } catch (err) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: err.message
        }, {
            status: 500
        });
    }
}
async function DELETE(req) {
    const session = await requireOwner();
    if (!session) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "Unauthorized"
    }, {
        status: 401
    });
    try {
        const { sheetName, rowIndex } = await req.json();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sheets$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deleteRowFromSheet"])(sheetName, rowIndex);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true
        });
    } catch (err) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: err.message
        }, {
            status: 500
        });
    }
}
async function PUT(req) {
    const session = await requireOwner();
    if (!session) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "Unauthorized"
    }, {
        status: 401
    });
    try {
        const CONSUMABLE_TYPES = [
            "Matcha",
            "Hojicha",
            "Gyokuro",
            "Sencha",
            "Mugwort",
            "Other Tea"
        ];
        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sheets$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPrivateData"])();
        const STATUS_CANONICAL = {
            "pending": "Pending",
            "unopened": "Unopened",
            "opened": "Opened",
            "finished": "Finished",
            "gave away": "Gave Away",
            "gifted away": "Gave Away",
            "received": "Unopened",
            "n/a": "",
            "none": "",
            "—": ""
        };
        const rowsToFix = [];
        for (const row of data.raw_data){
            let fixed = {
                ...row
            };
            let changed = false;
            // Clear status for received non-consumables
            if (fixed.Status?.trim() && fixed.Date_received?.trim() && !CONSUMABLE_TYPES.includes(fixed.Product_Type)) {
                fixed.Status = "";
                changed = true;
            }
            // Normalise status casing for consumables
            const raw = fixed.Status?.trim();
            const canonical = STATUS_CANONICAL[raw?.toLowerCase()];
            if (canonical && canonical !== raw) {
                fixed.Status = canonical;
                changed = true;
            }
            if (changed) rowsToFix.push({
                row: fixed,
                rowIndex: row.__rowIndex
            });
        }
        for (const { row, rowIndex } of rowsToFix){
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sheets$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateRowInSheet"])("raw_data", rowIndex, row);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            fixed: rowsToFix.length
        });
    } catch (err) {
        console.error("Bulk fix error:", err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: err.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ca7a4286._.js.map