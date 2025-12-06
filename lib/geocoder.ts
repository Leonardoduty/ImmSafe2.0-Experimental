// Global geocoding and autocomplete using OpenStreetMap Nominatim API

export interface GeocodingResult {
  name: string
  lat: number
  lon: number
  type: string
  display_name: string
}

export interface AutocompleteResult {
  name: string
  lat: number
  lon: number
  type: string
}

export function parseCoordinates(input: string): { lat: number; lon: number } | null {
  const trimmed = input.trim()
  const match = trimmed.match(/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/)
  if (match) {
    const lat = Number.parseFloat(match[1])
    const lon = Number.parseFloat(match[2])
    if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
      return { lat, lon }
    }
  }
  return null
}

export async function searchLocation(query: string): Promise<GeocodingResult[]> {
  if (!query || query.length < 2) return []

  try {
    const response = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`)

    if (!response.ok) return []

    const data = await response.json()
    return data
  } catch (error) {
    console.error("[v0] Geocoding error:", error)
    return []
  }
}

export async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  try {
    const response = await fetch(`/api/geocode?lat=${lat}&lon=${lon}`)

    if (!response.ok) return null
    const data = await response.json()
    return data.name
  } catch (error) {
    console.error("[v0] Reverse geocoding error:", error)
    return null
  }
}

export async function autocomplete(input: string): Promise<AutocompleteResult[]> {
  // Try parsing as coordinates first
  const coords = parseCoordinates(input)
  if (coords) {
    return [
      {
        name: `${coords.lat.toFixed(4)}, ${coords.lon.toFixed(4)}`,
        lat: coords.lat,
        lon: coords.lon,
        type: "coordinate",
      },
    ]
  }

  // Search for place names
  const results = await searchLocation(input)
  return results.slice(0, 5).map((r) => ({
    name: r.name,
    lat: r.lat,
    lon: r.lon,
    type: r.type,
  }))
}
