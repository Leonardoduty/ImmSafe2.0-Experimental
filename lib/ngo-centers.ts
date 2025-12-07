// UN & NGO Help Centers locations
export interface HelpCenter {
  id: string
  name: string
  organization: string
  type: "unhcr" | "red_cross" | "msf" | "unicef" | "wfp" | "other"
  lat: number
  lon: number
  country: string
  services: string[]
  contact?: string
  website?: string
  notes?: string
}

/**
 * Global UN & NGO Help Centers
 */
export const HELP_CENTERS: HelpCenter[] = [
  // UNHCR Centers
  {
    id: "unhcr-1",
    name: "UNHCR Jordan Office",
    organization: "UNHCR",
    type: "unhcr",
    lat: 31.9539,
    lon: 35.9106,
    country: "Jordan",
    services: ["Registration", "Legal assistance", "Cash assistance", "Shelter"],
    contact: "+962 6 550 2400",
    website: "https://www.unhcr.org/jordan",
  },
  {
    id: "unhcr-2",
    name: "UNHCR Lebanon Office",
    organization: "UNHCR",
    type: "unhcr",
    lat: 33.8547,
    lon: 35.5018,
    country: "Lebanon",
    services: ["Registration", "Legal assistance", "Protection"],
    contact: "+961 1 849 201",
  },
  {
    id: "unhcr-3",
    name: "UNHCR Turkey Office",
    organization: "UNHCR",
    type: "unhcr",
    lat: 39.9334,
    lon: 32.8597,
    country: "Turkey",
    services: ["Registration", "Legal assistance", "Education"],
    contact: "+90 312 409 7000",
  },
  {
    id: "unhcr-4",
    name: "UNHCR Greece Office",
    organization: "UNHCR",
    type: "unhcr",
    lat: 37.9838,
    lon: 23.7275,
    country: "Greece",
    services: ["Registration", "Legal assistance", "Shelter"],
    contact: "+30 210 672 9000",
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
    services: ["Emergency relief", "Medical care", "Family reunification"],
    contact: "+962 6 569 1191",
  },
  {
    id: "rc-2",
    name: "Red Cross Lebanon",
    organization: "ICRC",
    type: "red_cross",
    lat: 33.8869,
    lon: 35.5131,
    country: "Lebanon",
    services: ["Emergency relief", "Medical care"],
    contact: "+961 1 739 297",
  },
  {
    id: "rc-3",
    name: "Red Cross Turkey",
    organization: "ICRC",
    type: "red_cross",
    lat: 41.0082,
    lon: 28.9784,
    country: "Turkey",
    services: ["Emergency relief", "Medical care"],
    contact: "+90 212 251 7500",
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
    services: ["Medical care", "Emergency healthcare", "Mental health"],
    contact: "+962 6 550 2400",
  },
  {
    id: "msf-2",
    name: "MSF Lebanon",
    organization: "MSF",
    type: "msf",
    lat: 33.8547,
    lon: 35.5018,
    country: "Lebanon",
    services: ["Medical care", "Emergency healthcare"],
    contact: "+961 1 749 100",
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
    services: ["Child protection", "Education", "Healthcare"],
    contact: "+962 6 550 2400",
  },
  {
    id: "unicef-2",
    name: "UNICEF Lebanon",
    organization: "UNICEF",
    type: "unicef",
    lat: 33.8869,
    lon: 35.5131,
    country: "Lebanon",
    services: ["Child protection", "Education"],
    contact: "+961 1 759 200",
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
    services: ["Food assistance", "Cash transfers"],
    contact: "+962 6 550 2400",
  },
  {
    id: "wfp-2",
    name: "WFP Lebanon",
    organization: "WFP",
    type: "wfp",
    lat: 33.8547,
    lon: 35.5018,
    country: "Lebanon",
    services: ["Food assistance", "Cash transfers"],
    contact: "+961 1 759 200",
  },
]

/**
 * Search help centers by location or service
 */
export function searchHelpCenters(
  query?: string,
  country?: string,
  service?: string,
): HelpCenter[] {
  return HELP_CENTERS.filter((center) => {
    const matchesQuery =
      !query ||
      center.name.toLowerCase().includes(query.toLowerCase()) ||
      center.organization.toLowerCase().includes(query.toLowerCase())
    
    const matchesCountry = !country || center.country.toLowerCase().includes(country.toLowerCase())
    
    const matchesService =
      !service || center.services.some((s) => s.toLowerCase().includes(service.toLowerCase()))
    
    return matchesQuery && matchesCountry && matchesService
  })
}

/**
 * Get help centers near coordinates
 */
export function getHelpCentersNearby(
  lat: number,
  lon: number,
  radiusKm: number = 100,
): HelpCenter[] {
  return HELP_CENTERS.filter((center) => {
    const distance = calculateDistance(lat, lon, center.lat, center.lon)
    return distance <= radiusKm
  })
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}


