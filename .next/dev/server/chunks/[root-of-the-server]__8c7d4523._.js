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
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/geocode/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
// Use OpenStreetMap Nominatim API for global geocoding
const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search";
// Fallback database for common locations
const GEOCODE_DATABASE = {
    // Middle East - Syria & Surrounding
    syria: [
        {
            name: "Damascus",
            lat: 33.5138,
            lon: 36.2765,
            type: "city",
            display_name: "Damascus, Syria"
        },
        {
            name: "Aleppo",
            lat: 36.2021,
            lon: 37.1343,
            type: "city",
            display_name: "Aleppo, Syria"
        },
        {
            name: "Homs",
            lat: 34.7275,
            lon: 36.7139,
            type: "city",
            display_name: "Homs, Syria"
        },
        {
            name: "Hama",
            lat: 35.1361,
            lon: 36.755,
            type: "city",
            display_name: "Hama, Syria"
        },
        {
            name: "Latakia",
            lat: 34.7612,
            lon: 35.5286,
            type: "city",
            display_name: "Latakia, Syria"
        },
        {
            name: "Tartus",
            lat: 34.8927,
            lon: 35.8829,
            type: "city",
            display_name: "Tartus, Syria"
        },
        {
            name: "Idlib",
            lat: 35.9268,
            lon: 36.6567,
            type: "city",
            display_name: "Idlib, Syria"
        },
        {
            name: "Raqqa",
            lat: 35.9461,
            lon: 39.0086,
            type: "city",
            display_name: "Raqqa, Syria"
        },
        {
            name: "Hasaka",
            lat: 36.5024,
            lon: 40.7468,
            type: "city",
            display_name: "Hasaka, Syria"
        },
        {
            name: "Palmyra",
            lat: 34.5553,
            lon: 38.2725,
            type: "town",
            display_name: "Palmyra, Syria"
        }
    ],
    israel: [
        {
            name: "Tel Aviv",
            lat: 32.0853,
            lon: 34.7818,
            type: "city",
            display_name: "Tel Aviv, Israel"
        },
        {
            name: "Jerusalem",
            lat: 31.7683,
            lon: 35.2137,
            type: "city",
            display_name: "Jerusalem"
        },
        {
            name: "Haifa",
            lat: 32.8193,
            lon: 34.9956,
            type: "city",
            display_name: "Haifa, Israel"
        },
        {
            name: "Beer Sheba",
            lat: 31.2461,
            lon: 34.7913,
            type: "city",
            display_name: "Beer Sheba, Israel"
        }
    ],
    palestine: [
        {
            name: "Gaza",
            lat: 31.927,
            lon: 35.2007,
            type: "region",
            display_name: "Gaza, Palestine"
        },
        {
            name: "Ramallah",
            lat: 31.9454,
            lon: 35.2028,
            type: "city",
            display_name: "Ramallah, West Bank"
        },
        {
            name: "Bethlehem",
            lat: 31.7046,
            lon: 35.2038,
            type: "city",
            display_name: "Bethlehem, West Bank"
        },
        {
            name: "Nablus",
            lat: 32.2211,
            lon: 35.2344,
            type: "city",
            display_name: "Nablus, West Bank"
        },
        {
            name: "Jenin",
            lat: 32.3028,
            lon: 35.2889,
            type: "city",
            display_name: "Jenin, West Bank"
        }
    ],
    lebanon: [
        {
            name: "Beirut",
            lat: 33.8547,
            lon: 35.2661,
            type: "city",
            display_name: "Beirut, Lebanon"
        },
        {
            name: "Tripoli",
            lat: 34.4386,
            lon: 35.8395,
            type: "city",
            display_name: "Tripoli, Lebanon"
        },
        {
            name: "Sidon",
            lat: 33.5676,
            lon: 35.3734,
            type: "city",
            display_name: "Sidon, Lebanon"
        },
        {
            name: "Tyre",
            lat: 33.2735,
            lon: 35.1899,
            type: "city",
            display_name: "Tyre, Lebanon"
        },
        {
            name: "Baalbek",
            lat: 34.0055,
            lon: 36.2068,
            type: "town",
            display_name: "Baalbek, Lebanon"
        }
    ],
    jordan: [
        {
            name: "Amman",
            lat: 31.9454,
            lon: 35.9284,
            type: "city",
            display_name: "Amman, Jordan"
        },
        {
            name: "Zarqa",
            lat: 32.0551,
            lon: 36.0876,
            type: "city",
            display_name: "Zarqa, Jordan"
        },
        {
            name: "Irbid",
            lat: 32.5552,
            lon: 35.8489,
            type: "city",
            display_name: "Irbid, Jordan"
        },
        {
            name: "Aqaba",
            lat: 29.5327,
            lon: 34.9426,
            type: "city",
            display_name: "Aqaba, Jordan"
        }
    ],
    yemen: [
        {
            name: "Sanaa",
            lat: 15.3694,
            lon: 48.2219,
            type: "city",
            display_name: "Sanaa, Yemen"
        },
        {
            name: "Aden",
            lat: 12.7896,
            lon: 45.3569,
            type: "city",
            display_name: "Aden, Yemen"
        },
        {
            name: "Taiz",
            lat: 13.5801,
            lon: 44.0186,
            type: "city",
            display_name: "Taiz, Yemen"
        },
        {
            name: "Hodeidah",
            lat: 15.3547,
            lon: 42.3417,
            type: "city",
            display_name: "Hodeidah, Yemen"
        }
    ],
    turkey: [
        {
            name: "Istanbul",
            lat: 41.0082,
            lon: 28.9784,
            type: "city",
            display_name: "Istanbul, Turkey"
        },
        {
            name: "Ankara",
            lat: 39.9334,
            lon: 32.8597,
            type: "city",
            display_name: "Ankara, Turkey"
        },
        {
            name: "Izmir",
            lat: 38.4161,
            lon: 27.138,
            type: "city",
            display_name: "Izmir, Turkey"
        },
        {
            name: "Gaziantep",
            lat: 37.0662,
            lon: 37.3833,
            type: "city",
            display_name: "Gaziantep, Turkey"
        },
        {
            name: "Kilis",
            lat: 36.7184,
            lon: 37.1168,
            type: "city",
            display_name: "Kilis, Turkey"
        },
        {
            name: "Mardin",
            lat: 37.3089,
            lon: 40.7395,
            type: "city",
            display_name: "Mardin, Turkey"
        }
    ],
    afghanistan: [
        {
            name: "Kabul",
            lat: 34.5553,
            lon: 69.2075,
            type: "city",
            display_name: "Kabul, Afghanistan"
        },
        {
            name: "Kandahar",
            lat: 31.6257,
            lon: 65.7245,
            type: "city",
            display_name: "Kandahar, Afghanistan"
        },
        {
            name: "Herat",
            lat: 34.3425,
            lon: 62.2,
            type: "city",
            display_name: "Herat, Afghanistan"
        },
        {
            name: "Mazar-i-Sharif",
            lat: 36.7948,
            lon: 67.1104,
            type: "city",
            display_name: "Mazar-i-Sharif, Afghanistan"
        }
    ],
    pakistan: [
        {
            name: "Islamabad",
            lat: 33.6844,
            lon: 73.0479,
            type: "city",
            display_name: "Islamabad, Pakistan"
        },
        {
            name: "Karachi",
            lat: 24.8607,
            lon: 67.0011,
            type: "city",
            display_name: "Karachi, Pakistan"
        },
        {
            name: "Peshawar",
            lat: 34.008,
            lon: 71.5788,
            type: "city",
            display_name: "Peshawar, Pakistan"
        },
        {
            name: "Quetta",
            lat: 30.1798,
            lon: 66.975,
            type: "city",
            display_name: "Quetta, Pakistan"
        }
    ],
    iraq: [
        {
            name: "Baghdad",
            lat: 33.3128,
            lon: 44.3615,
            type: "city",
            display_name: "Baghdad, Iraq"
        },
        {
            name: "Mosul",
            lat: 36.3425,
            lon: 43.1581,
            type: "city",
            display_name: "Mosul, Iraq"
        },
        {
            name: "Basra",
            lat: 30.5085,
            lon: 47.8078,
            type: "city",
            display_name: "Basra, Iraq"
        },
        {
            name: "Kirkuk",
            lat: 35.4764,
            lon: 44.3989,
            type: "city",
            display_name: "Kirkuk, Iraq"
        },
        {
            name: "Erbil",
            lat: 36.191,
            lon: 44.0091,
            type: "city",
            display_name: "Erbil, Iraq"
        }
    ],
    sudan: [
        {
            name: "Khartoum",
            lat: 15.5007,
            lon: 32.5599,
            type: "city",
            display_name: "Khartoum, Sudan"
        },
        {
            name: "Port Sudan",
            lat: 19.6173,
            lon: 37.2169,
            type: "city",
            display_name: "Port Sudan, Sudan"
        },
        {
            name: "Darfur",
            lat: 13.5,
            lon: 25.0,
            type: "region",
            display_name: "Darfur, Sudan"
        }
    ],
    ethiopia: [
        {
            name: "Addis Ababa",
            lat: 9.032,
            lon: 38.7469,
            type: "city",
            display_name: "Addis Ababa, Ethiopia"
        },
        {
            name: "Dire Dawa",
            lat: 9.6412,
            lon: 41.8687,
            type: "city",
            display_name: "Dire Dawa, Ethiopia"
        }
    ],
    kenya: [
        {
            name: "Nairobi",
            lat: 1.2921,
            lon: 36.8219,
            type: "city",
            display_name: "Nairobi, Kenya"
        },
        {
            name: "Mombasa",
            lat: 4.0435,
            lon: 39.6682,
            type: "city",
            display_name: "Mombasa, Kenya"
        },
        {
            name: "Kakuma",
            lat: 3.4025,
            lon: 35.3075,
            type: "town",
            display_name: "Kakuma Refugee Camp, Kenya"
        },
        {
            name: "Dadaab",
            lat: 0.3031,
            lon: 40.3295,
            type: "town",
            display_name: "Dadaab Refugee Camp, Kenya"
        }
    ],
    uganda: [
        {
            name: "Kampala",
            lat: 0.3476,
            lon: 32.5825,
            type: "city",
            display_name: "Kampala, Uganda"
        }
    ],
    congo: [
        {
            name: "Kinshasa",
            lat: 4.3276,
            lon: 15.3136,
            type: "city",
            display_name: "Kinshasa, DR Congo"
        },
        {
            name: "Goma",
            lat: 1.6956,
            lon: 29.2201,
            type: "city",
            display_name: "Goma, DR Congo"
        }
    ],
    greece: [
        {
            name: "Athens",
            lat: 37.9838,
            lon: 23.7275,
            type: "city",
            display_name: "Athens, Greece"
        },
        {
            name: "Lesbos",
            lat: 39.2,
            lon: 26.1,
            type: "island",
            display_name: "Lesbos, Greece"
        }
    ]
};
function fuzzySearchLocations(query, limit = 10) {
    const q = query.toLowerCase().trim();
    if (q.length === 0) return [];
    const results = [];
    // Search all countries and their locations
    for (const [country, locations] of Object.entries(GEOCODE_DATABASE)){
        for (const location of locations){
            const name = location.name.toLowerCase();
            const display = location.display_name.toLowerCase();
            const country_name = country.toLowerCase();
            // Exact match on name
            if (name === q || display.includes(q)) {
                results.push({
                    ...location,
                    relevance: 100
                });
            } else if (name.startsWith(q) || display.startsWith(q)) {
                results.push({
                    ...location,
                    relevance: 80
                });
            } else if (name.includes(q) || display.includes(q)) {
                results.push({
                    ...location,
                    relevance: 60
                });
            } else if (country_name.startsWith(q)) {
                results.push({
                    ...location,
                    relevance: 40
                });
            }
        }
    }
    // Sort by relevance and limit
    return results.sort((a, b)=>b.relevance - a.relevance).slice(0, limit).map(({ relevance, ...rest })=>rest);
}
async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    try {
        if (query) {
            // Try Nominatim API first for global search
            try {
                const nominatimUrl = `${NOMINATIM_BASE_URL}?q=${encodeURIComponent(query)}&format=json&limit=10&addressdetails=1`;
                const nominatimResponse = await fetch(nominatimUrl, {
                    headers: {
                        "User-Agent": "RefugeeSurvivalApp/1.0"
                    }
                });
                if (nominatimResponse.ok) {
                    const nominatimData = await nominatimResponse.json();
                    if (nominatimData && nominatimData.length > 0) {
                        const results = nominatimData.map((item)=>({
                                name: item.display_name,
                                lat: parseFloat(item.lat),
                                lon: parseFloat(item.lon),
                                type: item.type || item.class || "location",
                                display_name: item.display_name
                            }));
                        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(results);
                    }
                }
            } catch (nominatimError) {
                console.error("[v0] Nominatim API error:", nominatimError);
            // Fall through to database search
            }
            // Fallback to local database
            const results = fuzzySearchLocations(query, 10);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(results);
        } else if (lat && lon) {
            const lat_num = Number.parseFloat(lat);
            const lon_num = Number.parseFloat(lon);
            // Try Nominatim reverse geocoding first
            try {
                const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat_num}&lon=${lon_num}&format=json`;
                const nominatimResponse = await fetch(nominatimUrl, {
                    headers: {
                        "User-Agent": "RefugeeSurvivalApp/1.0"
                    }
                });
                if (nominatimResponse.ok) {
                    const nominatimData = await nominatimResponse.json();
                    if (nominatimData && nominatimData.display_name) {
                        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                            name: nominatimData.display_name,
                            lat: lat_num,
                            lon: lon_num,
                            type: nominatimData.type || "location",
                            display_name: nominatimData.display_name
                        });
                    }
                }
            } catch (nominatimError) {
                console.error("[v0] Nominatim reverse geocoding error:", nominatimError);
            // Fall through to database search
            }
            // Fallback to local database
            let closestLocation = null;
            let closestDistance = Number.POSITIVE_INFINITY;
            for (const locations of Object.values(GEOCODE_DATABASE)){
                for (const location of locations){
                    const distance = Math.sqrt(Math.pow(location.lat - lat_num, 2) + Math.pow(location.lon - lon_num, 2));
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestLocation = location;
                    }
                }
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(closestLocation || null);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json([]);
    } catch (error) {
        console.error("[v0] API geocode error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json([]);
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8c7d4523._.js.map