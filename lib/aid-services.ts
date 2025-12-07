// Aid Services Directory - Shelters, Hospitals, Food Distribution, Legal Help

export interface AidService {
  name: string
  type: "shelter" | "hospital" | "food" | "legal" | "education" | "other"
  location: string
  country: string
  coordinates?: { lat: number; lon: number }
  contact: string
  services: string[]
  hours?: string
  notes?: string
}

export const AID_SERVICES: AidService[] = [
  // Shelters
  {
    name: "UNHCR Refugee Camp",
    type: "shelter",
    location: "Zaatari Refugee Camp",
    country: "Jordan",
    coordinates: { lat: 32.2833, lon: 36.3167 },
    contact: "UNHCR Jordan Office",
    services: ["Shelter", "Food", "Healthcare", "Education"],
    notes: "Largest refugee camp in Jordan",
  },
  {
    name: "Kakuma Refugee Camp",
    type: "shelter",
    location: "Kakuma",
    country: "Kenya",
    coordinates: { lat: 3.4025, lon: 35.3075 },
    contact: "UNHCR Kenya Office",
    services: ["Shelter", "Food", "Healthcare", "Education"],
  },
  {
    name: "Dadaab Refugee Camp",
    type: "shelter",
    location: "Dadaab",
    country: "Kenya",
    coordinates: { lat: 0.3031, lon: 40.3295 },
    contact: "UNHCR Kenya Office",
    services: ["Shelter", "Food", "Healthcare"],
  },
  
  // Hospitals
  {
    name: "MSF Hospital",
    type: "hospital",
    location: "Various locations",
    country: "Global",
    contact: "Local MSF office",
    services: ["Emergency care", "Surgery", "Maternal health", "Mental health"],
  },
  {
    name: "Red Cross Hospital",
    type: "hospital",
    location: "Various locations",
    country: "Global",
    contact: "Local Red Cross/Red Crescent",
    services: ["Emergency care", "Primary healthcare"],
  },
  
  // Food Distribution
  {
    name: "WFP Food Distribution Point",
    type: "food",
    location: "Various locations",
    country: "Global",
    contact: "Local WFP office",
    services: ["Food rations", "Cash for food"],
  },
  {
    name: "Red Cross Food Distribution",
    type: "food",
    location: "Various locations",
    country: "Global",
    contact: "Local Red Cross office",
    services: ["Emergency food", "Food vouchers"],
  },
  
  // Legal Help
  {
    name: "NRC Legal Assistance",
    type: "legal",
    location: "Various locations",
    country: "Global",
    contact: "Local NRC office",
    services: ["Legal counseling", "Documentation", "Asylum support"],
  },
  {
    name: "DRC Legal Aid",
    type: "legal",
    location: "Various locations",
    country: "Global",
    contact: "Local DRC office",
    services: ["Legal assistance", "Protection services"],
  },
  {
    name: "UNHCR Legal Unit",
    type: "legal",
    location: "Various locations",
    country: "Global",
    contact: "Local UNHCR office",
    services: ["Refugee status determination", "Legal counseling"],
  },
]

export function searchAidServices(
  query: string,
  country?: string,
  type?: AidService["type"],
): AidService[] {
  const lowerQuery = query.toLowerCase()
  return AID_SERVICES.filter((service) => {
    const matchesQuery =
      service.name.toLowerCase().includes(lowerQuery) ||
      service.location.toLowerCase().includes(lowerQuery) ||
      service.services.some((s) => s.toLowerCase().includes(lowerQuery))
    
    const matchesCountry =
      !country ||
      service.country === "Global" ||
      service.country.toLowerCase().includes(country.toLowerCase())
    
    const matchesType = !type || service.type === type
    
    return matchesQuery && matchesCountry && matchesType
  })
}

