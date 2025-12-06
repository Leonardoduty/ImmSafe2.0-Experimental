// Global routing with OSRM API and haversine fallback

interface RouteCoordinates {
  lat: number
  lon: number
}

interface RoutePath {
  lat: number
  lon: number
}
;[]

export async function getRouteFromOSRM(
  source: RouteCoordinates,
  destination: RouteCoordinates,
): Promise<RoutePath | null> {
  try {
    const url = `https://router.project-osrm.org/route/v1/foot/${source.lon},${source.lat};${destination.lon},${destination.lat}?geometries=geojson&overview=full`

    const response = await fetch(url, {
      headers: {
        "User-Agent": "SafeRoute-HumanitarianApp/1.0",
      },
    })

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
    console.error("[v0] OSRM routing error:", error)
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

export async function getGlobalRoute(source: RouteCoordinates, destination: RouteCoordinates): Promise<RoutePath> {
  // Try OSRM first
  const osrmRoute = await getRouteFromOSRM(source, destination)
  if (osrmRoute && osrmRoute.length > 0) {
    return osrmRoute
  }

  // Fallback to haversine-based polyline
  return generateGreatCircleRoute(source, destination)
}
