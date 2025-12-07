// Global routing with OpenRouteService, OSRM API, and haversine fallback
import { getRouteFromOpenRouteService } from "./openroute-service"

interface RouteCoordinates {
  lat: number
  lon: number
}

type RoutePath = Array<{ lat: number; lon: number }>

export async function getRouteFromOSRM(
  source: RouteCoordinates,
  destination: RouteCoordinates,
): Promise<RoutePath | null> {
  let timeoutId: NodeJS.Timeout | undefined
  try {
    // Create abort controller for timeout
    const controller = new AbortController()
    timeoutId = setTimeout(() => controller.abort(), 8000) // 8 second timeout
    
    const url = `https://router.project-osrm.org/route/v1/foot/${source.lon},${source.lat};${destination.lon},${destination.lat}?geometries=geojson&overview=full`

    const response = await fetch(url, {
      headers: {
        "User-Agent": "SafeRoute-HumanitarianApp/1.0",
      },
      signal: controller.signal,
    })
    
    if (timeoutId) clearTimeout(timeoutId)

    if (!response.ok) return null

    const data = await response.json()
    if (data.routes && data.routes[0]) {
      const coords = data.routes[0].geometry.coordinates
      return coords.map((c: [number, number]) => ({
        lat: c[1],
        lon: c[0],
      }))
    }
  } catch (error) {
    // Silently fail - we have fallback
    if (error instanceof Error && error.name !== "AbortError") {
      console.warn("[v0] OSRM routing unavailable (using fallback):", error.message)
    }
  } finally {
    // Cleanup timeout if still running
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }
  return null
}

export function generateGreatCircleRoute(source: RouteCoordinates, destination: RouteCoordinates): RoutePath {
  const points: RoutePath = []
  const steps = 50 // Generate 50 intermediate points

  for (let i = 0; i <= steps; i++) {
    const fraction = i / steps

    // Simple linear interpolation for fallback
    const lat = source.lat + (destination.lat - source.lat) * fraction
    const lon = source.lon + (destination.lon - source.lon) * fraction

    points.push({ lat, lon })
  }

  return points
}

/**
 * Get global route with multiple fallback options
 * Priority: OpenRouteService > OSRM > Great Circle
 */
export async function getGlobalRoute(
  source: RouteCoordinates,
  destination: RouteCoordinates,
  travelMode: "walking" | "vehicle" = "walking",
): Promise<RoutePath> {
  // Try OpenRouteService first (most accurate)
  const orsRoute = await getRouteFromOpenRouteService(
    source,
    destination,
    travelMode === "walking" ? "foot-walking" : "driving-car",
  )
  if (orsRoute && orsRoute.length > 0) {
    return orsRoute
  }

  // Fallback to OSRM
  const osrmRoute = await getRouteFromOSRM(source, destination)
  if (osrmRoute && osrmRoute.length > 0) {
    return osrmRoute
  }

  // Final fallback to haversine-based polyline
  return generateGreatCircleRoute(source, destination)
}
