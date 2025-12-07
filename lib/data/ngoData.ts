import type { NGO } from "@/types"

export const NGO_LIST: NGO[] = [
  {
    id: "ngo-1",
    name: "Doctors Without Borders",
    description: "International medical humanitarian organization providing emergency medical care",
    services: ["Medical Care", "Emergency Response", "Vaccinations", "Mental Health"],
    contact: {
      phone: "+1-888-392-0392",
      email: "info@msf.org",
      website: "https://www.msf.org"
    },
    location: { lat: 48.8566, lon: 2.3522, label: "Paris HQ", country: "France" },
    operatingHours: "24/7 Emergency"
  },
  {
    id: "ngo-2",
    name: "International Rescue Committee",
    description: "Responds to humanitarian crises and helps people survive and rebuild",
    services: ["Refugee Resettlement", "Education", "Economic Empowerment", "Health"],
    contact: {
      phone: "+1-212-551-3000",
      email: "info@rescue.org",
      website: "https://www.rescue.org"
    },
    location: { lat: 40.7128, lon: -74.0060, label: "New York HQ", country: "USA" },
    operatingHours: "Mon-Fri 9AM-6PM"
  },
  {
    id: "ngo-3",
    name: "Save the Children",
    description: "Works to improve children's lives through education, health care, and protection",
    services: ["Child Protection", "Education", "Health", "Emergency Response"],
    contact: {
      phone: "+1-800-728-3843",
      email: "info@savechildren.org",
      website: "https://www.savethechildren.org"
    },
    location: { lat: 51.5074, lon: -0.1278, label: "London HQ", country: "UK" },
    operatingHours: "Mon-Fri 8AM-5PM"
  },
  {
    id: "ngo-4",
    name: "CARE International",
    description: "Fights global poverty and provides disaster relief",
    services: ["Food Security", "Water & Sanitation", "Economic Development", "Education"],
    contact: {
      phone: "+1-800-521-2273",
      email: "info@care.org",
      website: "https://www.care.org"
    },
    location: { lat: 50.8503, lon: 4.3517, label: "Brussels", country: "Belgium" },
    operatingHours: "Mon-Fri 9AM-5PM"
  },
  {
    id: "ngo-5",
    name: "Mercy Corps",
    description: "Global humanitarian aid and development organization",
    services: ["Emergency Relief", "Economic Opportunity", "Food Security", "Conflict Management"],
    contact: {
      phone: "+1-888-256-1900",
      email: "info@mercycorps.org",
      website: "https://www.mercycorps.org"
    },
    location: { lat: 45.5231, lon: -122.6765, label: "Portland HQ", country: "USA" },
    operatingHours: "Mon-Fri 8AM-5PM"
  },
  {
    id: "ngo-6",
    name: "Oxfam International",
    description: "Works to end poverty and injustice worldwide",
    services: ["Humanitarian Aid", "Water & Sanitation", "Gender Justice", "Climate Action"],
    contact: {
      phone: "+254-20-2820000",
      email: "info@oxfam.org",
      website: "https://www.oxfam.org"
    },
    location: { lat: -1.2921, lon: 36.8219, label: "Nairobi", country: "Kenya" },
    operatingHours: "Mon-Fri 8AM-5PM"
  },
  {
    id: "ngo-7",
    name: "World Vision",
    description: "Christian humanitarian organization helping children and families",
    services: ["Child Sponsorship", "Disaster Relief", "Clean Water", "Health"],
    contact: {
      phone: "+1-888-511-6548",
      email: "info@worldvision.org",
      website: "https://www.worldvision.org"
    },
    location: { lat: 47.6062, lon: -122.3321, label: "Seattle HQ", country: "USA" },
    operatingHours: "Mon-Fri 8AM-5PM"
  },
  {
    id: "ngo-8",
    name: "Norwegian Refugee Council",
    description: "Independent humanitarian organization helping displaced people",
    services: ["Legal Aid", "Shelter", "Education", "Food Security"],
    contact: {
      phone: "+47-23-10-98-00",
      email: "nrc@nrc.no",
      website: "https://www.nrc.no"
    },
    location: { lat: 59.9139, lon: 10.7522, label: "Oslo HQ", country: "Norway" },
    operatingHours: "Mon-Fri 8AM-4PM"
  },
  {
    id: "ngo-9",
    name: "Danish Refugee Council",
    description: "Humanitarian organization working with refugees and displaced people",
    services: ["Protection", "Economic Recovery", "Humanitarian Disarmament"],
    contact: {
      phone: "+45-33-73-50-00",
      email: "drc@drc.ngo",
      website: "https://drc.ngo"
    },
    location: { lat: 55.6761, lon: 12.5683, label: "Copenhagen HQ", country: "Denmark" },
    operatingHours: "Mon-Fri 9AM-5PM"
  },
  {
    id: "ngo-10",
    name: "Islamic Relief",
    description: "Faith-inspired humanitarian and development organization",
    services: ["Emergency Relief", "Orphan Support", "Water & Sanitation", "Education"],
    contact: {
      phone: "+44-121-605-5555",
      email: "info@islamic-relief.org",
      website: "https://www.islamic-relief.org"
    },
    location: { lat: 52.4862, lon: -1.8904, label: "Birmingham HQ", country: "UK" },
    operatingHours: "Mon-Fri 9AM-5PM"
  },
  {
    id: "ngo-11",
    name: "Caritas International",
    description: "Catholic relief and development organization",
    services: ["Emergency Response", "Peacebuilding", "Migration Support", "Health"],
    contact: {
      email: "caritas@caritas.va",
      website: "https://www.caritas.org"
    },
    location: { lat: 41.9029, lon: 12.4534, label: "Vatican City", country: "Vatican" },
    operatingHours: "Mon-Fri 9AM-5PM"
  },
  {
    id: "ngo-12",
    name: "Action Against Hunger",
    description: "Global humanitarian organization fighting hunger",
    services: ["Nutrition", "Food Security", "Water & Sanitation", "Mental Health"],
    contact: {
      phone: "+1-212-967-7800",
      email: "info@actionagainsthunger.org",
      website: "https://www.actionagainsthunger.org"
    },
    location: { lat: 40.7484, lon: -73.9857, label: "New York", country: "USA" },
    operatingHours: "Mon-Fri 9AM-5PM"
  }
]

export function getNGOById(id: string): NGO | undefined {
  return NGO_LIST.find(ngo => ngo.id === id)
}

export function searchNGOs(query: string): NGO[] {
  const lowerQuery = query.toLowerCase()
  return NGO_LIST.filter(ngo =>
    ngo.name.toLowerCase().includes(lowerQuery) ||
    ngo.services.some(s => s.toLowerCase().includes(lowerQuery)) ||
    ngo.location.country?.toLowerCase().includes(lowerQuery)
  )
}
