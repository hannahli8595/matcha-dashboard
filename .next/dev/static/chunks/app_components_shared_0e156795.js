(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/components/shared.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "C",
    ()=>C,
    "CONSUMABLE_TYPES",
    ()=>CONSUMABLE_TYPES,
    "PIE_COLORS",
    ()=>PIE_COLORS,
    "PRODUCT_TYPES",
    ()=>PRODUCT_TYPES,
    "YEAR_START",
    ()=>YEAR_START,
    "btnD",
    ()=>btnD,
    "btnP",
    ()=>btnP,
    "btnS",
    ()=>btnS,
    "daysSince",
    ()=>daysSince,
    "daysUntil",
    ()=>daysUntil,
    "fmtDate",
    ()=>fmtDate,
    "generateTinId",
    ()=>generateTinId,
    "getExpiry",
    ()=>getExpiry,
    "hasAffiliate",
    ()=>hasAffiliate,
    "inp",
    ()=>inp,
    "isConsumable",
    ()=>isConsumable,
    "isSelfConsumption",
    ()=>isSelfConsumption,
    "parseDate",
    ()=>parseDate,
    "parseGrams",
    ()=>parseGrams,
    "parsePrice",
    ()=>parsePrice,
    "sel",
    ()=>sel,
    "sortRows",
    ()=>sortRows,
    "tinPriority",
    ()=>tinPriority,
    "today",
    ()=>today,
    "todayDate",
    ()=>todayDate,
    "weekLabel",
    ()=>weekLabel
]);
"use client";
const C = {
    ink: "#1a1a18",
    stone: "#3d3d38",
    moss: "#4a5c3f",
    sage: "#7a9467",
    mist: "#b8c4aa",
    cream: "#f5f2eb",
    parchment: "#ede9df",
    warm: "#d4c9b0",
    accent: "#6b8f52",
    red: "#c0392b",
    gold: "#c8a84b",
    amber: "#d4854a"
};
const PIE_COLORS = [
    C.moss,
    C.sage,
    C.mist,
    C.warm,
    C.gold,
    C.stone,
    "#8fa882",
    "#d4b896"
];
const PRODUCT_TYPES = [
    "Matcha",
    "Hojicha",
    "Gyokuro",
    "Sencha",
    "Other Tea",
    "Appliance",
    "Accessory",
    "Tool",
    "Other"
];
const CONSUMABLE_TYPES = [
    "Matcha",
    "Hojicha",
    "Gyokuro",
    "Sencha",
    "Other Tea"
];
function isConsumable(r) {
    return CONSUMABLE_TYPES.includes(r.Product_Type);
}
function isSelfConsumption(row) {
    const v = row["For_someone_else"] || row["For_someone_else?"] || "";
    return v.toLowerCase() !== "y";
}
function hasAffiliate(r) {
    const v = (r["Affiliate?"] || r["Affiliate"] || "").trim().toLowerCase();
    return v !== "" && v !== "n" && v !== "no";
}
function parseDate(v) {
    if (!v) return null;
    const d = new Date(v);
    return isNaN(d) ? null : d;
}
function fmtDate(v, forceYear = false) {
    if (!v) return "";
    const d = parseDate(v);
    if (!d) return String(v);
    const thisYear = new Date().getFullYear();
    if (forceYear || d.getFullYear() !== thisYear) return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
    return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
    });
}
function todayDate() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
}
function today() {
    return new Date().toLocaleDateString("en-US");
}
function daysSince(dateStr) {
    const d = parseDate(dateStr);
    return d ? Math.floor((todayDate() - d) / 86400000) : null;
}
function daysUntil(dateStr) {
    const d = parseDate(dateStr);
    return d ? Math.ceil((d - todayDate()) / 86400000) : null;
}
function weekLabel(dateStr) {
    const d = parseDate(dateStr);
    if (!d) return null;
    const jan1 = new Date(d.getFullYear(), 0, 1);
    return `W${Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7)}`;
}
const YEAR_START = new Date("2026-01-01");
function getExpiry(tin) {
    if (tin.Expiration_Date?.trim()) {
        const d = parseDate(tin.Expiration_Date);
        return d ? {
            date: d,
            estimated: false
        } : null;
    }
    if (tin.Status === "Opened" && tin.Date_received?.trim()) {
        const d = parseDate(tin.Date_received);
        if (!d) return null;
        const est = new Date(d);
        est.setDate(est.getDate() + 105);
        return {
            date: est,
            estimated: true
        };
    }
    return null;
}
function tinPriority(tin) {
    if (tin.Status === "Finished" || tin.Status === "Gave Away" || tin.Status === "Gifted away") return 9999999;
    const exp = getExpiry(tin);
    if (!exp) return 99999;
    return Math.ceil((exp.date - todayDate()) / 86400000);
}
function parseGrams(v) {
    return parseFloat(v) || 0;
}
function parsePrice(v) {
    return parseFloat((v || "").replace(/[$,]/g, "")) || 0;
}
function generateTinId(brand, name) {
    const slug = (s)=>s.toUpperCase().replace(/[^A-Z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    const d = new Date();
    return `${slug(brand)}-${slug(name)}-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}
function sortRows(rows, col, dir) {
    return [
        ...rows
    ].sort((a, b)=>{
        let av = a[col] ?? "", bv = b[col] ?? "";
        const ad = parseDate(av), bd = parseDate(bv);
        if (ad && bd) return dir === "asc" ? ad - bd : bd - ad;
        const an = parseFloat(av), bn = parseFloat(bv);
        if (!isNaN(an) && !isNaN(bn)) return dir === "asc" ? an - bn : bn - an;
        return dir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
}
const inp = {
    width: "100%",
    padding: "8px 10px",
    border: `1px solid ${C.warm}`,
    background: C.parchment,
    color: C.ink,
    fontSize: 12,
    borderRadius: 1,
    outline: "none"
};
const sel = {
    background: C.cream,
    border: `1px solid ${C.warm}`,
    color: C.ink,
    padding: "6px 10px",
    fontSize: 11,
    borderRadius: 1,
    cursor: "pointer"
};
const btnP = {
    background: C.ink,
    color: C.cream,
    border: "none",
    padding: "10px 22px",
    fontSize: 11,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    cursor: "pointer",
    borderRadius: 1
};
const btnS = {
    background: "transparent",
    color: C.stone,
    border: `1px solid ${C.warm}`,
    padding: "10px 22px",
    fontSize: 11,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    cursor: "pointer",
    borderRadius: 1
};
const btnD = {
    background: C.red,
    color: C.cream,
    border: "none",
    padding: "10px 22px",
    fontSize: 11,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    cursor: "pointer",
    borderRadius: 1
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_components_shared_0e156795.js.map