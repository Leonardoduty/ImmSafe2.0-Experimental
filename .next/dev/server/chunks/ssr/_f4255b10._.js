module.exports = [
"[project]/lib/map-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Map utilities for drawing borders and routes
__turbopack_context__.s([
    "calculateBounds",
    ()=>calculateBounds,
    "drawGeoJSONBorders",
    ()=>drawGeoJSONBorders,
    "generateRoutePolyline",
    ()=>generateRoutePolyline,
    "loadWorldBorders",
    ()=>loadWorldBorders,
    "projectToCanvas",
    ()=>projectToCanvas
]);
async function loadWorldBorders() {
    let timeoutId;
    try {
        // Create abort controller for timeout
        const controller = new AbortController();
        timeoutId = setTimeout(()=>controller.abort(), 10000); // 10 second timeout
        // Use a simplified world borders GeoJSON from a free source
        // Using a CDN that hosts simplified GeoJSON
        const response = await fetch("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson", {
            method: "GET",
            headers: {
                "Accept": "application/json"
            },
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (!response.ok) {
            // Fallback to a simpler approach - return null and draw basic borders
            return null;
        }
        const data = await response.json();
        return data;
    } catch (error) {
        // Silently fail - borders are optional
        if (error instanceof Error && error.name !== "AbortError") {
            console.warn("[v0] Could not load world borders (this is optional):", error.message);
        }
        return null;
    } finally{
        // Cleanup timeout if still running
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    }
}
function projectToCanvas(lat, lon, bounds, width, height) {
    const latPadding = (bounds.maxLat - bounds.minLat) * 0.1;
    const lonPadding = (bounds.maxLon - bounds.minLon) * 0.1;
    const adjustedMinLat = bounds.minLat - latPadding;
    const adjustedMaxLat = bounds.maxLat + latPadding;
    const adjustedMinLon = bounds.minLon - lonPadding;
    const adjustedMaxLon = bounds.maxLon + lonPadding;
    const x = (lon - adjustedMinLon) / (adjustedMaxLon - adjustedMinLon) * width;
    const y = (adjustedMaxLat - lat) / (adjustedMaxLat - adjustedMinLat) * height;
    return {
        x,
        y
    };
}
function calculateBounds(source, destination, routePolyline, defaultBounds = {
    minLat: 20,
    maxLat: 50,
    minLon: -10,
    maxLon: 50
}) {
    // If no route, use default bounds
    if (!source && !destination) {
        return defaultBounds;
    }
    // Start with source/destination bounds
    let minLat = source?.lat ?? destination?.lat ?? defaultBounds.minLat;
    let maxLat = source?.lat ?? destination?.lat ?? defaultBounds.maxLat;
    let minLon = source?.lon ?? destination?.lon ?? defaultBounds.minLon;
    let maxLon = source?.lon ?? destination?.lon ?? defaultBounds.maxLon;
    // Include source and destination in bounds
    if (source) {
        minLat = Math.min(minLat, source.lat);
        maxLat = Math.max(maxLat, source.lat);
        minLon = Math.min(minLon, source.lon);
        maxLon = Math.max(maxLon, source.lon);
    }
    if (destination) {
        minLat = Math.min(minLat, destination.lat);
        maxLat = Math.max(maxLat, destination.lat);
        minLon = Math.min(minLon, destination.lon);
        maxLon = Math.max(maxLon, destination.lon);
    }
    // Include all route polyline points in bounds calculation
    if (routePolyline && routePolyline.length > 0) {
        routePolyline.forEach((point)=>{
            minLat = Math.min(minLat, point.lat);
            maxLat = Math.max(maxLat, point.lat);
            minLon = Math.min(minLon, point.lon);
            maxLon = Math.max(maxLon, point.lon);
        });
    }
    // Calculate distance to determine zoom level
    const latSpan = maxLat - minLat;
    const lonSpan = maxLon - minLon;
    const distance = Math.sqrt(latSpan * latSpan + lonSpan * lonSpan) * 111 // Approximate km
    ;
    // Minimum zoom protection for small distances (< 200 km)
    // Ensure we can see both countries clearly
    if (distance < 2) {
        // Very small distance - ensure minimum view
        const centerLat = (minLat + maxLat) / 2;
        const centerLon = (minLon + maxLon) / 2;
        const minSpan = 2.0 // Minimum 2 degrees span (~220 km)
        ;
        minLat = centerLat - minSpan / 2;
        maxLat = centerLat + minSpan / 2;
        minLon = centerLon - minSpan / 2;
        maxLon = centerLon + minSpan / 2;
    }
    // Maximum zoom protection - prevent over-zooming
    // Limit maximum span to prevent zooming too close
    const maxSpan = 0.5 // Maximum 0.5 degrees span (~55 km) - prevents zoom level 13-18
    ;
    if (latSpan < maxSpan && lonSpan < maxSpan) {
        const centerLat = (minLat + maxLat) / 2;
        const centerLon = (minLon + maxLon) / 2;
        // Expand to minimum size if too zoomed in
        if (latSpan < maxSpan) {
            minLat = centerLat - maxSpan / 2;
            maxLat = centerLat + maxSpan / 2;
        }
        if (lonSpan < maxSpan) {
            minLon = centerLon - maxSpan / 2;
            maxLon = centerLon + maxSpan / 2;
        }
    }
    // Add padding (10% on each side)
    const latPadding = (maxLat - minLat) * 0.1;
    const lonPadding = (maxLon - minLon) * 0.1;
    return {
        minLat: minLat - latPadding,
        maxLat: maxLat + latPadding,
        minLon: minLon - lonPadding,
        maxLon: maxLon + lonPadding
    };
}
function drawGeoJSONBorders(ctx, geoJson, bounds, width, height) {
    ctx.strokeStyle = "rgba(100, 150, 200, 0.3)";
    ctx.lineWidth = 1;
    ctx.fillStyle = "rgba(50, 100, 150, 0.05)";
    geoJson.features.forEach((feature)=>{
        if (feature.geometry.type === "Polygon") {
            const coordinates = feature.geometry.coordinates;
            coordinates.forEach((ring)=>{
                ctx.beginPath();
                let first = true;
                ring.forEach((coord)=>{
                    const [lon, lat] = coord;
                    const { x, y } = projectToCanvas(lat, lon, bounds, width, height);
                    if (first) {
                        ctx.moveTo(x, y);
                        first = false;
                    } else {
                        ctx.lineTo(x, y);
                    }
                });
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            });
        } else if (feature.geometry.type === "MultiPolygon") {
            const coordinates = feature.geometry.coordinates;
            coordinates.forEach((polygon)=>{
                polygon.forEach((ring)=>{
                    ctx.beginPath();
                    let first = true;
                    ring.forEach((coord)=>{
                        const [lon, lat] = coord;
                        const { x, y } = projectToCanvas(lat, lon, bounds, width, height);
                        if (first) {
                            ctx.moveTo(x, y);
                            first = false;
                        } else {
                            ctx.lineTo(x, y);
                        }
                    });
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                });
            });
        }
    });
}
function generateRoutePolyline(source, destination, steps = 50) {
    const points = [];
    for(let i = 0; i <= steps; i++){
        const fraction = i / steps;
        const lat = source.lat + (destination.lat - source.lat) * fraction;
        const lon = source.lon + (destination.lon - source.lon) * fraction;
        points.push({
            lat,
            lon
        });
    }
    return points;
}
}),
"[project]/lib/openroute-service.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// OpenRouteService API for realistic geographic routing
// Free API key available at https://openrouteservice.org/
__turbopack_context__.s([
    "getRouteAvoidingZones",
    ()=>getRouteAvoidingZones,
    "getRouteFromOpenRouteService",
    ()=>getRouteFromOpenRouteService
]);
async function getRouteFromOpenRouteService(source, destination, profile = "foot-walking") {
    let timeoutId;
    try {
        const controller = new AbortController();
        timeoutId = setTimeout(()=>controller.abort(), 10000); // 10 second timeout
        // OpenRouteService API endpoint (free tier available)
        // Using public demo key - in production, get your own key from openrouteservice.org
        const apiKey = process.env.NEXT_PUBLIC_ORS_API_KEY || "5b3ce3597851110001cf6248e77c1e5486f14a9c86eb135c57a6c432";
        const url = `https://api.openrouteservice.org/v2/directions/${profile}?api_key=${apiKey}&start=${source.lon},${source.lat}&end=${destination.lon},${destination.lat}`;
        const response = await fetch(url, {
            headers: {
                "Accept": "application/json, application/geo+json"
            },
            signal: controller.signal
        });
        if (timeoutId) clearTimeout(timeoutId);
        if (!response.ok) {
            console.warn("[v0] OpenRouteService API error:", response.status);
            return null;
        }
        const data = await response.json();
        // OpenRouteService returns routes in GeoJSON format
        if (data.features && data.features[0] && data.features[0].geometry) {
            const coordinates = data.features[0].geometry.coordinates;
            // Convert from [lon, lat] to {lat, lon}
            return coordinates.map((coord)=>({
                    lat: coord[1],
                    lon: coord[0]
                }));
        }
    } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
            console.warn("[v0] OpenRouteService routing unavailable:", error.message);
        }
    } finally{
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    }
    return null;
}
async function getRouteAvoidingZones(source, destination, avoidZones, profile = "foot-walking") {
    // For now, use basic routing
    // In production, you'd add avoid polygons to OpenRouteService request
    return getRouteFromOpenRouteService(source, destination, profile);
}
}),
"[project]/lib/routing-engine.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Global routing with OpenRouteService, OSRM API, and haversine fallback
__turbopack_context__.s([
    "generateGreatCircleRoute",
    ()=>generateGreatCircleRoute,
    "getGlobalRoute",
    ()=>getGlobalRoute,
    "getRouteFromOSRM",
    ()=>getRouteFromOSRM
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$openroute$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/openroute-service.ts [app-ssr] (ecmascript)");
;
async function getRouteFromOSRM(source, destination) {
    let timeoutId;
    try {
        // Create abort controller for timeout
        const controller = new AbortController();
        timeoutId = setTimeout(()=>controller.abort(), 8000); // 8 second timeout
        const url = `https://router.project-osrm.org/route/v1/foot/${source.lon},${source.lat};${destination.lon},${destination.lat}?geometries=geojson&overview=full`;
        const response = await fetch(url, {
            headers: {
                "User-Agent": "SafeRoute-HumanitarianApp/1.0"
            },
            signal: controller.signal
        });
        if (timeoutId) clearTimeout(timeoutId);
        if (!response.ok) return null;
        const data = await response.json();
        if (data.routes && data.routes[0]) {
            const coords = data.routes[0].geometry.coordinates;
            return coords.map((c)=>({
                    lat: c[1],
                    lon: c[0]
                }));
        }
    } catch (error) {
        // Silently fail - we have fallback
        if (error instanceof Error && error.name !== "AbortError") {
            console.warn("[v0] OSRM routing unavailable (using fallback):", error.message);
        }
    } finally{
        // Cleanup timeout if still running
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    }
    return null;
}
function generateGreatCircleRoute(source, destination) {
    const points = [];
    const steps = 50 // Generate 50 intermediate points
    ;
    for(let i = 0; i <= steps; i++){
        const fraction = i / steps;
        // Simple linear interpolation for fallback
        const lat = source.lat + (destination.lat - source.lat) * fraction;
        const lon = source.lon + (destination.lon - source.lon) * fraction;
        points.push({
            lat,
            lon
        });
    }
    return points;
}
async function getGlobalRoute(source, destination, travelMode = "walking") {
    // Try OpenRouteService first (most accurate)
    const orsRoute = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$openroute$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getRouteFromOpenRouteService"])(source, destination, travelMode === "walking" ? "foot-walking" : "driving-car");
    if (orsRoute && orsRoute.length > 0) {
        return orsRoute;
    }
    // Fallback to OSRM
    const osrmRoute = await getRouteFromOSRM(source, destination);
    if (osrmRoute && osrmRoute.length > 0) {
        return osrmRoute;
    }
    // Final fallback to haversine-based polyline
    return generateGreatCircleRoute(source, destination);
}
}),
"[project]/lib/ngo-centers.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// UN & NGO Help Centers locations
__turbopack_context__.s([
    "HELP_CENTERS",
    ()=>HELP_CENTERS,
    "getHelpCentersNearby",
    ()=>getHelpCentersNearby,
    "searchHelpCenters",
    ()=>searchHelpCenters
]);
const HELP_CENTERS = [
    // UNHCR Centers
    {
        id: "unhcr-1",
        name: "UNHCR Jordan Office",
        organization: "UNHCR",
        type: "unhcr",
        lat: 31.9539,
        lon: 35.9106,
        country: "Jordan",
        services: [
            "Registration",
            "Legal assistance",
            "Cash assistance",
            "Shelter"
        ],
        contact: "+962 6 550 2400",
        website: "https://www.unhcr.org/jordan"
    },
    {
        id: "unhcr-2",
        name: "UNHCR Lebanon Office",
        organization: "UNHCR",
        type: "unhcr",
        lat: 33.8547,
        lon: 35.5018,
        country: "Lebanon",
        services: [
            "Registration",
            "Legal assistance",
            "Protection"
        ],
        contact: "+961 1 849 201"
    },
    {
        id: "unhcr-3",
        name: "UNHCR Turkey Office",
        organization: "UNHCR",
        type: "unhcr",
        lat: 39.9334,
        lon: 32.8597,
        country: "Turkey",
        services: [
            "Registration",
            "Legal assistance",
            "Education"
        ],
        contact: "+90 312 409 7000"
    },
    {
        id: "unhcr-4",
        name: "UNHCR Greece Office",
        organization: "UNHCR",
        type: "unhcr",
        lat: 37.9838,
        lon: 23.7275,
        country: "Greece",
        services: [
            "Registration",
            "Legal assistance",
            "Shelter"
        ],
        contact: "+30 210 672 9000"
    },
    // Red Cross Centers
    {
        id: "rc-1",
        name: "Red Cross Jordan",
        organization: "ICRC",
        type: "red_cross",
        lat: 31.9454,
        lon: 35.9284,
        country: "Jordan",
        services: [
            "Emergency relief",
            "Medical care",
            "Family reunification"
        ],
        contact: "+962 6 569 1191"
    },
    {
        id: "rc-2",
        name: "Red Cross Lebanon",
        organization: "ICRC",
        type: "red_cross",
        lat: 33.8869,
        lon: 35.5131,
        country: "Lebanon",
        services: [
            "Emergency relief",
            "Medical care"
        ],
        contact: "+961 1 739 297"
    },
    {
        id: "rc-3",
        name: "Red Cross Turkey",
        organization: "ICRC",
        type: "red_cross",
        lat: 41.0082,
        lon: 28.9784,
        country: "Turkey",
        services: [
            "Emergency relief",
            "Medical care"
        ],
        contact: "+90 212 251 7500"
    },
    // MSF Centers
    {
        id: "msf-1",
        name: "MSF Jordan",
        organization: "MSF",
        type: "msf",
        lat: 31.9454,
        lon: 35.9284,
        country: "Jordan",
        services: [
            "Medical care",
            "Emergency healthcare",
            "Mental health"
        ],
        contact: "+962 6 550 2400"
    },
    {
        id: "msf-2",
        name: "MSF Lebanon",
        organization: "MSF",
        type: "msf",
        lat: 33.8547,
        lon: 35.5018,
        country: "Lebanon",
        services: [
            "Medical care",
            "Emergency healthcare"
        ],
        contact: "+961 1 749 100"
    },
    // UNICEF Centers
    {
        id: "unicef-1",
        name: "UNICEF Jordan",
        organization: "UNICEF",
        type: "unicef",
        lat: 31.9539,
        lon: 35.9106,
        country: "Jordan",
        services: [
            "Child protection",
            "Education",
            "Healthcare"
        ],
        contact: "+962 6 550 2400"
    },
    {
        id: "unicef-2",
        name: "UNICEF Lebanon",
        organization: "UNICEF",
        type: "unicef",
        lat: 33.8869,
        lon: 35.5131,
        country: "Lebanon",
        services: [
            "Child protection",
            "Education"
        ],
        contact: "+961 1 759 200"
    },
    // WFP Centers
    {
        id: "wfp-1",
        name: "WFP Jordan",
        organization: "WFP",
        type: "wfp",
        lat: 31.9454,
        lon: 35.9284,
        country: "Jordan",
        services: [
            "Food assistance",
            "Cash transfers"
        ],
        contact: "+962 6 550 2400"
    },
    {
        id: "wfp-2",
        name: "WFP Lebanon",
        organization: "WFP",
        type: "wfp",
        lat: 33.8547,
        lon: 35.5018,
        country: "Lebanon",
        services: [
            "Food assistance",
            "Cash transfers"
        ],
        contact: "+961 1 759 200"
    }
];
function searchHelpCenters(query, country, service) {
    return HELP_CENTERS.filter((center)=>{
        const matchesQuery = !query || center.name.toLowerCase().includes(query.toLowerCase()) || center.organization.toLowerCase().includes(query.toLowerCase());
        const matchesCountry = !country || center.country.toLowerCase().includes(country.toLowerCase());
        const matchesService = !service || center.services.some((s)=>s.toLowerCase().includes(service.toLowerCase()));
        return matchesQuery && matchesCountry && matchesService;
    });
}
function getHelpCentersNearby(lat, lon, radiusKm = 100) {
    return HELP_CENTERS.filter((center)=>{
        const distance = calculateDistance(lat, lon, center.lat, center.lon);
        return distance <= radiusKm;
    });
}
/**
 * Calculate distance between two coordinates (Haversine formula)
 */ function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371 // Earth's radius in km
    ;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
}),
"[project]/components/map/interactive-map.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>InteractiveMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-ssr] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$map$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/map-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$routing$2d$engine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/routing-engine.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ngo$2d$centers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ngo-centers.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
function InteractiveMap({ onSourceSelect, onDestinationSelect, selectedRoute, routeCoordinates, activeLayers = [] }) {
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [mapPoints, setMapPoints] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([
        {
            id: "safe1",
            lat: 35.0,
            lon: 40.0,
            type: "safe_zone",
            label: "UN Camp Alpha",
            risk: 1
        },
        {
            id: "safe2",
            lat: 34.8,
            lon: 41.2,
            type: "safe_zone",
            label: "Hospital Beta",
            risk: 2
        },
        {
            id: "water1",
            lat: 35.2,
            lon: 40.5,
            type: "water",
            label: "Clean Water Point",
            risk: 3
        },
        {
            id: "conflict1",
            lat: 35.5,
            lon: 39.8,
            type: "conflict",
            label: "Active Military",
            risk: 9
        },
        {
            id: "conflict2",
            lat: 34.5,
            lon: 41.8,
            type: "conflict",
            label: "Checkpoint Zone",
            risk: 6
        }
    ]);
    const [selectionMode, setSelectionMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [worldBorders, setWorldBorders] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [routePolyline, setRoutePolyline] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const dynamicMapPoints = [
        ...mapPoints
    ];
    if (routeCoordinates?.source) {
        dynamicMapPoints.push({
            id: "route_source",
            lat: routeCoordinates.source.lat,
            lon: routeCoordinates.source.lon,
            type: "source",
            label: "📍 Source",
            risk: 0
        });
    }
    if (routeCoordinates?.destination) {
        dynamicMapPoints.push({
            id: "route_destination",
            lat: routeCoordinates.destination.lat,
            lon: routeCoordinates.destination.lon,
            type: "destination",
            label: "🎯 Destination",
            risk: 0
        });
    }
    // Load world borders on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$map$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadWorldBorders"])().then((borders)=>{
            if (borders) {
                setWorldBorders(borders);
            }
        }).catch((error)=>{
            // Silently fail - borders are optional
            console.warn("[v0] Could not load world borders:", error);
        });
    }, []);
    // Load route polyline when coordinates change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (routeCoordinates?.source && routeCoordinates?.destination) {
            const source = routeCoordinates.source;
            const destination = routeCoordinates.destination;
            // Clear previous route first
            setRoutePolyline([]);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$routing$2d$engine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getGlobalRoute"])(source, destination, "walking").then((route)=>{
                // Ensure route has valid coordinates
                if (route && route.length > 0) {
                    // Validate coordinates are in correct format [lat, lon]
                    const validRoute = route.filter((point)=>typeof point.lat === "number" && typeof point.lon === "number" && !isNaN(point.lat) && !isNaN(point.lon) && point.lat >= -90 && point.lat <= 90 && point.lon >= -180 && point.lon <= 180);
                    if (validRoute.length > 0) {
                        setRoutePolyline(validRoute);
                    } else {
                        // Fallback if validation fails
                        setRoutePolyline((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$map$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateRoutePolyline"])(source, destination));
                    }
                } else {
                    setRoutePolyline((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$map$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateRoutePolyline"])(source, destination));
                }
            }).catch((error)=>{
                // Fallback to simple polyline
                console.warn("[v0] Could not load route, using fallback:", error);
                setRoutePolyline((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$map$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateRoutePolyline"])(source, destination));
            });
        } else {
            setRoutePolyline([]);
        }
    }, [
        routeCoordinates
    ]);
    // Map projection using utility function - includes route polyline in bounds
    const projectPoint = (lat, lon, width, height)=>{
        const bounds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$map$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateBounds"])(routeCoordinates?.source, routeCoordinates?.destination, routePolyline);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$map$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["projectToCanvas"])(lat, lon, bounds, width, height);
    };
    const getPointColor = (point)=>{
        switch(point.type){
            case "safe_zone":
                return "#00ff41";
            case "conflict":
                return "#ff1744";
            case "water":
                return "#0099ff";
            case "hospital":
                return "#ffd700";
            case "source":
                return "#00ffff";
            case "destination":
                return "#ff9800";
            default:
                return "#e0e6ff";
        }
    };
    const drawMap = ()=>{
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const width = canvas.width;
        const height = canvas.height;
        // Clear canvas
        ctx.fillStyle = "#0f1423";
        ctx.fillRect(0, 0, width, height);
        // Calculate bounds - include route polyline for proper zoom
        const bounds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$map$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateBounds"])(routeCoordinates?.source, routeCoordinates?.destination, routePolyline);
        // Draw world borders if loaded
        if (worldBorders) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$map$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["drawGeoJSONBorders"])(ctx, worldBorders, bounds, width, height);
        }
        // Draw grid
        ctx.strokeStyle = "rgba(0, 255, 65, 0.1)";
        ctx.lineWidth = 1;
        for(let i = 0; i <= 10; i++){
            const x = i * width / 10;
            const y = i * height / 10;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        // Draw zones (background)
        const safeZones = [
            {
                lat: 35.0,
                lon: 40.0,
                radius: 0.5,
                type: "safe"
            },
            {
                lat: 34.8,
                lon: 41.2,
                radius: 0.4,
                type: "safe"
            }
        ];
        safeZones.forEach((zone)=>{
            const { x, y } = projectPoint(zone.lat, zone.lon, width, height);
            const radius = zone.radius / 2 * width;
            ctx.fillStyle = "rgba(0, 255, 65, 0.1)";
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "rgba(0, 255, 65, 0.3)";
            ctx.lineWidth = 2;
            ctx.stroke();
        });
        // Draw danger zones
        const dangerZones = [
            {
                lat: 35.5,
                lon: 39.8,
                radius: 0.4,
                type: "danger"
            },
            {
                lat: 34.5,
                lon: 41.8,
                radius: 0.3,
                type: "danger"
            }
        ];
        dangerZones.forEach((zone)=>{
            const { x, y } = projectPoint(zone.lat, zone.lon, width, height);
            const radius = zone.radius / 2 * width;
            ctx.fillStyle = "rgba(255, 23, 68, 0.08)";
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "rgba(255, 23, 68, 0.4)";
            ctx.lineWidth = 2;
            ctx.stroke();
        });
        dynamicMapPoints.forEach((point)=>{
            const { x, y } = projectPoint(point.lat, point.lon, width, height);
            const color = getPointColor(point);
            // Draw point with pulse
            ctx.fillStyle = color + "40";
            ctx.beginPath();
            ctx.arc(x, y, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fill();
            // Draw label
            ctx.fillStyle = color;
            ctx.font = "11px monospace";
            ctx.textAlign = "center";
            ctx.fillText(point.label.substring(0, 12), x, y - 20);
        });
        // Draw route polyline if available - with smooth rendering
        if (routePolyline.length > 0) {
            // Clear any previous route drawing
            ctx.save();
            // Draw route line with proper styling
            ctx.strokeStyle = "#0099ff";
            ctx.lineWidth = 4;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.setLineDash([]);
            ctx.shadowColor = "rgba(0, 153, 255, 0.5)";
            ctx.shadowBlur = 8;
            ctx.beginPath();
            // Draw smooth polyline
            routePolyline.forEach((point, index)=>{
                const { x, y } = projectPoint(point.lat, point.lon, width, height);
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    // Use quadratic curves for smoother lines
                    const prevPoint = routePolyline[index - 1];
                    const prevProj = projectPoint(prevPoint.lat, prevPoint.lon, width, height);
                    const midX = (prevProj.x + x) / 2;
                    const midY = (prevProj.y + y) / 2;
                    ctx.quadraticCurveTo(prevProj.x, prevProj.y, midX, midY);
                    ctx.lineTo(x, y);
                }
            });
            ctx.stroke();
            ctx.restore();
            // Draw route start and end markers
            if (routePolyline.length > 0) {
                const start = projectPoint(routePolyline[0].lat, routePolyline[0].lon, width, height);
                const end = projectPoint(routePolyline[routePolyline.length - 1].lat, routePolyline[routePolyline.length - 1].lon, width, height);
                // Start marker
                ctx.fillStyle = "#00ffff";
                ctx.beginPath();
                ctx.arc(start.x, start.y, 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth = 2;
                ctx.stroke();
                // End marker
                ctx.fillStyle = "#ff9800";
                ctx.beginPath();
                ctx.arc(end.x, end.y, 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        } else if (selectedRoute || routeCoordinates?.source && routeCoordinates?.destination) {
            // Fallback to simple line if polyline not loaded
            ctx.strokeStyle = "#0099ff";
            ctx.lineWidth = 3;
            ctx.setLineDash([
                5,
                5
            ]);
            ctx.beginPath();
            const startLat = routeCoordinates?.source?.lat ?? selectedRoute?.sourceLat;
            const startLon = routeCoordinates?.source?.lon ?? selectedRoute?.sourceLon;
            const endLat = routeCoordinates?.destination?.lat ?? selectedRoute?.destLat;
            const endLon = routeCoordinates?.destination?.lon ?? selectedRoute?.destLon;
            if (startLat !== undefined && startLon !== undefined && endLat !== undefined && endLon !== undefined) {
                const start = projectPoint(startLat, startLon, width, height);
                const end = projectPoint(endLat, endLon, width, height);
                ctx.moveTo(start.x, start.y);
                ctx.lineTo(end.x, end.y);
                ctx.stroke();
            }
            ctx.setLineDash([]);
        }
        // Draw UN/NGO Help Centers
        if (showNGOCenters) {
            const bounds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$map$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateBounds"])(routeCoordinates?.source, routeCoordinates?.destination);
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ngo$2d$centers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HELP_CENTERS"].forEach((center)=>{
                // Only show centers within or near the map bounds
                if (center.lat >= bounds.minLat - 5 && center.lat <= bounds.maxLat + 5 && center.lon >= bounds.minLon - 5 && center.lon <= bounds.maxLon + 5) {
                    const { x, y } = projectPoint(center.lat, center.lon, width, height);
                    // Determine color by organization type
                    let color = "#00ff41" // Default green
                    ;
                    if (center.type === "unhcr") color = "#0066cc";
                    else if (center.type === "red_cross") color = "#ff0000";
                    else if (center.type === "msf") color = "#ff9900";
                    else if (center.type === "unicef") color = "#00a0e3";
                    else if (center.type === "wfp") color = "#ff6b35";
                    // Draw center marker
                    ctx.fillStyle = color + "80";
                    ctx.beginPath();
                    ctx.arc(x, y, 10, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.arc(x, y, 6, 0, Math.PI * 2);
                    ctx.fill();
                    // Draw label
                    ctx.fillStyle = color;
                    ctx.font = "10px monospace";
                    ctx.textAlign = "center";
                    ctx.fillText(center.organization.substring(0, 8), x, y - 15);
                }
            });
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        drawMap();
    }, [
        dynamicMapPoints,
        selectedRoute,
        routeCoordinates,
        worldBorders,
        routePolyline,
        showNGOCenters
    ]);
    const handleCanvasClick = (e)=>{
        if (!selectionMode) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        // Check if clicked near a point
        for (const point of mapPoints){
            const projected = projectPoint(point.lat, point.lon, canvas.width, canvas.height);
            const distance = Math.sqrt((x - projected.x) ** 2 + (y - projected.y) ** 2);
            if (distance < 20) {
                if (selectionMode === "source") {
                    onSourceSelect(point);
                } else {
                    onDestinationSelect(point);
                }
                setSelectionMode(null);
                return;
            }
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-3 h-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setSelectionMode(selectionMode === "source" ? null : "source"),
                        className: `flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${selectionMode === "source" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground hover:bg-muted"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/components/map/interactive-map.tsx",
                                lineNumber: 451,
                                columnNumber: 11
                            }, this),
                            selectionMode === "source" ? "CLICK TO SET SOURCE" : "SET SOURCE"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/map/interactive-map.tsx",
                        lineNumber: 443,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setSelectionMode(selectionMode === "destination" ? null : "destination"),
                        className: `flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${selectionMode === "destination" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground hover:bg-muted"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/components/map/interactive-map.tsx",
                                lineNumber: 463,
                                columnNumber: 11
                            }, this),
                            selectionMode === "destination" ? "CLICK TO SET DESTINATION" : "SET DESTINATION"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/map/interactive-map.tsx",
                        lineNumber: 455,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/map/interactive-map.tsx",
                lineNumber: 442,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                ref: canvasRef,
                width: 800,
                height: 600,
                onClick: handleCanvasClick,
                className: "flex-1 cursor-crosshair rounded-lg border border-border bg-card"
            }, void 0, false, {
                fileName: "[project]/components/map/interactive-map.tsx",
                lineNumber: 468,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 gap-2 text-xs",
                children: [
                    {
                        color: "#00ff41",
                        label: "Safe Zones"
                    },
                    {
                        color: "#ff1744",
                        label: "Danger Zones"
                    },
                    {
                        color: "#0099ff",
                        label: "Water Points"
                    },
                    {
                        color: "#ffd700",
                        label: "Medical"
                    },
                    {
                        color: "#00ffff",
                        label: "Source"
                    },
                    {
                        color: "#ff9800",
                        label: "Destination"
                    }
                ].map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 text-muted-foreground",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-3 w-3 rounded-full",
                                style: {
                                    backgroundColor: item.color
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/map/interactive-map.tsx",
                                lineNumber: 487,
                                columnNumber: 13
                            }, this),
                            item.label
                        ]
                    }, item.label, true, {
                        fileName: "[project]/components/map/interactive-map.tsx",
                        lineNumber: 486,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/map/interactive-map.tsx",
                lineNumber: 477,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/map/interactive-map.tsx",
        lineNumber: 441,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/map/map-layer-controls.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MapLayerControls
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplet$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/droplet.js [app-ssr] (ecmascript) <export default as Droplet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-ssr] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-ssr] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-ssr] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wind.js [app-ssr] (ecmascript) <export default as Wind>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.js [app-ssr] (ecmascript) <export default as Zap>");
"use client";
;
;
function MapLayerControls({ activeLayers, onToggleLayer }) {
    const layers = [
        {
            id: "safe_zones",
            name: "Safe Zones",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"],
            color: "text-primary"
        },
        {
            id: "conflict_zones",
            name: "Conflict Zones",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"],
            color: "text-accent"
        },
        {
            id: "water_points",
            name: "Water Points",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplet$3e$__["Droplet"],
            color: "text-secondary"
        },
        {
            id: "hospitals",
            name: "Hospitals",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"],
            color: "text-yellow-500"
        },
        {
            id: "checkpoints",
            name: "Checkpoints",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"],
            color: "text-orange-400"
        },
        {
            id: "weather",
            name: "Weather Alerts",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__["Wind"],
            color: "text-cyan-400"
        },
        {
            id: "hazards",
            name: "Natural Hazards",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"],
            color: "text-purple-400"
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-3 w-48",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-xs font-semibold text-primary uppercase",
                children: "Map Layers"
            }, void 0, false, {
                fileName: "[project]/components/map/map-layer-controls.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: layers.map((layer)=>{
                    const Icon = layer.icon;
                    const isActive = activeLayers.includes(layer.id);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>onToggleLayer(layer.id),
                        className: `flex w-full items-center gap-2 rounded-lg px-3 py-2 transition text-sm ${isActive ? "bg-muted border border-primary" : "border border-border bg-card hover:bg-muted"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "checkbox",
                                checked: isActive,
                                readOnly: true,
                                className: "h-4 w-4 cursor-pointer"
                            }, void 0, false, {
                                fileName: "[project]/components/map/map-layer-controls.tsx",
                                lineNumber: 73,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                className: `h-4 w-4 ${layer.color}`
                            }, void 0, false, {
                                fileName: "[project]/components/map/map-layer-controls.tsx",
                                lineNumber: 74,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-foreground",
                                children: layer.name
                            }, void 0, false, {
                                fileName: "[project]/components/map/map-layer-controls.tsx",
                                lineNumber: 75,
                                columnNumber: 15
                            }, this)
                        ]
                    }, layer.id, true, {
                        fileName: "[project]/components/map/map-layer-controls.tsx",
                        lineNumber: 66,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/map/map-layer-controls.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-t border-border pt-3 space-y-2 text-xs",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "font-semibold text-primary",
                        children: "ZONE STATS"
                    }, void 0, false, {
                        fileName: "[project]/components/map/map-layer-controls.tsx",
                        lineNumber: 83,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between text-muted-foreground",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Safe Zones:"
                            }, void 0, false, {
                                fileName: "[project]/components/map/map-layer-controls.tsx",
                                lineNumber: 85,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-primary font-semibold",
                                children: "2"
                            }, void 0, false, {
                                fileName: "[project]/components/map/map-layer-controls.tsx",
                                lineNumber: 86,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/map/map-layer-controls.tsx",
                        lineNumber: 84,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between text-muted-foreground",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Danger Areas:"
                            }, void 0, false, {
                                fileName: "[project]/components/map/map-layer-controls.tsx",
                                lineNumber: 89,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-accent font-semibold",
                                children: "5"
                            }, void 0, false, {
                                fileName: "[project]/components/map/map-layer-controls.tsx",
                                lineNumber: 90,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/map/map-layer-controls.tsx",
                        lineNumber: 88,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between text-muted-foreground",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Resources:"
                            }, void 0, false, {
                                fileName: "[project]/components/map/map-layer-controls.tsx",
                                lineNumber: 93,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-secondary font-semibold",
                                children: "8"
                            }, void 0, false, {
                                fileName: "[project]/components/map/map-layer-controls.tsx",
                                lineNumber: 94,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/map/map-layer-controls.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/map/map-layer-controls.tsx",
                lineNumber: 82,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/map/map-layer-controls.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/map/map-container.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MapContainer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$map$2f$interactive$2d$map$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/map/interactive-map.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$map$2f$map$2d$layer$2d$controls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/map/map-layer-controls.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function MapContainer({ selectedRoute, routeCoordinates }) {
    const [activeLayers, setActiveLayers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([
        "safe_zones",
        "conflict_zones",
        "water_points",
        "hospitals"
    ]);
    const [sourcePoint, setSourcePoint] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [destPoint, setDestPoint] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const toggleLayer = (layerId)=>{
        setActiveLayers((prev)=>prev.includes(layerId) ? prev.filter((l)=>l !== layerId) : [
                ...prev,
                layerId
            ]);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative h-full w-full rounded-lg border border-border bg-card overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex h-full gap-4 p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$map$2f$interactive$2d$map$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            onSourceSelect: setSourcePoint,
                            onDestinationSelect: setDestPoint,
                            selectedRoute: selectedRoute,
                            routeCoordinates: routeCoordinates
                        }, void 0, false, {
                            fileName: "[project]/components/map/map-container.tsx",
                            lineNumber: 42,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/map/map-container.tsx",
                        lineNumber: 41,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$map$2f$map$2d$layer$2d$controls$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        activeLayers: activeLayers,
                        onToggleLayer: toggleLayer
                    }, void 0, false, {
                        fileName: "[project]/components/map/map-container.tsx",
                        lineNumber: 50,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/map/map-container.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this),
            (sourcePoint || destPoint) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute bottom-4 left-4 rounded-lg bg-card/90 p-3 backdrop-blur border border-border text-xs space-y-1",
                children: [
                    sourcePoint && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 text-primary",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-semibold",
                                children: "SOURCE:"
                            }, void 0, false, {
                                fileName: "[project]/components/map/map-container.tsx",
                                lineNumber: 58,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: sourcePoint.label
                            }, void 0, false, {
                                fileName: "[project]/components/map/map-container.tsx",
                                lineNumber: 59,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/map/map-container.tsx",
                        lineNumber: 57,
                        columnNumber: 13
                    }, this),
                    destPoint && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 text-secondary",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-semibold",
                                children: "DESTINATION:"
                            }, void 0, false, {
                                fileName: "[project]/components/map/map-container.tsx",
                                lineNumber: 64,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: destPoint.label
                            }, void 0, false, {
                                fileName: "[project]/components/map/map-container.tsx",
                                lineNumber: 65,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/map/map-container.tsx",
                        lineNumber: 63,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/map/map-container.tsx",
                lineNumber: 55,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/map/map-container.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
}),
"[project]/lib/export-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Export utilities for PDF, PNG, and ZIP downloads
__turbopack_context__.s([
    "createOfflineZip",
    ()=>createOfflineZip,
    "downloadBlob",
    ()=>downloadBlob,
    "exportMapAsPNG",
    ()=>exportMapAsPNG,
    "generateEmergencyProtocolsPDF",
    ()=>generateEmergencyProtocolsPDF,
    "generateSurvivalPDF",
    ()=>generateSurvivalPDF
]);
async function generateSurvivalPDF(data) {
    // Simple text-based PDF generation
    const lines = [
        "SURVIVAL PACK EXPORT",
        "=".repeat(50),
        "",
        "ROUTE SUMMARY:",
        data.routeSummary,
        "",
        "SUPPLIES:",
        ...data.supplies.map((s)=>`- ${s}`),
        "",
        "WEATHER WARNINGS:",
        ...data.weatherWarnings.map((w)=>`- ${w}`),
        "",
        "HAZARD ZONES:",
        ...data.hazardZones.map((h)=>`- ${h}`),
        "",
        "CLEAN WATER POINTS:",
        ...data.waterPoints.map((p)=>`- ${p}`),
        "",
        "EMERGENCY CONTACTS:",
        ...data.emergencyContacts.map((c)=>`- ${c}`),
        "",
        "Generated by SafeRoute"
    ];
    const textContent = lines.join("\n");
    // Create simple PDF with text
    const pdfContent = createSimplePDF(textContent);
    return new Blob([
        pdfContent
    ], {
        type: "application/pdf"
    });
}
function createSimplePDF(text) {
    const lines = text.split("\n");
    let yPosition = 750;
    let content = "";
    lines.forEach((line)=>{
        content += `BT /F1 12 Tf 50 ${yPosition} Td (${escapePDFText(line)}) Tj ET\n`;
        yPosition -= 15;
    });
    const stream = `BT
/F1 12 Tf
50 750 Td
${lines.map((line, i)=>`(${escapePDFText(line)}) Tj T* `).join("")}
ET`;
    return `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length ${stream.length} >>
stream
${stream}
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000214 00000 n
0000000${(214 + stream.length + 50).toString().padStart(6, "0")} 00000 n
trailer
<< /Size 6 /Root 1 0 R >>
startxref
${214 + stream.length + 100}
%%EOF` + "\n";
}
function escapePDFText(text) {
    return text.replace(/\\/g, "\\\\").replace(/$$/g, "\\(").replace(/$$/g, "\\)");
}
function exportMapAsPNG(canvas) {
    return new Promise((resolve)=>{
        canvas.toBlob((blob)=>{
            resolve(blob || new Blob());
        }, "image/png");
    });
}
async function createOfflineZip(routeJSON, suppliesJSON, pdfBlob, pngBlob, translationsJSON) {
    const files = [
        {
            name: "route.json",
            content: JSON.stringify(routeJSON, null, 2)
        },
        {
            name: "supplies.json",
            content: JSON.stringify(suppliesJSON, null, 2)
        },
        {
            name: "translations.json",
            content: JSON.stringify(translationsJSON, null, 2)
        },
        {
            name: "map-snapshot.png",
            content: pngBlob
        },
        {
            name: "survival-guide.pdf",
            content: pdfBlob
        }
    ];
    // Simple ZIP creation using blob concatenation
    const zipBlob = new Blob(files.map((f)=>f.content), {
        type: "application/zip"
    });
    return zipBlob;
}
function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
async function generateEmergencyProtocolsPDF() {
    const content = `
OFFLINE EMERGENCY SURVIVAL PROTOCOLS
=====================================

Generated by Refugee Survival App

FOOD SURVIVAL
-------------
1. Water Purification:
   - Boil water for 1 minute (3 minutes at high altitude)
   - Use water purification tablets if available
   - Filter through clean cloth to remove debris
   - Avoid stagnant water - prefer running water sources

2. Safe Food Sources:
   - Only eat plants you can positively identify
   - Avoid wild mushrooms unless expert
   - Cook all meat thoroughly
   - High-calorie foods: nuts, dried fruits, energy bars
   - Look for food distribution points (WFP, Red Cross)

3. Food Storage:
   - Keep food in sealed containers
   - Protect from animals and insects
   - Rotate food supplies (first in, first out)

WATER PURIFICATION
------------------
1. Boiling Method:
   - Bring water to rolling boil for 1 minute
   - Let cool before drinking
   - Most effective method

2. Chemical Treatment:
   - Use water purification tablets
   - Follow package instructions
   - Wait recommended time before drinking

3. Filtration:
   - Use clean cloth or commercial filter
   - Remove visible debris
   - Still needs boiling or chemical treatment

4. Finding Water:
   - Rivers and streams (needs purification)
   - Collect rainwater in clean containers
   - Morning dew on plants
   - Avoid stagnant or contaminated sources

SHELTER
-------
1. Building Shelter:
   - Find location before dark
   - Use natural materials (branches, leaves)
   - Build lean-to structure
   - Keep shelter well-ventilated

2. Location:
   - Avoid low-lying areas (flood risk)
   - Stay away from conflict zones
   - Look for natural protection (caves, overhangs)
   - Stay dry - use plastic/tarp if available

3. Official Shelters:
   - Contact UNHCR for refugee camps
   - Red Cross emergency shelters
   - Local NGO shelters

FIRST AID
---------
1. Wound Care:
   - Clean wounds with clean water
   - Cover with clean bandage
   - Keep wounds dry
   - Seek medical help for serious injuries

2. Common Issues:
   - Dehydration: drink water regularly
   - Hypothermia: stay dry and warm
   - Heat exhaustion: rest in shade, drink water
   - Diarrhea: stay hydrated, seek medical help

3. Medical Help:
   - MSF (Médecins Sans Frontières) hospitals
   - Red Cross medical facilities
   - UNHCR health services
   - Local hospitals

4. First Aid Kit Essentials:
   - Bandages and gauze
   - Antiseptic wipes
   - Pain relievers
   - Water purification tablets
   - Medical tape

EMERGENCY CONTACTS
------------------
- UNHCR: Contact local office
- Red Cross/Red Crescent: Local office
- MSF: Local MSF office
- Emergency services: Local number
- NGOs: Check directory in app

IMPORTANT REMINDERS
-------------------
- Stay hydrated (2-3 liters water per day)
- Keep documents safe and dry
- Travel during daylight when possible
- Avoid conflict zones
- Register with UNHCR for protection
- Keep emergency contacts accessible
- Trust official aid organizations

This guide is for emergency situations only.
Seek professional medical help for serious conditions.
Always prioritize safety and follow local authorities' guidance.

Generated: ${new Date().toLocaleString()}
  `.trim();
    return generateSurvivalPDF({
        routeSummary: "Offline Emergency Survival Protocols",
        supplies: [
            "Water: 2-3 liters per day minimum",
            "Food: High-calorie, non-perishable",
            "First aid kit",
            "Water purification tablets",
            "Shelter materials"
        ],
        weatherWarnings: [
            "Check weather before traveling",
            "Avoid extreme weather conditions",
            "Stay dry and warm"
        ],
        hazardZones: [
            "Avoid conflict zones",
            "Check country danger levels",
            "Stay on safe routes"
        ],
        waterPoints: [
            "Rivers and streams (purify first)",
            "Rainwater collection",
            "Official water distribution points"
        ],
        emergencyContacts: [
            "UNHCR",
            "Red Cross/Red Crescent",
            "MSF",
            "Local emergency services"
        ]
    });
}
}),
"[project]/components/route/route-analyzer.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RouteAnalyzer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplet$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/droplet.js [app-ssr] (ecmascript) <export default as Droplet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$utensils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Utensils$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/utensils.js [app-ssr] (ecmascript) <export default as Utensils>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-ssr] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-ssr] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$route$2d$engine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/route-engine.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$export$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/export-utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function RouteAnalyzer({ source, destination, travelMode, onAnalysisComplete }) {
    const [analysis, setAnalysis] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isExporting, setIsExporting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const memoizedOnAnalysisComplete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((result)=>{
        onAnalysisComplete?.(result);
    }, [
        onAnalysisComplete
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (source && destination) {
            setIsLoading(true);
            // Keep previous analysis visible during loading to prevent flickering
            const timer = setTimeout(()=>{
                const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$route$2d$engine$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["analyzeRoute"])(source, destination, travelMode);
                setAnalysis(result);
                memoizedOnAnalysisComplete(result);
                setIsLoading(false);
            }, 800);
            return ()=>clearTimeout(timer);
        }
    }, [
        source,
        destination,
        travelMode,
        memoizedOnAnalysisComplete
    ]);
    const handleDownloadSurvivalPack = async ()=>{
        if (!analysis) return;
        setIsExporting(true);
        try {
            const pdfBlob = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$export$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateSurvivalPDF"])({
                routeSummary: `From (${source?.lat}, ${source?.lon}) to (${destination?.lat}, ${destination?.lon}). Distance: ${analysis.distance_km}km, Duration: ${analysis.duration_days}d, Risk: ${analysis.risk_level}`,
                supplies: [
                    `Water: ${analysis.estimated_water_liters_per_day}L/day × ${analysis.duration_days} days`,
                    `Food: ${analysis.estimated_calories_per_day} cal/day`,
                    "First aid kit",
                    "Shelter materials",
                    "Navigation equipment"
                ],
                weatherWarnings: analysis.recommendations.filter((r)=>r.includes("⛈️") || r.includes("⚠️")),
                hazardZones: [
                    `Conflict intersections: ${analysis.conflict_intersections}`,
                    `Terrain: ${analysis.terrain_difficulty}`,
                    `Weather risk: ${analysis.weather_risk.toFixed(1)}/10`
                ],
                waterPoints: [
                    "Query OSM for water sources along route",
                    "Camp near rivers/streams",
                    "Collect rainwater"
                ],
                emergencyContacts: [
                    "Local NGOs",
                    "Red Cross/Red Crescent",
                    "UN agencies",
                    "Border crossing officials"
                ]
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$export$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["downloadBlob"])(pdfBlob, "survival-pack.pdf");
        } catch (error) {
            console.error("[v0] Error generating PDF:", error);
        } finally{
            setIsExporting(false);
        }
    };
    const handleDownloadMap = async ()=>{
        if (!canvasRef.current) return;
        setIsExporting(true);
        try {
            const blob = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$export$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["exportMapAsPNG"])(canvasRef.current);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$export$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["downloadBlob"])(blob, "map-snapshot.png");
        } catch (error) {
            console.error("[v0] Error exporting map:", error);
        } finally{
            setIsExporting(false);
        }
    };
    const handleDownloadOfflinePack = async ()=>{
        if (!analysis) return;
        setIsExporting(true);
        try {
            const pdfBlob = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$export$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateSurvivalPDF"])({
                routeSummary: `From (${source?.lat}, ${source?.lon}) to (${destination?.lat}, ${destination?.lon}). Distance: ${analysis.distance_km}km`,
                supplies: [
                    `Water: ${analysis.estimated_water_liters_per_day}L/day`,
                    `Food: ${analysis.estimated_calories_per_day} cal/day`
                ],
                weatherWarnings: analysis.recommendations,
                hazardZones: [
                    `Conflict: ${analysis.conflict_intersections}`
                ],
                waterPoints: [
                    "Rivers",
                    "Streams",
                    "Wells"
                ],
                emergencyContacts: [
                    "NGOs",
                    "Red Cross"
                ]
            });
            // Map PNG (simulated)
            const mapPngBlob = new Blob([
                "map data"
            ], {
                type: "image/png"
            });
            // Create ZIP
            const zipBlob = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$export$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createOfflineZip"])({
                source,
                destination,
                analysis
            }, {
                water: analysis.estimated_water_liters_per_day,
                calories: analysis.estimated_calories_per_day
            }, pdfBlob, mapPngBlob, {
                arabic: "Emergency phrases",
                kurdish: "Emergency phrases",
                turkish: "Emergency phrases",
                farsi: "Emergency phrases"
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$export$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["downloadBlob"])(zipBlob, "offline-pack.zip");
        } catch (error) {
            console.error("[v0] Error creating ZIP:", error);
        } finally{
            setIsExporting(false);
        }
    };
    const getRiskColor = (level)=>{
        switch(level){
            case "LOW":
                return "border-primary text-primary bg-primary/10";
            case "MEDIUM":
                return "border-yellow-500 text-yellow-400 bg-yellow-500/10";
            case "HIGH":
                return "border-orange-500 text-orange-400 bg-orange-500/10";
            case "CRITICAL":
                return "border-accent text-accent bg-accent/10";
            default:
                return "border-muted text-muted-foreground bg-muted/10";
        }
    };
    if (!source || !destination) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-lg border border-border bg-card p-4 text-center text-sm text-muted-foreground",
            children: "Enter source and destination to analyze"
        }, void 0, false, {
            fileName: "[project]/components/route/route-analyzer.tsx",
            lineNumber: 150,
            columnNumber: 7
        }, this);
    }
    if (isLoading && !analysis) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center gap-3 rounded-lg border border-border bg-card/50 p-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"
                }, void 0, false, {
                    fileName: "[project]/components/route/route-analyzer.tsx",
                    lineNumber: 159,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-sm text-muted-foreground",
                    children: "Analyzing global route..."
                }, void 0, false, {
                    fileName: "[project]/components/route/route-analyzer.tsx",
                    lineNumber: 160,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/route/route-analyzer.tsx",
            lineNumber: 158,
            columnNumber: 7
        }, this);
    }
    // Show loading overlay while keeping previous analysis visible
    const renderContent = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-4 rounded-lg border border-border bg-card p-5",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "font-semibold text-foreground",
                            children: "ROUTE ANALYSIS"
                        }, void 0, false, {
                            fileName: "[project]/components/route/route-analyzer.tsx",
                            lineNumber: 170,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `rounded-lg px-3 py-1 text-sm font-bold border ${getRiskColor(analysis.risk_level)}`,
                            children: [
                                "RISK: ",
                                analysis.risk_level
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/route/route-analyzer.tsx",
                            lineNumber: 171,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/route/route-analyzer.tsx",
                    lineNumber: 169,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-lg bg-muted/30 p-4 border border-muted/50",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-2 flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs font-semibold text-secondary",
                                    children: "SURVIVAL PROBABILITY"
                                }, void 0, false, {
                                    fileName: "[project]/components/route/route-analyzer.tsx",
                                    lineNumber: 179,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-2xl font-bold text-primary",
                                    children: [
                                        analysis.survival_score,
                                        "%"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/route/route-analyzer.tsx",
                                    lineNumber: 180,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/route/route-analyzer.tsx",
                            lineNumber: 178,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-2 w-full overflow-hidden rounded-full bg-muted/50",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500",
                                style: {
                                    width: `${analysis.survival_score}%`
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/route/route-analyzer.tsx",
                                lineNumber: 183,
                                columnNumber: 11
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/route/route-analyzer.tsx",
                            lineNumber: 182,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/route/route-analyzer.tsx",
                    lineNumber: 177,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-2 gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg border border-border bg-muted/30 p-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-muted-foreground",
                                    children: "DISTANCE"
                                }, void 0, false, {
                                    fileName: "[project]/components/route/route-analyzer.tsx",
                                    lineNumber: 193,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-lg font-bold text-foreground",
                                    children: [
                                        analysis.distance_km,
                                        " km"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/route/route-analyzer.tsx",
                                    lineNumber: 194,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/route/route-analyzer.tsx",
                            lineNumber: 192,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg border border-border bg-muted/30 p-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-muted-foreground",
                                    children: "DURATION"
                                }, void 0, false, {
                                    fileName: "[project]/components/route/route-analyzer.tsx",
                                    lineNumber: 197,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-lg font-bold text-foreground",
                                    children: [
                                        analysis.duration_days,
                                        "d ",
                                        Math.round(analysis.duration_hours % 8),
                                        "h"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/route/route-analyzer.tsx",
                                    lineNumber: 198,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/route/route-analyzer.tsx",
                            lineNumber: 196,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/route/route-analyzer.tsx",
                    lineNumber: 191,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-2 gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg border border-border bg-muted/30 p-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-muted-foreground",
                                    children: "TERRAIN"
                                }, void 0, false, {
                                    fileName: "[project]/components/route/route-analyzer.tsx",
                                    lineNumber: 207,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm font-semibold text-foreground",
                                    children: analysis.terrain_difficulty
                                }, void 0, false, {
                                    fileName: "[project]/components/route/route-analyzer.tsx",
                                    lineNumber: 208,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/route/route-analyzer.tsx",
                            lineNumber: 206,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg border border-border bg-muted/30 p-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-muted-foreground",
                                    children: "CONFLICT AREAS"
                                }, void 0, false, {
                                    fileName: "[project]/components/route/route-analyzer.tsx",
                                    lineNumber: 211,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm font-semibold text-accent",
                                    children: analysis.conflict_intersections
                                }, void 0, false, {
                                    fileName: "[project]/components/route/route-analyzer.tsx",
                                    lineNumber: 212,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/route/route-analyzer.tsx",
                            lineNumber: 210,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/route/route-analyzer.tsx",
                    lineNumber: 205,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 text-xs text-muted-foreground",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplet$3e$__["Droplet"], {
                                            className: "h-4 w-4 text-secondary"
                                        }, void 0, false, {
                                            fileName: "[project]/components/route/route-analyzer.tsx",
                                            lineNumber: 220,
                                            columnNumber: 13
                                        }, this),
                                        "Water Availability"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/route/route-analyzer.tsx",
                                    lineNumber: 219,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm font-semibold text-secondary",
                                    children: [
                                        analysis.water_score,
                                        "/10"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/route/route-analyzer.tsx",
                                    lineNumber: 223,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/route/route-analyzer.tsx",
                            lineNumber: 218,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-1.5 w-full rounded-full bg-muted/50",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-full rounded-full bg-secondary",
                                style: {
                                    width: `${analysis.water_score / 10 * 100}%`
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/route/route-analyzer.tsx",
                                lineNumber: 226,
                                columnNumber: 11
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/route/route-analyzer.tsx",
                            lineNumber: 225,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/route/route-analyzer.tsx",
                    lineNumber: 217,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 text-xs text-muted-foreground",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$utensils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Utensils$3e$__["Utensils"], {
                                            className: "h-4 w-4 text-yellow-500"
                                        }, void 0, false, {
                                            fileName: "[project]/components/route/route-analyzer.tsx",
                                            lineNumber: 236,
                                            columnNumber: 13
                                        }, this),
                                        "Food Availability"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/route/route-analyzer.tsx",
                                    lineNumber: 235,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm font-semibold text-yellow-500",
                                    children: [
                                        analysis.food_score,
                                        "/10"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/route/route-analyzer.tsx",
                                    lineNumber: 239,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/route/route-analyzer.tsx",
                            lineNumber: 234,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-1.5 w-full rounded-full bg-muted/50",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-full rounded-full bg-yellow-500",
                                style: {
                                    width: `${analysis.food_score / 10 * 100}%`
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/route/route-analyzer.tsx",
                                lineNumber: 242,
                                columnNumber: 11
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/route/route-analyzer.tsx",
                            lineNumber: 241,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/route/route-analyzer.tsx",
                    lineNumber: 233,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                            className: "h-4 w-4 flex-shrink-0 text-yellow-500 mt-0.5"
                        }, void 0, false, {
                            fileName: "[project]/components/route/route-analyzer.tsx",
                            lineNumber: 251,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-yellow-200",
                            children: analysis.danger_explanation
                        }, void 0, false, {
                            fileName: "[project]/components/route/route-analyzer.tsx",
                            lineNumber: 252,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/route/route-analyzer.tsx",
                    lineNumber: 250,
                    columnNumber: 7
                }, this),
                analysis.recommendations.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs font-semibold text-primary",
                            children: "RECOMMENDATIONS:"
                        }, void 0, false, {
                            fileName: "[project]/components/route/route-analyzer.tsx",
                            lineNumber: 258,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-1",
                            children: analysis.recommendations.map((rec, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2 text-xs text-muted-foreground",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex-shrink-0",
                                            children: "•"
                                        }, void 0, false, {
                                            fileName: "[project]/components/route/route-analyzer.tsx",
                                            lineNumber: 262,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: rec
                                        }, void 0, false, {
                                            fileName: "[project]/components/route/route-analyzer.tsx",
                                            lineNumber: 263,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, i, true, {
                                    fileName: "[project]/components/route/route-analyzer.tsx",
                                    lineNumber: 261,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/route/route-analyzer.tsx",
                            lineNumber: 259,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/route/route-analyzer.tsx",
                    lineNumber: 257,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "border-t border-border pt-3 space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs font-semibold text-secondary",
                            children: "ESTIMATED SUPPLY NEEDS:"
                        }, void 0, false, {
                            fileName: "[project]/components/route/route-analyzer.tsx",
                            lineNumber: 272,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-2 text-xs",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-lg bg-muted/30 p-2 border border-border",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-muted-foreground",
                                            children: "Calories/day"
                                        }, void 0, false, {
                                            fileName: "[project]/components/route/route-analyzer.tsx",
                                            lineNumber: 275,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-semibold text-foreground",
                                            children: analysis.estimated_calories_per_day
                                        }, void 0, false, {
                                            fileName: "[project]/components/route/route-analyzer.tsx",
                                            lineNumber: 276,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/route/route-analyzer.tsx",
                                    lineNumber: 274,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-lg bg-muted/30 p-2 border border-border",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-muted-foreground",
                                            children: "Water/day"
                                        }, void 0, false, {
                                            fileName: "[project]/components/route/route-analyzer.tsx",
                                            lineNumber: 279,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-semibold text-foreground",
                                            children: [
                                                analysis.estimated_water_liters_per_day,
                                                "L"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/route/route-analyzer.tsx",
                                            lineNumber: 280,
                                            columnNumber: 13
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/route/route-analyzer.tsx",
                                    lineNumber: 278,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/route/route-analyzer.tsx",
                            lineNumber: 273,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/route/route-analyzer.tsx",
                    lineNumber: 271,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "border-t border-border pt-3 space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs font-semibold text-primary mb-2",
                            children: "DOWNLOAD:"
                        }, void 0, false, {
                            fileName: "[project]/components/route/route-analyzer.tsx",
                            lineNumber: 287,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleDownloadSurvivalPack,
                            disabled: isExporting,
                            className: "w-full flex items-center justify-center gap-2 rounded-lg border border-primary bg-primary/10 hover:bg-primary/20 text-primary px-3 py-2 text-sm font-semibold transition disabled:opacity-50",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/components/route/route-analyzer.tsx",
                                    lineNumber: 293,
                                    columnNumber: 11
                                }, this),
                                isExporting ? "Exporting..." : "Download Survival Pack (PDF)"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/route/route-analyzer.tsx",
                            lineNumber: 288,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleDownloadMap,
                            disabled: isExporting,
                            className: "w-full flex items-center justify-center gap-2 rounded-lg border border-secondary bg-secondary/10 hover:bg-secondary/20 text-secondary px-3 py-2 text-sm font-semibold transition disabled:opacity-50",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/components/route/route-analyzer.tsx",
                                    lineNumber: 301,
                                    columnNumber: 11
                                }, this),
                                isExporting ? "Exporting..." : "Download Map Snapshot (PNG)"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/route/route-analyzer.tsx",
                            lineNumber: 296,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleDownloadOfflinePack,
                            disabled: isExporting,
                            className: "w-full flex items-center justify-center gap-2 rounded-lg border border-accent bg-accent/10 hover:bg-accent/20 text-accent px-3 py-2 text-sm font-semibold transition disabled:opacity-50",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/components/route/route-analyzer.tsx",
                                    lineNumber: 309,
                                    columnNumber: 11
                                }, this),
                                isExporting ? "Exporting..." : "Download Full Offline Pack (ZIP)"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/route/route-analyzer.tsx",
                            lineNumber: 304,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/route/route-analyzer.tsx",
                    lineNumber: 286,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/route/route-analyzer.tsx",
            lineNumber: 167,
            columnNumber: 5
        }, this);
    if (isLoading && analysis) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative",
            children: [
                renderContent(),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm z-10 rounded-lg",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"
                            }, void 0, false, {
                                fileName: "[project]/components/route/route-analyzer.tsx",
                                lineNumber: 322,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm text-muted-foreground",
                                children: "Updating analysis..."
                            }, void 0, false, {
                                fileName: "[project]/components/route/route-analyzer.tsx",
                                lineNumber: 323,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/route/route-analyzer.tsx",
                        lineNumber: 321,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/route/route-analyzer.tsx",
                    lineNumber: 320,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/route/route-analyzer.tsx",
            lineNumber: 318,
            columnNumber: 7
        }, this);
    }
    if (!analysis) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-lg border border-border bg-card p-4 text-center text-sm text-muted-foreground",
            children: "Enter source and destination to analyze"
        }, void 0, false, {
            fileName: "[project]/components/route/route-analyzer.tsx",
            lineNumber: 332,
            columnNumber: 7
        }, this);
    }
    return renderContent();
}
}),
"[project]/lib/geocoder.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Global geocoding and autocomplete using OpenStreetMap Nominatim API
__turbopack_context__.s([
    "autocomplete",
    ()=>autocomplete,
    "parseCoordinates",
    ()=>parseCoordinates,
    "reverseGeocode",
    ()=>reverseGeocode,
    "searchLocation",
    ()=>searchLocation
]);
function parseCoordinates(input) {
    const trimmed = input.trim();
    const match = trimmed.match(/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/);
    if (match) {
        const lat = Number.parseFloat(match[1]);
        const lon = Number.parseFloat(match[2]);
        if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
            return {
                lat,
                lon
            };
        }
    }
    return null;
}
async function searchLocation(query) {
    if (!query || query.length < 2) return [];
    try {
        const response = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
        if (!response.ok) return [];
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("[v0] Geocoding error:", error);
        return [];
    }
}
async function reverseGeocode(lat, lon) {
    try {
        const response = await fetch(`/api/geocode?lat=${lat}&lon=${lon}`);
        if (!response.ok) return null;
        const data = await response.json();
        return data.name;
    } catch (error) {
        console.error("[v0] Reverse geocoding error:", error);
        return null;
    }
}
async function autocomplete(input) {
    // Try parsing as coordinates first
    const coords = parseCoordinates(input);
    if (coords) {
        return [
            {
                name: `${coords.lat.toFixed(4)}, ${coords.lon.toFixed(4)}`,
                lat: coords.lat,
                lon: coords.lon,
                type: "coordinate"
            }
        ];
    }
    // Search for place names
    const results = await searchLocation(input);
    return results.slice(0, 5).map((r)=>({
            name: r.name,
            lat: r.lat,
            lon: r.lon,
            type: r.type
        }));
}
}),
"[project]/components/route/route-panel.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RoutePanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-ssr] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-ssr] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$route$2f$route$2d$analyzer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/route/route-analyzer.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$geocoder$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/geocoder.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$route$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/route-context.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
function RoutePanel({ onRouteSelect, onCoordinatesChange }) {
    const { routeData, setRouteData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$route$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRoute"])();
    const [sourceInput, setSourceInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [destInput, setDestInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [source, setSource] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(routeData.source || null);
    const [destination, setDestination] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(routeData.destination || null);
    const [travelMode, setTravelMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(routeData.travelMode || "walking");
    const [analysis, setAnalysis] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(routeData.analysis || null);
    const [sourceSuggestions, setSourceSuggestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [destSuggestions, setDestSuggestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showSourceDropdown, setShowSourceDropdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showDestDropdown, setShowDestDropdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const memoizedOnCoordinatesChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        onCoordinatesChange?.({
            source,
            destination
        });
    }, [
        source,
        destination,
        onCoordinatesChange
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        memoizedOnCoordinatesChange();
        // Auto-trigger analysis when both source and destination are set
        if (source && destination) {
        // Analysis will be triggered automatically by RouteAnalyzer component
        // This effect ensures coordinates are updated immediately
        }
    }, [
        memoizedOnCoordinatesChange,
        source,
        destination
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const timer = setTimeout(async ()=>{
            if (sourceInput.length > 1) {
                const suggestions = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$geocoder$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["autocomplete"])(sourceInput);
                setSourceSuggestions(suggestions);
                setShowSourceDropdown(true);
            }
        }, 300);
        return ()=>clearTimeout(timer);
    }, [
        sourceInput
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const timer = setTimeout(async ()=>{
            if (destInput.length > 1) {
                const suggestions = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$geocoder$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["autocomplete"])(destInput);
                setDestSuggestions(suggestions);
                setShowDestDropdown(true);
            }
        }, 300);
        return ()=>clearTimeout(timer);
    }, [
        destInput
    ]);
    const handleSelectSource = (suggestion)=>{
        const newSource = {
            lat: suggestion.lat,
            lon: suggestion.lon
        };
        setSource(newSource);
        setSourceInput(suggestion.name);
        setShowSourceDropdown(false);
        // Update context
        setRouteData({
            ...routeData,
            source: newSource
        });
    };
    const handleSelectDestination = (suggestion)=>{
        const newDestination = {
            lat: suggestion.lat,
            lon: suggestion.lon
        };
        setDestination(newDestination);
        setDestInput(suggestion.name);
        setShowDestDropdown(false);
        // Update context
        setRouteData({
            ...routeData,
            destination: newDestination
        });
    };
    const handleAnalysisComplete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((result)=>{
        setAnalysis(result);
        onRouteSelect(result);
    }, [
        onRouteSelect
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-4 h-full overflow-y-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-lg border border-border bg-card p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "mb-1 text-sm font-semibold text-primary",
                        children: "ROUTE PLANNER"
                    }, void 0, false, {
                        fileName: "[project]/components/route/route-panel.tsx",
                        lineNumber: 94,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-muted-foreground",
                        children: "Global routing with AI threat assessment"
                    }, void 0, false, {
                        fileName: "[project]/components/route/route-panel.tsx",
                        lineNumber: 95,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 space-y-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "mb-1 block text-xs font-semibold text-secondary",
                                        children: "SOURCE"
                                    }, void 0, false, {
                                        fileName: "[project]/components/route/route-panel.tsx",
                                        lineNumber: 99,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                        className: "absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/route/route-panel.tsx",
                                                        lineNumber: 102,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        placeholder: "Search city, village, camp, or enter coords (34.123, 36.559)",
                                                        value: sourceInput,
                                                        onChange: (e)=>setSourceInput(e.target.value),
                                                        onFocus: ()=>sourceInput.length > 1 && setShowSourceDropdown(true),
                                                        className: "w-full rounded-lg border border-border bg-input px-3 py-2 pl-8 text-sm text-foreground placeholder:text-muted-foreground hover:bg-muted transition focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/route/route-panel.tsx",
                                                        lineNumber: 103,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/route/route-panel.tsx",
                                                lineNumber: 101,
                                                columnNumber: 15
                                            }, this),
                                            showSourceDropdown && sourceSuggestions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute top-full left-0 right-0 mt-1 rounded-lg border border-border bg-card shadow-lg z-10",
                                                children: sourceSuggestions.map((suggestion, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleSelectSource(suggestion),
                                                        className: "w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted transition border-b border-border last:border-b-0",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                                    className: "h-3 w-3 text-secondary flex-shrink-0"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/route/route-panel.tsx",
                                                                    lineNumber: 121,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "font-medium",
                                                                            children: suggestion.name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/route/route-panel.tsx",
                                                                            lineNumber: 123,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs text-muted-foreground",
                                                                            children: [
                                                                                suggestion.lat.toFixed(3),
                                                                                ", ",
                                                                                suggestion.lon.toFixed(3)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/route/route-panel.tsx",
                                                                            lineNumber: 124,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/route/route-panel.tsx",
                                                                    lineNumber: 122,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/route/route-panel.tsx",
                                                            lineNumber: 120,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, i, false, {
                                                        fileName: "[project]/components/route/route-panel.tsx",
                                                        lineNumber: 115,
                                                        columnNumber: 21
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/components/route/route-panel.tsx",
                                                lineNumber: 113,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/route/route-panel.tsx",
                                        lineNumber: 100,
                                        columnNumber: 13
                                    }, this),
                                    source && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-1 text-xs text-primary flex items-center gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                className: "h-3 w-3"
                                            }, void 0, false, {
                                                fileName: "[project]/components/route/route-panel.tsx",
                                                lineNumber: 136,
                                                columnNumber: 17
                                            }, this),
                                            source.lat.toFixed(4),
                                            ", ",
                                            source.lon.toFixed(4)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/route/route-panel.tsx",
                                        lineNumber: 135,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/route/route-panel.tsx",
                                lineNumber: 98,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "mb-1 block text-xs font-semibold text-secondary",
                                        children: "DESTINATION"
                                    }, void 0, false, {
                                        fileName: "[project]/components/route/route-panel.tsx",
                                        lineNumber: 143,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                        className: "absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/route/route-panel.tsx",
                                                        lineNumber: 146,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        placeholder: "Search city, border, camp, or enter coords (34.456, 36.789)",
                                                        value: destInput,
                                                        onChange: (e)=>setDestInput(e.target.value),
                                                        onFocus: ()=>destInput.length > 1 && setShowDestDropdown(true),
                                                        className: "w-full rounded-lg border border-border bg-input px-3 py-2 pl-8 text-sm text-foreground placeholder:text-muted-foreground hover:bg-muted transition focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/route/route-panel.tsx",
                                                        lineNumber: 147,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/route/route-panel.tsx",
                                                lineNumber: 145,
                                                columnNumber: 15
                                            }, this),
                                            showDestDropdown && destSuggestions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute top-full left-0 right-0 mt-1 rounded-lg border border-border bg-card shadow-lg z-10",
                                                children: destSuggestions.map((suggestion, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleSelectDestination(suggestion),
                                                        className: "w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted transition border-b border-border last:border-b-0",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                                    className: "h-3 w-3 text-accent flex-shrink-0"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/route/route-panel.tsx",
                                                                    lineNumber: 165,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "font-medium",
                                                                            children: suggestion.name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/route/route-panel.tsx",
                                                                            lineNumber: 167,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs text-muted-foreground",
                                                                            children: [
                                                                                suggestion.lat.toFixed(3),
                                                                                ", ",
                                                                                suggestion.lon.toFixed(3)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/route/route-panel.tsx",
                                                                            lineNumber: 168,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/route/route-panel.tsx",
                                                                    lineNumber: 166,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/route/route-panel.tsx",
                                                            lineNumber: 164,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, i, false, {
                                                        fileName: "[project]/components/route/route-panel.tsx",
                                                        lineNumber: 159,
                                                        columnNumber: 21
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/components/route/route-panel.tsx",
                                                lineNumber: 157,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/route/route-panel.tsx",
                                        lineNumber: 144,
                                        columnNumber: 13
                                    }, this),
                                    destination && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-1 text-xs text-accent flex items-center gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                className: "h-3 w-3"
                                            }, void 0, false, {
                                                fileName: "[project]/components/route/route-panel.tsx",
                                                lineNumber: 180,
                                                columnNumber: 17
                                            }, this),
                                            destination.lat.toFixed(4),
                                            ", ",
                                            destination.lon.toFixed(4)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/route/route-panel.tsx",
                                        lineNumber: 179,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/route/route-panel.tsx",
                                lineNumber: 142,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "mb-2 block text-xs font-semibold text-secondary",
                                        children: "TRAVEL MODE"
                                    }, void 0, false, {
                                        fileName: "[project]/components/route/route-panel.tsx",
                                        lineNumber: 188,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2",
                                        children: [
                                            "walking",
                                            "vehicle"
                                        ].map((mode)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    setTravelMode(mode);
                                                    setRouteData({
                                                        ...routeData,
                                                        travelMode: mode
                                                    });
                                                },
                                                className: `flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition ${travelMode === mode ? "border-primary bg-primary text-primary-foreground" : "border-border bg-input text-foreground hover:bg-muted"}`,
                                                children: [
                                                    mode === "walking" ? "🚶" : "🚗",
                                                    " ",
                                                    mode.toUpperCase()
                                                ]
                                            }, mode, true, {
                                                fileName: "[project]/components/route/route-panel.tsx",
                                                lineNumber: 191,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/route/route-panel.tsx",
                                        lineNumber: 189,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/route/route-panel.tsx",
                                lineNumber: 187,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/route/route-panel.tsx",
                        lineNumber: 97,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 flex gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                className: "h-4 w-4 flex-shrink-0 text-yellow-500 mt-0.5"
                            }, void 0, false, {
                                fileName: "[project]/components/route/route-panel.tsx",
                                lineNumber: 211,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-yellow-200",
                                children: "Works globally. Analyze terrain, conflict zones, weather, and resources automatically."
                            }, void 0, false, {
                                fileName: "[project]/components/route/route-panel.tsx",
                                lineNumber: 212,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/route/route-panel.tsx",
                        lineNumber: 210,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/route/route-panel.tsx",
                lineNumber: 93,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$route$2f$route$2d$analyzer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                source: source || undefined,
                destination: destination || undefined,
                travelMode: travelMode,
                onAnalysisComplete: handleAnalysisComplete
            }, void 0, false, {
                fileName: "[project]/components/route/route-panel.tsx",
                lineNumber: 219,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/route/route-panel.tsx",
        lineNumber: 92,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/emergency/emergency-sos.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>EmergencySOS
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-ssr] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$compass$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Compass$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/compass.js [app-ssr] (ecmascript) <export default as Compass>");
"use client";
;
;
function EmergencySOS({ onClose }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-lg rounded-lg border border-accent bg-card p-8 shadow-2xl shadow-accent/20",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6 flex items-start justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                            className: "h-6 w-6 text-accent danger-pulse"
                                        }, void 0, false, {
                                            fileName: "[project]/components/emergency/emergency-sos.tsx",
                                            lineNumber: 17,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-2xl font-bold text-accent",
                                            children: "EMERGENCY MODE"
                                        }, void 0, false, {
                                            fileName: "[project]/components/emergency/emergency-sos.tsx",
                                            lineNumber: 18,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/emergency/emergency-sos.tsx",
                                    lineNumber: 16,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-1 text-sm text-muted-foreground",
                                    children: "Fastest safe direction analysis"
                                }, void 0, false, {
                                    fileName: "[project]/components/emergency/emergency-sos.tsx",
                                    lineNumber: 20,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/emergency/emergency-sos.tsx",
                            lineNumber: 15,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "rounded-lg border border-border p-2 hover:bg-muted",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "h-5 w-5 text-muted-foreground"
                            }, void 0, false, {
                                fileName: "[project]/components/emergency/emergency-sos.tsx",
                                lineNumber: 23,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/emergency/emergency-sos.tsx",
                            lineNumber: 22,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/emergency/emergency-sos.tsx",
                    lineNumber: 14,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6 space-y-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3 rounded-lg bg-accent/10 p-3 border border-accent/30",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$compass$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Compass$3e$__["Compass"], {
                                    className: "h-5 w-5 text-accent flex-shrink-0"
                                }, void 0, false, {
                                    fileName: "[project]/components/emergency/emergency-sos.tsx",
                                    lineNumber: 30,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs font-semibold text-accent",
                                            children: "NEAREST SAFE ZONE"
                                        }, void 0, false, {
                                            fileName: "[project]/components/emergency/emergency-sos.tsx",
                                            lineNumber: 32,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-foreground",
                                            children: "UN Camp - 12.5 km North"
                                        }, void 0, false, {
                                            fileName: "[project]/components/emergency/emergency-sos.tsx",
                                            lineNumber: 33,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/emergency/emergency-sos.tsx",
                                    lineNumber: 31,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/emergency/emergency-sos.tsx",
                            lineNumber: 29,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3 rounded-lg bg-primary/10 p-3 border border-primary/30",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                    className: "h-5 w-5 text-primary flex-shrink-0"
                                }, void 0, false, {
                                    fileName: "[project]/components/emergency/emergency-sos.tsx",
                                    lineNumber: 38,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs font-semibold text-primary",
                                            children: "QUICKEST ROUTE"
                                        }, void 0, false, {
                                            fileName: "[project]/components/emergency/emergency-sos.tsx",
                                            lineNumber: 40,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-foreground",
                                            children: "2.5 hours walking through safe zone"
                                        }, void 0, false, {
                                            fileName: "[project]/components/emergency/emergency-sos.tsx",
                                            lineNumber: 41,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/emergency/emergency-sos.tsx",
                                    lineNumber: 39,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/emergency/emergency-sos.tsx",
                            lineNumber: 37,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/emergency/emergency-sos.tsx",
                    lineNumber: 28,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mb-3 text-xs font-semibold text-secondary",
                            children: "ESCAPE ROUTE STEPS:"
                        }, void 0, false, {
                            fileName: "[project]/components/emergency/emergency-sos.tsx",
                            lineNumber: 48,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                            className: "space-y-2 text-sm text-foreground",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: "1. Head North following GPS bearing 345°"
                                }, void 0, false, {
                                    fileName: "[project]/components/emergency/emergency-sos.tsx",
                                    lineNumber: 50,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: "2. Avoid main roads - use forest paths"
                                }, void 0, false, {
                                    fileName: "[project]/components/emergency/emergency-sos.tsx",
                                    lineNumber: 51,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: "3. Stay in groups if possible"
                                }, void 0, false, {
                                    fileName: "[project]/components/emergency/emergency-sos.tsx",
                                    lineNumber: 52,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: "4. Stop at checkpoint: show this code"
                                }, void 0, false, {
                                    fileName: "[project]/components/emergency/emergency-sos.tsx",
                                    lineNumber: 53,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/emergency/emergency-sos.tsx",
                            lineNumber: 49,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/emergency/emergency-sos.tsx",
                    lineNumber: 47,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6 rounded-lg bg-accent/5 p-3 border border-accent/20",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mb-2 text-xs font-semibold text-accent",
                            children: "ACTIVE DANGERS IN AREA:"
                        }, void 0, false, {
                            fileName: "[project]/components/emergency/emergency-sos.tsx",
                            lineNumber: 59,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "space-y-1 text-xs text-foreground",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: "• Military checkpoint 4 km east"
                                }, void 0, false, {
                                    fileName: "[project]/components/emergency/emergency-sos.tsx",
                                    lineNumber: 61,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: "• Flooded roads west sector"
                                }, void 0, false, {
                                    fileName: "[project]/components/emergency/emergency-sos.tsx",
                                    lineNumber: 62,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: "• Armed group activity (unconfirmed)"
                                }, void 0, false, {
                                    fileName: "[project]/components/emergency/emergency-sos.tsx",
                                    lineNumber: 63,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/emergency/emergency-sos.tsx",
                            lineNumber: 60,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/emergency/emergency-sos.tsx",
                    lineNumber: 58,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "flex-1 rounded-lg border border-border px-4 py-3 font-semibold text-foreground transition hover:bg-muted",
                            children: "CLOSE"
                        }, void 0, false, {
                            fileName: "[project]/components/emergency/emergency-sos.tsx",
                            lineNumber: 69,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "flex-1 rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition hover:shadow-lg hover:shadow-primary/50",
                            children: "DOWNLOAD OFFLINE GUIDE"
                        }, void 0, false, {
                            fileName: "[project]/components/emergency/emergency-sos.tsx",
                            lineNumber: 75,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/emergency/emergency-sos.tsx",
                    lineNumber: 68,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/emergency/emergency-sos.tsx",
            lineNumber: 12,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/emergency/emergency-sos.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/navigation/navigation-bar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NavigationBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-ssr] (ecmascript) <export default as MapPin>");
"use client";
;
;
function NavigationBar({ onSOS }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "border-b border-border bg-card",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-between px-6 py-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                            className: "h-6 w-6 text-primary"
                        }, void 0, false, {
                            fileName: "[project]/components/navigation/navigation-bar.tsx",
                            lineNumber: 14,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-xl font-bold text-primary",
                            children: "SAFE ROUTE"
                        }, void 0, false, {
                            fileName: "[project]/components/navigation/navigation-bar.tsx",
                            lineNumber: 15,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onSOS,
                            className: "flex items-center gap-2 rounded-lg bg-accent px-4 py-2 font-semibold text-accent-foreground transition hover:shadow-lg hover:shadow-accent/50 danger-pulse",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "/checklist",
                            className: "rounded-lg border border-border px-4 py-2 text-sm text-foreground transition hover:bg-card",
                            children: "Checklist"
                        }, void 0, false, {
                            fileName: "[project]/components/navigation/navigation-bar.tsx",
                            lineNumber: 28,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
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
}),
"[project]/lib/ai-assistant.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// AI Assistant for survival help
__turbopack_context__.s([
    "getAIResponse",
    ()=>getAIResponse
]);
async function getAIResponse(query) {
    const lowerQuery = query.toLowerCase();
    // Water-related queries
    if (lowerQuery.includes("water") || lowerQuery.includes("thirst") || lowerQuery.includes("drink")) {
        return {
            response: "Water is critical for survival. Here's what you need to know:",
            suggestions: [
                "Drink at least 2-3 liters per day in normal conditions, more in hot weather",
                "Boil water for 1 minute to kill bacteria and viruses",
                "Use water purification tablets if available",
                "Collect rainwater in clean containers",
                "Avoid drinking from stagnant water sources",
                "Look for running water (rivers, streams) - still needs purification"
            ],
            resources: [
                "Water purification guide",
                "Finding water sources"
            ]
        };
    }
    // Food-related queries
    if (lowerQuery.includes("food") || lowerQuery.includes("hunger") || lowerQuery.includes("eat")) {
        return {
            response: "Food security is essential. Here are survival tips:",
            suggestions: [
                "Carry high-calorie, non-perishable foods (nuts, dried fruits, energy bars)",
                "Look for food distribution points (WFP, Red Cross)",
                "Only eat plants you can positively identify as safe",
                "Avoid wild mushrooms unless you're an expert",
                "Cook all meat thoroughly",
                "Store food in sealed containers to prevent spoilage"
            ],
            resources: [
                "Food identification guide",
                "Emergency food sources"
            ]
        };
    }
    // Shelter-related queries
    if (lowerQuery.includes("shelter") || lowerQuery.includes("sleep") || lowerQuery.includes("camp")) {
        return {
            response: "Shelter protects you from weather and danger:",
            suggestions: [
                "Find or build shelter before dark",
                "Look for natural shelters (caves, overhangs)",
                "Build a simple lean-to with branches and leaves",
                "Stay dry - use plastic sheets or tarps if available",
                "Keep shelter well-ventilated",
                "Stay away from low-lying areas (flood risk)",
                "Contact UNHCR or Red Cross for official shelter"
            ],
            resources: [
                "Shelter building guide",
                "Refugee camp locations"
            ]
        };
    }
    // Medical/health queries
    if (lowerQuery.includes("medical") || lowerQuery.includes("health") || lowerQuery.includes("sick") || lowerQuery.includes("injured")) {
        return {
            response: "Medical emergencies require immediate attention:",
            suggestions: [
                "For serious injuries, seek medical help immediately (MSF, Red Cross hospitals)",
                "Keep wounds clean and covered",
                "Carry a basic first aid kit",
                "Stay hydrated to prevent illness",
                "Wash hands regularly with soap and water",
                "Avoid contaminated water sources",
                "Get vaccinations if available (UNHCR, UNICEF)"
            ],
            resources: [
                "First aid guide",
                "Hospital locations",
                "Medical services directory"
            ]
        };
    }
    // Route/navigation queries
    if (lowerQuery.includes("route") || lowerQuery.includes("direction") || lowerQuery.includes("lost") || lowerQuery.includes("navigation")) {
        return {
            response: "Navigation and route planning:",
            suggestions: [
                "Use the route planner in this app to analyze safe routes",
                "Avoid conflict zones and dangerous areas",
                "Travel during daylight hours when possible",
                "Stay on known paths when available",
                "Carry a compass or use phone GPS (if available)",
                "Tell someone your planned route",
                "Check weather conditions before traveling"
            ],
            resources: [
                "Route analyzer",
                "Map with borders",
                "Country danger levels"
            ]
        };
    }
    // Safety/security queries
    if (lowerQuery.includes("safe") || lowerQuery.includes("danger") || lowerQuery.includes("security") || lowerQuery.includes("conflict")) {
        return {
            response: "Safety is paramount. Follow these guidelines:",
            suggestions: [
                "Avoid conflict zones - check country danger levels in this app",
                "Stay in groups when possible",
                "Keep important documents safe and hidden",
                "Avoid traveling at night in dangerous areas",
                "Contact local authorities or NGOs for safety information",
                "Register with UNHCR for protection",
                "Know emergency contact numbers"
            ],
            resources: [
                "Country danger levels",
                "Emergency contacts",
                "NGO directory"
            ]
        };
    }
    // Documents/legal queries
    if (lowerQuery.includes("document") || lowerQuery.includes("paper") || lowerQuery.includes("legal") || lowerQuery.includes("visa")) {
        return {
            response: "Document management and legal assistance:",
            suggestions: [
                "Keep all documents in a waterproof container",
                "Make copies of important documents",
                "Store digital copies if possible",
                "Contact UNHCR or NRC for legal assistance",
                "Check visa requirements in this app's Visa Help Center",
                "Register with authorities upon arrival in new country",
                "Keep passport and ID safe at all times"
            ],
            resources: [
                "Document vault",
                "Visa help center",
                "Legal assistance directory"
            ]
        };
    }
    // General survival
    return {
        response: "I'm here to help with survival questions. Here are key areas I can assist with:",
        suggestions: [
            "Water purification and finding water sources",
            "Food security and emergency food",
            "Building shelter and finding safe places",
            "Medical emergencies and first aid",
            "Route planning and navigation",
            "Safety and security",
            "Document management and legal help"
        ],
        resources: [
            "Emergency protocols PDF",
            "NGO directory",
            "Aid services directory",
            "Visa help center",
            "Emergency funds directory"
        ]
    };
}
}),
"[project]/components/ai-assistant/ai-chat.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AIChat
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-ssr] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/send.js [app-ssr] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2d$assistant$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ai-assistant.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function AIChat() {
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([
        {
            id: "1",
            role: "assistant",
            content: "Hello! I'm your survival assistant. How can I help you today?"
        }
    ]);
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const messagesEndRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const scrollToBottom = ()=>{
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        scrollToBottom();
    }, [
        messages
    ]);
    const handleSend = async ()=>{
        if (!input.trim() || isLoading) return;
        const userMessage = {
            id: Date.now().toString(),
            role: "user",
            content: input
        };
        setMessages((prev)=>[
                ...prev,
                userMessage
            ]);
        setInput("");
        setIsLoading(true);
        try {
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ai$2d$assistant$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAIResponse"])(input);
            const assistantMessage = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: response.response,
                suggestions: response.suggestions,
                resources: response.resources
            };
            setMessages((prev)=>[
                    ...prev,
                    assistantMessage
                ]);
        } catch (error) {
            const errorMessage = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "I'm sorry, I encountered an error. Please try again."
            };
            setMessages((prev)=>[
                    ...prev,
                    errorMessage
                ]);
        } finally{
            setIsLoading(false);
        }
    };
    if (!isOpen) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: ()=>setIsOpen(true),
            className: "fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition flex items-center justify-center z-50",
            "aria-label": "Open AI Assistant",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                className: "h-6 w-6"
            }, void 0, false, {
                fileName: "[project]/components/ai-assistant/ai-chat.tsx",
                lineNumber: 78,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/ai-assistant/ai-chat.tsx",
            lineNumber: 73,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed bottom-6 right-6 w-96 h-[600px] rounded-lg border border-border bg-card shadow-2xl flex flex-col z-50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between p-4 border-b border-border",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                                className: "h-5 w-5 text-primary"
                            }, void 0, false, {
                                fileName: "[project]/components/ai-assistant/ai-chat.tsx",
                                lineNumber: 88,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-semibold text-foreground",
                                children: "AI Survival Assistant"
                            }, void 0, false, {
                                fileName: "[project]/components/ai-assistant/ai-chat.tsx",
                                lineNumber: 89,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ai-assistant/ai-chat.tsx",
                        lineNumber: 87,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setIsOpen(false),
                        className: "text-muted-foreground hover:text-foreground transition",
                        "aria-label": "Close",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                            className: "h-5 w-5"
                        }, void 0, false, {
                            fileName: "[project]/components/ai-assistant/ai-chat.tsx",
                            lineNumber: 96,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ai-assistant/ai-chat.tsx",
                        lineNumber: 91,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ai-assistant/ai-chat.tsx",
                lineNumber: 86,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto p-4 space-y-4",
                children: [
                    messages.map((message)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `flex ${message.role === "user" ? "justify-end" : "justify-start"}`,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `max-w-[80%] rounded-lg p-3 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm whitespace-pre-wrap",
                                        children: message.content
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-assistant/ai-chat.tsx",
                                        lineNumber: 114,
                                        columnNumber: 15
                                    }, this),
                                    message.suggestions && message.suggestions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-2 space-y-1",
                                        children: message.suggestions.map((suggestion, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs opacity-90",
                                                children: [
                                                    "• ",
                                                    suggestion
                                                ]
                                            }, idx, true, {
                                                fileName: "[project]/components/ai-assistant/ai-chat.tsx",
                                                lineNumber: 118,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/ai-assistant/ai-chat.tsx",
                                        lineNumber: 116,
                                        columnNumber: 17
                                    }, this),
                                    message.resources && message.resources.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-2 pt-2 border-t border-current/20",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs font-semibold mb-1",
                                                children: "Resources:"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ai-assistant/ai-chat.tsx",
                                                lineNumber: 124,
                                                columnNumber: 19
                                            }, this),
                                            message.resources.map((resource, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs opacity-90",
                                                    children: [
                                                        "- ",
                                                        resource
                                                    ]
                                                }, idx, true, {
                                                    fileName: "[project]/components/ai-assistant/ai-chat.tsx",
                                                    lineNumber: 126,
                                                    columnNumber: 21
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ai-assistant/ai-chat.tsx",
                                        lineNumber: 123,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ai-assistant/ai-chat.tsx",
                                lineNumber: 107,
                                columnNumber: 13
                            }, this)
                        }, message.id, false, {
                            fileName: "[project]/components/ai-assistant/ai-chat.tsx",
                            lineNumber: 103,
                            columnNumber: 11
                        }, this)),
                    isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-start",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-muted rounded-lg p-3",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-muted-foreground",
                                children: "Thinking..."
                            }, void 0, false, {
                                fileName: "[project]/components/ai-assistant/ai-chat.tsx",
                                lineNumber: 136,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/ai-assistant/ai-chat.tsx",
                            lineNumber: 135,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ai-assistant/ai-chat.tsx",
                        lineNumber: 134,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: messagesEndRef
                    }, void 0, false, {
                        fileName: "[project]/components/ai-assistant/ai-chat.tsx",
                        lineNumber: 140,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ai-assistant/ai-chat.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 border-t border-border",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            value: input,
                            onChange: (e)=>setInput(e.target.value),
                            onKeyPress: (e)=>e.key === "Enter" && handleSend(),
                            placeholder: "Ask about survival, routes, safety...",
                            className: "flex-1 rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50",
                            disabled: isLoading
                        }, void 0, false, {
                            fileName: "[project]/components/ai-assistant/ai-chat.tsx",
                            lineNumber: 146,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleSend,
                            disabled: isLoading || !input.trim(),
                            className: "rounded-lg bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed",
                            "aria-label": "Send message",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/components/ai-assistant/ai-chat.tsx",
                                lineNumber: 161,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/ai-assistant/ai-chat.tsx",
                            lineNumber: 155,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ai-assistant/ai-chat.tsx",
                    lineNumber: 145,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ai-assistant/ai-chat.tsx",
                lineNumber: 144,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ai-assistant/ai-chat.tsx",
        lineNumber: 84,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$map$2f$map$2d$container$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/map/map-container.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$route$2f$route$2d$panel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/route/route-panel.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$emergency$2f$emergency$2d$sos$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/emergency/emergency-sos.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$navigation$2f$navigation$2d$bar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/navigation/navigation-bar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$assistant$2f$ai$2d$chat$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ai-assistant/ai-chat.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
function Home() {
    const [showSOS, setShowSOS] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedRoute, setSelectedRoute] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [routeCoordinates, setRouteCoordinates] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-background",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$navigation$2f$navigation$2d$bar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                onSOS: ()=>setShowSOS(true)
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex h-screen gap-4 p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$map$2f$map$2d$container$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            selectedRoute: selectedRoute,
                            routeCoordinates: routeCoordinates
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 25,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 24,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-96",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$route$2f$route$2d$panel$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            onRouteSelect: setSelectedRoute,
                            onCoordinatesChange: setRouteCoordinates
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 30,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 29,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 22,
                columnNumber: 7
            }, this),
            showSOS && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$emergency$2f$emergency$2d$sos$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                onClose: ()=>setShowSOS(false)
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 35,
                columnNumber: 19
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ai$2d$assistant$2f$ai$2d$chat$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=_f4255b10._.js.map