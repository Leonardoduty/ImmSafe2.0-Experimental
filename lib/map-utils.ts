// Map utilities for drawing borders and routes

export interface GeoJSONFeature {
  type: string
  properties: Record<string, any>
  geometry: {
    type: string
    coordinates: number[][][] | number[][][][]
  }
}

export interface GeoJSON {
  type: string
  features: GeoJSONFeature[]
}

// Load simplified world borders GeoJSON
export async function loadWorldBorders(): Promise<GeoJSON | null> {
  let timeoutId: NodeJS.Timeout | undefined
  try {
    // Create abort controller for timeout
    const controller = new AbortController()
    timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    // Use a simplified world borders GeoJSON from a free source
    // Using a CDN that hosts simplified GeoJSON
    const response = await fetch("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson", {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId)
    if (!response.ok) {
      // Fallback to a simpler approach - return null and draw basic borders
      return null
    }
    const data = await response.json()
    return data as GeoJSON
  } catch (error) {
    // Silently fail - borders are optional
    if (error instanceof Error && error.name !== "AbortError") {
      console.warn("[v0] Could not load world borders (this is optional):", error.message)
    }
    return null
  } finally {
    // Cleanup timeout if still running
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }
}

// Project lat/lon to canvas coordinates
export function projectToCanvas(
  lat: number,
  lon: number,
  bounds: { minLat: number; maxLat: number; minLon: number; maxLon: number },
  width: number,
  height: number,
): { x: number; y: number } {
  const latPadding = (bounds.maxLat - bounds.minLat) * 0.1
  const lonPadding = (bounds.maxLon - bounds.minLon) * 0.1
  const adjustedMinLat = bounds.minLat - latPadding
  const adjustedMaxLat = bounds.maxLat + latPadding
  const adjustedMinLon = bounds.minLon - lonPadding
  const adjustedMaxLon = bounds.maxLon + lonPadding

  const x = ((lon - adjustedMinLon) / (adjustedMaxLon - adjustedMinLon)) * width
  const y = ((adjustedMaxLat - lat) / (adjustedMaxLat - adjustedMinLat)) * height

  return { x, y }
}

/**
 * Calculate bounds from coordinates with route polyline support
 * Uses fitBounds-style logic with independent lat/lon spans
 * Automatically zooms out for short routes so both countries are clearly visible
 */
export function calculateBounds(
  source?: { lat: number; lon: number },
  destination?: { lat: number; lon: number },
  routePolyline?: Array<{ lat: number; lon: number }>,
  defaultBounds = { minLat: 20, maxLat: 50, minLon: -10, maxLon: 50 },
): { minLat: number; maxLat: number; minLon: number; maxLon: number } {
  if (!source && !destination) {
    return defaultBounds
  }

  let minLat = source?.lat ?? destination?.lat ?? defaultBounds.minLat
  let maxLat = source?.lat ?? destination?.lat ?? defaultBounds.maxLat
  let minLon = source?.lon ?? destination?.lon ?? defaultBounds.minLon
  let maxLon = source?.lon ?? destination?.lon ?? defaultBounds.maxLon

  if (source) {
    minLat = Math.min(minLat, source.lat)
    maxLat = Math.max(maxLat, source.lat)
    minLon = Math.min(minLon, source.lon)
    maxLon = Math.max(maxLon, source.lon)
  }

  if (destination) {
    minLat = Math.min(minLat, destination.lat)
    maxLat = Math.max(maxLat, destination.lat)
    minLon = Math.min(minLon, destination.lon)
    maxLon = Math.max(maxLon, destination.lon)
  }

  if (routePolyline && routePolyline.length > 0) {
    routePolyline.forEach((point) => {
      minLat = Math.min(minLat, point.lat)
      maxLat = Math.max(maxLat, point.lat)
      minLon = Math.min(minLon, point.lon)
      maxLon = Math.max(maxLon, point.lon)
    })
  }

  let latSpan = maxLat - minLat
  let lonSpan = maxLon - minLon
  const distanceKm = Math.sqrt(latSpan * latSpan + lonSpan * lonSpan) * 111

  const centerLat = (minLat + maxLat) / 2
  const centerLon = (minLon + maxLon) / 2

  const minLatSpan = 4.0
  const minLonSpan = 4.0

  if (distanceKm < 100) {
    if (latSpan < minLatSpan) {
      minLat = centerLat - minLatSpan / 2
      maxLat = centerLat + minLatSpan / 2
      latSpan = minLatSpan
    }
    if (lonSpan < minLonSpan) {
      minLon = centerLon - minLonSpan / 2
      maxLon = centerLon + minLonSpan / 2
      lonSpan = minLonSpan
    }
  } else if (distanceKm < 300) {
    const minSpan = 5.0
    if (latSpan < minSpan) {
      minLat = centerLat - minSpan / 2
      maxLat = centerLat + minSpan / 2
      latSpan = minSpan
    }
    if (lonSpan < minSpan) {
      minLon = centerLon - minSpan / 2
      maxLon = centerLon + minSpan / 2
      lonSpan = minSpan
    }
  } else if (distanceKm < 500) {
    const minSpan = 6.0
    if (latSpan < minSpan) {
      minLat = centerLat - minSpan / 2
      maxLat = centerLat + minSpan / 2
      latSpan = minSpan
    }
    if (lonSpan < minSpan) {
      minLon = centerLon - minSpan / 2
      maxLon = centerLon + minSpan / 2
      lonSpan = minSpan
    }
  }

  const latPadding = latSpan * 0.2
  const lonPadding = lonSpan * 0.2

  let finalMinLat = minLat - latPadding
  let finalMaxLat = maxLat + latPadding
  let finalMinLon = minLon - lonPadding
  let finalMaxLon = maxLon + lonPadding

  finalMinLat = Math.max(-85, finalMinLat)
  finalMaxLat = Math.min(85, finalMaxLat)
  finalMinLon = Math.max(-180, finalMinLon)
  finalMaxLon = Math.min(180, finalMaxLon)

  return {
    minLat: finalMinLat,
    maxLat: finalMaxLat,
    minLon: finalMinLon,
    maxLon: finalMaxLon,
  }
}

// Draw GeoJSON borders on canvas
export function drawGeoJSONBorders(
  ctx: CanvasRenderingContext2D,
  geoJson: GeoJSON,
  bounds: { minLat: number; maxLat: number; minLon: number; maxLon: number },
  width: number,
  height: number,
) {
  ctx.strokeStyle = "rgba(100, 150, 200, 0.3)"
  ctx.lineWidth = 1
  ctx.fillStyle = "rgba(50, 100, 150, 0.05)"

  geoJson.features.forEach((feature) => {
    if (feature.geometry.type === "Polygon") {
      const coordinates = feature.geometry.coordinates as number[][][]
      coordinates.forEach((ring) => {
        ctx.beginPath()
        let first = true
        ring.forEach((coord) => {
          const [lon, lat] = coord
          const { x, y } = projectToCanvas(lat, lon, bounds, width, height)
          if (first) {
            ctx.moveTo(x, y)
            first = false
          } else {
            ctx.lineTo(x, y)
          }
        })
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
      })
    } else if (feature.geometry.type === "MultiPolygon") {
      const coordinates = feature.geometry.coordinates as number[][][][]
      coordinates.forEach((polygon) => {
        polygon.forEach((ring) => {
          ctx.beginPath()
          let first = true
          ring.forEach((coord) => {
            const [lon, lat] = coord
            const { x, y } = projectToCanvas(lat, lon, bounds, width, height)
            if (first) {
              ctx.moveTo(x, y)
              first = false
            } else {
              ctx.lineTo(x, y)
            }
          })
          ctx.closePath()
          ctx.fill()
          ctx.stroke()
        })
      })
    }
  })
}

// Generate route polyline points
export function generateRoutePolyline(
  source: { lat: number; lon: number },
  destination: { lat: number; lon: number },
  steps = 50,
): Array<{ lat: number; lon: number }> {
  const points: Array<{ lat: number; lon: number }> = []
  for (let i = 0; i <= steps; i++) {
    const fraction = i / steps
    const lat = source.lat + (destination.lat - source.lat) * fraction
    const lon = source.lon + (destination.lon - source.lon) * fraction
    points.push({ lat, lon })
  }
  return points
}

