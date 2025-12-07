// Country danger levels for route analysis
export interface CountryDangerLevel {
  level: "low" | "medium" | "high" | "critical"
  reason?: string
}

export const COUNTRY_DANGER_LEVELS: Record<string, CountryDangerLevel> = {
  // High conflict zones
  Syria: { level: "critical", reason: "Active conflict zones, military operations" },
  Ukraine: { level: "critical", reason: "Active war zone, military conflict" },
  Yemen: { level: "critical", reason: "Ongoing conflict, humanitarian crisis" },
  Afghanistan: { level: "high", reason: "Security concerns, unstable regions" },
  Iraq: { level: "high", reason: "Security risks in certain areas" },
  Sudan: { level: "critical", reason: "Active conflict, civil unrest" },
  "South Sudan": { level: "high", reason: "Intermittent conflict" },
  Somalia: { level: "high", reason: "Security concerns" },
  "Central African Republic": { level: "high", reason: "Ongoing conflict" },
  "Democratic Republic of the Congo": { level: "high", reason: "Eastern regions have conflict" },
  Libya: { level: "high", reason: "Political instability" },
  Mali: { level: "high", reason: "Security concerns in northern regions" },
  Niger: { level: "medium", reason: "Border security concerns" },
  "Burkina Faso": { level: "high", reason: "Security concerns" },
  Myanmar: { level: "high", reason: "Political instability, conflict" },
  Palestine: { level: "high", reason: "Conflict zones, checkpoints" },
  Israel: { level: "medium", reason: "Security concerns near borders" },
  
  // Medium risk countries
  Lebanon: { level: "medium", reason: "Political instability, border concerns" },
  Turkey: { level: "low", reason: "Generally safe, border regions may have concerns" },
  Jordan: { level: "low", reason: "Generally stable" },
  Egypt: { level: "medium", reason: "Sinai region has security concerns" },
  Pakistan: { level: "medium", reason: "Border regions have security concerns" },
  Iran: { level: "medium", reason: "Political situation, border concerns" },
  Venezuela: { level: "medium", reason: "Economic crisis, political instability" },
  Colombia: { level: "medium", reason: "Some regions have security concerns" },
  Mexico: { level: "medium", reason: "Border regions have security concerns" },
  
  // Generally safe countries
  Poland: { level: "low", reason: "Safe for refugees" },
  Germany: { level: "low", reason: "Safe, refugee-friendly" },
  "United Kingdom": { level: "low", reason: "Safe" },
  USA: { level: "low", reason: "Safe" },
  Canada: { level: "low", reason: "Safe" },
  France: { level: "low", reason: "Safe" },
  Sweden: { level: "low", reason: "Safe, refugee-friendly" },
  Norway: { level: "low", reason: "Safe" },
  Greece: { level: "low", reason: "Safe, refugee-friendly" },
  Italy: { level: "low", reason: "Safe" },
  Spain: { level: "low", reason: "Safe" },
  UAE: { level: "low", reason: "Safe" },
  "Saudi Arabia": { level: "low", reason: "Safe" },
  Kuwait: { level: "low", reason: "Safe" },
  Qatar: { level: "low", reason: "Safe" },
  Kenya: { level: "low", reason: "Safe, refugee camps available" },
  Uganda: { level: "low", reason: "Safe, refugee-friendly" },
  Ethiopia: { level: "medium", reason: "Some regions have concerns" },
  Tanzania: { level: "low", reason: "Safe" },
  Rwanda: { level: "low", reason: "Safe" },
}

export function getCountryDangerLevel(countryName: string): CountryDangerLevel | null {
  // Try exact match first
  if (COUNTRY_DANGER_LEVELS[countryName]) {
    return COUNTRY_DANGER_LEVELS[countryName]
  }
  
  // Try case-insensitive match
  const normalized = countryName.trim()
  for (const [key, value] of Object.entries(COUNTRY_DANGER_LEVELS)) {
    if (key.toLowerCase() === normalized.toLowerCase()) {
      return value
    }
  }
  
  // Try partial match
  for (const [key, value] of Object.entries(COUNTRY_DANGER_LEVELS)) {
    if (normalized.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(normalized.toLowerCase())) {
      return value
    }
  }
  
  return null
}

export function getDangerLevelForCoordinates(lat: number, lon: number): CountryDangerLevel | null {
  // This is a simplified version - in production, you'd use reverse geocoding
  // to get the country name from coordinates, then look it up
  // For now, return null and let the route engine handle it
  return null
}

