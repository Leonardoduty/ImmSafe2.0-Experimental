// Global map layer data
// TODO: Replace with real datasets from:
// - UNHCR for safe zones
// - ACLED for conflict zones
// - OSM for water points
// - Official border crossing data

export interface LayerPoint {
  lat: number
  lon: number
  label?: string
  country?: string
  metadata?: Record<string, any>
}

/**
 * Global Safe Zones - UN camps, refugee camps, safe areas
 * Replace with real UNHCR data in production
 */
export const GLOBAL_SAFE_ZONES: LayerPoint[] = [
  // Middle East
  { lat: 31.9539, lon: 35.9106, label: "Zaatari Camp", country: "Jordan" },
  { lat: 33.8547, lon: 35.5018, label: "UNHCR Lebanon", country: "Lebanon" },
  { lat: 36.2021, lon: 37.1343, label: "Aleppo Safe Zone", country: "Syria" },
  
  // Africa
  { lat: 3.4025, lon: 35.3075, label: "Kakuma Camp", country: "Kenya" },
  { lat: 0.3031, lon: 40.3295, label: "Dadaab Camp", country: "Kenya" },
  { lat: 15.5007, lon: 32.5599, label: "Khartoum Safe Area", country: "Sudan" },
  { lat: 4.3276, lon: 15.3136, label: "Kinshasa Safe Zone", country: "DRC" },
  
  // Asia
  { lat: 34.5553, lon: 69.2075, label: "Kabul Safe Zone", country: "Afghanistan" },
  { lat: 33.6844, lon: 73.0479, label: "Islamabad Camp", country: "Pakistan" },
  { lat: 24.8607, lon: 67.0011, label: "Karachi Safe Area", country: "Pakistan" },
  
  // Europe
  { lat: 37.9838, lon: 23.7275, label: "Athens Reception", country: "Greece" },
  { lat: 39.2, lon: 26.1, label: "Lesbos Camp", country: "Greece" },
  { lat: 41.0082, lon: 28.9784, label: "Istanbul Center", country: "Turkey" },
  
  // Americas
  { lat: 4.7110, lon: -74.0721, label: "Bogota Center", country: "Colombia" },
  { lat: 19.4326, lon: -99.1332, label: "Mexico City Center", country: "Mexico" },
]

/**
 * Global Conflict Zones
 * Replace with real ACLED or conflict monitoring data in production
 */
export const GLOBAL_CONFLICT_ZONES: LayerPoint[] = [
  // Middle East
  { lat: 33.5138, lon: 36.2765, label: "Damascus Conflict", country: "Syria" },
  { lat: 31.927, lon: 35.2007, label: "Gaza Conflict", country: "Palestine" },
  { lat: 33.3128, lon: 44.3615, label: "Baghdad Zone", country: "Iraq" },
  
  // Africa
  { lat: 15.5007, lon: 32.5599, label: "Khartoum Conflict", country: "Sudan" },
  { lat: 13.5, lon: 25.0, label: "Darfur Conflict", country: "Sudan" },
  { lat: 1.6956, lon: 29.2201, label: "Goma Conflict", country: "DRC" },
  
  // Asia
  { lat: 34.5553, lon: 69.2075, label: "Kabul Conflict", country: "Afghanistan" },
  { lat: 15.3694, lon: 48.2219, label: "Sanaa Conflict", country: "Yemen" },
  { lat: 48.3794, lon: 31.1656, label: "Ukraine Conflict", country: "Ukraine" },
  
  // Americas
  { lat: 4.7110, lon: -74.0721, label: "Colombia Conflict", country: "Colombia" },
]

/**
 * Global Water Points / Wells
 * Replace with real OSM or water source data in production
 */
export const GLOBAL_WATER_POINTS: LayerPoint[] = [
  // Middle East
  { lat: 31.9539, lon: 35.9106, label: "Jordan Water Point", country: "Jordan" },
  { lat: 33.8547, lon: 35.5018, label: "Beirut Water", country: "Lebanon" },
  { lat: 36.2021, lon: 37.1343, label: "Aleppo Water", country: "Syria" },
  
  // Africa
  { lat: 3.4025, lon: 35.3075, label: "Kakuma Water", country: "Kenya" },
  { lat: 15.5007, lon: 32.5599, label: "Nile Water Point", country: "Sudan" },
  { lat: 9.032, lon: 38.7469, label: "Addis Water", country: "Ethiopia" },
  
  // Asia
  { lat: 34.5553, lon: 69.2075, label: "Kabul Water", country: "Afghanistan" },
  { lat: 33.6844, lon: 73.0479, label: "Islamabad Water", country: "Pakistan" },
  { lat: 24.8607, lon: 67.0011, label: "Karachi Water", country: "Pakistan" },
  
  // Europe
  { lat: 37.9838, lon: 23.7275, label: "Athens Water", country: "Greece" },
  { lat: 41.0082, lon: 28.9784, label: "Istanbul Water", country: "Turkey" },
]

/**
 * Global Border Checkpoints
 * Replace with real border crossing data in production
 */
export const GLOBAL_BORDER_CHECKPOINTS: LayerPoint[] = [
  // Middle East borders
  { lat: 33.0, lon: 35.8, label: "Syria-Lebanon", country: "Border" },
  { lat: 32.5, lon: 35.9, label: "Jordan-Syria", country: "Border" },
  { lat: 31.5, lon: 35.2, label: "Israel-Jordan", country: "Border" },
  { lat: 36.8, lon: 37.0, label: "Syria-Turkey", country: "Border" },
  
  // Europe borders
  { lat: 41.0, lon: 28.0, label: "Turkey-Greece", country: "Border" },
  { lat: 46.0, lon: 14.5, label: "Slovenia-Croatia", country: "Border" },
  { lat: 47.0, lon: 8.5, label: "Switzerland-Austria", country: "Border" },
  
  // Asia borders
  { lat: 34.0, lon: 71.0, label: "Afghanistan-Pakistan", country: "Border" },
  { lat: 31.0, lon: 74.0, label: "India-Pakistan", country: "Border" },
  
  // Africa borders
  { lat: 15.0, lon: 32.0, label: "Sudan-Ethiopia", country: "Border" },
  { lat: 3.0, lon: 35.0, label: "Kenya-South Sudan", country: "Border" },
]

/**
 * Get all points for a specific layer type
 */
export function getLayerPoints(layerType: string): LayerPoint[] {
  switch (layerType) {
    case "safe_zones":
      return GLOBAL_SAFE_ZONES
    case "conflict_zones":
      return GLOBAL_CONFLICT_ZONES
    case "water_points":
      return GLOBAL_WATER_POINTS
    case "checkpoints":
      return GLOBAL_BORDER_CHECKPOINTS
    default:
      return []
  }
}

/**
 * Get points within bounds (for filtering visible points)
 */
export function getPointsInBounds(
  points: LayerPoint[],
  bounds: { minLat: number; maxLat: number; minLon: number; maxLon: number },
  padding: number = 5,
): LayerPoint[] {
  return points.filter(
    (point) =>
      point.lat >= bounds.minLat - padding &&
      point.lat <= bounds.maxLat + padding &&
      point.lon >= bounds.minLon - padding &&
      point.lon <= bounds.maxLon + padding,
  )
}


