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
"[project]/app/page.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PublicDashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/BarChart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/Bar.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/XAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/YAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Tooltip.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/CartesianGrid.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/shared.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const parseF = (v)=>parseFloat(v) || 0;
const yesVal = (v)=>[
        "y",
        "yes",
        "true",
        "1"
    ].includes((v || "").toLowerCase().trim());
function SectionTitle({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            borderBottom: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].ink}`,
            paddingBottom: 8,
            marginBottom: 18
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
            style: {
                fontFamily: "'Playfair Display',Georgia,serif",
                fontSize: 17,
                fontWeight: 700,
                color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].ink,
                margin: 0
            },
            children: children
        }, void 0, false, {
            fileName: "[project]/app/page.jsx",
            lineNumber: 15,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/page.jsx",
        lineNumber: 14,
        columnNumber: 10
    }, this);
}
_c = SectionTitle;
function Note({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            fontSize: 10,
            color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].mist,
            fontStyle: "italic",
            marginBottom: 16,
            lineHeight: 1.6,
            borderLeft: `2px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].warm}`,
            paddingLeft: 10
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/app/page.jsx",
        lineNumber: 19,
        columnNumber: 10
    }, this);
}
_c1 = Note;
function Th({ label, col, sortCol, sortDir, onSort }) {
    const active = sortCol === col;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
        onClick: ()=>onSort(col),
        style: {
            textAlign: "left",
            padding: "10px 14px",
            color: active ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].cream : __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].mist,
            fontSize: 9,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontWeight: 400,
            whiteSpace: "nowrap",
            cursor: "pointer",
            userSelect: "none",
            background: active ? "rgba(255,255,255,0.08)" : "transparent"
        },
        children: [
            label,
            active ? sortDir === "asc" ? " ↑" : " ↓" : ""
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.jsx",
        lineNumber: 23,
        columnNumber: 10
    }, this);
}
_c2 = Th;
function Dot({ color, opacity = 1 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        style: {
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: color,
            display: "inline-block",
            flexShrink: 0,
            opacity
        }
    }, void 0, false, {
        fileName: "[project]/app/page.jsx",
        lineNumber: 28,
        columnNumber: 10
    }, this);
}
_c3 = Dot;
const STATUS_COLORS = {
    "Opened": __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].moss,
    "Unopened": __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].sage,
    "Finished": __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].warm,
    "Pending": __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].gold
};
function PublicDashboard() {
    _s();
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [invSearch, setInvSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [invBrand, setInvBrand] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("All");
    const [invType, setInvType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("All");
    const [invSort, setInvSort] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        col: "Brand",
        dir: "asc"
    });
    const [chartSort, setChartSort] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("weight-desc");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PublicDashboard.useEffect": ()=>{
            fetch("/api/public-data").then({
                "PublicDashboard.useEffect": (r)=>r.json()
            }["PublicDashboard.useEffect"]).then({
                "PublicDashboard.useEffect": (d)=>{
                    setData(d);
                    setLoading(false);
                }
            }["PublicDashboard.useEffect"]).catch({
                "PublicDashboard.useEffect": ()=>{
                    setError("Failed to load");
                    setLoading(false);
                }
            }["PublicDashboard.useEffect"]);
        }
    }["PublicDashboard.useEffect"], []);
    const raw_data = data?.raw_data || [];
    const teaItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PublicDashboard.useMemo[teaItems]": ()=>raw_data.filter({
                "PublicDashboard.useMemo[teaItems]": (r)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isConsumable"])(r) && r.Status !== "Gave Away"
            }["PublicDashboard.useMemo[teaItems]"])
    }["PublicDashboard.useMemo[teaItems]"], [
        raw_data
    ]);
    const allBrands = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PublicDashboard.useMemo[allBrands]": ()=>[
                ...new Set(teaItems.map({
                    "PublicDashboard.useMemo[allBrands]": (r)=>r.Brand
                }["PublicDashboard.useMemo[allBrands]"]).filter(Boolean))
            ].sort()
    }["PublicDashboard.useMemo[allBrands]"], [
        teaItems
    ]);
    const allTypes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PublicDashboard.useMemo[allTypes]": ()=>[
                ...new Set(teaItems.map({
                    "PublicDashboard.useMemo[allTypes]": (r)=>r.Product_Type
                }["PublicDashboard.useMemo[allTypes]"]).filter(Boolean))
            ].sort()
    }["PublicDashboard.useMemo[allTypes]"], [
        teaItems
    ]);
    const filteredCollection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PublicDashboard.useMemo[filteredCollection]": ()=>{
            const rows = teaItems.filter({
                "PublicDashboard.useMemo[filteredCollection].rows": (r)=>(invBrand === "All" || r.Brand === invBrand) && (invType === "All" || r.Product_Type === invType) && (!invSearch || [
                        r.Brand,
                        r.Product_Name,
                        r.Origin,
                        r["Disclosed_Cultivars_(Matcha)"]
                    ].some({
                        "PublicDashboard.useMemo[filteredCollection].rows": (v)=>v?.toLowerCase().includes(invSearch.toLowerCase())
                    }["PublicDashboard.useMemo[filteredCollection].rows"]))
            }["PublicDashboard.useMemo[filteredCollection].rows"]);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sortRows"])(rows, invSort.col, invSort.dir);
        }
    }["PublicDashboard.useMemo[filteredCollection]"], [
        teaItems,
        invBrand,
        invType,
        invSearch,
        invSort
    ]);
    const tinChartData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PublicDashboard.useMemo[tinChartData]": ()=>{
            const [sortKey, sortDir] = chartSort.split("-");
            return teaItems.filter({
                "PublicDashboard.useMemo[tinChartData]": (r)=>parseF(r.Tin_Weight_g) > 0
            }["PublicDashboard.useMemo[tinChartData]"]).map({
                "PublicDashboard.useMemo[tinChartData]": (r)=>({
                        tin: r,
                        brand: r.Brand,
                        name: r.Product_Name,
                        weight: parseF(r.Tin_Weight_g),
                        status: r.Status
                    })
            }["PublicDashboard.useMemo[tinChartData]"]).sort({
                "PublicDashboard.useMemo[tinChartData]": (a, b)=>{
                    const cmp = sortKey === "brand" ? a.brand.localeCompare(b.brand) : b.weight - a.weight;
                    return sortDir === "desc" ? cmp : -cmp;
                }
            }["PublicDashboard.useMemo[tinChartData]"]);
        }
    }["PublicDashboard.useMemo[tinChartData]"], [
        teaItems,
        chartSort
    ]);
    const card = {
        background: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].parchment,
        padding: "22px 26px",
        borderRadius: 2
    };
    const selStyle = {
        background: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].cream,
        border: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].warm}`,
        color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].ink,
        padding: "6px 10px",
        fontSize: 11,
        borderRadius: 1,
        cursor: "pointer"
    };
    if (loading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            minHeight: "100vh",
            background: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].cream,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 16
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Mono:wght@300;400;500&display=swap');*{box-sizing:border-box;margin:0;padding:0;font-family:'DM Mono',monospace;}`
            }, void 0, false, {
                fileName: "[project]/app/page.jsx",
                lineNumber: 84,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 32,
                    fontFamily: "'Playfair Display',Georgia,serif",
                    color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].ink
                },
                children: "抹茶"
            }, void 0, false, {
                fileName: "[project]/app/page.jsx",
                lineNumber: 85,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 11,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].stone
                },
                children: "Loading…"
            }, void 0, false, {
                fileName: "[project]/app/page.jsx",
                lineNumber: 86,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.jsx",
        lineNumber: 83,
        columnNumber: 5
    }, this);
    if (error) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            minHeight: "100vh",
            background: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].cream,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Mono:wght@300;400;500&display=swap');*{box-sizing:border-box;margin:0;padding:0;}`
            }, void 0, false, {
                fileName: "[project]/app/page.jsx",
                lineNumber: 92,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].red,
                    fontSize: 13
                },
                children: error
            }, void 0, false, {
                fileName: "[project]/app/page.jsx",
                lineNumber: 93,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.jsx",
        lineNumber: 91,
        columnNumber: 5
    }, this);
    // Bar chart tick — wraps brand + product name into narrow multi-line labels
    const BAR_W = tinChartData.length > 20 ? 88 : tinChartData.length > 12 ? 104 : 120;
    const chartW = Math.max(600, tinChartData.length * BAR_W);
    const MultiLineTick = ({ x, y, index })=>{
        const d = tinChartData[index];
        if (!d) return null;
        const wrap = (s, max)=>{
            const words = s.split(" ");
            const lines = [];
            let cur = "";
            for (const w of words){
                if ((cur + " " + w).trim().length > max && cur) {
                    lines.push(cur.trim());
                    cur = w;
                } else cur = (cur + " " + w).trim();
            }
            if (cur) lines.push(cur);
            return lines.slice(0, 2);
        };
        const all = [
            ...wrap(d.brand, 11).map((l)=>({
                    text: l,
                    fill: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].stone,
                    size: 9,
                    fw: 600
                })),
            ...wrap(d.name, 11).map((l)=>({
                    text: l,
                    fill: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].mist,
                    size: 8,
                    fw: 400
                }))
        ];
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
            transform: `translate(${x},${y + 6})`,
            children: all.map((l, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                    textAnchor: "middle",
                    fill: l.fill,
                    fontSize: l.size,
                    fontWeight: l.fw,
                    dy: i * 13,
                    children: l.text
                }, i, false, {
                    fileName: "[project]/app/page.jsx",
                    lineNumber: 119,
                    columnNumber: 23
                }, this))
        }, void 0, false, {
            fileName: "[project]/app/page.jsx",
            lineNumber: 118,
            columnNumber: 12
        }, this);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Mono:wght@300;400;500&display=swap');
      *{box-sizing:border-box;margin:0;padding:0;font-family:'DM Mono',monospace;}
      ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].parchment}}::-webkit-scrollbar-thumb{background:${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].warm}}
      .hrow:hover{background:${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].warm}!important;}
    `
            }, void 0, false, {
                fileName: "[project]/app/page.jsx",
                lineNumber: 124,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    minHeight: "100vh",
                    background: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].cream,
                    color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].ink
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        style: {
                            borderBottom: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].ink}`
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                maxWidth: 1400,
                                margin: "0 auto",
                                padding: "18px 40px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                flexWrap: "wrap",
                                gap: 10
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 24,
                                                fontFamily: "'Playfair Display',Georgia,serif",
                                                fontWeight: 700
                                            },
                                            children: "抹茶 Collection"
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.jsx",
                                            lineNumber: 137,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 10,
                                                color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].stone,
                                                letterSpacing: "0.08em",
                                                marginTop: 3
                                            },
                                            children: "Matcha · Hojicha · Tea Powders · 2024–present"
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.jsx",
                                            lineNumber: 138,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.jsx",
                                    lineNumber: 136,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "/private",
                                    style: {
                                        fontSize: 10,
                                        color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].stone,
                                        letterSpacing: "0.1em",
                                        textTransform: "uppercase",
                                        textDecoration: "none",
                                        border: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].warm}`,
                                        padding: "5px 12px",
                                        borderRadius: 1
                                    },
                                    children: "Owner Login →"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.jsx",
                                    lineNumber: 140,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.jsx",
                            lineNumber: 135,
                            columnNumber: 9
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.jsx",
                        lineNumber: 134,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        style: {
                            padding: "32px 40px",
                            maxWidth: 1400,
                            margin: "0 auto",
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            gap: 32
                        },
                        children: [
                            tinChartData.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: card,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "flex-start",
                                            flexWrap: "wrap",
                                            gap: 12,
                                            marginBottom: 6
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    flex: 1
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                                                    children: "Collection by Tin Size"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.jsx",
                                                    lineNumber: 150,
                                                    columnNumber: 37
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.jsx",
                                                lineNumber: 150,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 8,
                                                    paddingBottom: 14
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: 10,
                                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].stone,
                                                            letterSpacing: "0.08em",
                                                            textTransform: "uppercase"
                                                        },
                                                        children: "Sort"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.jsx",
                                                        lineNumber: 152,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        value: chartSort,
                                                        onChange: (e)=>setChartSort(e.target.value),
                                                        style: selStyle,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "weight-desc",
                                                                children: "Heaviest → Lightest"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.jsx",
                                                                lineNumber: 154,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "weight-asc",
                                                                children: "Lightest → Heaviest"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.jsx",
                                                                lineNumber: 155,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "brand-asc",
                                                                children: "Brand A → Z"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.jsx",
                                                                lineNumber: 156,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "brand-desc",
                                                                children: "Brand Z → A"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.jsx",
                                                                lineNumber: 157,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/page.jsx",
                                                        lineNumber: 153,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.jsx",
                                                lineNumber: 151,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.jsx",
                                        lineNumber: 149,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Note, {
                                        children: "Each bar = one tin. Height = original weight in grams (g). Only tins with a known weight are shown. Consumption progress is not displayed. Duplicate tins are given away and not listed."
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.jsx",
                                        lineNumber: 161,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            gap: 14,
                                            fontSize: 10,
                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].stone,
                                            marginBottom: 14,
                                            flexWrap: "wrap"
                                        },
                                        children: Object.entries(STATUS_COLORS).map(([s, color])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 5
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            width: 10,
                                                            height: 10,
                                                            background: color,
                                                            display: "inline-block",
                                                            borderRadius: 1,
                                                            opacity: s === "Unopened" ? 0.45 : 1
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.jsx",
                                                        lineNumber: 165,
                                                        columnNumber: 19
                                                    }, this),
                                                    s
                                                ]
                                            }, s, true, {
                                                fileName: "[project]/app/page.jsx",
                                                lineNumber: 164,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.jsx",
                                        lineNumber: 162,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            overflowX: "auto",
                                            overflowY: "hidden"
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                width: chartW,
                                                height: 320
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BarChart"], {
                                                width: chartW,
                                                height: 320,
                                                data: tinChartData,
                                                margin: {
                                                    top: 4,
                                                    right: 16,
                                                    left: 0,
                                                    bottom: 90
                                                },
                                                barCategoryGap: "20%",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                                                        stroke: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].warm,
                                                        strokeDasharray: "3 3",
                                                        vertical: false
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.jsx",
                                                        lineNumber: 172,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XAxis"], {
                                                        dataKey: "brand",
                                                        tick: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MultiLineTick, {}, void 0, false, {
                                                            fileName: "[project]/app/page.jsx",
                                                            lineNumber: 173,
                                                            columnNumber: 48
                                                        }, void 0),
                                                        interval: 0,
                                                        height: 90
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.jsx",
                                                        lineNumber: 173,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["YAxis"], {
                                                        tick: {
                                                            fontSize: 9,
                                                            fill: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].stone
                                                        },
                                                        tickFormatter: (v)=>`${v}g`,
                                                        width: 36
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.jsx",
                                                        lineNumber: 174,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                                                        content: ({ active, payload })=>{
                                                            if (!active || !payload?.length) return null;
                                                            const d = payload[0]?.payload;
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    background: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].ink,
                                                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].cream,
                                                                    padding: "10px 14px",
                                                                    fontSize: 11,
                                                                    borderRadius: 2,
                                                                    lineHeight: 1.8,
                                                                    minWidth: 160
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            fontWeight: 600,
                                                                            marginBottom: 2
                                                                        },
                                                                        children: d?.brand
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/page.jsx",
                                                                        lineNumber: 179,
                                                                        columnNumber: 23
                                                                    }, void 0),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            opacity: 0.7,
                                                                            fontSize: 10,
                                                                            marginBottom: 6
                                                                        },
                                                                        children: d?.name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/page.jsx",
                                                                        lineNumber: 180,
                                                                        columnNumber: 23
                                                                    }, void 0),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                style: {
                                                                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].mist
                                                                                },
                                                                                children: "Size: "
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/page.jsx",
                                                                                lineNumber: 181,
                                                                                columnNumber: 28
                                                                            }, void 0),
                                                                            d?.weight,
                                                                            "g"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/page.jsx",
                                                                        lineNumber: 181,
                                                                        columnNumber: 23
                                                                    }, void 0),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            display: "flex",
                                                                            alignItems: "center",
                                                                            gap: 6,
                                                                            marginTop: 4
                                                                        },
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Dot, {
                                                                                color: STATUS_COLORS[d?.status] || __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].stone
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/page.jsx",
                                                                                lineNumber: 183,
                                                                                columnNumber: 25
                                                                            }, void 0),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                style: {
                                                                                    fontSize: 10,
                                                                                    opacity: 0.8
                                                                                },
                                                                                children: d?.status
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/page.jsx",
                                                                                lineNumber: 183,
                                                                                columnNumber: 73
                                                                            }, void 0)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/page.jsx",
                                                                        lineNumber: 182,
                                                                        columnNumber: 23
                                                                    }, void 0)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/page.jsx",
                                                                lineNumber: 178,
                                                                columnNumber: 28
                                                            }, void 0);
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.jsx",
                                                        lineNumber: 175,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Bar"], {
                                                        dataKey: "weight",
                                                        shape: (props)=>{
                                                            const { x, y, width, height, payload } = props;
                                                            const color = STATUS_COLORS[payload?.status] || __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].stone;
                                                            const isUnopened = payload?.status === "Unopened";
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                                        x: x,
                                                                        y: y,
                                                                        width: width,
                                                                        height: height,
                                                                        fill: color,
                                                                        rx: 2,
                                                                        fillOpacity: isUnopened ? 0.45 : 1
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/page.jsx",
                                                                        lineNumber: 192,
                                                                        columnNumber: 23
                                                                    }, void 0),
                                                                    isUnopened && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                                        x: x,
                                                                        y: y,
                                                                        width: width,
                                                                        height: height,
                                                                        fill: "none",
                                                                        stroke: color,
                                                                        strokeWidth: 1.5,
                                                                        strokeDasharray: "3 2",
                                                                        rx: 2
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/page.jsx",
                                                                        lineNumber: 193,
                                                                        columnNumber: 38
                                                                    }, void 0)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/page.jsx",
                                                                lineNumber: 191,
                                                                columnNumber: 28
                                                            }, void 0);
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.jsx",
                                                        lineNumber: 187,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.jsx",
                                                lineNumber: 171,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.jsx",
                                            lineNumber: 170,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.jsx",
                                        lineNumber: 169,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.jsx",
                                lineNumber: 148,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 16
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Note, {
                                        children: "Tea products only — matcha, hojicha, and other powders. Accessories and appliances are not listed. Duplicate items are given away and not listed here."
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.jsx",
                                        lineNumber: 204,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            alignItems: "flex-end",
                                            gap: 0,
                                            flexWrap: "wrap",
                                            paddingBottom: 12,
                                            borderBottom: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].warm}`
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    marginRight: 8
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: 9,
                                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].mist,
                                                            letterSpacing: "0.1em",
                                                            textTransform: "uppercase",
                                                            marginBottom: 4
                                                        },
                                                        children: "Brand"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.jsx",
                                                        lineNumber: 209,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        value: invBrand,
                                                        onChange: (e)=>setInvBrand(e.target.value),
                                                        style: {
                                                            ...selStyle,
                                                            minWidth: 160
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "All",
                                                                children: "All brands"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.jsx",
                                                                lineNumber: 211,
                                                                columnNumber: 17
                                                            }, this),
                                                            allBrands.map((b)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    children: b
                                                                }, b, false, {
                                                                    fileName: "[project]/app/page.jsx",
                                                                    lineNumber: 212,
                                                                    columnNumber: 35
                                                                }, this))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/page.jsx",
                                                        lineNumber: 210,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.jsx",
                                                lineNumber: 208,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    width: 160,
                                                    marginRight: 8
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.jsx",
                                                lineNumber: 216,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    marginRight: 8
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: 9,
                                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].mist,
                                                            letterSpacing: "0.1em",
                                                            textTransform: "uppercase",
                                                            marginBottom: 4
                                                        },
                                                        children: "Type"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.jsx",
                                                        lineNumber: 218,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        value: invType,
                                                        onChange: (e)=>setInvType(e.target.value),
                                                        style: {
                                                            ...selStyle,
                                                            minWidth: 120
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "All",
                                                                children: "All types"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.jsx",
                                                                lineNumber: 220,
                                                                columnNumber: 17
                                                            }, this),
                                                            allTypes.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    children: t
                                                                }, t, false, {
                                                                    fileName: "[project]/app/page.jsx",
                                                                    lineNumber: 221,
                                                                    columnNumber: 34
                                                                }, this))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/page.jsx",
                                                        lineNumber: 219,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.jsx",
                                                lineNumber: 217,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    flex: 1
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/app/page.jsx",
                                                lineNumber: 224,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "flex-end"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: 9,
                                                            color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].mist,
                                                            letterSpacing: "0.1em",
                                                            textTransform: "uppercase",
                                                            marginBottom: 4
                                                        },
                                                        children: "Search"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.jsx",
                                                        lineNumber: 226,
                                                        columnNumber: 15
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: "flex",
                                                            gap: 8,
                                                            alignItems: "center"
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                value: invSearch,
                                                                onChange: (e)=>setInvSearch(e.target.value),
                                                                placeholder: "Brand, name, origin, cultivar…",
                                                                style: {
                                                                    padding: "6px 12px",
                                                                    border: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].warm}`,
                                                                    background: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].cream,
                                                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].ink,
                                                                    fontSize: 11,
                                                                    borderRadius: 1,
                                                                    outline: "none",
                                                                    width: 260
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.jsx",
                                                                lineNumber: 228,
                                                                columnNumber: 17
                                                            }, this),
                                                            (invBrand !== "All" || invType !== "All" || invSearch) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>{
                                                                    setInvBrand("All");
                                                                    setInvType("All");
                                                                    setInvSearch("");
                                                                },
                                                                style: {
                                                                    padding: "5px 10px",
                                                                    fontSize: 10,
                                                                    border: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].red}`,
                                                                    background: "transparent",
                                                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].red,
                                                                    cursor: "pointer",
                                                                    borderRadius: 1
                                                                },
                                                                children: "Clear"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.jsx",
                                                                lineNumber: 232,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    fontSize: 10,
                                                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].mist,
                                                                    whiteSpace: "nowrap"
                                                                },
                                                                children: [
                                                                    filteredCollection.length,
                                                                    " items"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/page.jsx",
                                                                lineNumber: 236,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/page.jsx",
                                                        lineNumber: 227,
                                                        columnNumber: 15
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/page.jsx",
                                                lineNumber: 225,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/page.jsx",
                                        lineNumber: 207,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            background: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].parchment,
                                            borderRadius: 2,
                                            overflow: "hidden"
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                            style: {
                                                width: "100%",
                                                borderCollapse: "collapse",
                                                fontSize: 11
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        style: {
                                                            background: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].ink
                                                        },
                                                        children: [
                                                            [
                                                                "Brand",
                                                                "Brand"
                                                            ],
                                                            [
                                                                "Product_Name",
                                                                "Product Name"
                                                            ],
                                                            [
                                                                "Product_Type",
                                                                "Type"
                                                            ],
                                                            [
                                                                "Origin",
                                                                "Origin"
                                                            ],
                                                            [
                                                                "Disclosed_Cultivars_(Matcha)",
                                                                "Cultivars"
                                                            ],
                                                            [
                                                                "_Ceremonial_advertised?_(Matcha)",
                                                                "Ceremonial"
                                                            ],
                                                            [
                                                                "First-harvest?_(Matcha)",
                                                                "First Harvest"
                                                            ],
                                                            [
                                                                "Organic?_(Matcha)",
                                                                "Organic"
                                                            ],
                                                            [
                                                                "Tin_Weight_g",
                                                                "Size (g)"
                                                            ]
                                                        ].map(([col, label])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Th, {
                                                                label: label,
                                                                col: col,
                                                                sortCol: invSort.col,
                                                                sortDir: invSort.dir,
                                                                onSort: (c)=>setInvSort((s)=>({
                                                                            col: c,
                                                                            dir: s.col === c && s.dir === "asc" ? "desc" : "asc"
                                                                        }))
                                                            }, col, false, {
                                                                fileName: "[project]/app/page.jsx",
                                                                lineNumber: 257,
                                                                columnNumber: 21
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.jsx",
                                                        lineNumber: 245,
                                                        columnNumber: 17
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.jsx",
                                                    lineNumber: 244,
                                                    columnNumber: 15
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                    children: filteredCollection.map((r, i)=>{
                                                        const isMat = r.Product_Type === "Matcha";
                                                        const Check = ({ field })=>isMat ? yesVal(r[field]) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].moss,
                                                                    fontWeight: 700,
                                                                    fontSize: 13
                                                                },
                                                                children: "✓"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.jsx",
                                                                lineNumber: 267,
                                                                columnNumber: 25
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].mist
                                                                },
                                                                children: "—"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.jsx",
                                                                lineNumber: 268,
                                                                columnNumber: 25
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].mist
                                                                },
                                                                children: "—"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/page.jsx",
                                                                lineNumber: 269,
                                                                columnNumber: 23
                                                            }, this);
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                            className: "hrow",
                                                            style: {
                                                                borderBottom: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].warm}`,
                                                                background: i % 2 === 0 ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].cream : __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].parchment
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: "9px 14px",
                                                                        fontWeight: 600
                                                                    },
                                                                    children: r.Brand
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.jsx",
                                                                    lineNumber: 272,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: "9px 14px",
                                                                        color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].stone
                                                                    },
                                                                    children: r.Product_Name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.jsx",
                                                                    lineNumber: 273,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: "9px 14px"
                                                                    },
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            fontSize: 9,
                                                                            padding: "2px 7px",
                                                                            background: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].parchment,
                                                                            border: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].warm}`,
                                                                            borderRadius: 1,
                                                                            whiteSpace: "nowrap"
                                                                        },
                                                                        children: r.Product_Type
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/page.jsx",
                                                                        lineNumber: 275,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.jsx",
                                                                    lineNumber: 274,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: "9px 14px",
                                                                        color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].stone
                                                                    },
                                                                    children: r.Origin || "—"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.jsx",
                                                                    lineNumber: 277,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: "9px 14px",
                                                                        color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].stone,
                                                                        fontSize: 10,
                                                                        maxWidth: 160,
                                                                        overflow: "hidden",
                                                                        textOverflow: "ellipsis",
                                                                        whiteSpace: "nowrap"
                                                                    },
                                                                    title: r["Disclosed_Cultivars_(Matcha)"] || "",
                                                                    children: r["Disclosed_Cultivars_(Matcha)"] || "—"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.jsx",
                                                                    lineNumber: 278,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: "9px 14px",
                                                                        textAlign: "center"
                                                                    },
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Check, {
                                                                        field: "_Ceremonial_advertised?_(Matcha)"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/page.jsx",
                                                                        lineNumber: 281,
                                                                        columnNumber: 75
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.jsx",
                                                                    lineNumber: 281,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: "9px 14px",
                                                                        textAlign: "center"
                                                                    },
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Check, {
                                                                        field: "First-harvest?_(Matcha)"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/page.jsx",
                                                                        lineNumber: 282,
                                                                        columnNumber: 75
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.jsx",
                                                                    lineNumber: 282,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: "9px 14px",
                                                                        textAlign: "center"
                                                                    },
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Check, {
                                                                        field: "Organic?_(Matcha)"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/page.jsx",
                                                                        lineNumber: 283,
                                                                        columnNumber: 75
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.jsx",
                                                                    lineNumber: 283,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        padding: "9px 14px",
                                                                        color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].stone,
                                                                        textAlign: "right"
                                                                    },
                                                                    children: r.Tin_Weight_g ? Math.round(parseFloat(r.Tin_Weight_g)) : "—"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/page.jsx",
                                                                    lineNumber: 284,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, i, true, {
                                                            fileName: "[project]/app/page.jsx",
                                                            lineNumber: 271,
                                                            columnNumber: 21
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.jsx",
                                                    lineNumber: 262,
                                                    columnNumber: 15
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.jsx",
                                            lineNumber: 243,
                                            columnNumber: 13
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.jsx",
                                        lineNumber: 242,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.jsx",
                                lineNumber: 203,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.jsx",
                        lineNumber: 144,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                        style: {
                            borderTop: `1px solid ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].warm}`,
                            marginTop: 40
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                maxWidth: 1400,
                                margin: "0 auto",
                                padding: "16px 40px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontSize: 10,
                                        color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].mist,
                                        letterSpacing: "0.1em"
                                    },
                                    children: "抹茶 COLLECTION"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.jsx",
                                    lineNumber: 298,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontSize: 10,
                                        color: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$shared$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["C"].mist
                                    },
                                    children: "Matcha · Hojicha · Tea Powders · Public view"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.jsx",
                                    lineNumber: 299,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.jsx",
                            lineNumber: 297,
                            columnNumber: 9
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.jsx",
                        lineNumber: 296,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.jsx",
                lineNumber: 131,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true);
}
_s(PublicDashboard, "xwx+gS5KggH5If6hkmoCukJWtG4=");
_c4 = PublicDashboard;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "SectionTitle");
__turbopack_context__.k.register(_c1, "Note");
__turbopack_context__.k.register(_c2, "Th");
__turbopack_context__.k.register(_c3, "Dot");
__turbopack_context__.k.register(_c4, "PublicDashboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_59fdf0fd._.js.map