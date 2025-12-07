// Map tile layer configurations
export interface MapLayer {
  id: string
  name: string
  url: string
  attribution: string
  maxZoom: number
}

/**
 * Available map tile layers
 */
export const MAP_LAYERS: MapLayer[] = [
  {
    id: "osm",
    name: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  {
    id: "satellite",
    name: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
    maxZoom: 19,
  },
  {
    id: "terrain",
    name: "Terrain",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
    maxZoom: 17,
  },
  {
    id: "humanitarian",
    name: "Humanitarian",
    url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> & HOT',
    maxZoom: 19,
  },
]

/**
 * Get map layer by ID
 */
export function getMapLayer(layerId: string): MapLayer | undefined {
  return MAP_LAYERS.find((layer) => layer.id === layerId)
}

/**
 * Render map tile as image (for canvas-based maps)
 */
export async function loadMapTile(
  layer: MapLayer,
  x: number,
  y: number,
  z: number,
): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const url = layer.url
      .replace("{s}", "a") // Use subdomain 'a'
      .replace("{z}", z.toString())
      .replace("{x}", x.toString())
      .replace("{y}", y.toString())

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = url
  })
}


