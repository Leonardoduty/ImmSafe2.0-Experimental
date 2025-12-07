(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/navigation/navigation-bar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NavigationBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
"use client";
;
;
function NavigationBar({ onSOS }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "border-b border-border bg-card",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-between px-6 py-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                            className: "h-6 w-6 text-primary"
                        }, void 0, false, {
                            fileName: "[project]/components/navigation/navigation-bar.tsx",
                            lineNumber: 14,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-xl font-bold text-primary",
                            children: "SAFE ROUTE"
                        }, void 0, false, {
                            fileName: "[project]/components/navigation/navigation-bar.tsx",
                            lineNumber: 15,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-xs text-muted-foreground",
                            children: "Humanitarian Survival Planning"
                        }, void 0, false, {
                            fileName: "[project]/components/navigation/navigation-bar.tsx",
                            lineNumber: 16,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/navigation/navigation-bar.tsx",
                    lineNumber: 13,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onSOS,
                            className: "flex items-center gap-2 rounded-lg bg-accent px-4 py-2 font-semibold text-accent-foreground transition hover:shadow-lg hover:shadow-accent/50 danger-pulse",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                    className: "h-5 w-5"
                                }, void 0, false, {
                                    fileName: "[project]/components/navigation/navigation-bar.tsx",
                                    lineNumber: 24,
                                    columnNumber: 13
                                }, this),
                                "SOS"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/navigation/navigation-bar.tsx",
                            lineNumber: 20,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "/checklist",
                            className: "rounded-lg border border-border px-4 py-2 text-sm text-foreground transition hover:bg-card",
                            children: "Checklist"
                        }, void 0, false, {
                            fileName: "[project]/components/navigation/navigation-bar.tsx",
                            lineNumber: 28,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "/guides",
                            className: "rounded-lg border border-border px-4 py-2 text-sm text-foreground transition hover:bg-card",
                            children: "Guides"
                        }, void 0, false, {
                            fileName: "[project]/components/navigation/navigation-bar.tsx",
                            lineNumber: 35,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/navigation/navigation-bar.tsx",
                    lineNumber: 19,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/navigation/navigation-bar.tsx",
            lineNumber: 12,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/navigation/navigation-bar.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
_c = NavigationBar;
var _c;
__turbopack_context__.k.register(_c, "NavigationBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/language-guides.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Multi-language survival guides
__turbopack_context__.s([
    "LANGUAGE_GUIDES",
    ()=>LANGUAGE_GUIDES,
    "getAvailableLanguages",
    ()=>getAvailableLanguages,
    "getLanguageGuide",
    ()=>getLanguageGuide
]);
const LANGUAGE_GUIDES = {
    arabic: {
        language: "Arabic",
        code: "ar",
        title: "دليل البقاء على قيد الحياة",
        phrases: [
            {
                category: "Emergency",
                items: [
                    {
                        english: "Help",
                        translation: "مساعدة",
                        phonetic: "musa'ada"
                    },
                    {
                        english: "I need water",
                        translation: "أحتاج ماء",
                        phonetic: "ahtaj ma'an"
                    },
                    {
                        english: "I am lost",
                        translation: "أنا ضائع",
                        phonetic: "ana da'i"
                    },
                    {
                        english: "Where is the hospital?",
                        translation: "أين المستشفى؟",
                        phonetic: "ayna al-mustashfa?"
                    },
                    {
                        english: "I need food",
                        translation: "أحتاج طعام",
                        phonetic: "ahtaj ta'am"
                    }
                ]
            },
            {
                category: "Directions",
                items: [
                    {
                        english: "Where is...?",
                        translation: "أين...؟",
                        phonetic: "ayna...?"
                    },
                    {
                        english: "How far?",
                        translation: "كم المسافة؟",
                        phonetic: "kam al-masafa?"
                    },
                    {
                        english: "Left",
                        translation: "يسار",
                        phonetic: "yasar"
                    },
                    {
                        english: "Right",
                        translation: "يمين",
                        phonetic: "yamin"
                    },
                    {
                        english: "Straight",
                        translation: "مستقيم",
                        phonetic: "mustaqim"
                    }
                ]
            }
        ]
    },
    turkish: {
        language: "Turkish",
        code: "tr",
        title: "Hayatta Kalma Rehberi",
        phrases: [
            {
                category: "Emergency",
                items: [
                    {
                        english: "Help",
                        translation: "Yardım",
                        phonetic: "yar-dim"
                    },
                    {
                        english: "I need water",
                        translation: "Suya ihtiyacım var",
                        phonetic: "su-ya ih-ti-ya-jim var"
                    },
                    {
                        english: "I am lost",
                        translation: "Kayboldum",
                        phonetic: "kay-bol-dum"
                    },
                    {
                        english: "Where is the hospital?",
                        translation: "Hastane nerede?",
                        phonetic: "has-ta-ne ne-re-de?"
                    },
                    {
                        english: "I need food",
                        translation: "Yemeğe ihtiyacım var",
                        phonetic: "ye-me-ge ih-ti-ya-jim var"
                    }
                ]
            },
            {
                category: "Directions",
                items: [
                    {
                        english: "Where is...?",
                        translation: "... nerede?",
                        phonetic: "... ne-re-de?"
                    },
                    {
                        english: "How far?",
                        translation: "Ne kadar uzak?",
                        phonetic: "ne ka-dar u-zak?"
                    },
                    {
                        english: "Left",
                        translation: "Sol",
                        phonetic: "sol"
                    },
                    {
                        english: "Right",
                        translation: "Sağ",
                        phonetic: "sağ"
                    },
                    {
                        english: "Straight",
                        translation: "Düz",
                        phonetic: "duz"
                    }
                ]
            }
        ]
    },
    french: {
        language: "French",
        code: "fr",
        title: "Guide de Survie",
        phrases: [
            {
                category: "Emergency",
                items: [
                    {
                        english: "Help",
                        translation: "Aide",
                        phonetic: "ed"
                    },
                    {
                        english: "I need water",
                        translation: "J'ai besoin d'eau",
                        phonetic: "zhay buh-zwan doh"
                    },
                    {
                        english: "I am lost",
                        translation: "Je suis perdu",
                        phonetic: "zhuh swee per-doo"
                    },
                    {
                        english: "Where is the hospital?",
                        translation: "Où est l'hôpital?",
                        phonetic: "oo ay loh-pee-tal?"
                    },
                    {
                        english: "I need food",
                        translation: "J'ai besoin de nourriture",
                        phonetic: "zhay buh-zwan duh noo-ree-tur"
                    }
                ]
            },
            {
                category: "Directions",
                items: [
                    {
                        english: "Where is...?",
                        translation: "Où est...?",
                        phonetic: "oo ay...?"
                    },
                    {
                        english: "How far?",
                        translation: "À quelle distance?",
                        phonetic: "ah kel dis-tans?"
                    },
                    {
                        english: "Left",
                        translation: "Gauche",
                        phonetic: "gohsh"
                    },
                    {
                        english: "Right",
                        translation: "Droite",
                        phonetic: "drwat"
                    },
                    {
                        english: "Straight",
                        translation: "Tout droit",
                        phonetic: "too drwa"
                    }
                ]
            }
        ]
    },
    kurdish: {
        language: "Kurdish",
        code: "ku",
        title: "رێنمایی مانەوە",
        phrases: [
            {
                category: "Emergency",
                items: [
                    {
                        english: "Help",
                        translation: "یارمەتی",
                        phonetic: "yar-meti"
                    },
                    {
                        english: "I need water",
                        translation: "ئاو پێویستە",
                        phonetic: "aw pe-wis-te"
                    },
                    {
                        english: "I am lost",
                        translation: "گومانم",
                        phonetic: "gu-man-im"
                    },
                    {
                        english: "Where is the hospital?",
                        translation: "نەخۆشخانە لە کوێیە?",
                        phonetic: "ne-khosh-kha-ne le kwe-ye?"
                    },
                    {
                        english: "I need food",
                        translation: "خواردن پێویستە",
                        phonetic: "khwar-din pe-wis-te"
                    }
                ]
            },
            {
                category: "Directions",
                items: [
                    {
                        english: "Where is...?",
                        translation: "... لە کوێیە?",
                        phonetic: "... le kwe-ye?"
                    },
                    {
                        english: "How far?",
                        translation: "چەند دوورە?",
                        phonetic: "chen dur-e?"
                    },
                    {
                        english: "Left",
                        translation: "چەپ",
                        phonetic: "chep"
                    },
                    {
                        english: "Right",
                        translation: "ڕاست",
                        phonetic: "rast"
                    },
                    {
                        english: "Straight",
                        translation: "راست",
                        phonetic: "rast"
                    }
                ]
            }
        ]
    },
    farsi: {
        language: "Farsi",
        code: "fa",
        title: "راهنمای بقا",
        phrases: [
            {
                category: "Emergency",
                items: [
                    {
                        english: "Help",
                        translation: "کمک",
                        phonetic: "komak"
                    },
                    {
                        english: "I need water",
                        translation: "من به آب نیاز دارم",
                        phonetic: "man be ab niaz daram"
                    },
                    {
                        english: "I am lost",
                        translation: "من گم شده‌ام",
                        phonetic: "man gom shode-am"
                    },
                    {
                        english: "Where is the hospital?",
                        translation: "بیمارستان کجاست؟",
                        phonetic: "bimarestan kojast?"
                    },
                    {
                        english: "I need food",
                        translation: "من به غذا نیاز دارم",
                        phonetic: "man be ghaza niaz daram"
                    }
                ]
            },
            {
                category: "Directions",
                items: [
                    {
                        english: "Where is...?",
                        translation: "... کجاست؟",
                        phonetic: "... kojast?"
                    },
                    {
                        english: "How far?",
                        translation: "چقدر دور است؟",
                        phonetic: "cheghadr dur ast?"
                    },
                    {
                        english: "Left",
                        translation: "چپ",
                        phonetic: "chap"
                    },
                    {
                        english: "Right",
                        translation: "راست",
                        phonetic: "rast"
                    },
                    {
                        english: "Straight",
                        translation: "مستقیم",
                        phonetic: "mostaghim"
                    }
                ]
            }
        ]
    },
    urdu: {
        language: "Urdu",
        code: "ur",
        title: "زندہ رہنے کی رہنمائی",
        phrases: [
            {
                category: "Emergency",
                items: [
                    {
                        english: "Help",
                        translation: "مدد",
                        phonetic: "madad"
                    },
                    {
                        english: "I need water",
                        translation: "مجھے پانی چاہیے",
                        phonetic: "mujhe pani chahiye"
                    },
                    {
                        english: "I am lost",
                        translation: "میں کھو گیا ہوں",
                        phonetic: "main kho gaya hoon"
                    },
                    {
                        english: "Where is the hospital?",
                        translation: "ہسپتال کہاں ہے؟",
                        phonetic: "hospital kahan hai?"
                    },
                    {
                        english: "I need food",
                        translation: "مجھے کھانا چاہیے",
                        phonetic: "mujhe khana chahiye"
                    }
                ]
            },
            {
                category: "Directions",
                items: [
                    {
                        english: "Where is...?",
                        translation: "... کہاں ہے؟",
                        phonetic: "... kahan hai?"
                    },
                    {
                        english: "How far?",
                        translation: "کتنا دور؟",
                        phonetic: "kitna dur?"
                    },
                    {
                        english: "Left",
                        translation: "بائیں",
                        phonetic: "bain"
                    },
                    {
                        english: "Right",
                        translation: "دائیں",
                        phonetic: "dain"
                    },
                    {
                        english: "Straight",
                        translation: "سیدھا",
                        phonetic: "seedha"
                    }
                ]
            }
        ]
    },
    russian: {
        language: "Russian",
        code: "ru",
        title: "Руководство по выживанию",
        phrases: [
            {
                category: "Emergency",
                items: [
                    {
                        english: "Help",
                        translation: "Помощь",
                        phonetic: "po-moshch"
                    },
                    {
                        english: "I need water",
                        translation: "Мне нужна вода",
                        phonetic: "mne nuzhna vo-da"
                    },
                    {
                        english: "I am lost",
                        translation: "Я заблудился",
                        phonetic: "ya za-blu-dil-sya"
                    },
                    {
                        english: "Where is the hospital?",
                        translation: "Где больница?",
                        phonetic: "gde bol-ni-tsa?"
                    },
                    {
                        english: "I need food",
                        translation: "Мне нужна еда",
                        phonetic: "mne nuzhna ye-da"
                    }
                ]
            },
            {
                category: "Directions",
                items: [
                    {
                        english: "Where is...?",
                        translation: "Где...?",
                        phonetic: "gde...?"
                    },
                    {
                        english: "How far?",
                        translation: "Как далеко?",
                        phonetic: "kak da-le-ko?"
                    },
                    {
                        english: "Left",
                        translation: "Влево",
                        phonetic: "vle-vo"
                    },
                    {
                        english: "Right",
                        translation: "Вправо",
                        phonetic: "vpra-vo"
                    },
                    {
                        english: "Straight",
                        translation: "Прямо",
                        phonetic: "prya-mo"
                    }
                ]
            }
        ]
    },
    ukrainian: {
        language: "Ukrainian",
        code: "uk",
        title: "Посібник з виживання",
        phrases: [
            {
                category: "Emergency",
                items: [
                    {
                        english: "Help",
                        translation: "Допомога",
                        phonetic: "do-po-mo-ha"
                    },
                    {
                        english: "I need water",
                        translation: "Мені потрібна вода",
                        phonetic: "me-ni pot-rib-na vo-da"
                    },
                    {
                        english: "I am lost",
                        translation: "Я заблукав",
                        phonetic: "ya za-blu-kav"
                    },
                    {
                        english: "Where is the hospital?",
                        translation: "Де лікарня?",
                        phonetic: "de lik-ar-nya?"
                    },
                    {
                        english: "I need food",
                        translation: "Мені потрібна їжа",
                        phonetic: "me-ni pot-rib-na yi-zha"
                    }
                ]
            },
            {
                category: "Directions",
                items: [
                    {
                        english: "Where is...?",
                        translation: "Де...?",
                        phonetic: "de...?"
                    },
                    {
                        english: "How far?",
                        translation: "Як далеко?",
                        phonetic: "yak da-le-ko?"
                    },
                    {
                        english: "Left",
                        translation: "Ліворуч",
                        phonetic: "li-vo-ruch"
                    },
                    {
                        english: "Right",
                        translation: "Праворуч",
                        phonetic: "pra-vo-ruch"
                    },
                    {
                        english: "Straight",
                        translation: "Прямо",
                        phonetic: "prya-mo"
                    }
                ]
            }
        ]
    }
};
function getLanguageGuide(code) {
    return LANGUAGE_GUIDES[code.toLowerCase()];
}
function getAvailableLanguages() {
    return Object.values(LANGUAGE_GUIDES);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/guides/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GuidesPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$languages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Languages$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/languages.js [app-client] (ecmascript) <export default as Languages>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$navigation$2f$navigation$2d$bar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/navigation/navigation-bar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$language$2d$guides$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/language-guides.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const guides = [
    {
        id: "first-aid",
        title: "First Aid Essentials",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"],
        color: "text-accent",
        category: "medical",
        content: [
            "Wounds & Bleeding: Apply pressure with clean cloth, elevate, bandage tightly",
            "Dehydration: Rest in shade, drink water slowly with salt if available, cool body",
            "Hypothermia: Remove wet clothes, warm gradually, give warm drinks",
            "Heat Stroke: Move to shade, cool with water, rest flat with legs elevated",
            "Infection Signs: Redness, pus, fever - treat with antiseptic, keep clean & dry",
            "Sprains: Rest, ice (if available), compress, elevate"
        ]
    },
    {
        id: "water",
        title: "Finding Clean Water",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"],
        color: "text-secondary",
        category: "survival",
        content: [
            "Purification: Boil for 1 minute, use purification tablets, or filter through cloth & sand",
            "Sources: Running streams preferred over stagnant water, rainwater collection",
            "Signs of Safety: Clear water, no debris, no smell, upstream from human activity",
            "Danger Signs: Dead animals upstream, chemical smell, discoloration, cloudy appearance",
            "Immediate: Desperate situations - use any water with purification tablets",
            "Storage: Keep in clean, sealed containers away from sun"
        ]
    },
    {
        id: "shelter",
        title: "Emergency Shelter Building",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"],
        color: "text-yellow-500",
        category: "survival",
        content: [
            "Quick Shelter: Use fallen trees, rocks, dense bushes to block wind",
            "Lean-To: Prop branch against tree, cover with leaves/branches, insulate with dry material",
            "Snow Cave: Dig into snowbank on leeward side, small entrance keeps cold out",
            "Underground: Dig shallow trench, cover with branches & leaves, insulate floor",
            "Exposed Areas: Stay low, minimize heat loss, avoid high winds",
            "Materials: Use natural resources - branches, leaves, rocks, cloth"
        ]
    },
    {
        id: "fire",
        title: "Starting Fire Without Tools",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"],
        color: "text-orange-500",
        category: "survival",
        content: [
            "Friction Method: Dry stick in groove of wood, rub rapidly to create heat & ember",
            "Magnification: Use water drop on cloth to focus sun rays on dry kindling",
            "Friction Bow: Create bow with cord/vine to spin stick rapidly",
            "Tinder: Dry grass, bark, leaves catch easily",
            "Kindling: Small sticks to build flame gradually",
            "Fuel: Larger wood for sustained fire"
        ]
    },
    {
        id: "women-protection",
        title: "Women & Children Safety",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"],
        color: "text-pink-500",
        category: "safety",
        content: [
            "Trafficking Warning Signs: Promises of work, separation from group, movement at night",
            "Safe Shelter Verification: Established organizations, multiple women present, reference checking",
            "Emergency Contacts: UNHCR offices, local NGOs, police stations for protection",
            "Travel Safety: Stay in groups, avoid isolated areas, trust instincts about people",
            "Healthcare: Women's clinics exist - ask other refugees for trusted locations",
            "Rights: Children cannot work, healthcare is your right, education is available"
        ]
    },
    {
        id: "mental-health",
        title: "Trauma & Stress Relief",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"],
        color: "text-purple-500",
        category: "mental",
        content: [
            "Panic Attacks: Find safe spot, breathe deeply (4 count in, 4 count out), ground yourself",
            "Grounding: Name 5 things you see, 4 you hear, 3 you feel, 2 you smell, 1 you taste",
            "Stress Relief: Physical activity helps - walk, stretch, dance if safe",
            "Sleep: Try to maintain routine, safe sleeping area reduces anxiety",
            "Connection: Talk to others, shared experience helps normalize trauma reactions",
            "Hope: Remember this is temporary, you are strong, help exists"
        ]
    },
    {
        id: "border",
        title: "Border Crossing Basics",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"],
        color: "text-secondary",
        category: "legal",
        content: [
            "Documentation: Gather identity documents, photos, medical records in waterproof bag",
            "Legal Crossings: Use official checkpoints when possible - safer than smugglers",
            "Checkpoints: Be honest, cooperate, keep hands visible, don't run",
            "Rights: You have rights even undocumented - state clearly you need assistance",
            "UNHCR Recognition: Mention if registered - increases access to protection",
            "Corruption: Bribery less common at official crossings than hidden routes"
        ]
    },
    {
        id: "food",
        title: "Identifying Edible Plants",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"],
        color: "text-green-500",
        category: "survival",
        content: [
            "Rule of Three: If unsure, don't eat - poisoning worse than hunger",
            "Safe Plants: Dandelion greens, clover, acorns (boil first), pine needles (tea)",
            "Danger Signs: White/umbrella flowers, milky sap, three leaflets (poison ivy)",
            "Testing: Rub on skin, wait 5 min, taste tongue, wait 15 min before swallowing",
            "Berries: Red/white/purple usually safer than white - but still test first",
            "Mushrooms: Extremely dangerous - avoid unless expert identification"
        ]
    }
];
// Use language guides from lib
const availableLanguages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$language$2d$guides$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAvailableLanguages"])();
function GuidesPage() {
    _s();
    const [selectedGuide, setSelectedGuide] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("first-aid");
    const [selectedLanguage, setSelectedLanguage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("arabic");
    const activeGuide = guides.find((g)=>g.id === selectedGuide);
    const IconComponent = activeGuide?.icon;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-background",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$navigation$2f$navigation$2d$bar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                onSOS: ()=>{}
            }, void 0, false, {
                fileName: "[project]/app/guides/page.tsx",
                lineNumber: 152,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-6xl mx-auto p-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-3xl font-bold text-primary flex items-center gap-3 mb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                                        className: "h-8 w-8"
                                    }, void 0, false, {
                                        fileName: "[project]/app/guides/page.tsx",
                                        lineNumber: 158,
                                        columnNumber: 13
                                    }, this),
                                    "HUMANITARIAN GUIDES & RESOURCES"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/guides/page.tsx",
                                lineNumber: 157,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-muted-foreground",
                                children: "Survival guides, first aid, and essential information"
                            }, void 0, false, {
                                fileName: "[project]/app/guides/page.tsx",
                                lineNumber: 161,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/guides/page.tsx",
                        lineNumber: 156,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 lg:grid-cols-4 gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: guides.map((guide)=>{
                                    const Icon = guide.icon;
                                    const isActive = selectedGuide === guide.id;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setSelectedGuide(guide.id),
                                        className: `w-full flex items-center gap-3 rounded-lg p-3 transition text-left ${isActive ? "bg-primary/20 border border-primary" : "border border-border hover:bg-muted/30"}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                className: `h-5 w-5 flex-shrink-0 ${guide.color}`
                                            }, void 0, false, {
                                                fileName: "[project]/app/guides/page.tsx",
                                                lineNumber: 179,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `text-sm font-medium ${isActive ? "text-primary" : "text-foreground"}`,
                                                children: guide.title
                                            }, void 0, false, {
                                                fileName: "[project]/app/guides/page.tsx",
                                                lineNumber: 180,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, guide.id, true, {
                                        fileName: "[project]/app/guides/page.tsx",
                                        lineNumber: 172,
                                        columnNumber: 17
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/app/guides/page.tsx",
                                lineNumber: 166,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "lg:col-span-3 space-y-4",
                                children: [
                                    activeGuide && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "rounded-lg border border-border bg-card p-6",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-4",
                                                    children: [
                                                        IconComponent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconComponent, {
                                                            className: `h-8 w-8 ${activeGuide.color}`
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/guides/page.tsx",
                                                            lineNumber: 195,
                                                            columnNumber: 39
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                                    className: "text-2xl font-bold text-foreground",
                                                                    children: activeGuide.title
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/guides/page.tsx",
                                                                    lineNumber: 197,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-muted-foreground",
                                                                    children: "Essential information for survival"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/guides/page.tsx",
                                                                    lineNumber: 198,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/guides/page.tsx",
                                                            lineNumber: 196,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/guides/page.tsx",
                                                    lineNumber: 194,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/guides/page.tsx",
                                                lineNumber: 193,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "rounded-lg border border-border bg-card p-6 space-y-3",
                                                children: activeGuide.content.map((paragraph, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "flex-shrink-0 text-primary font-bold",
                                                                children: "•"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/guides/page.tsx",
                                                                lineNumber: 207,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-foreground",
                                                                children: paragraph
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/guides/page.tsx",
                                                                lineNumber: 208,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, idx, true, {
                                                        fileName: "[project]/app/guides/page.tsx",
                                                        lineNumber: 206,
                                                        columnNumber: 21
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/app/guides/page.tsx",
                                                lineNumber: 204,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-lg border border-border bg-card p-6 space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$languages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Languages$3e$__["Languages"], {
                                                        className: "h-6 w-6 text-primary"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/guides/page.tsx",
                                                        lineNumber: 218,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-lg font-bold text-foreground",
                                                        children: "Multi-Language Survival Phrases"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/guides/page.tsx",
                                                        lineNumber: 219,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/guides/page.tsx",
                                                lineNumber: 217,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "text-sm text-muted-foreground mb-2 block",
                                                        children: "Select Language:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/guides/page.tsx",
                                                        lineNumber: 223,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "grid grid-cols-4 gap-2",
                                                        children: availableLanguages.map((lang)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>setSelectedLanguage(lang.code),
                                                                className: `rounded-lg px-3 py-2 text-sm font-semibold transition ${selectedLanguage === lang.code ? "bg-primary text-primary-foreground" : "border border-border hover:bg-muted"}`,
                                                                children: lang.language
                                                            }, lang.code, false, {
                                                                fileName: "[project]/app/guides/page.tsx",
                                                                lineNumber: 226,
                                                                columnNumber: 21
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/guides/page.tsx",
                                                        lineNumber: 224,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/guides/page.tsx",
                                                lineNumber: 222,
                                                columnNumber: 15
                                            }, this),
                                            (()=>{
                                                const langGuide = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$language$2d$guides$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLanguageGuide"])(selectedLanguage);
                                                if (!langGuide) return null;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                            className: "font-semibold text-foreground",
                                                            children: langGuide.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/guides/page.tsx",
                                                            lineNumber: 247,
                                                            columnNumber: 21
                                                        }, this),
                                                        langGuide.phrases.map((category, catIdx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "space-y-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                                        className: "text-sm font-semibold text-primary",
                                                                        children: category.category
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/guides/page.tsx",
                                                                        lineNumber: 250,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "grid grid-cols-1 md:grid-cols-2 gap-3",
                                                                        children: category.items.map((item, itemIdx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "rounded-lg bg-muted/30 p-3 border border-border",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-xs text-muted-foreground mb-1",
                                                                                        children: item.english
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/guides/page.tsx",
                                                                                        lineNumber: 254,
                                                                                        columnNumber: 31
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-sm font-semibold text-foreground",
                                                                                        children: item.translation
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/app/guides/page.tsx",
                                                                                        lineNumber: 255,
                                                                                        columnNumber: 31
                                                                                    }, this),
                                                                                    item.phonetic && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-xs text-muted-foreground italic mt-1",
                                                                                        children: [
                                                                                            "(",
                                                                                            item.phonetic,
                                                                                            ")"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/app/guides/page.tsx",
                                                                                        lineNumber: 257,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                ]
                                                                            }, itemIdx, true, {
                                                                                fileName: "[project]/app/guides/page.tsx",
                                                                                lineNumber: 253,
                                                                                columnNumber: 29
                                                                            }, this))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/guides/page.tsx",
                                                                        lineNumber: 251,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, catIdx, true, {
                                                                fileName: "[project]/app/guides/page.tsx",
                                                                lineNumber: 249,
                                                                columnNumber: 23
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/guides/page.tsx",
                                                    lineNumber: 246,
                                                    columnNumber: 19
                                                }, this);
                                            })()
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/guides/page.tsx",
                                        lineNumber: 216,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/guides/page.tsx",
                                lineNumber: 189,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/guides/page.tsx",
                        lineNumber: 164,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/guides/page.tsx",
                lineNumber: 154,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/guides/page.tsx",
        lineNumber: 151,
        columnNumber: 5
    }, this);
}
_s(GuidesPage, "t5gdSv15UXXtIj5XWK/a6S5Lurg=");
_c = GuidesPage;
var _c;
__turbopack_context__.k.register(_c, "GuidesPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/lucide-react/dist/esm/shared/src/utils.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "mergeClasses",
    ()=>mergeClasses,
    "toKebabCase",
    ()=>toKebabCase
]);
const toKebabCase = (string)=>string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const mergeClasses = (...classes)=>classes.filter((className, index, array)=>{
        return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
    }).join(" ").trim();
;
 //# sourceMappingURL=utils.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/defaultAttributes.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>defaultAttributes
]);
var defaultAttributes = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
};
;
 //# sourceMappingURL=defaultAttributes.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/Icon.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>Icon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$defaultAttributes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/defaultAttributes.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/shared/src/utils.js [app-client] (ecmascript)");
;
;
;
const Icon = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(({ color = "currentColor", size = 24, strokeWidth = 2, absoluteStrokeWidth, className = "", children, iconNode, ...rest }, ref)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])("svg", {
        ref,
        ...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$defaultAttributes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        width: size,
        height: size,
        stroke: color,
        strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeClasses"])("lucide", className),
        ...rest
    }, [
        ...iconNode.map(([tag, attrs])=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])(tag, attrs)),
        ...Array.isArray(children) ? children : [
            children
        ]
    ]);
});
;
 //# sourceMappingURL=Icon.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>createLucideIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/shared/src/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$Icon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/Icon.js [app-client] (ecmascript)");
;
;
;
const createLucideIcon = (iconName, iconNode)=>{
    const Component = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$Icon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            ref,
            iconNode,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeClasses"])(`lucide-${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toKebabCase"])(iconName)}`, className),
            ...props
        }));
    Component.displayName = `${iconName}`;
    return Component;
};
;
 //# sourceMappingURL=createLucideIcon.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>BookOpen
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const BookOpen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("BookOpen", [
    [
        "path",
        {
            d: "M12 7v14",
            key: "1akyts"
        }
    ],
    [
        "path",
        {
            d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
            key: "ruj8y"
        }
    ]
]);
;
 //# sourceMappingURL=book-open.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript) <export default as BookOpen>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BookOpen",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>Heart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const Heart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("Heart", [
    [
        "path",
        {
            d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
            key: "c3ymky"
        }
    ]
]);
;
 //# sourceMappingURL=heart.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript) <export default as Heart>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Heart",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>Users
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const Users = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("Users", [
    [
        "path",
        {
            d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
            key: "1yyitq"
        }
    ],
    [
        "circle",
        {
            cx: "9",
            cy: "7",
            r: "4",
            key: "nufk8"
        }
    ],
    [
        "path",
        {
            d: "M22 21v-2a4 4 0 0 0-3-3.87",
            key: "kshegd"
        }
    ],
    [
        "path",
        {
            d: "M16 3.13a4 4 0 0 1 0 7.75",
            key: "1da9ce"
        }
    ]
]);
;
 //# sourceMappingURL=users.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Users",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/languages.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>Languages
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const Languages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("Languages", [
    [
        "path",
        {
            d: "m5 8 6 6",
            key: "1wu5hv"
        }
    ],
    [
        "path",
        {
            d: "m4 14 6-6 2-3",
            key: "1k1g8d"
        }
    ],
    [
        "path",
        {
            d: "M2 5h12",
            key: "or177f"
        }
    ],
    [
        "path",
        {
            d: "M7 2h1",
            key: "1t2jsx"
        }
    ],
    [
        "path",
        {
            d: "m22 22-5-10-5 10",
            key: "don7ne"
        }
    ],
    [
        "path",
        {
            d: "M14 18h6",
            key: "1m8k6r"
        }
    ]
]);
;
 //# sourceMappingURL=languages.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/languages.js [app-client] (ecmascript) <export default as Languages>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Languages",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$languages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$languages$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/languages.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>TriangleAlert
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const TriangleAlert = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("TriangleAlert", [
    [
        "path",
        {
            d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
            key: "wmoenq"
        }
    ],
    [
        "path",
        {
            d: "M12 9v4",
            key: "juzpu7"
        }
    ],
    [
        "path",
        {
            d: "M12 17h.01",
            key: "p32p05"
        }
    ]
]);
;
 //# sourceMappingURL=triangle-alert.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AlertTriangle",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>MapPin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const MapPin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("MapPin", [
    [
        "path",
        {
            d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
            key: "1r0f0z"
        }
    ],
    [
        "circle",
        {
            cx: "12",
            cy: "10",
            r: "3",
            key: "ilqhr7"
        }
    ]
]);
;
 //# sourceMappingURL=map-pin.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MapPin",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_c064528b._.js.map