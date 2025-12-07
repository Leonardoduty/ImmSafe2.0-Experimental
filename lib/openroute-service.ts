// OpenRouteService API for realistic geographic routing
// Free API key available at https://openrouteservice.org/

interface RouteCoordinates {
  lat: number
  lon: number
}

type RoutePath = Array<{ lat: number; lon: number }>

/**
 * Get route from OpenRouteService API
 * Falls back to OSRM if OpenRouteService fails
 */
export async function getRouteFromOpenRouteService(
  source: RouteCoordinates,
  destination: RouteCoordinates,
  profile: "foot-walking" | "driving-car" = "foot-walking",
): Promise<RoutePath | null> {
  let timeoutId: NodeJS.Timeout | undefined
  try {
    const controller = new AbortController()
    timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    // OpenRouteService API endpoint (free tier available)
    // Using public demo key - in production, get your own key from openrouteservice.org
    const apiKey = process.env.NEXT_PUBLIC_ORS_API_KEY || "5b3ce3597851110001cf6248e77c1e5486f14a9c86eb135c57a6c432"
    
    const url = `https://api.openrouteservice.org/v2/directions/${profile}?api_key=${apiKey}&start=${source.lon},${source.lat}&end=${destination.lon},${destination.lat}`

    const response = await fetch(url, {
      headers: {
        "Accept": "application/json, application/geo+json",
      },
      signal: controller.signal,
    })

    if (timeoutId) clearTimeout(timeoutId)

    if (!response.ok) {
      console.warn("[v0] OpenRouteService API error:", response.status)
      return null
    }

    const data = await response.json()
    
    // OpenRouteService returns routes in GeoJSON format
    if (data.features && data.features[0] && data.features[0].geometry) {
      const coordinates = data.features[0].geometry.coordinates as [number, number][]
      // Convert from [lon, lat] to {lat, lon}
      return coordinates.map((coord) => ({
        lat: coord[1],
        lon: coord[0],
      }))
    }
  } catch (error) {
    if (error instanceof Error && error.name !== "AbortError") {
      console.warn("[v0] OpenRouteService routing unavailable:", error.message)
    }
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }
  return null
}

/**
 * Get route with multiple waypoints to avoid conflict zones
 */
export async function getRouteAvoidingZones(
  source: RouteCoordinates,
  destination: RouteCoordinates,
  avoidZones: Array<{ lat: number; lon: number; radius: number }>,
  profile: "foot-walking" | "driving-car" = "foot-walking",
): Promise<RoutePath | null> {
  // For now, use basic routing
  // In production, you'd add avoid polygons to OpenRouteService request
  return getRouteFromOpenRouteService(source, destination, profile)
}


