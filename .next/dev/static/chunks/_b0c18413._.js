(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/map-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
function calculateBounds(source, destination, defaultBounds = {
    minLat: 34,
    maxLat: 36,
    minLon: 39,
    maxLon: 42
}) {
    if (!source && !destination) {
        return defaultBounds;
    }
    let minLat = source?.lat ?? destination?.lat ?? defaultBounds.minLat;
    let maxLat = source?.lat ?? destination?.lat ?? defaultBounds.maxLat;
    let minLon = source?.lon ?? destination?.lon ?? defaultBounds.minLon;
    let maxLon = source?.lon ?? destination?.lon ?? defaultBounds.maxLon;
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
    return {
        minLat,
        maxLat,
        minLon,
        maxLon
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/routing-engine.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Global routing with OSRM API and haversine fallback
__turbopack_context__.s([
    "generateGreatCircleRoute",
    ()=>generateGreatCircleRoute,
    "getGlobalRoute",
    ()=>getGlobalRoute,
    "getRouteFromOSRM",
    ()=>getRouteFromOSRM
]);
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
async function getGlobalRoute(source, destination) {
    // Try OSRM first
    const osrmRoute = await getRouteFromOSRM(source, destination);
    if (osrmRoute && osrmRoute.length > 0) {
        return osrmRoute;
    }
    // Fallback to haversine-based polyline
    return generateGreatCircleRoute(source, destination);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/map/interactive-map.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>InteractiveMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$map$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/map-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$routing$2d$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/routing-engine.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function InteractiveMap({ onSourceSelect, onDestinationSelect, selectedRoute, routeCoordinates }) {
    _s();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [mapPoints, setMapPoints] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
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
    const [selectionMode, setSelectionMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [worldBorders, setWorldBorders] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [routePolyline, setRoutePolyline] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InteractiveMap.useEffect": ()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$map$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loadWorldBorders"])().then({
                "InteractiveMap.useEffect": (borders)=>{
                    if (borders) {
                        setWorldBorders(borders);
                    }
                }
            }["InteractiveMap.useEffect"]).catch({
                "InteractiveMap.useEffect": (error)=>{
                    // Silently fail - borders are optional
                    console.warn("[v0] Could not load world borders:", error);
                }
            }["InteractiveMap.useEffect"]);
        }
    }["InteractiveMap.useEffect"], []);
    // Load route polyline when coordinates change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InteractiveMap.useEffect": ()=>{
            if (routeCoordinates?.source && routeCoordinates?.destination) {
                const source = routeCoordinates.source;
                const destination = routeCoordinates.destination;
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$routing$2d$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getGlobalRoute"])(source, destination).then({
                    "InteractiveMap.useEffect": (route)=>{
                        setRoutePolyline(route);
                    }
                }["InteractiveMap.useEffect"]).catch({
                    "InteractiveMap.useEffect": (error)=>{
                        // Fallback to simple polyline
                        console.warn("[v0] Could not load route from OSRM, using fallback:", error);
                        const fallbackRoute = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$map$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateRoutePolyline"])(source, destination);
                        setRoutePolyline(fallbackRoute);
                    }
                }["InteractiveMap.useEffect"]);
            } else {
                setRoutePolyline([]);
            }
        }
    }["InteractiveMap.useEffect"], [
        routeCoordinates
    ]);
    // Map projection using utility function
    const projectPoint = (lat, lon, width, height)=>{
        const bounds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$map$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateBounds"])(routeCoordinates?.source, routeCoordinates?.destination);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$map$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["projectToCanvas"])(lat, lon, bounds, width, height);
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
        // Calculate bounds
        const bounds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$map$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateBounds"])(routeCoordinates?.source, routeCoordinates?.destination);
        // Draw world borders if loaded
        if (worldBorders) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$map$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["drawGeoJSONBorders"])(ctx, worldBorders, bounds, width, height);
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
        // Draw route polyline if available
        if (routePolyline.length > 0) {
            ctx.strokeStyle = "#0099ff";
            ctx.lineWidth = 3;
            ctx.setLineDash([]);
            ctx.beginPath();
            routePolyline.forEach((point, index)=>{
                const { x, y } = projectPoint(point.lat, point.lon, width, height);
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.stroke();
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
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InteractiveMap.useEffect": ()=>{
            drawMap();
        }
    }["InteractiveMap.useEffect"], [
        dynamicMapPoints,
        selectedRoute,
        routeCoordinates,
        worldBorders,
        routePolyline
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-3 h-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setSelectionMode(selectionMode === "source" ? null : "source"),
                        className: `flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${selectionMode === "source" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground hover:bg-muted"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/components/map/interactive-map.tsx",
                                lineNumber: 363,
                                columnNumber: 11
                            }, this),
                            selectionMode === "source" ? "CLICK TO SET SOURCE" : "SET SOURCE"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/map/interactive-map.tsx",
                        lineNumber: 355,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setSelectionMode(selectionMode === "destination" ? null : "destination"),
                        className: `flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${selectionMode === "destination" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground hover:bg-muted"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/components/map/interactive-map.tsx",
                                lineNumber: 375,
                                columnNumber: 11
                            }, this),
                            selectionMode === "destination" ? "CLICK TO SET DESTINATION" : "SET DESTINATION"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/map/interactive-map.tsx",
                        lineNumber: 367,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/map/interactive-map.tsx",
                lineNumber: 354,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                ref: canvasRef,
                width: 800,
                height: 600,
                onClick: handleCanvasClick,
                className: "flex-1 cursor-crosshair rounded-lg border border-border bg-card"
            }, void 0, false, {
                fileName: "[project]/components/map/interactive-map.tsx",
                lineNumber: 380,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                ].map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 text-muted-foreground",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-3 w-3 rounded-full",
                                style: {
                                    backgroundColor: item.color
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/map/interactive-map.tsx",
                                lineNumber: 399,
                                columnNumber: 13
                            }, this),
                            item.label
                        ]
                    }, item.label, true, {
                        fileName: "[project]/components/map/interactive-map.tsx",
                        lineNumber: 398,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/map/interactive-map.tsx",
                lineNumber: 389,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/map/interactive-map.tsx",
        lineNumber: 353,
        columnNumber: 5
    }, this);
}
_s(InteractiveMap, "zlTcV1EJ2ns/jT9zT+Gjid6mXRE=");
_c = InteractiveMap;
var _c;
__turbopack_context__.k.register(_c, "InteractiveMap");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/map/map-layer-controls.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MapLayerControls
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplet$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/droplet.js [app-client] (ecmascript) <export default as Droplet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wind.js [app-client] (ecmascript) <export default as Wind>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
"use client";
;
;
function MapLayerControls({ activeLayers, onToggleLayer }) {
    const layers = [
        {
            id: "safe_zones",
            name: "Safe Zones",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"],
            color: "text-primary"
        },
        {
            id: "conflict_zones",
            name: "Conflict Zones",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"],
            color: "text-accent"
        },
        {
            id: "water_points",
            name: "Water Points",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplet$3e$__["Droplet"],
            color: "text-secondary"
        },
        {
            id: "hospitals",
            name: "Hospitals",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"],
            color: "text-yellow-500"
        },
        {
            id: "checkpoints",
            name: "Checkpoints",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"],
            color: "text-orange-400"
        },
        {
            id: "weather",
            name: "Weather Alerts",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wind$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wind$3e$__["Wind"],
            color: "text-cyan-400"
        },
        {
            id: "hazards",
            name: "Natural Hazards",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"],
            color: "text-purple-400"
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-3 w-48",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-xs font-semibold text-primary uppercase",
                children: "Map Layers"
            }, void 0, false, {
                fileName: "[project]/components/map/map-layer-controls.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: layers.map((layer)=>{
                    const Icon = layer.icon;
                    const isActive = activeLayers.includes(layer.id);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>onToggleLayer(layer.id),
                        className: `flex w-full items-center gap-2 rounded-lg px-3 py-2 transition text-sm ${isActive ? "bg-muted border border-primary" : "border border-border bg-card hover:bg-muted"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "checkbox",
                                checked: isActive,
                                readOnly: true,
                                className: "h-4 w-4 cursor-pointer"
                            }, void 0, false, {
                                fileName: "[project]/components/map/map-layer-controls.tsx",
                                lineNumber: 73,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                className: `h-4 w-4 ${layer.color}`
                            }, void 0, false, {
                                fileName: "[project]/components/map/map-layer-controls.tsx",
                                lineNumber: 74,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-t border-border pt-3 space-y-2 text-xs",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "font-semibold text-primary",
                        children: "ZONE STATS"
                    }, void 0, false, {
                        fileName: "[project]/components/map/map-layer-controls.tsx",
                        lineNumber: 83,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between text-muted-foreground",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Safe Zones:"
                            }, void 0, false, {
                                fileName: "[project]/components/map/map-layer-controls.tsx",
                                lineNumber: 85,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between text-muted-foreground",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Danger Areas:"
                            }, void 0, false, {
                                fileName: "[project]/components/map/map-layer-controls.tsx",
                                lineNumber: 89,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between text-muted-foreground",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Resources:"
                            }, void 0, false, {
                                fileName: "[project]/components/map/map-layer-controls.tsx",
                                lineNumber: 93,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
_c = MapLayerControls;
var _c;
__turbopack_context__.k.register(_c, "MapLayerControls");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/map/map-container.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MapContainer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$map$2f$interactive$2d$map$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/map/interactive-map.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$map$2f$map$2d$layer$2d$controls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/map/map-layer-controls.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function MapContainer({ selectedRoute, routeCoordinates }) {
    _s();
    const [activeLayers, setActiveLayers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        "safe_zones",
        "conflict_zones",
        "water_points",
        "hospitals"
    ]);
    const [sourcePoint, setSourcePoint] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [destPoint, setDestPoint] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const toggleLayer = (layerId)=>{
        setActiveLayers((prev)=>prev.includes(layerId) ? prev.filter((l)=>l !== layerId) : [
                ...prev,
                layerId
            ]);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative h-full w-full rounded-lg border border-border bg-card overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex h-full gap-4 p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$map$2f$interactive$2d$map$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$map$2f$map$2d$layer$2d$controls$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
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
            (sourcePoint || destPoint) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute bottom-4 left-4 rounded-lg bg-card/90 p-3 backdrop-blur border border-border text-xs space-y-1",
                children: [
                    sourcePoint && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 text-primary",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-semibold",
                                children: "SOURCE:"
                            }, void 0, false, {
                                fileName: "[project]/components/map/map-container.tsx",
                                lineNumber: 58,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    destPoint && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 text-secondary",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-semibold",
                                children: "DESTINATION:"
                            }, void 0, false, {
                                fileName: "[project]/components/map/map-container.tsx",
                                lineNumber: 64,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
_s(MapContainer, "iKpBAbMz24iwHkpBlIMS4ygDGMc=");
_c = MapContainer;
var _c;
__turbopack_context__.k.register(_c, "MapContainer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/country-danger-levels.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Country danger levels for route analysis
__turbopack_context__.s([
    "COUNTRY_DANGER_LEVELS",
    ()=>COUNTRY_DANGER_LEVELS,
    "getCountryDangerLevel",
    ()=>getCountryDangerLevel,
    "getDangerLevelForCoordinates",
    ()=>getDangerLevelForCoordinates
]);
const COUNTRY_DANGER_LEVELS = {
    // High conflict zones
    Syria: {
        level: "critical",
        reason: "Active conflict zones, military operations"
    },
    Ukraine: {
        level: "critical",
        reason: "Active war zone, military conflict"
    },
    Yemen: {
        level: "critical",
        reason: "Ongoing conflict, humanitarian crisis"
    },
    Afghanistan: {
        level: "high",
        reason: "Security concerns, unstable regions"
    },
    Iraq: {
        level: "high",
        reason: "Security risks in certain areas"
    },
    Sudan: {
        level: "critical",
        reason: "Active conflict, civil unrest"
    },
    "South Sudan": {
        level: "high",
        reason: "Intermittent conflict"
    },
    Somalia: {
        level: "high",
        reason: "Security concerns"
    },
    "Central African Republic": {
        level: "high",
        reason: "Ongoing conflict"
    },
    "Democratic Republic of the Congo": {
        level: "high",
        reason: "Eastern regions have conflict"
    },
    Libya: {
        level: "high",
        reason: "Political instability"
    },
    Mali: {
        level: "high",
        reason: "Security concerns in northern regions"
    },
    Niger: {
        level: "medium",
        reason: "Border security concerns"
    },
    "Burkina Faso": {
        level: "high",
        reason: "Security concerns"
    },
    Myanmar: {
        level: "high",
        reason: "Political instability, conflict"
    },
    Palestine: {
        level: "high",
        reason: "Conflict zones, checkpoints"
    },
    Israel: {
        level: "medium",
        reason: "Security concerns near borders"
    },
    // Medium risk countries
    Lebanon: {
        level: "medium",
        reason: "Political instability, border concerns"
    },
    Turkey: {
        level: "low",
        reason: "Generally safe, border regions may have concerns"
    },
    Jordan: {
        level: "low",
        reason: "Generally stable"
    },
    Egypt: {
        level: "medium",
        reason: "Sinai region has security concerns"
    },
    Pakistan: {
        level: "medium",
        reason: "Border regions have security concerns"
    },
    Iran: {
        level: "medium",
        reason: "Political situation, border concerns"
    },
    Venezuela: {
        level: "medium",
        reason: "Economic crisis, political instability"
    },
    Colombia: {
        level: "medium",
        reason: "Some regions have security concerns"
    },
    Mexico: {
        level: "medium",
        reason: "Border regions have security concerns"
    },
    // Generally safe countries
    Poland: {
        level: "low",
        reason: "Safe for refugees"
    },
    Germany: {
        level: "low",
        reason: "Safe, refugee-friendly"
    },
    "United Kingdom": {
        level: "low",
        reason: "Safe"
    },
    USA: {
        level: "low",
        reason: "Safe"
    },
    Canada: {
        level: "low",
        reason: "Safe"
    },
    France: {
        level: "low",
        reason: "Safe"
    },
    Sweden: {
        level: "low",
        reason: "Safe, refugee-friendly"
    },
    Norway: {
        level: "low",
        reason: "Safe"
    },
    Greece: {
        level: "low",
        reason: "Safe, refugee-friendly"
    },
    Italy: {
        level: "low",
        reason: "Safe"
    },
    Spain: {
        level: "low",
        reason: "Safe"
    },
    UAE: {
        level: "low",
        reason: "Safe"
    },
    "Saudi Arabia": {
        level: "low",
        reason: "Safe"
    },
    Kuwait: {
        level: "low",
        reason: "Safe"
    },
    Qatar: {
        level: "low",
        reason: "Safe"
    },
    Kenya: {
        level: "low",
        reason: "Safe, refugee camps available"
    },
    Uganda: {
        level: "low",
        reason: "Safe, refugee-friendly"
    },
    Ethiopia: {
        level: "medium",
        reason: "Some regions have concerns"
    },
    Tanzania: {
        level: "low",
        reason: "Safe"
    },
    Rwanda: {
        level: "low",
        reason: "Safe"
    }
};
function getCountryDangerLevel(countryName) {
    // Try exact match first
    if (COUNTRY_DANGER_LEVELS[countryName]) {
        return COUNTRY_DANGER_LEVELS[countryName];
    }
    // Try case-insensitive match
    const normalized = countryName.trim();
    for (const [key, value] of Object.entries(COUNTRY_DANGER_LEVELS)){
        if (key.toLowerCase() === normalized.toLowerCase()) {
            return value;
        }
    }
    // Try partial match
    for (const [key, value] of Object.entries(COUNTRY_DANGER_LEVELS)){
        if (normalized.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(normalized.toLowerCase())) {
            return value;
        }
    }
    return null;
}
function getDangerLevelForCoordinates(lat, lon) {
    // This is a simplified version - in production, you'd use reverse geocoding
    // to get the country name from coordinates, then look it up
    // For now, return null and let the route engine handle it
    return null;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/route-engine.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Route Planning & AI Threat Assessment Engine
__turbopack_context__.s([
    "analyzeRoute",
    ()=>analyzeRoute,
    "calculateDistance",
    ()=>calculateDistance,
    "findAlternateRoutes",
    ()=>findAlternateRoutes
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$country$2d$danger$2d$levels$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/country-danger-levels.ts [app-client] (ecmascript)");
;
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371 // Earth's radius in km
    ;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
// Generate synthetic territory data for route points
function generateTerritoryData(lat, lon) {
    // Simulated ML model approximation
    const noise = Math.sin(lat * lon) * Math.cos(lat + lon);
    return {
        lat,
        lon,
        terrain: [
            "flat",
            "hilly",
            "mountainous"
        ][Math.floor(Math.abs(noise * 3)) % 3],
        conflict_level: Math.max(1, Math.min(10, Math.floor((Math.sin(lat * 0.5) + Math.cos(lon * 0.5)) * 5 + 5))),
        weather_severity: Math.max(0, Math.floor(Math.abs(Math.sin(lat - lon)) * 10 - 3)),
        water_availability: Math.max(1, Math.floor((Math.cos(lat * lon) * 10 + 10) / 2)),
        food_availability: Math.max(1, Math.floor((Math.sin(lat + lon) * 10 + 10) / 2))
    };
}
// Calculate average walking speed based on terrain
function calculateWalkingSpeed(terrain) {
    switch(terrain){
        case "flat":
            return 5 // km/h
            ;
        case "hilly":
            return 3 // km/h
            ;
        case "mountainous":
            return 2 // km/h
            ;
        case "water":
            return 1 // km/h (crossing required)
            ;
        default:
            return 4;
    }
}
function analyzeRoute(source, destination, travelMode) {
    const distance = calculateDistance(source.lat, source.lon, destination.lat, destination.lon);
    // Generate route profile by sampling points
    const routeSteps = 10;
    let totalConflict = 0;
    let totalWeatherRisk = 0;
    let totalWaterScore = 0;
    let totalFoodScore = 0;
    let conflictIntersections = 0;
    let terrainDifficulty = 0;
    for(let i = 0; i <= routeSteps; i++){
        const ratio = i / routeSteps;
        const stepLat = source.lat + (destination.lat - source.lat) * ratio;
        const stepLon = source.lon + (destination.lon - source.lon) * ratio;
        const data = generateTerritoryData(stepLat, stepLon);
        totalConflict += data.conflict_level;
        totalWeatherRisk += data.weather_severity;
        totalWaterScore += data.water_availability;
        totalFoodScore += data.food_availability;
        if (data.conflict_level >= 6) {
            conflictIntersections++;
        }
        // Terrain difficulty scoring
        if (data.terrain === "mountainous") terrainDifficulty += 3;
        else if (data.terrain === "hilly") terrainDifficulty += 2;
        else if (data.terrain === "water") terrainDifficulty += 4;
        else terrainDifficulty += 1;
    }
    // Averages
    const avgConflict = totalConflict / (routeSteps + 1);
    const avgWeatherRisk = totalWeatherRisk / (routeSteps + 1);
    const waterScore = Math.round(totalWaterScore / (routeSteps + 1) * 10);
    const foodScore = Math.round(totalFoodScore / (routeSteps + 1) * 10);
    const terrainDifficultyAvg = terrainDifficulty / (routeSteps + 1);
    // Calculate duration
    const avgTerrain = terrainDifficulty / (routeSteps + 1);
    let terrainType = "MODERATE";
    let speed = 4 // default km/h
    ;
    if (travelMode === "vehicle") {
        speed = 40;
        terrainType = "EASY";
    } else if (avgTerrain < 1.5) {
        speed = 5;
        terrainType = "EASY";
    } else if (avgTerrain < 2.5) {
        speed = 3;
        terrainType = "MODERATE";
    } else if (avgTerrain < 3.5) {
        speed = 2;
        terrainType = "DIFFICULT";
    } else {
        speed = 1;
        terrainType = "EXTREME";
    }
    const duration_hours = distance / speed;
    const duration_days = Math.ceil(duration_hours / 8) // 8 hours walking per day
    ;
    const nights_required = Math.max(0, duration_days - 1);
    // Survival Score calculation (0-100)
    const conflictScore = Math.max(0, 100 - avgConflict * 8);
    const weatherScore = Math.max(0, 100 - avgWeatherRisk * 6);
    const resourceScore = (waterScore + foodScore) / 2;
    const survivalScore = Math.round(conflictScore * 0.4 + weatherScore * 0.3 + resourceScore * 0.3);
    // Risk Level
    let riskLevel = "LOW";
    if (survivalScore < 30) riskLevel = "CRITICAL";
    else if (survivalScore < 50) riskLevel = "HIGH";
    else if (survivalScore < 75) riskLevel = "MEDIUM";
    // Calorie and water calculations
    const estimatedCaloriesPerDay = travelMode === "walking" ? 2500 : 2000;
    const estimatedWaterPerDay = 3 // liters, adjusted for weather
    ;
    const adjustedWaterPerDay = estimatedWaterPerDay + (avgWeatherRisk > 7 ? 2 : 0) + (duration_hours > 24 ? 1 : 0);
    // Check country danger levels along route (simplified - check midpoint)
    const midLat = source.lat + (destination.lat - source.lat) * 0.5;
    const midLon = source.lon + (destination.lon - source.lon) * 0.5;
    // In production, you'd reverse geocode to get country names, but for now we'll add warnings based on known dangerous regions
    const dangerousCountries = [];
    if (midLat >= 33 && midLat <= 37 && midLon >= 35 && midLon <= 42) {
        // Middle East region
        dangerousCountries.push("Syria", "Iraq", "Lebanon");
    }
    if (midLat >= 48 && midLat <= 52 && midLon >= 22 && midLon <= 40) {
        // Ukraine region
        dangerousCountries.push("Ukraine");
    }
    // Generate recommendations
    const recommendations = [];
    if (survivalScore < 50) recommendations.push("⚠️ High risk route - consider alternatives");
    if (conflictIntersections > 3) recommendations.push("⚠️ Multiple conflict zones detected - use evasion tactics");
    if (waterScore < 4) recommendations.push("🚨 Water scarcity - bring maximum water containers");
    if (foodScore < 4) recommendations.push("🚨 Food scarcity - carry high-calorie supplies");
    if (nights_required > 5) recommendations.push("🏕️ Long journey - extra shelter/blankets needed");
    if (terrainType === "EXTREME") recommendations.push("⛏️ Extreme terrain - professional equipment required");
    if (avgWeatherRisk > 6) recommendations.push("⛈️ Severe weather risk - check daily forecasts");
    if (waterScore > 6 && foodScore > 6) recommendations.push("✅ Good resource availability on route");
    if (survivalScore > 75) recommendations.push("✅ Relatively safer route - standard supplies sufficient");
    // Add country danger warnings
    dangerousCountries.forEach((country)=>{
        const dangerLevel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$country$2d$danger$2d$levels$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCountryDangerLevel"])(country);
        if (dangerLevel && (dangerLevel.level === "high" || dangerLevel.level === "critical")) {
            recommendations.push(`🚨 Route passes through ${country} (${dangerLevel.level.toUpperCase()} risk) - ${dangerLevel.reason || "Exercise extreme caution"}`);
        }
    });
    // Danger explanation
    let dangerExplanation = `Route analysis: ${distance.toFixed(1)} km across `;
    if (terrainType === "EXTREME") dangerExplanation += "extreme terrain. ";
    else if (terrainType === "DIFFICULT") dangerExplanation += "difficult terrain. ";
    else dangerExplanation += "varied terrain. ";
    if (avgConflict > 6) dangerExplanation += "High conflict presence. ";
    if (avgWeatherRisk > 6) dangerExplanation += "Severe weather conditions. ";
    if (waterScore < 3) dangerExplanation += "Limited water sources. ";
    if (foodScore < 3) dangerExplanation += "Limited food availability. ";
    return {
        distance_km: Number.parseFloat(distance.toFixed(1)),
        duration_hours: Number.parseFloat(duration_hours.toFixed(1)),
        duration_days,
        nights_required,
        survival_score: Math.max(0, Math.min(100, survivalScore)),
        risk_level: riskLevel,
        terrain_difficulty: terrainType,
        conflict_intersections: conflictIntersections,
        water_score: waterScore,
        food_score: foodScore,
        weather_risk: avgWeatherRisk,
        danger_explanation: dangerExplanation,
        recommendations,
        estimated_calories_per_day: estimatedCaloriesPerDay,
        estimated_water_liters_per_day: Number.parseFloat(adjustedWaterPerDay.toFixed(1))
    };
}
function findAlternateRoutes(source, destination, travelMode) {
    const routes = [];
    // Generate 3 alternative routes with slight variations
    for(let i = 0; i < 3; i++){
        const variance = 0.1 + i * 0.05;
        const altDest = {
            lat: destination.lat + (Math.random() - 0.5) * variance,
            lon: destination.lon + (Math.random() - 0.5) * variance
        };
        routes.push(analyzeRoute(source, altDest, travelMode));
    }
    return routes.sort((a, b)=>b.survival_score - a.survival_score);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/export-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/route/route-analyzer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RouteAnalyzer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplet$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/droplet.js [app-client] (ecmascript) <export default as Droplet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$utensils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Utensils$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/utensils.js [app-client] (ecmascript) <export default as Utensils>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$route$2d$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/route-engine.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$export$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/export-utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function RouteAnalyzer({ source, destination, travelMode, onAnalysisComplete }) {
    _s();
    const [analysis, setAnalysis] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isExporting, setIsExporting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const memoizedOnAnalysisComplete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "RouteAnalyzer.useCallback[memoizedOnAnalysisComplete]": (result)=>{
            onAnalysisComplete?.(result);
        }
    }["RouteAnalyzer.useCallback[memoizedOnAnalysisComplete]"], [
        onAnalysisComplete
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RouteAnalyzer.useEffect": ()=>{
            if (source && destination) {
                setIsLoading(true);
                // Keep previous analysis visible during loading to prevent flickering
                const timer = setTimeout({
                    "RouteAnalyzer.useEffect.timer": ()=>{
                        const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$route$2d$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["analyzeRoute"])(source, destination, travelMode);
                        setAnalysis(result);
                        memoizedOnAnalysisComplete(result);
                        setIsLoading(false);
                    }
                }["RouteAnalyzer.useEffect.timer"], 800);
                return ({
                    "RouteAnalyzer.useEffect": ()=>clearTimeout(timer)
                })["RouteAnalyzer.useEffect"];
            }
        }
    }["RouteAnalyzer.useEffect"], [
        source,
        destination,
        travelMode,
        memoizedOnAnalysisComplete
    ]);
    const handleDownloadSurvivalPack = async ()=>{
        if (!analysis) return;
        setIsExporting(true);
        try {
            const pdfBlob = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$export$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateSurvivalPDF"])({
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
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$export$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["downloadBlob"])(pdfBlob, "survival-pack.pdf");
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
            const blob = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$export$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["exportMapAsPNG"])(canvasRef.current);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$export$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["downloadBlob"])(blob, "map-snapshot.png");
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
            const pdfBlob = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$export$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateSurvivalPDF"])({
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
            const zipBlob = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$export$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createOfflineZip"])({
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
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$export$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["downloadBlob"])(zipBlob, "offline-pack.zip");
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-lg border border-border bg-card p-4 text-center text-sm text-muted-foreground",
            children: "Enter source and destination to analyze"
        }, void 0, false, {
            fileName: "[project]/components/route/route-analyzer.tsx",
            lineNumber: 150,
            columnNumber: 7
        }, this);
    }
    if (isLoading && !analysis) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center gap-3 rounded-lg border border-border bg-card/50 p-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"
                }, void 0, false, {
                    fileName: "[project]/components/route/route-analyzer.tsx",
                    lineNumber: 159,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
    const renderContent = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-4 rounded-lg border border-border bg-card p-5",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "font-semibold text-foreground",
                            children: "ROUTE ANALYSIS"
                        }, void 0, false, {
                            fileName: "[project]/components/route/route-analyzer.tsx",
                            lineNumber: 170,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-lg bg-muted/30 p-4 border border-muted/50",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-2 flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs font-semibold text-secondary",
                                    children: "SURVIVAL PROBABILITY"
                                }, void 0, false, {
                                    fileName: "[project]/components/route/route-analyzer.tsx",
                                    lineNumber: 179,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-2 w-full overflow-hidden rounded-full bg-muted/50",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-2 gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg border border-border bg-muted/30 p-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-muted-foreground",
                                    children: "DISTANCE"
                                }, void 0, false, {
                                    fileName: "[project]/components/route/route-analyzer.tsx",
                                    lineNumber: 193,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg border border-border bg-muted/30 p-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-muted-foreground",
                                    children: "DURATION"
                                }, void 0, false, {
                                    fileName: "[project]/components/route/route-analyzer.tsx",
                                    lineNumber: 197,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-2 gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg border border-border bg-muted/30 p-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-muted-foreground",
                                    children: "TERRAIN"
                                }, void 0, false, {
                                    fileName: "[project]/components/route/route-analyzer.tsx",
                                    lineNumber: 207,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-lg border border-border bg-muted/30 p-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-muted-foreground",
                                    children: "CONFLICT AREAS"
                                }, void 0, false, {
                                    fileName: "[project]/components/route/route-analyzer.tsx",
                                    lineNumber: 211,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 text-xs text-muted-foreground",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$droplet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Droplet$3e$__["Droplet"], {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-1.5 w-full rounded-full bg-muted/50",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 text-xs text-muted-foreground",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$utensils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Utensils$3e$__["Utensils"], {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-1.5 w-full rounded-full bg-muted/50",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                            className: "h-4 w-4 flex-shrink-0 text-yellow-500 mt-0.5"
                        }, void 0, false, {
                            fileName: "[project]/components/route/route-analyzer.tsx",
                            lineNumber: 251,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                analysis.recommendations.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs font-semibold text-primary",
                            children: "RECOMMENDATIONS:"
                        }, void 0, false, {
                            fileName: "[project]/components/route/route-analyzer.tsx",
                            lineNumber: 258,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-1",
                            children: analysis.recommendations.map((rec, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2 text-xs text-muted-foreground",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex-shrink-0",
                                            children: "•"
                                        }, void 0, false, {
                                            fileName: "[project]/components/route/route-analyzer.tsx",
                                            lineNumber: 262,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "border-t border-border pt-3 space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs font-semibold text-secondary",
                            children: "ESTIMATED SUPPLY NEEDS:"
                        }, void 0, false, {
                            fileName: "[project]/components/route/route-analyzer.tsx",
                            lineNumber: 272,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-2 text-xs",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-lg bg-muted/30 p-2 border border-border",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-muted-foreground",
                                            children: "Calories/day"
                                        }, void 0, false, {
                                            fileName: "[project]/components/route/route-analyzer.tsx",
                                            lineNumber: 275,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-lg bg-muted/30 p-2 border border-border",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-muted-foreground",
                                            children: "Water/day"
                                        }, void 0, false, {
                                            fileName: "[project]/components/route/route-analyzer.tsx",
                                            lineNumber: 279,
                                            columnNumber: 13
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "border-t border-border pt-3 space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs font-semibold text-primary mb-2",
                            children: "DOWNLOAD:"
                        }, void 0, false, {
                            fileName: "[project]/components/route/route-analyzer.tsx",
                            lineNumber: 287,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleDownloadSurvivalPack,
                            disabled: isExporting,
                            className: "w-full flex items-center justify-center gap-2 rounded-lg border border-primary bg-primary/10 hover:bg-primary/20 text-primary px-3 py-2 text-sm font-semibold transition disabled:opacity-50",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleDownloadMap,
                            disabled: isExporting,
                            className: "w-full flex items-center justify-center gap-2 rounded-lg border border-secondary bg-secondary/10 hover:bg-secondary/20 text-secondary px-3 py-2 text-sm font-semibold transition disabled:opacity-50",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleDownloadOfflinePack,
                            disabled: isExporting,
                            className: "w-full flex items-center justify-center gap-2 rounded-lg border border-accent bg-accent/10 hover:bg-accent/20 text-accent px-3 py-2 text-sm font-semibold transition disabled:opacity-50",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative",
            children: [
                renderContent(),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm z-10 rounded-lg",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"
                            }, void 0, false, {
                                fileName: "[project]/components/route/route-analyzer.tsx",
                                lineNumber: 322,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
_s(RouteAnalyzer, "gbrsZFeqC8k2v66Tvwmm5zcnsJY=");
_c = RouteAnalyzer;
var _c;
__turbopack_context__.k.register(_c, "RouteAnalyzer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/geocoder.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/route/route-panel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RoutePanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$route$2f$route$2d$analyzer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/route/route-analyzer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$geocoder$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/geocoder.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function RoutePanel({ onRouteSelect, onCoordinatesChange }) {
    _s();
    const [sourceInput, setSourceInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [destInput, setDestInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [source, setSource] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [destination, setDestination] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [travelMode, setTravelMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("walking");
    const [analysis, setAnalysis] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [sourceSuggestions, setSourceSuggestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [destSuggestions, setDestSuggestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showSourceDropdown, setShowSourceDropdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showDestDropdown, setShowDestDropdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const memoizedOnCoordinatesChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "RoutePanel.useCallback[memoizedOnCoordinatesChange]": ()=>{
            onCoordinatesChange?.({
                source,
                destination
            });
        }
    }["RoutePanel.useCallback[memoizedOnCoordinatesChange]"], [
        source,
        destination,
        onCoordinatesChange
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RoutePanel.useEffect": ()=>{
            memoizedOnCoordinatesChange();
            // Auto-trigger analysis when both source and destination are set
            if (source && destination) {
            // Analysis will be triggered automatically by RouteAnalyzer component
            // This effect ensures coordinates are updated immediately
            }
        }
    }["RoutePanel.useEffect"], [
        memoizedOnCoordinatesChange,
        source,
        destination
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RoutePanel.useEffect": ()=>{
            const timer = setTimeout({
                "RoutePanel.useEffect.timer": async ()=>{
                    if (sourceInput.length > 1) {
                        const suggestions = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$geocoder$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["autocomplete"])(sourceInput);
                        setSourceSuggestions(suggestions);
                        setShowSourceDropdown(true);
                    }
                }
            }["RoutePanel.useEffect.timer"], 300);
            return ({
                "RoutePanel.useEffect": ()=>clearTimeout(timer)
            })["RoutePanel.useEffect"];
        }
    }["RoutePanel.useEffect"], [
        sourceInput
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RoutePanel.useEffect": ()=>{
            const timer = setTimeout({
                "RoutePanel.useEffect.timer": async ()=>{
                    if (destInput.length > 1) {
                        const suggestions = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$geocoder$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["autocomplete"])(destInput);
                        setDestSuggestions(suggestions);
                        setShowDestDropdown(true);
                    }
                }
            }["RoutePanel.useEffect.timer"], 300);
            return ({
                "RoutePanel.useEffect": ()=>clearTimeout(timer)
            })["RoutePanel.useEffect"];
        }
    }["RoutePanel.useEffect"], [
        destInput
    ]);
    const handleSelectSource = (suggestion)=>{
        setSource({
            lat: suggestion.lat,
            lon: suggestion.lon
        });
        setSourceInput(suggestion.name);
        setShowSourceDropdown(false);
    };
    const handleSelectDestination = (suggestion)=>{
        setDestination({
            lat: suggestion.lat,
            lon: suggestion.lon
        });
        setDestInput(suggestion.name);
        setShowDestDropdown(false);
    };
    const handleAnalysisComplete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "RoutePanel.useCallback[handleAnalysisComplete]": (result)=>{
            setAnalysis(result);
            onRouteSelect(result);
        }
    }["RoutePanel.useCallback[handleAnalysisComplete]"], [
        onRouteSelect
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-4 h-full overflow-y-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-lg border border-border bg-card p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "mb-1 text-sm font-semibold text-primary",
                        children: "ROUTE PLANNER"
                    }, void 0, false, {
                        fileName: "[project]/components/route/route-panel.tsx",
                        lineNumber: 86,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-muted-foreground",
                        children: "Global routing with AI threat assessment"
                    }, void 0, false, {
                        fileName: "[project]/components/route/route-panel.tsx",
                        lineNumber: 87,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 space-y-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "mb-1 block text-xs font-semibold text-secondary",
                                        children: "SOURCE"
                                    }, void 0, false, {
                                        fileName: "[project]/components/route/route-panel.tsx",
                                        lineNumber: 91,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                        className: "absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/route/route-panel.tsx",
                                                        lineNumber: 94,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        placeholder: "Search city, village, camp, or enter coords (34.123, 36.559)",
                                                        value: sourceInput,
                                                        onChange: (e)=>setSourceInput(e.target.value),
                                                        onFocus: ()=>sourceInput.length > 1 && setShowSourceDropdown(true),
                                                        className: "w-full rounded-lg border border-border bg-input px-3 py-2 pl-8 text-sm text-foreground placeholder:text-muted-foreground hover:bg-muted transition focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/route/route-panel.tsx",
                                                        lineNumber: 95,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/route/route-panel.tsx",
                                                lineNumber: 93,
                                                columnNumber: 15
                                            }, this),
                                            showSourceDropdown && sourceSuggestions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute top-full left-0 right-0 mt-1 rounded-lg border border-border bg-card shadow-lg z-10",
                                                children: sourceSuggestions.map((suggestion, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleSelectSource(suggestion),
                                                        className: "w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted transition border-b border-border last:border-b-0",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                                    className: "h-3 w-3 text-secondary flex-shrink-0"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/route/route-panel.tsx",
                                                                    lineNumber: 113,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "font-medium",
                                                                            children: suggestion.name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/route/route-panel.tsx",
                                                                            lineNumber: 115,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs text-muted-foreground",
                                                                            children: [
                                                                                suggestion.lat.toFixed(3),
                                                                                ", ",
                                                                                suggestion.lon.toFixed(3)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/route/route-panel.tsx",
                                                                            lineNumber: 116,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/route/route-panel.tsx",
                                                                    lineNumber: 114,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/route/route-panel.tsx",
                                                            lineNumber: 112,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, i, false, {
                                                        fileName: "[project]/components/route/route-panel.tsx",
                                                        lineNumber: 107,
                                                        columnNumber: 21
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/components/route/route-panel.tsx",
                                                lineNumber: 105,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/route/route-panel.tsx",
                                        lineNumber: 92,
                                        columnNumber: 13
                                    }, this),
                                    source && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-1 text-xs text-primary flex items-center gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                className: "h-3 w-3"
                                            }, void 0, false, {
                                                fileName: "[project]/components/route/route-panel.tsx",
                                                lineNumber: 128,
                                                columnNumber: 17
                                            }, this),
                                            source.lat.toFixed(4),
                                            ", ",
                                            source.lon.toFixed(4)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/route/route-panel.tsx",
                                        lineNumber: 127,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/route/route-panel.tsx",
                                lineNumber: 90,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "mb-1 block text-xs font-semibold text-secondary",
                                        children: "DESTINATION"
                                    }, void 0, false, {
                                        fileName: "[project]/components/route/route-panel.tsx",
                                        lineNumber: 135,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                        className: "absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/route/route-panel.tsx",
                                                        lineNumber: 138,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        placeholder: "Search city, border, camp, or enter coords (34.456, 36.789)",
                                                        value: destInput,
                                                        onChange: (e)=>setDestInput(e.target.value),
                                                        onFocus: ()=>destInput.length > 1 && setShowDestDropdown(true),
                                                        className: "w-full rounded-lg border border-border bg-input px-3 py-2 pl-8 text-sm text-foreground placeholder:text-muted-foreground hover:bg-muted transition focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/route/route-panel.tsx",
                                                        lineNumber: 139,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/route/route-panel.tsx",
                                                lineNumber: 137,
                                                columnNumber: 15
                                            }, this),
                                            showDestDropdown && destSuggestions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute top-full left-0 right-0 mt-1 rounded-lg border border-border bg-card shadow-lg z-10",
                                                children: destSuggestions.map((suggestion, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleSelectDestination(suggestion),
                                                        className: "w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted transition border-b border-border last:border-b-0",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                                    className: "h-3 w-3 text-accent flex-shrink-0"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/route/route-panel.tsx",
                                                                    lineNumber: 157,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "font-medium",
                                                                            children: suggestion.name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/route/route-panel.tsx",
                                                                            lineNumber: 159,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs text-muted-foreground",
                                                                            children: [
                                                                                suggestion.lat.toFixed(3),
                                                                                ", ",
                                                                                suggestion.lon.toFixed(3)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/route/route-panel.tsx",
                                                                            lineNumber: 160,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/route/route-panel.tsx",
                                                                    lineNumber: 158,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/route/route-panel.tsx",
                                                            lineNumber: 156,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, i, false, {
                                                        fileName: "[project]/components/route/route-panel.tsx",
                                                        lineNumber: 151,
                                                        columnNumber: 21
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/components/route/route-panel.tsx",
                                                lineNumber: 149,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/route/route-panel.tsx",
                                        lineNumber: 136,
                                        columnNumber: 13
                                    }, this),
                                    destination && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-1 text-xs text-accent flex items-center gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                className: "h-3 w-3"
                                            }, void 0, false, {
                                                fileName: "[project]/components/route/route-panel.tsx",
                                                lineNumber: 172,
                                                columnNumber: 17
                                            }, this),
                                            destination.lat.toFixed(4),
                                            ", ",
                                            destination.lon.toFixed(4)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/route/route-panel.tsx",
                                        lineNumber: 171,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/route/route-panel.tsx",
                                lineNumber: 134,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "mb-2 block text-xs font-semibold text-secondary",
                                        children: "TRAVEL MODE"
                                    }, void 0, false, {
                                        fileName: "[project]/components/route/route-panel.tsx",
                                        lineNumber: 180,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2",
                                        children: [
                                            "walking",
                                            "vehicle"
                                        ].map((mode)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setTravelMode(mode),
                                                className: `flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition ${travelMode === mode ? "border-primary bg-primary text-primary-foreground" : "border-border bg-input text-foreground hover:bg-muted"}`,
                                                children: [
                                                    mode === "walking" ? "🚶" : "🚗",
                                                    " ",
                                                    mode.toUpperCase()
                                                ]
                                            }, mode, true, {
                                                fileName: "[project]/components/route/route-panel.tsx",
                                                lineNumber: 183,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/route/route-panel.tsx",
                                        lineNumber: 181,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/route/route-panel.tsx",
                                lineNumber: 179,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/route/route-panel.tsx",
                        lineNumber: 89,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 flex gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                className: "h-4 w-4 flex-shrink-0 text-yellow-500 mt-0.5"
                            }, void 0, false, {
                                fileName: "[project]/components/route/route-panel.tsx",
                                lineNumber: 200,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-yellow-200",
                                children: "Works globally. Analyze terrain, conflict zones, weather, and resources automatically."
                            }, void 0, false, {
                                fileName: "[project]/components/route/route-panel.tsx",
                                lineNumber: 201,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/route/route-panel.tsx",
                        lineNumber: 199,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/route/route-panel.tsx",
                lineNumber: 85,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$route$2f$route$2d$analyzer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                source: source || undefined,
                destination: destination || undefined,
                travelMode: travelMode,
                onAnalysisComplete: handleAnalysisComplete
            }, void 0, false, {
                fileName: "[project]/components/route/route-panel.tsx",
                lineNumber: 208,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/route/route-panel.tsx",
        lineNumber: 84,
        columnNumber: 5
    }, this);
}
_s(RoutePanel, "eYmhmyfi0w8dWJWl3tM3gGPNFnY=");
_c = RoutePanel;
var _c;
__turbopack_context__.k.register(_c, "RoutePanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/emergency/emergency-sos.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>EmergencySOS
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$compass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Compass$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/compass.js [app-client] (ecmascript) <export default as Compass>");
"use client";
;
;
function EmergencySOS({ onClose }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-lg rounded-lg border border-accent bg-card p-8 shadow-2xl shadow-accent/20",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6 flex items-start justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                            className: "h-6 w-6 text-accent danger-pulse"
                                        }, void 0, false, {
                                            fileName: "[project]/components/emergency/emergency-sos.tsx",
                                            lineNumber: 17,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "rounded-lg border border-border p-2 hover:bg-muted",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6 space-y-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3 rounded-lg bg-accent/10 p-3 border border-accent/30",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$compass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Compass$3e$__["Compass"], {
                                    className: "h-5 w-5 text-accent flex-shrink-0"
                                }, void 0, false, {
                                    fileName: "[project]/components/emergency/emergency-sos.tsx",
                                    lineNumber: 30,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs font-semibold text-accent",
                                            children: "NEAREST SAFE ZONE"
                                        }, void 0, false, {
                                            fileName: "[project]/components/emergency/emergency-sos.tsx",
                                            lineNumber: 32,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3 rounded-lg bg-primary/10 p-3 border border-primary/30",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                    className: "h-5 w-5 text-primary flex-shrink-0"
                                }, void 0, false, {
                                    fileName: "[project]/components/emergency/emergency-sos.tsx",
                                    lineNumber: 38,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs font-semibold text-primary",
                                            children: "QUICKEST ROUTE"
                                        }, void 0, false, {
                                            fileName: "[project]/components/emergency/emergency-sos.tsx",
                                            lineNumber: 40,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mb-3 text-xs font-semibold text-secondary",
                            children: "ESCAPE ROUTE STEPS:"
                        }, void 0, false, {
                            fileName: "[project]/components/emergency/emergency-sos.tsx",
                            lineNumber: 48,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                            className: "space-y-2 text-sm text-foreground",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: "1. Head North following GPS bearing 345°"
                                }, void 0, false, {
                                    fileName: "[project]/components/emergency/emergency-sos.tsx",
                                    lineNumber: 50,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: "2. Avoid main roads - use forest paths"
                                }, void 0, false, {
                                    fileName: "[project]/components/emergency/emergency-sos.tsx",
                                    lineNumber: 51,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: "3. Stay in groups if possible"
                                }, void 0, false, {
                                    fileName: "[project]/components/emergency/emergency-sos.tsx",
                                    lineNumber: 52,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6 rounded-lg bg-accent/5 p-3 border border-accent/20",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mb-2 text-xs font-semibold text-accent",
                            children: "ACTIVE DANGERS IN AREA:"
                        }, void 0, false, {
                            fileName: "[project]/components/emergency/emergency-sos.tsx",
                            lineNumber: 59,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "space-y-1 text-xs text-foreground",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: "• Military checkpoint 4 km east"
                                }, void 0, false, {
                                    fileName: "[project]/components/emergency/emergency-sos.tsx",
                                    lineNumber: 61,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: "• Flooded roads west sector"
                                }, void 0, false, {
                                    fileName: "[project]/components/emergency/emergency-sos.tsx",
                                    lineNumber: 62,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "flex-1 rounded-lg border border-border px-4 py-3 font-semibold text-foreground transition hover:bg-muted",
                            children: "CLOSE"
                        }, void 0, false, {
                            fileName: "[project]/components/emergency/emergency-sos.tsx",
                            lineNumber: 69,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
_c = EmergencySOS;
var _c;
__turbopack_context__.k.register(_c, "EmergencySOS");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
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
"[project]/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$map$2f$map$2d$container$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/map/map-container.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$route$2f$route$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/route/route-panel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$emergency$2f$emergency$2d$sos$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/emergency/emergency-sos.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$navigation$2f$navigation$2d$bar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/navigation/navigation-bar.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function Home() {
    _s();
    const [showSOS, setShowSOS] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedRoute, setSelectedRoute] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [routeCoordinates, setRouteCoordinates] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-background",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$navigation$2f$navigation$2d$bar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                onSOS: ()=>setShowSOS(true)
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex h-screen gap-4 p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$map$2f$map$2d$container$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            selectedRoute: selectedRoute,
                            routeCoordinates: routeCoordinates
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 24,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 23,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-96",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$route$2f$route$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            onRouteSelect: setSelectedRoute,
                            onCoordinatesChange: setRouteCoordinates
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 29,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 28,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, this),
            showSOS && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$emergency$2f$emergency$2d$sos$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                onClose: ()=>setShowSOS(false)
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 34,
                columnNumber: 19
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
_s(Home, "bZBHkk8wLhBJu9juGQVeNFp63Co=");
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_b0c18413._.js.map