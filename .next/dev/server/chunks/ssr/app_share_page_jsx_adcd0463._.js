module.exports = [
"[project]/app/share/page.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SharePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function useMobile() {
    const [mobile, setMobile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const check = ()=>setMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return ()=>window.removeEventListener("resize", check);
    }, []);
    return mobile;
}
const C = {
    ink: "#1a1a18",
    cream: "#faf7f2",
    parchment: "#f3ede3",
    warm: "#e8ddd0",
    stone: "#8a7f72",
    mist: "#b8b0a5",
    moss: "#4a6741",
    sage: "#7a9e74",
    gold: "#c4963a",
    amber: "#d4854a",
    accent: "#5c7a9e",
    red: "#8b3a3a"
};
const font = `'DM Mono', monospace`;
const serif = `'Playfair Display', Georgia, serif`;
function estimateShipping(grams) {
    return {
        cost: Math.ceil(grams / 28)
    };
}
function shippingFor(grams) {
    return estimateShipping(grams);
}
function parseSuggestions(raw) {
    try {
        return JSON.parse(raw || "[]");
    } catch  {
        return [];
    }
}
function Flag({ label, value }) {
    if (value?.toLowerCase() !== "y") return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        style: {
            fontSize: 9,
            padding: "2px 7px",
            borderRadius: 1,
            border: `1px solid ${C.moss}`,
            color: C.moss,
            background: "#eef4ec",
            letterSpacing: "0.06em",
            textTransform: "uppercase"
        },
        children: label
    }, void 0, false, {
        fileName: "[project]/app/share/page.jsx",
        lineNumber: 34,
        columnNumber: 10
    }, this);
}
function GramsBar({ available, claimed }) {
    const pct = Math.min(claimed / available * 100, 100);
    const full = pct >= 100;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 10,
                    color: C.stone,
                    marginBottom: 4
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            claimed,
                            "g claimed of ",
                            available,
                            "g"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/share/page.jsx",
                        lineNumber: 41,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: full ? C.red : C.moss,
                            fontWeight: 600
                        },
                        children: full ? "sold out" : `${available - claimed}g left`
                    }, void 0, false, {
                        fileName: "[project]/app/share/page.jsx",
                        lineNumber: 42,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/share/page.jsx",
                lineNumber: 40,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    height: 4,
                    background: C.warm,
                    borderRadius: 2,
                    overflow: "hidden"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        width: `${pct}%`,
                        height: "100%",
                        background: full ? C.amber : C.moss,
                        borderRadius: 2,
                        transition: "width 0.4s"
                    }
                }, void 0, false, {
                    fileName: "[project]/app/share/page.jsx",
                    lineNumber: 45,
                    columnNumber: 7
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/share/page.jsx",
                lineNumber: 44,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/share/page.jsx",
        lineNumber: 39,
        columnNumber: 10
    }, this);
}
// ── Name modal ────────────────────────────────────────────────────────────────
function NameModal({ onClose, onName }) {
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [err, setErr] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const inp = {
        padding: "11px 14px",
        border: `1px solid ${C.warm}`,
        borderRadius: 1,
        fontSize: 14,
        fontFamily: font,
        background: C.parchment,
        color: C.ink,
        outline: "none",
        width: "100%"
    };
    function submit() {
        if (!name.trim()) return setErr("Please enter your name.");
        onName(name.trim());
        onClose();
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        onClick: (e)=>e.target === e.currentTarget && onClose(),
        style: {
            position: "fixed",
            inset: 0,
            background: "rgba(26,26,24,0.75)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                background: C.cream,
                width: "100%",
                maxWidth: 360,
                borderRadius: 2,
                overflow: "hidden"
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        background: C.ink,
                        padding: "20px 24px"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: 16,
                                fontFamily: serif,
                                fontWeight: 700,
                                color: C.cream
                            },
                            children: "Who are you?"
                        }, void 0, false, {
                            fileName: "[project]/app/share/page.jsx",
                            lineNumber: 64,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: 11,
                                color: C.stone,
                                marginTop: 4
                            },
                            children: "Enter once — then just pick grams and claim across everything."
                        }, void 0, false, {
                            fileName: "[project]/app/share/page.jsx",
                            lineNumber: 65,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/share/page.jsx",
                    lineNumber: 63,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        padding: "24px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 12
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            value: name,
                            onChange: (e)=>setName(e.target.value),
                            placeholder: "Your name",
                            style: inp,
                            autoFocus: true,
                            onKeyDown: (e)=>e.key === "Enter" && submit()
                        }, void 0, false, {
                            fileName: "[project]/app/share/page.jsx",
                            lineNumber: 68,
                            columnNumber: 11
                        }, this),
                        err && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: 11,
                                color: C.red
                            },
                            children: err
                        }, void 0, false, {
                            fileName: "[project]/app/share/page.jsx",
                            lineNumber: 70,
                            columnNumber: 17
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: submit,
                            style: {
                                padding: "12px",
                                background: C.moss,
                                color: C.cream,
                                border: "none",
                                borderRadius: 1,
                                cursor: "pointer",
                                fontSize: 12,
                                fontFamily: font,
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                fontWeight: 600
                            },
                            children: "Let's go →"
                        }, void 0, false, {
                            fileName: "[project]/app/share/page.jsx",
                            lineNumber: 71,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/share/page.jsx",
                    lineNumber: 67,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/share/page.jsx",
            lineNumber: 62,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/share/page.jsx",
        lineNumber: 60,
        columnNumber: 5
    }, this);
}
// ── Submit confirmation modal ─────────────────────────────────────────────────
function SubmitModal({ myClaims, listings, myName, onClose, onSubmitted }) {
    const [submitting, setSub] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [done, setDone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [err, setErr] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const totalG = myClaims.reduce((s, c)=>s + (parseFloat(c.Grams_Claimed) || 0), 0);
    const shTotal = Math.ceil(totalG / 28);
    async function handleSubmit() {
        setSub(true);
        setErr("");
        try {
            const res = await fetch("/api/share-data/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Name: myName
                })
            });
            const d = await res.json();
            if (!res.ok) {
                setErr(d.error || "Error");
                setSub(false);
                return;
            }
            setDone(d);
            onSubmitted();
        } catch  {
            setErr("Network error.");
            setSub(false);
        }
    }
    const row = (c, i)=>{
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "9px 0",
                borderBottom: `1px solid ${C.warm}`,
                gap: 12
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        flex: 1
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: 12,
                                fontWeight: 600,
                                color: C.ink
                            },
                            children: c.Brand
                        }, void 0, false, {
                            fileName: "[project]/app/share/page.jsx",
                            lineNumber: 105,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: 10,
                                color: C.stone
                            },
                            children: c.Product_Name
                        }, void 0, false, {
                            fileName: "[project]/app/share/page.jsx",
                            lineNumber: 106,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/share/page.jsx",
                    lineNumber: 104,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        textAlign: "right",
                        flexShrink: 0
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 12,
                            fontWeight: 600
                        },
                        children: [
                            c.Grams_Claimed,
                            "g"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/share/page.jsx",
                        lineNumber: 109,
                        columnNumber: 9
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/share/page.jsx",
                    lineNumber: 108,
                    columnNumber: 7
                }, this)
            ]
        }, i, true, {
            fileName: "[project]/app/share/page.jsx",
            lineNumber: 103,
            columnNumber: 12
        }, this);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        onClick: (e)=>e.target === e.currentTarget && !done && onClose(),
        style: {
            position: "fixed",
            inset: 0,
            background: "rgba(26,26,24,0.8)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                background: C.cream,
                width: "100%",
                maxWidth: 460,
                borderRadius: 2,
                overflow: "hidden",
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "column"
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        background: C.ink,
                        padding: "18px 24px",
                        flexShrink: 0
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: 15,
                                fontFamily: serif,
                                fontWeight: 700,
                                color: C.cream
                            },
                            children: done ? "Order submitted ✓" : "Review your order"
                        }, void 0, false, {
                            fileName: "[project]/app/share/page.jsx",
                            lineNumber: 120,
                            columnNumber: 11
                        }, this),
                        !done && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: 11,
                                color: C.stone,
                                marginTop: 3
                            },
                            children: "Once submitted, Hannah gets notified. You can still edit individual claims."
                        }, void 0, false, {
                            fileName: "[project]/app/share/page.jsx",
                            lineNumber: 121,
                            columnNumber: 19
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/share/page.jsx",
                    lineNumber: 119,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        padding: "20px 24px",
                        overflowY: "auto",
                        flex: 1
                    },
                    children: done ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    textAlign: "center",
                                    padding: "20px 0 12px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 40,
                                            marginBottom: 12
                                        },
                                        children: "🍵"
                                    }, void 0, false, {
                                        fileName: "[project]/app/share/page.jsx",
                                        lineNumber: 126,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 14,
                                            fontWeight: 700,
                                            color: C.moss,
                                            marginBottom: 6
                                        },
                                        children: "Order locked in!"
                                    }, void 0, false, {
                                        fileName: "[project]/app/share/page.jsx",
                                        lineNumber: 127,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 11,
                                            color: C.stone,
                                            lineHeight: 1.7
                                        },
                                        children: "Hannah has been notified. She'll be in touch about shipping soon."
                                    }, void 0, false, {
                                        fileName: "[project]/app/share/page.jsx",
                                        lineNumber: 128,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/share/page.jsx",
                                lineNumber: 125,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 16
                                },
                                children: myClaims.map(row)
                            }, void 0, false, {
                                fileName: "[project]/app/share/page.jsx",
                                lineNumber: 132,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    borderTop: `2px solid ${C.warm}`,
                                    marginTop: 8,
                                    paddingTop: 10,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    fontSize: 12,
                                    fontWeight: 600
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Shipping est."
                                    }, void 0, false, {
                                        fileName: "[project]/app/share/page.jsx",
                                        lineNumber: 136,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: C.moss
                                        },
                                        children: [
                                            "$",
                                            shTotal.toFixed(2)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/share/page.jsx",
                                        lineNumber: 136,
                                        columnNumber: 41
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/share/page.jsx",
                                lineNumber: 135,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            myClaims.map(row),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    borderTop: `2px solid ${C.warm}`,
                                    marginTop: 8,
                                    paddingTop: 10
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            justifyContent: "space-between",
                                            fontSize: 12,
                                            fontWeight: 600,
                                            marginBottom: 4
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Total"
                                            }, void 0, false, {
                                                fileName: "[project]/app/share/page.jsx",
                                                lineNumber: 142,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    totalG,
                                                    "g"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/share/page.jsx",
                                                lineNumber: 142,
                                                columnNumber: 35
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/share/page.jsx",
                                        lineNumber: 141,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            justifyContent: "space-between",
                                            fontSize: 12,
                                            fontWeight: 600
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Shipping est."
                                            }, void 0, false, {
                                                fileName: "[project]/app/share/page.jsx",
                                                lineNumber: 145,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    color: C.moss
                                                },
                                                children: [
                                                    "$",
                                                    shTotal.toFixed(2)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/share/page.jsx",
                                                lineNumber: 145,
                                                columnNumber: 43
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/share/page.jsx",
                                        lineNumber: 144,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 10,
                                            color: C.mist,
                                            marginTop: 6
                                        },
                                        children: "Final shipping confirmed before payment."
                                    }, void 0, false, {
                                        fileName: "[project]/app/share/page.jsx",
                                        lineNumber: 147,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/share/page.jsx",
                                lineNumber: 140,
                                columnNumber: 13
                            }, this),
                            err && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 11,
                                    color: C.red,
                                    marginTop: 8
                                },
                                children: err
                            }, void 0, false, {
                                fileName: "[project]/app/share/page.jsx",
                                lineNumber: 149,
                                columnNumber: 19
                            }, this)
                        ]
                    }, void 0, true)
                }, void 0, false, {
                    fileName: "[project]/app/share/page.jsx",
                    lineNumber: 123,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        padding: "16px 24px",
                        borderTop: `1px solid ${C.warm}`,
                        flexShrink: 0,
                        display: "flex",
                        gap: 10,
                        justifyContent: "flex-end"
                    },
                    children: done ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onClose,
                        style: {
                            padding: "9px 22px",
                            background: C.moss,
                            color: C.cream,
                            border: "none",
                            borderRadius: 1,
                            cursor: "pointer",
                            fontSize: 11,
                            fontFamily: font,
                            letterSpacing: "0.08em"
                        },
                        children: "Done"
                    }, void 0, false, {
                        fileName: "[project]/app/share/page.jsx",
                        lineNumber: 154,
                        columnNumber: 15
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                style: {
                                    padding: "9px 18px",
                                    background: "transparent",
                                    border: `1px solid ${C.warm}`,
                                    borderRadius: 1,
                                    cursor: "pointer",
                                    fontSize: 11,
                                    fontFamily: font,
                                    color: C.stone
                                },
                                children: "Go back"
                            }, void 0, false, {
                                fileName: "[project]/app/share/page.jsx",
                                lineNumber: 156,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleSubmit,
                                disabled: submitting,
                                style: {
                                    padding: "9px 22px",
                                    background: C.moss,
                                    color: C.cream,
                                    border: "none",
                                    borderRadius: 1,
                                    cursor: submitting ? "wait" : "pointer",
                                    fontSize: 11,
                                    fontFamily: font,
                                    letterSpacing: "0.08em",
                                    fontWeight: 600
                                },
                                children: submitting ? "Submitting…" : "Submit order →"
                            }, void 0, false, {
                                fileName: "[project]/app/share/page.jsx",
                                lineNumber: 157,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true)
                }, void 0, false, {
                    fileName: "[project]/app/share/page.jsx",
                    lineNumber: 152,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/share/page.jsx",
            lineNumber: 118,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/share/page.jsx",
        lineNumber: 116,
        columnNumber: 5
    }, this);
}
// ── Sticky order panel ────────────────────────────────────────────────────────
function OrderPanel({ myClaims, listings, myName, onSubmit, onCancelItem, submitted }) {
    const totalG = myClaims.reduce((s, c)=>s + (parseFloat(c.Grams_Claimed) || 0), 0);
    const shTotal = Math.ceil(totalG / 28);
    if (!myName) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            background: C.parchment,
            border: `1px solid ${C.warm}`,
            borderRadius: 2,
            padding: "20px 18px"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 12,
                    fontFamily: serif,
                    fontWeight: 700,
                    color: C.ink,
                    marginBottom: 6
                },
                children: "Your order"
            }, void 0, false, {
                fileName: "[project]/app/share/page.jsx",
                lineNumber: 175,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 11,
                    color: C.mist
                },
                children: "Enter your name to start claiming."
            }, void 0, false, {
                fileName: "[project]/app/share/page.jsx",
                lineNumber: 176,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/share/page.jsx",
        lineNumber: 174,
        columnNumber: 5
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            background: C.parchment,
            border: `1px solid ${C.warm}`,
            borderRadius: 2,
            overflow: "hidden",
            position: "sticky",
            top: 24
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    background: C.ink,
                    padding: "14px 18px"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 12,
                            fontFamily: serif,
                            fontWeight: 700,
                            color: C.cream
                        },
                        children: "Your order"
                    }, void 0, false, {
                        fileName: "[project]/app/share/page.jsx",
                        lineNumber: 183,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 10,
                            color: C.stone,
                            marginTop: 2
                        },
                        children: myName
                    }, void 0, false, {
                        fileName: "[project]/app/share/page.jsx",
                        lineNumber: 184,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/share/page.jsx",
                lineNumber: 182,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: "14px 18px"
                },
                children: myClaims.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        fontSize: 11,
                        color: C.mist,
                        padding: "12px 0",
                        textAlign: "center"
                    },
                    children: [
                        "No claims yet —",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/app/share/page.jsx",
                            lineNumber: 189,
                            columnNumber: 28
                        }, this),
                        "pick grams on any listing"
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/share/page.jsx",
                    lineNumber: 188,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        myClaims.map((c, i)=>{
                            const l = listings.find((l)=>l.Tin_ID === c.Tin_ID) || {};
                            const sh = shippingFor(parseFloat(c.Grams_Claimed) || 0, l);
                            const isSubmitted = !!c.Order_Submitted;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: "8px 0",
                                    borderBottom: `1px solid ${C.warm}`,
                                    display: "flex",
                                    gap: 8,
                                    alignItems: "flex-start"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: 1,
                                            minWidth: 0
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: 11,
                                                    fontWeight: 600,
                                                    color: C.ink,
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap"
                                                },
                                                children: c.Brand
                                            }, void 0, false, {
                                                fileName: "[project]/app/share/page.jsx",
                                                lineNumber: 198,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: 10,
                                                    color: C.stone,
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap"
                                                },
                                                children: c.Product_Name
                                            }, void 0, false, {
                                                fileName: "[project]/app/share/page.jsx",
                                                lineNumber: 199,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: 10,
                                                    color: C.mist,
                                                    marginTop: 2
                                                },
                                                children: [
                                                    c.Grams_Claimed,
                                                    "g"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/share/page.jsx",
                                                lineNumber: 200,
                                                columnNumber: 17
                                            }, this),
                                            isSubmitted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: 9,
                                                    color: C.moss,
                                                    marginTop: 2
                                                },
                                                children: "✓ submitted"
                                            }, void 0, false, {
                                                fileName: "[project]/app/share/page.jsx",
                                                lineNumber: 201,
                                                columnNumber: 31
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/share/page.jsx",
                                        lineNumber: 197,
                                        columnNumber: 15
                                    }, this),
                                    !isSubmitted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onCancelItem(c),
                                        style: {
                                            fontSize: 11,
                                            color: C.mist,
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            padding: "0 2px",
                                            flexShrink: 0,
                                            lineHeight: 1
                                        },
                                        children: "✕"
                                    }, void 0, false, {
                                        fileName: "[project]/app/share/page.jsx",
                                        lineNumber: 203,
                                        columnNumber: 30
                                    }, this)
                                ]
                            }, i, true, {
                                fileName: "[project]/app/share/page.jsx",
                                lineNumber: 196,
                                columnNumber: 20
                            }, this);
                        }),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginTop: 10,
                                paddingTop: 8,
                                borderTop: `2px solid ${C.warm}`
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "flex",
                                        justifyContent: "space-between",
                                        fontSize: 11,
                                        marginBottom: 3
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: C.stone
                                            },
                                            children: "Total"
                                        }, void 0, false, {
                                            fileName: "[project]/app/share/page.jsx",
                                            lineNumber: 211,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontWeight: 600
                                            },
                                            children: [
                                                totalG,
                                                "g"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/share/page.jsx",
                                            lineNumber: 212,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/share/page.jsx",
                                    lineNumber: 210,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "flex",
                                        justifyContent: "space-between",
                                        fontSize: 11
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: C.stone
                                            },
                                            children: "Shipping est."
                                        }, void 0, false, {
                                            fileName: "[project]/app/share/page.jsx",
                                            lineNumber: 215,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontWeight: 600,
                                                color: C.moss
                                            },
                                            children: [
                                                "$",
                                                shTotal.toFixed(2)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/share/page.jsx",
                                            lineNumber: 216,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/share/page.jsx",
                                    lineNumber: 214,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/share/page.jsx",
                            lineNumber: 209,
                            columnNumber: 11
                        }, this),
                        submitted ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginTop: 12,
                                padding: "8px 12px",
                                background: "#eef4ec",
                                border: `1px solid ${C.moss}`,
                                borderRadius: 1,
                                fontSize: 11,
                                color: C.moss,
                                fontWeight: 600,
                                textAlign: "center"
                            },
                            children: "Order submitted ✓"
                        }, void 0, false, {
                            fileName: "[project]/app/share/page.jsx",
                            lineNumber: 221,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onSubmit,
                            style: {
                                width: "100%",
                                marginTop: 12,
                                padding: "10px",
                                background: C.moss,
                                color: C.cream,
                                border: "none",
                                borderRadius: 1,
                                cursor: "pointer",
                                fontSize: 11,
                                fontFamily: font,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                fontWeight: 600
                            },
                            children: "Review & submit →"
                        }, void 0, false, {
                            fileName: "[project]/app/share/page.jsx",
                            lineNumber: 225,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: 9,
                                color: C.mist,
                                marginTop: 8,
                                textAlign: "center",
                                lineHeight: 1.5
                            },
                            children: [
                                "Submitting notifies Hannah.",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/app/share/page.jsx",
                                    lineNumber: 231,
                                    columnNumber: 40
                                }, this),
                                "You can still edit claims after."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/share/page.jsx",
                            lineNumber: 230,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true)
            }, void 0, false, {
                fileName: "[project]/app/share/page.jsx",
                lineNumber: 186,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/share/page.jsx",
        lineNumber: 181,
        columnNumber: 5
    }, this);
}
// ── Listing card ──────────────────────────────────────────────────────────────
function ListingCard({ listing, claims, myName, onClaimDone, onNeedName }) {
    const suggestions = parseSuggestions(listing.Suggestions);
    const tinClaims = claims.filter((c)=>c.Tin_ID === listing.Tin_ID && c.Status?.toLowerCase() === "claimed");
    const waitClaims = claims.filter((c)=>c.Tin_ID === listing.Tin_ID && c.Status?.toLowerCase() === "waitlist");
    const totalClaimed = tinClaims.reduce((s, c)=>s + (parseFloat(c.Grams_Claimed) || 0), 0);
    const available = parseFloat(listing.Grams_Available) || 0;
    const remaining = Math.max(available - totalClaimed, 0);
    const isFull = remaining <= 0;
    const myClaim = myName ? [
        ...tinClaims,
        ...waitClaims
    ].find((c)=>c.Name?.toLowerCase() === myName.toLowerCase()) : null;
    const mySug = myName ? suggestions.find((s)=>s.name?.toLowerCase() === myName.toLowerCase()) : null;
    const [grams, setGrams] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(myClaim ? String(myClaim.Grams_Claimed) : mySug ? String(mySug.grams) : "");
    const [sub, setSub] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [flash, setFlash] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null); // "claimed"|"updated"|"waitlist"
    const [err, setErr] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!grams) {
            if (mySug) setGrams(String(mySug.grams));
            else if (myClaim) setGrams(String(myClaim.Grams_Claimed));
        }
    }, [
        myName
    ]);
    async function handleClaim() {
        if (!myName) {
            onNeedName();
            return;
        }
        if (!grams || parseFloat(grams) <= 0) return setErr("Enter grams.");
        setSub(true);
        setErr("");
        try {
            if (myClaim) {
                const res = await fetch("/api/share-data", {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        Name: myName,
                        Tin_ID: listing.Tin_ID,
                        Grams_Claimed: parseFloat(grams)
                    })
                });
                const d = await res.json();
                if (!res.ok) {
                    setErr(d.error || "Error");
                    setSub(false);
                    return;
                }
                setFlash(d.status === "Waitlist" ? "waitlist" : "updated");
            } else {
                const res = await fetch("/api/share-data", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        Tin_ID: listing.Tin_ID,
                        Brand: listing.Brand,
                        Product_Name: listing.Product_Name,
                        Product_Type: listing.Product_Type || "",
                        Name: myName,
                        Grams_Claimed: parseFloat(grams)
                    })
                });
                const d = await res.json();
                if (!res.ok) {
                    setErr(d.error || "Error");
                    setSub(false);
                    return;
                }
                setFlash(d.isWaitlist ? "waitlist" : "claimed");
            }
            onClaimDone();
            setTimeout(()=>setFlash(null), 2500);
        } catch  {
            setErr("Network error.");
        }
        setSub(false);
    }
    async function handleCancel() {
        if (!myName) return;
        setSub(true);
        try {
            const res = await fetch("/api/share-data", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Name: myName,
                    Tin_ID: listing.Tin_ID,
                    cancel: true
                })
            });
            if (res.ok) {
                setGrams("");
                onClaimDone();
            } else {
                const d = await res.json();
                setErr(d.error || "Error");
            }
        } catch  {
            setErr("Network error.");
        }
        setSub(false);
    }
    const inp = {
        padding: "9px 12px",
        border: `1px solid ${C.warm}`,
        borderRadius: 1,
        fontSize: 13,
        fontFamily: font,
        background: C.parchment,
        color: C.ink,
        outline: "none",
        width: "100%"
    };
    const flashColors = {
        claimed: {
            bg: "#eef4ec",
            c: C.moss,
            t: "Claimed ✓"
        },
        updated: {
            bg: "#eef4ec",
            c: C.moss,
            t: "Updated ✓"
        },
        waitlist: {
            bg: "#fdf8e8",
            c: C.gold,
            t: "On waitlist ✓"
        }
    };
    const fc = flash ? flashColors[flash] : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            background: C.cream,
            border: `1px solid ${C.warm}`,
            borderRadius: 2,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    background: C.ink,
                    padding: "16px 20px"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 10,
                            color: C.mist,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            marginBottom: 3
                        },
                        children: listing.Product_Type || "Tea"
                    }, void 0, false, {
                        fileName: "[project]/app/share/page.jsx",
                        lineNumber: 308,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 16,
                            fontFamily: serif,
                            fontWeight: 700,
                            color: C.cream,
                            lineHeight: 1.2
                        },
                        children: listing.Brand
                    }, void 0, false, {
                        fileName: "[project]/app/share/page.jsx",
                        lineNumber: 309,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 11,
                            color: C.mist,
                            marginTop: 2
                        },
                        children: listing.Product_Name
                    }, void 0, false, {
                        fileName: "[project]/app/share/page.jsx",
                        lineNumber: 310,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/share/page.jsx",
                lineNumber: 307,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: "16px 20px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 11
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            gap: 5,
                            flexWrap: "wrap"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Flag, {
                                label: "Ceremonial",
                                value: listing["_Ceremonial_advertised?_(Matcha)"]
                            }, void 0, false, {
                                fileName: "[project]/app/share/page.jsx",
                                lineNumber: 314,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Flag, {
                                label: "Organic",
                                value: listing["Organic?_(Matcha)"]
                            }, void 0, false, {
                                fileName: "[project]/app/share/page.jsx",
                                lineNumber: 315,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Flag, {
                                label: "1st Harvest",
                                value: listing["First-harvest?_(Matcha)"]
                            }, void 0, false, {
                                fileName: "[project]/app/share/page.jsx",
                                lineNumber: 316,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/share/page.jsx",
                        lineNumber: 313,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 11,
                            color: C.stone,
                            display: "flex",
                            flexDirection: "column",
                            gap: 3
                        },
                        children: [
                            listing.Origin && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: C.mist
                                        },
                                        children: "Origin: "
                                    }, void 0, false, {
                                        fileName: "[project]/app/share/page.jsx",
                                        lineNumber: 319,
                                        columnNumber: 33
                                    }, this),
                                    listing.Origin
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/share/page.jsx",
                                lineNumber: 319,
                                columnNumber: 28
                            }, this),
                            listing["Disclosed_Cultivars_(Matcha)"] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: C.mist
                                        },
                                        children: "Cultivar: "
                                    }, void 0, false, {
                                        fileName: "[project]/app/share/page.jsx",
                                        lineNumber: 320,
                                        columnNumber: 58
                                    }, this),
                                    listing["Disclosed_Cultivars_(Matcha)"]
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/share/page.jsx",
                                lineNumber: 320,
                                columnNumber: 53
                            }, this),
                            listing["Price/g"] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: C.mist
                                        },
                                        children: "$/g: "
                                    }, void 0, false, {
                                        fileName: "[project]/app/share/page.jsx",
                                        lineNumber: 321,
                                        columnNumber: 37
                                    }, this),
                                    listing["Price/g"]
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/share/page.jsx",
                                lineNumber: 321,
                                columnNumber: 32
                            }, this),
                            listing.URL && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: listing.URL,
                                target: "_blank",
                                rel: "noreferrer",
                                style: {
                                    color: C.moss,
                                    fontSize: 10
                                },
                                children: "↗ Product page"
                            }, void 0, false, {
                                fileName: "[project]/app/share/page.jsx",
                                lineNumber: 322,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/share/page.jsx",
                        lineNumber: 318,
                        columnNumber: 9
                    }, this),
                    listing.Notes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 11,
                            color: C.stone,
                            background: C.parchment,
                            border: `1px solid ${C.warm}`,
                            padding: "7px 11px",
                            borderRadius: 1,
                            fontStyle: "italic"
                        },
                        children: listing.Notes
                    }, void 0, false, {
                        fileName: "[project]/app/share/page.jsx",
                        lineNumber: 324,
                        columnNumber: 25
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(GramsBar, {
                        available: available,
                        claimed: totalClaimed
                    }, void 0, false, {
                        fileName: "[project]/app/share/page.jsx",
                        lineNumber: 326,
                        columnNumber: 9
                    }, this),
                    mySug && !myClaim && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            background: "#f0f6ea",
                            border: `1px solid ${C.sage}`,
                            borderRadius: 1,
                            padding: "7px 11px",
                            fontSize: 11
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: C.moss,
                                    fontWeight: 600
                                },
                                children: [
                                    "✦ Suggested: ",
                                    mySug.grams,
                                    "g"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/share/page.jsx",
                                lineNumber: 329,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: C.stone
                                },
                                children: " — prefilled, adjust freely"
                            }, void 0, false, {
                                fileName: "[project]/app/share/page.jsx",
                                lineNumber: 330,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/share/page.jsx",
                        lineNumber: 328,
                        columnNumber: 27
                    }, this),
                    tinClaims.filter((c)=>c.Name?.toLowerCase() !== myName?.toLowerCase()).length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            gap: 2
                        },
                        children: tinClaims.filter((c)=>c.Name?.toLowerCase() !== myName?.toLowerCase()).map((c, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    justifyContent: "space-between",
                                    fontSize: 10,
                                    padding: "3px 0",
                                    borderBottom: `1px solid ${C.warm}`
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: C.mist
                                        },
                                        children: c.Name
                                    }, void 0, false, {
                                        fileName: "[project]/app/share/page.jsx",
                                        lineNumber: 337,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: C.stone
                                        },
                                        children: [
                                            c.Grams_Claimed,
                                            "g"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/share/page.jsx",
                                        lineNumber: 337,
                                        columnNumber: 61
                                    }, this)
                                ]
                            }, i, true, {
                                fileName: "[project]/app/share/page.jsx",
                                lineNumber: 336,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/share/page.jsx",
                        lineNumber: 334,
                        columnNumber: 11
                    }, this),
                    waitClaims.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 10,
                            color: C.amber
                        },
                        children: [
                            waitClaims.length,
                            " on waitlist"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/share/page.jsx",
                        lineNumber: 342,
                        columnNumber: 31
                    }, this),
                    myClaim && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            background: "#eef4ec",
                            border: `1px solid ${C.moss}`,
                            borderRadius: 1,
                            padding: "7px 11px",
                            fontSize: 11,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: C.moss,
                                            fontWeight: 600
                                        },
                                        children: [
                                            "Your claim: ",
                                            myClaim.Grams_Claimed,
                                            "g"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/share/page.jsx",
                                        lineNumber: 346,
                                        columnNumber: 13
                                    }, this),
                                    myClaim.Status === "Waitlist" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: C.amber,
                                            marginLeft: 6
                                        },
                                        children: "(waitlist)"
                                    }, void 0, false, {
                                        fileName: "[project]/app/share/page.jsx",
                                        lineNumber: 347,
                                        columnNumber: 43
                                    }, this),
                                    myClaim.Order_Submitted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: C.mist,
                                            marginLeft: 6,
                                            fontSize: 10
                                        },
                                        children: "submitted"
                                    }, void 0, false, {
                                        fileName: "[project]/app/share/page.jsx",
                                        lineNumber: 348,
                                        columnNumber: 39
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/share/page.jsx",
                                lineNumber: 345,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleCancel,
                                disabled: sub,
                                style: {
                                    fontSize: 10,
                                    color: C.red,
                                    background: "none",
                                    border: `1px solid ${C.red}`,
                                    borderRadius: 1,
                                    padding: "2px 7px",
                                    cursor: "pointer",
                                    fontFamily: font
                                },
                                children: "Cancel"
                            }, void 0, false, {
                                fileName: "[project]/app/share/page.jsx",
                                lineNumber: 350,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/share/page.jsx",
                        lineNumber: 344,
                        columnNumber: 19
                    }, this),
                    fc && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            background: fc.bg,
                            borderRadius: 1,
                            padding: "7px 11px",
                            fontSize: 11,
                            fontWeight: 700,
                            color: fc.c,
                            textAlign: "center",
                            transition: "opacity 0.3s"
                        },
                        children: fc.t
                    }, void 0, false, {
                        fileName: "[project]/app/share/page.jsx",
                        lineNumber: 354,
                        columnNumber: 14
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginTop: "auto",
                            display: "flex",
                            flexDirection: "column",
                            gap: 7
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    gap: 8,
                                    alignItems: "center"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        min: "1",
                                        placeholder: isFull ? "Waitlist grams" : "How many grams?",
                                        value: grams,
                                        onChange: (e)=>setGrams(e.target.value),
                                        onKeyDown: (e)=>e.key === "Enter" && handleClaim(),
                                        style: inp
                                    }, void 0, false, {
                                        fileName: "[project]/app/share/page.jsx",
                                        lineNumber: 358,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleClaim,
                                        disabled: sub || !grams,
                                        style: {
                                            padding: "9px 14px",
                                            border: "none",
                                            borderRadius: 1,
                                            cursor: sub ? "wait" : "pointer",
                                            whiteSpace: "nowrap",
                                            background: !grams ? C.warm : isFull ? C.amber : C.moss,
                                            color: C.cream,
                                            fontSize: 11,
                                            fontFamily: font,
                                            letterSpacing: "0.08em",
                                            fontWeight: 600,
                                            opacity: !grams ? 0.5 : 1
                                        },
                                        children: sub ? "…" : myClaim ? "Update" : isFull ? "Waitlist" : "Claim"
                                    }, void 0, false, {
                                        fileName: "[project]/app/share/page.jsx",
                                        lineNumber: 362,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/share/page.jsx",
                                lineNumber: 357,
                                columnNumber: 11
                            }, this),
                            err && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 11,
                                    color: C.red
                                },
                                children: err
                            }, void 0, false, {
                                fileName: "[project]/app/share/page.jsx",
                                lineNumber: 369,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/share/page.jsx",
                        lineNumber: 356,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/share/page.jsx",
                lineNumber: 312,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/share/page.jsx",
        lineNumber: 306,
        columnNumber: 5
    }, this);
}
// ── Main ──────────────────────────────────────────────────────────────────────
const TYPE_TABS = [
    "All",
    "Matcha",
    "Hojicha",
    "Other"
];
function typeTab(l, tab) {
    if (tab === "All") return true;
    const t = l.Product_Type || "";
    if (tab === "Other") return t !== "Matcha" && t !== "Hojicha";
    return t === tab;
}
function SharePage() {
    const mobile = useMobile();
    const [listings, setListings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [claims, setClaims] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [myName, setMyName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [showNameModal, setShowNM] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("All");
    const [refresh, setRefresh] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [showSubmit, setShowSubmit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [submitted, setSubmitted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        try {
            const n = sessionStorage.getItem("share_name");
            if (n) setMyName(n);
        } catch  {}
    }, []);
    function saveName(n) {
        setMyName(n);
        try {
            sessionStorage.setItem("share_name", n);
        } catch  {}
        ;
    }
    function clearName() {
        setMyName("");
        try {
            sessionStorage.removeItem("share_name");
        } catch  {}
        ;
    }
    const load = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        try {
            const res = await fetch("/api/share-data");
            const d = await res.json();
            setListings(d.listings || []);
            setClaims(d.claims || []);
        } catch  {}
        setLoading(false);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        load();
    }, [
        load,
        refresh
    ]);
    const myClaims = myName ? claims.filter((c)=>c.Name?.toLowerCase() === myName.toLowerCase() && c.Status?.toLowerCase() !== "cancelled") : [];
    const hasUnsubmitted = myClaims.some((c)=>!c.Order_Submitted && c.Status?.toLowerCase() === "claimed");
    async function handleCancelItem(claim) {
        try {
            await fetch("/api/share-data", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Name: myName,
                    Tin_ID: claim.Tin_ID,
                    cancel: true
                })
            });
            setRefresh((r)=>r + 1);
        } catch  {}
    }
    const filtered = listings.filter((l)=>typeTab(l, activeTab));
    const availableTabs = TYPE_TABS.filter((tab)=>tab === "All" || listings.some((l)=>typeTab(l, tab)));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Mono:wght@300;400;500&display=swap');
      *{box-sizing:border-box;margin:0;padding:0;}
      html,body{width:100%;overflow-x:hidden;background:${C.cream};font-family:'DM Mono',monospace;}
      input:focus{border-color:${C.moss}!important;box-shadow:0 0 0 2px rgba(74,103,65,0.1);}
      input[type=number]::-webkit-inner-spin-button{opacity:1;}
      .share-type-tabs::-webkit-scrollbar{display:none;}
    `
            }, void 0, false, {
                fileName: "[project]/app/share/page.jsx",
                lineNumber: 431,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    background: C.ink,
                    padding: mobile ? "16px 16px 0" : "28px 36px 0"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        maxWidth: 1100,
                        margin: "0 auto",
                        padding: mobile ? "0 16px" : 0
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                flexWrap: "wrap",
                                gap: 12,
                                paddingBottom: 20
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 10,
                                                color: C.mist,
                                                letterSpacing: "0.2em",
                                                textTransform: "uppercase",
                                                marginBottom: 6
                                            },
                                            children: "Share Drop"
                                        }, void 0, false, {
                                            fileName: "[project]/app/share/page.jsx",
                                            lineNumber: 445,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 26,
                                                fontFamily: serif,
                                                color: C.cream,
                                                fontWeight: 700
                                            },
                                            children: "抹茶 Samples"
                                        }, void 0, false, {
                                            fileName: "[project]/app/share/page.jsx",
                                            lineNumber: 446,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 11,
                                                color: C.stone,
                                                marginTop: 7,
                                                maxWidth: 440,
                                                lineHeight: 1.7
                                            },
                                            children: "Claim your grams. Stamps if it fits in an envelope, package rate if not. Submit when done."
                                        }, void 0, false, {
                                            fileName: "[project]/app/share/page.jsx",
                                            lineNumber: 447,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/share/page.jsx",
                                    lineNumber: 444,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-end",
                                        gap: 6,
                                        paddingTop: 4
                                    },
                                    children: myName ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: 10,
                                                    color: C.mist
                                                },
                                                children: "Claiming as"
                                            }, void 0, false, {
                                                fileName: "[project]/app/share/page.jsx",
                                                lineNumber: 453,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: 14,
                                                    fontWeight: 700,
                                                    color: C.cream
                                                },
                                                children: myName
                                            }, void 0, false, {
                                                fileName: "[project]/app/share/page.jsx",
                                                lineNumber: 454,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    clearName();
                                                    setShowNM(true);
                                                },
                                                style: {
                                                    fontSize: 10,
                                                    color: C.stone,
                                                    background: "none",
                                                    border: `1px solid #555`,
                                                    borderRadius: 1,
                                                    padding: "3px 10px",
                                                    cursor: "pointer",
                                                    fontFamily: font
                                                },
                                                children: "Change"
                                            }, void 0, false, {
                                                fileName: "[project]/app/share/page.jsx",
                                                lineNumber: 455,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowNM(true),
                                        style: {
                                            padding: "10px 22px",
                                            background: C.moss,
                                            color: C.cream,
                                            border: "none",
                                            borderRadius: 1,
                                            cursor: "pointer",
                                            fontSize: 11,
                                            fontFamily: font,
                                            letterSpacing: "0.1em",
                                            textTransform: "uppercase",
                                            fontWeight: 600
                                        },
                                        children: "Start claiming →"
                                    }, void 0, false, {
                                        fileName: "[project]/app/share/page.jsx",
                                        lineNumber: 456,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/share/page.jsx",
                                    lineNumber: 451,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/share/page.jsx",
                            lineNumber: 443,
                            columnNumber: 9
                        }, this),
                        availableTabs.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                overflowX: "auto",
                                WebkitOverflowScrolling: "touch",
                                scrollbarWidth: "none",
                                borderTop: `1px solid #333`
                            },
                            children: availableTabs.map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setActiveTab(tab),
                                    style: {
                                        padding: "10px 20px",
                                        border: "none",
                                        borderBottom: `2px solid ${activeTab === tab ? C.sage : "transparent"}`,
                                        background: "transparent",
                                        color: activeTab === tab ? C.cream : C.stone,
                                        fontSize: 11,
                                        fontFamily: font,
                                        cursor: "pointer",
                                        letterSpacing: "0.08em"
                                    },
                                    children: tab
                                }, tab, false, {
                                    fileName: "[project]/app/share/page.jsx",
                                    lineNumber: 464,
                                    columnNumber: 13
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/share/page.jsx",
                            lineNumber: 462,
                            columnNumber: 34
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/share/page.jsx",
                    lineNumber: 442,
                    columnNumber: 7
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/share/page.jsx",
                lineNumber: 441,
                columnNumber: 5
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "grid",
                    gridTemplateColumns: mobile ? "1fr" : "1fr 280px",
                    gap: mobile ? 0 : 28,
                    alignItems: "start",
                    maxWidth: 1100,
                    margin: "0 auto",
                    padding: mobile ? "16px" : "28px 24px"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            !myName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: C.parchment,
                                    border: `1px solid ${C.warm}`,
                                    borderRadius: 1,
                                    padding: "12px 18px",
                                    marginBottom: 20,
                                    fontSize: 11,
                                    color: C.stone,
                                    lineHeight: 1.7
                                },
                                children: [
                                    "👋 ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        style: {
                                            color: C.ink
                                        },
                                        children: "Enter your name once"
                                    }, void 0, false, {
                                        fileName: "[project]/app/share/page.jsx",
                                        lineNumber: 479,
                                        columnNumber: 14
                                    }, this),
                                    " to claim across all listings.",
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowNM(true),
                                        style: {
                                            color: C.moss,
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            fontFamily: font,
                                            fontSize: 11,
                                            fontWeight: 600,
                                            textDecoration: "underline"
                                        },
                                        children: "Let's go →"
                                    }, void 0, false, {
                                        fileName: "[project]/app/share/page.jsx",
                                        lineNumber: 480,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/share/page.jsx",
                                lineNumber: 478,
                                columnNumber: 19
                            }, this),
                            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    textAlign: "center",
                                    padding: "60px 0",
                                    color: C.mist
                                },
                                children: "Loading…"
                            }, void 0, false, {
                                fileName: "[project]/app/share/page.jsx",
                                lineNumber: 483,
                                columnNumber: 18
                            }, this) : filtered.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    textAlign: "center",
                                    padding: "60px 0"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 20,
                                            fontFamily: serif,
                                            color: C.stone,
                                            marginBottom: 8
                                        },
                                        children: listings.length === 0 ? "Nothing available right now" : `No ${activeTab} listings`
                                    }, void 0, false, {
                                        fileName: "[project]/app/share/page.jsx",
                                        lineNumber: 485,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 11,
                                            color: C.mist
                                        },
                                        children: listings.length > 0 ? "Try a different tab." : "Check back soon."
                                    }, void 0, false, {
                                        fileName: "[project]/app/share/page.jsx",
                                        lineNumber: 488,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/share/page.jsx",
                                lineNumber: 484,
                                columnNumber: 30
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "grid",
                                    gridTemplateColumns: mobile ? "1fr" : "repeat(auto-fill,minmax(260px,1fr))",
                                    gap: mobile ? 12 : 16
                                },
                                children: filtered.map((l, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ListingCard, {
                                        listing: l,
                                        claims: claims,
                                        myName: myName,
                                        onClaimDone: ()=>setRefresh((r)=>r + 1),
                                        onNeedName: ()=>setShowNM(true)
                                    }, l.Tin_ID || i, false, {
                                        fileName: "[project]/app/share/page.jsx",
                                        lineNumber: 492,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/share/page.jsx",
                                lineNumber: 490,
                                columnNumber: 10
                            }, this),
                            !loading && listings.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 28,
                                    fontSize: 10,
                                    color: C.mist,
                                    lineHeight: 1.8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        style: {
                                            color: C.stone
                                        },
                                        children: "Shipping:"
                                    }, void 0, false, {
                                        fileName: "[project]/app/share/page.jsx",
                                        lineNumber: 499,
                                        columnNumber: 11
                                    }, this),
                                    " ~$1 per 28g in a padded envelope. Full tins ship as packages ($5–$9). See your order panel for estimates. Final cost confirmed before payment."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/share/page.jsx",
                                lineNumber: 498,
                                columnNumber: 39
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/share/page.jsx",
                        lineNumber: 477,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            order: mobile ? -1 : 1
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(OrderPanel, {
                            myClaims: myClaims,
                            listings: listings,
                            myName: myName,
                            submitted: submitted,
                            onSubmit: ()=>setShowSubmit(true),
                            onCancelItem: handleCancelItem
                        }, void 0, false, {
                            fileName: "[project]/app/share/page.jsx",
                            lineNumber: 505,
                            columnNumber: 9
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/share/page.jsx",
                        lineNumber: 504,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/share/page.jsx",
                lineNumber: 475,
                columnNumber: 5
            }, this),
            showNameModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(NameModal, {
                onClose: ()=>setShowNM(false),
                onName: saveName
            }, void 0, false, {
                fileName: "[project]/app/share/page.jsx",
                lineNumber: 516,
                columnNumber: 21
            }, this),
            showSubmit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SubmitModal, {
                myClaims: myClaims.filter((c)=>c.Status?.toLowerCase() === "claimed"),
                listings: listings,
                myName: myName,
                onClose: ()=>setShowSubmit(false),
                onSubmitted: ()=>{
                    setSubmitted(true);
                    setRefresh((r)=>r + 1);
                }
            }, void 0, false, {
                fileName: "[project]/app/share/page.jsx",
                lineNumber: 517,
                columnNumber: 18
            }, this)
        ]
    }, void 0, true);
}
}),
];

//# sourceMappingURL=app_share_page_jsx_adcd0463._.js.map