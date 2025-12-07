export interface LayerPoint {
  lat: number
  lon: number
  label?: string
  country?: string
  metadata?: Record<string, any>
}

export const GLOBAL_SAFE_ZONES: LayerPoint[] = [
  { lat: 31.9539, lon: 35.9106, label: "Zaatari Camp", country: "Jordan" },
  { lat: 33.8547, lon: 35.5018, label: "UNHCR Lebanon", country: "Lebanon" },
  { lat: 36.2021, lon: 37.1343, label: "Aleppo Safe Zone", country: "Syria" },
  { lat: 32.0853, lon: 34.7818, label: "Tel Aviv Center", country: "Israel" },
  { lat: 31.7683, lon: 35.2137, label: "Jerusalem Center", country: "Israel" },
  { lat: 29.5581, lon: 34.9482, label: "Eilat Safe Zone", country: "Israel" },
  { lat: 3.4025, lon: 35.3075, label: "Kakuma Camp", country: "Kenya" },
  { lat: 0.3031, lon: 40.3295, label: "Dadaab Camp", country: "Kenya" },
  { lat: 15.5007, lon: 32.5599, label: "Khartoum Safe Area", country: "Sudan" },
  { lat: 4.3276, lon: 15.3136, label: "Kinshasa Safe Zone", country: "DRC" },
  { lat: 9.032, lon: 38.7469, label: "Addis Ababa Center", country: "Ethiopia" },
  { lat: 6.5244, lon: 3.3792, label: "Lagos Safe Zone", country: "Nigeria" },
  { lat: -1.2921, lon: 36.8219, label: "Nairobi Center", country: "Kenya" },
  { lat: -33.9249, lon: 18.4241, label: "Cape Town Center", country: "South Africa" },
  { lat: 30.0444, lon: 31.2357, label: "Cairo Safe Zone", country: "Egypt" },
  { lat: 36.8065, lon: 10.1815, label: "Tunis Center", country: "Tunisia" },
  { lat: 34.5553, lon: 69.2075, label: "Kabul Safe Zone", country: "Afghanistan" },
  { lat: 33.6844, lon: 73.0479, label: "Islamabad Camp", country: "Pakistan" },
  { lat: 24.8607, lon: 67.0011, label: "Karachi Safe Area", country: "Pakistan" },
  { lat: 31.5497, lon: 74.3436, label: "Lahore Center", country: "Pakistan" },
  { lat: 28.6139, lon: 77.2090, label: "New Delhi Center", country: "India" },
  { lat: 23.8103, lon: 90.4125, label: "Dhaka Safe Zone", country: "Bangladesh" },
  { lat: 16.8661, lon: 96.1951, label: "Yangon Center", country: "Myanmar" },
  { lat: 13.7563, lon: 100.5018, label: "Bangkok Center", country: "Thailand" },
  { lat: 1.3521, lon: 103.8198, label: "Singapore Center", country: "Singapore" },
  { lat: 35.6762, lon: 139.6503, label: "Tokyo Center", country: "Japan" },
  { lat: 37.5665, lon: 126.9780, label: "Seoul Center", country: "South Korea" },
  { lat: 37.9838, lon: 23.7275, label: "Athens Reception", country: "Greece" },
  { lat: 39.2, lon: 26.1, label: "Lesbos Camp", country: "Greece" },
  { lat: 41.0082, lon: 28.9784, label: "Istanbul Center", country: "Turkey" },
  { lat: 39.9334, lon: 32.8597, label: "Ankara Center", country: "Turkey" },
  { lat: 52.5200, lon: 13.4050, label: "Berlin Center", country: "Germany" },
  { lat: 48.8566, lon: 2.3522, label: "Paris Center", country: "France" },
  { lat: 51.5074, lon: -0.1278, label: "London Center", country: "UK" },
  { lat: 40.4168, lon: -3.7038, label: "Madrid Center", country: "Spain" },
  { lat: 41.9028, lon: 12.4964, label: "Rome Center", country: "Italy" },
  { lat: 50.0755, lon: 14.4378, label: "Prague Center", country: "Czech Republic" },
  { lat: 52.2297, lon: 21.0122, label: "Warsaw Center", country: "Poland" },
  { lat: 50.4501, lon: 30.5234, label: "Kyiv Safe Zone", country: "Ukraine" },
  { lat: 49.8397, lon: 24.0297, label: "Lviv Safe Zone", country: "Ukraine" },
  { lat: 4.7110, lon: -74.0721, label: "Bogota Center", country: "Colombia" },
  { lat: 19.4326, lon: -99.1332, label: "Mexico City Center", country: "Mexico" },
  { lat: -12.0464, lon: -77.0428, label: "Lima Center", country: "Peru" },
  { lat: -34.6037, lon: -58.3816, label: "Buenos Aires Center", country: "Argentina" },
  { lat: -23.5505, lon: -46.6333, label: "Sao Paulo Center", country: "Brazil" },
  { lat: 40.7128, lon: -74.0060, label: "New York Center", country: "USA" },
  { lat: 34.0522, lon: -118.2437, label: "Los Angeles Center", country: "USA" },
  { lat: 25.7617, lon: -80.1918, label: "Miami Center", country: "USA" },
]

export const GLOBAL_CONFLICT_ZONES: LayerPoint[] = [
  { lat: 33.5138, lon: 36.2765, label: "Damascus Conflict", country: "Syria" },
  { lat: 35.9310, lon: 38.9910, label: "Raqqa Conflict", country: "Syria" },
  { lat: 34.8021, lon: 38.9968, label: "Deir ez-Zor", country: "Syria" },
  { lat: 31.5017, lon: 34.4668, label: "Gaza Conflict", country: "Palestine" },
  { lat: 31.7329, lon: 35.0323, label: "West Bank Tension", country: "Palestine" },
  { lat: 33.3128, lon: 44.3615, label: "Baghdad Zone", country: "Iraq" },
  { lat: 36.3566, lon: 43.1596, label: "Mosul Zone", country: "Iraq" },
  { lat: 30.5079, lon: 47.7835, label: "Basra Zone", country: "Iraq" },
  { lat: 15.5007, lon: 32.5599, label: "Khartoum Conflict", country: "Sudan" },
  { lat: 13.5, lon: 25.0, label: "Darfur Conflict", country: "Sudan" },
  { lat: 12.8628, lon: 30.2176, label: "South Kordofan", country: "Sudan" },
  { lat: 1.6956, lon: 29.2201, label: "Goma Conflict", country: "DRC" },
  { lat: 0.4162, lon: 25.4340, label: "Kisangani Conflict", country: "DRC" },
  { lat: -5.9669, lon: 22.9581, label: "Kasai Conflict", country: "DRC" },
  { lat: 34.5553, lon: 69.2075, label: "Kabul Conflict", country: "Afghanistan" },
  { lat: 31.6257, lon: 65.7101, label: "Kandahar Conflict", country: "Afghanistan" },
  { lat: 36.7069, lon: 67.1147, label: "Mazar-i-Sharif", country: "Afghanistan" },
  { lat: 34.4212, lon: 62.1721, label: "Herat Conflict", country: "Afghanistan" },
  { lat: 15.3694, lon: 48.2219, label: "Sanaa Conflict", country: "Yemen" },
  { lat: 12.7855, lon: 45.0366, label: "Aden Conflict", country: "Yemen" },
  { lat: 16.0000, lon: 44.0000, label: "Marib Conflict", country: "Yemen" },
  { lat: 48.3794, lon: 31.1656, label: "Central Ukraine", country: "Ukraine" },
  { lat: 47.8388, lon: 35.1396, label: "Zaporizhzhia Zone", country: "Ukraine" },
  { lat: 48.0159, lon: 37.8028, label: "Donetsk Conflict", country: "Ukraine" },
  { lat: 48.5679, lon: 39.3174, label: "Luhansk Conflict", country: "Ukraine" },
  { lat: 46.4825, lon: 30.7233, label: "Odesa Zone", country: "Ukraine" },
  { lat: 46.6354, lon: 32.6178, label: "Kherson Zone", country: "Ukraine" },
  { lat: 2.0469, lon: 45.3182, label: "Mogadishu Conflict", country: "Somalia" },
  { lat: 9.0320, lon: 38.7469, label: "Tigray Conflict", country: "Ethiopia" },
  { lat: 11.5886, lon: 43.1456, label: "Djibouti Zone", country: "Djibouti" },
  { lat: 4.7110, lon: -74.0721, label: "Colombia Conflict", country: "Colombia" },
  { lat: 7.1255, lon: -73.1198, label: "Bucaramanga Zone", country: "Colombia" },
  { lat: 12.1150, lon: -86.2362, label: "Nicaragua Zone", country: "Nicaragua" },
  { lat: 10.4806, lon: -66.9036, label: "Caracas Zone", country: "Venezuela" },
  { lat: 16.8634, lon: 96.1951, label: "Myanmar Conflict", country: "Myanmar" },
  { lat: 21.9162, lon: 95.9560, label: "Mandalay Zone", country: "Myanmar" },
  { lat: 6.9271, lon: 79.8612, label: "Sri Lanka Zone", country: "Sri Lanka" },
]

export const GLOBAL_WATER_POINTS: LayerPoint[] = [
  { lat: 31.9539, lon: 35.9106, label: "Jordan Water Point", country: "Jordan" },
  { lat: 33.8547, lon: 35.5018, label: "Beirut Water", country: "Lebanon" },
  { lat: 36.2021, lon: 37.1343, label: "Aleppo Water", country: "Syria" },
  { lat: 31.5017, lon: 34.4668, label: "Gaza Water", country: "Palestine" },
  { lat: 32.0853, lon: 34.7818, label: "Tel Aviv Water", country: "Israel" },
  { lat: 31.7683, lon: 35.2137, label: "Jerusalem Water", country: "Israel" },
  { lat: 3.4025, lon: 35.3075, label: "Kakuma Water", country: "Kenya" },
  { lat: 15.5007, lon: 32.5599, label: "Nile Water Point", country: "Sudan" },
  { lat: 9.032, lon: 38.7469, label: "Addis Water", country: "Ethiopia" },
  { lat: -1.2921, lon: 36.8219, label: "Nairobi Water", country: "Kenya" },
  { lat: 30.0444, lon: 31.2357, label: "Cairo Water", country: "Egypt" },
  { lat: 6.5244, lon: 3.3792, label: "Lagos Water", country: "Nigeria" },
  { lat: 34.5553, lon: 69.2075, label: "Kabul Water", country: "Afghanistan" },
  { lat: 33.6844, lon: 73.0479, label: "Islamabad Water", country: "Pakistan" },
  { lat: 24.8607, lon: 67.0011, label: "Karachi Water", country: "Pakistan" },
  { lat: 31.5497, lon: 74.3436, label: "Lahore Water", country: "Pakistan" },
  { lat: 28.6139, lon: 77.2090, label: "Delhi Water", country: "India" },
  { lat: 23.8103, lon: 90.4125, label: "Dhaka Water", country: "Bangladesh" },
  { lat: 13.7563, lon: 100.5018, label: "Bangkok Water", country: "Thailand" },
  { lat: 37.9838, lon: 23.7275, label: "Athens Water", country: "Greece" },
  { lat: 41.0082, lon: 28.9784, label: "Istanbul Water", country: "Turkey" },
  { lat: 39.9334, lon: 32.8597, label: "Ankara Water", country: "Turkey" },
  { lat: 50.4501, lon: 30.5234, label: "Kyiv Water", country: "Ukraine" },
  { lat: 49.8397, lon: 24.0297, label: "Lviv Water", country: "Ukraine" },
  { lat: 52.5200, lon: 13.4050, label: "Berlin Water", country: "Germany" },
  { lat: 48.8566, lon: 2.3522, label: "Paris Water", country: "France" },
  { lat: 4.7110, lon: -74.0721, label: "Bogota Water", country: "Colombia" },
  { lat: 19.4326, lon: -99.1332, label: "Mexico City Water", country: "Mexico" },
  { lat: -12.0464, lon: -77.0428, label: "Lima Water", country: "Peru" },
  { lat: -23.5505, lon: -46.6333, label: "Sao Paulo Water", country: "Brazil" },
  { lat: 36.8065, lon: 10.1815, label: "Tunis Water", country: "Tunisia" },
  { lat: 33.8869, lon: 9.5375, label: "Libya Water", country: "Libya" },
  { lat: 15.3694, lon: 48.2219, label: "Yemen Water", country: "Yemen" },
  { lat: 2.0469, lon: 45.3182, label: "Mogadishu Water", country: "Somalia" },
]

export const GLOBAL_BORDER_CHECKPOINTS: LayerPoint[] = [
  { lat: 33.0, lon: 35.8, label: "Syria-Lebanon", country: "Border" },
  { lat: 32.5, lon: 35.9, label: "Jordan-Syria", country: "Border" },
  { lat: 31.5, lon: 35.2, label: "Israel-Jordan", country: "Border" },
  { lat: 36.8, lon: 37.0, label: "Syria-Turkey", country: "Border" },
  { lat: 31.2, lon: 34.3, label: "Israel-Egypt", country: "Border" },
  { lat: 29.5, lon: 35.0, label: "Jordan-Saudi", country: "Border" },
  { lat: 41.0, lon: 28.0, label: "Turkey-Greece", country: "Border" },
  { lat: 41.5, lon: 26.5, label: "Turkey-Bulgaria", country: "Border" },
  { lat: 46.0, lon: 14.5, label: "Slovenia-Croatia", country: "Border" },
  { lat: 47.0, lon: 8.5, label: "Switzerland-Austria", country: "Border" },
  { lat: 45.8, lon: 16.0, label: "Croatia-Hungary", country: "Border" },
  { lat: 48.0, lon: 17.0, label: "Austria-Slovakia", country: "Border" },
  { lat: 50.0, lon: 14.5, label: "Czech-Germany", country: "Border" },
  { lat: 51.5, lon: 23.5, label: "Poland-Ukraine", country: "Border" },
  { lat: 49.5, lon: 23.0, label: "Ukraine-Poland", country: "Border" },
  { lat: 48.5, lon: 22.5, label: "Ukraine-Slovakia", country: "Border" },
  { lat: 48.0, lon: 24.5, label: "Ukraine-Hungary", country: "Border" },
  { lat: 47.5, lon: 26.5, label: "Ukraine-Romania", country: "Border" },
  { lat: 34.0, lon: 71.0, label: "Afghanistan-Pakistan", country: "Border" },
  { lat: 31.0, lon: 74.0, label: "India-Pakistan", country: "Border" },
  { lat: 26.9, lon: 75.8, label: "India-Pakistan (Rajasthan)", country: "Border" },
  { lat: 28.6, lon: 70.0, label: "Pakistan-Iran", country: "Border" },
  { lat: 37.0, lon: 68.0, label: "Afghanistan-Tajikistan", country: "Border" },
  { lat: 36.5, lon: 61.5, label: "Afghanistan-Iran", country: "Border" },
  { lat: 15.0, lon: 32.0, label: "Sudan-Ethiopia", country: "Border" },
  { lat: 3.0, lon: 35.0, label: "Kenya-South Sudan", country: "Border" },
  { lat: 4.0, lon: 32.5, label: "Uganda-South Sudan", country: "Border" },
  { lat: 0.0, lon: 29.5, label: "DRC-Uganda", country: "Border" },
  { lat: -1.5, lon: 29.0, label: "DRC-Rwanda", country: "Border" },
  { lat: 25.5, lon: -100.0, label: "Mexico-USA", country: "Border" },
  { lat: 31.3, lon: -110.9, label: "Mexico-USA (Arizona)", country: "Border" },
  { lat: 32.5, lon: -117.0, label: "Mexico-USA (California)", country: "Border" },
  { lat: 7.5, lon: -77.5, label: "Colombia-Panama", country: "Border" },
  { lat: 0.0, lon: -78.0, label: "Colombia-Ecuador", country: "Border" },
  { lat: 10.0, lon: -73.0, label: "Colombia-Venezuela", country: "Border" },
  { lat: 20.5, lon: 97.0, label: "Myanmar-Thailand", country: "Border" },
  { lat: 23.5, lon: 88.5, label: "Bangladesh-India", country: "Border" },
  { lat: 26.8, lon: 88.4, label: "Nepal-India", country: "Border" },
]

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

export function getPointsInBounds(
  points: LayerPoint[],
  bounds: { minLat: number; maxLat: number; minLon: number; maxLon: number },
  padding: number = 10,
): LayerPoint[] {
  return points.filter(
    (point) =>
      point.lat >= bounds.minLat - padding &&
      point.lat <= bounds.maxLat + padding &&
      point.lon >= bounds.minLon - padding &&
      point.lon <= bounds.maxLon + padding,
  )
}
