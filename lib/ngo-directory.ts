// Global NGO Directory

export interface NGO {
  name: string
  type: "international" | "national" | "local"
  services: string[]
  countries: string[]
  contact: string
  website?: string
  email?: string
  phone?: string
  notes?: string
}

export const NGO_DIRECTORY: NGO[] = [
  {
    name: "UNHCR - UN Refugee Agency",
    type: "international",
    services: ["Registration", "Legal assistance", "Cash assistance", "Shelter", "Education", "Healthcare"],
    countries: ["Global"],
    contact: "Contact local UNHCR office",
    website: "https://www.unhcr.org",
    notes: "Primary UN agency for refugees",
  },
  {
    name: "International Committee of the Red Cross",
    type: "international",
    services: ["Emergency relief", "Medical care", "Family reunification", "Protection"],
    countries: ["Global"],
    contact: "Local ICRC office",
    website: "https://www.icrc.org",
  },
  {
    name: "Médecins Sans Frontières (MSF)",
    type: "international",
    services: ["Medical care", "Emergency healthcare", "Mental health"],
    countries: ["Global"],
    contact: "Local MSF office",
    website: "https://www.msf.org",
  },
  {
    name: "Save the Children",
    type: "international",
    services: ["Child protection", "Education", "Healthcare", "Emergency relief"],
    countries: ["Global"],
    contact: "Local Save the Children office",
    website: "https://www.savethechildren.org",
  },
  {
    name: "Oxfam",
    type: "international",
    services: ["Water and sanitation", "Food security", "Cash assistance", "Protection"],
    countries: ["Global"],
    contact: "Local Oxfam office",
    website: "https://www.oxfam.org",
  },
  {
    name: "World Food Programme",
    type: "international",
    services: ["Food assistance", "Cash transfers", "Nutrition programs"],
    countries: ["Global"],
    contact: "Local WFP office",
    website: "https://www.wfp.org",
  },
  {
    name: "UNICEF",
    type: "international",
    services: ["Child protection", "Education", "Healthcare", "Water and sanitation"],
    countries: ["Global"],
    contact: "Local UNICEF office",
    website: "https://www.unicef.org",
  },
  {
    name: "CARE International",
    type: "international",
    services: ["Emergency relief", "Food security", "Shelter", "Protection"],
    countries: ["Global"],
    contact: "Local CARE office",
    website: "https://www.care.org",
  },
  {
    name: "Mercy Corps",
    type: "international",
    services: ["Cash assistance", "Livelihoods", "Emergency relief"],
    countries: ["Global"],
    contact: "Local Mercy Corps office",
    website: "https://www.mercycorps.org",
  },
  {
    name: "Norwegian Refugee Council",
    type: "international",
    services: ["Legal assistance", "Education", "Shelter", "Cash assistance"],
    countries: ["Global"],
    contact: "Local NRC office",
    website: "https://www.nrc.no",
  },
  {
    name: "Danish Refugee Council",
    type: "international",
    services: ["Protection", "Legal assistance", "Livelihoods", "Shelter"],
    countries: ["Global"],
    contact: "Local DRC office",
    website: "https://drc.ngo",
  },
  {
    name: "International Rescue Committee",
    type: "international",
    services: ["Healthcare", "Education", "Economic recovery", "Safety"],
    countries: ["Global"],
    contact: "Local IRC office",
    website: "https://www.rescue.org",
  },
  {
    name: "Action Against Hunger",
    type: "international",
    services: ["Nutrition", "Food security", "Water and sanitation"],
    countries: ["Global"],
    contact: "Local ACF office",
    website: "https://www.actionagainsthunger.org",
  },
  {
    name: "Islamic Relief",
    type: "international",
    services: ["Emergency relief", "Food security", "Healthcare", "Education"],
    countries: ["Global"],
    contact: "Local Islamic Relief office",
    website: "https://www.islamic-relief.org",
  },
  {
    name: "World Vision",
    type: "international",
    services: ["Child protection", "Education", "Healthcare", "Emergency relief"],
    countries: ["Global"],
    contact: "Local World Vision office",
    website: "https://www.wvi.org",
  },
]

export function searchNGOs(query: string, country?: string, service?: string): NGO[] {
  const lowerQuery = query.toLowerCase()
  return NGO_DIRECTORY.filter((ngo) => {
    const matchesQuery =
      ngo.name.toLowerCase().includes(lowerQuery) ||
      ngo.services.some((s) => s.toLowerCase().includes(lowerQuery))
    
    const matchesCountry =
      !country ||
      ngo.countries.includes("Global") ||
      ngo.countries.some((c) => c.toLowerCase().includes(country.toLowerCase()))
    
    const matchesService =
      !service ||
      ngo.services.some((s) => s.toLowerCase().includes(service.toLowerCase()))
    
    return matchesQuery && matchesCountry && matchesService
  })
}

