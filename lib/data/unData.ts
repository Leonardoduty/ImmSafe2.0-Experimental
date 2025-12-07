import type { UNOffice } from "@/types"

export const UN_OFFICES: UNOffice[] = [
  {
    id: "un-1",
    name: "UNHCR Geneva",
    agency: "UNHCR",
    description: "UN Refugee Agency headquarters - global refugee protection and assistance",
    services: ["Refugee Protection", "Resettlement", "Legal Aid", "Documentation"],
    contact: {
      phone: "+41-22-739-8111",
      email: "hqgv@unhcr.org",
      website: "https://www.unhcr.org"
    },
    location: { lat: 46.2276, lon: 6.1432, label: "Geneva HQ", country: "Switzerland" },
    operatingHours: "Mon-Fri 8AM-5PM"
  },
  {
    id: "un-2",
    name: "UNICEF New York",
    agency: "UNICEF",
    description: "UN Children's Fund - child protection and welfare worldwide",
    services: ["Child Protection", "Education", "Health", "Nutrition"],
    contact: {
      phone: "+1-212-326-7000",
      email: "info@unicef.org",
      website: "https://www.unicef.org"
    },
    location: { lat: 40.7484, lon: -73.9683, label: "New York HQ", country: "USA" },
    operatingHours: "Mon-Fri 9AM-5PM"
  },
  {
    id: "un-3",
    name: "WFP Rome",
    agency: "WFP",
    description: "World Food Programme - combating hunger and food insecurity",
    services: ["Food Distribution", "Emergency Response", "Nutrition Support", "Logistics"],
    contact: {
      phone: "+39-06-6513-1",
      email: "wfpinfo@wfp.org",
      website: "https://www.wfp.org"
    },
    location: { lat: 41.8356, lon: 12.2853, label: "Rome HQ", country: "Italy" },
    operatingHours: "Mon-Fri 8:30AM-5PM"
  },
  {
    id: "un-4",
    name: "WHO Geneva",
    agency: "WHO",
    description: "World Health Organization - international public health",
    services: ["Health Emergencies", "Disease Prevention", "Medical Guidance", "Vaccination"],
    contact: {
      phone: "+41-22-791-2111",
      email: "info@who.int",
      website: "https://www.who.int"
    },
    location: { lat: 46.2329, lon: 6.1344, label: "Geneva HQ", country: "Switzerland" },
    operatingHours: "Mon-Fri 8AM-5PM"
  },
  {
    id: "un-5",
    name: "IOM Geneva",
    agency: "IOM",
    description: "International Organization for Migration - migration management",
    services: ["Migration Assistance", "Voluntary Return", "Counter-Trafficking", "Resettlement"],
    contact: {
      phone: "+41-22-717-9111",
      email: "hq@iom.int",
      website: "https://www.iom.int"
    },
    location: { lat: 46.2022, lon: 6.1434, label: "Geneva HQ", country: "Switzerland" },
    operatingHours: "Mon-Fri 8AM-5PM"
  },
  {
    id: "un-6",
    name: "UNHCR Jordan",
    agency: "UNHCR",
    description: "UNHCR Jordan office - Syrian refugee support",
    services: ["Refugee Registration", "Cash Assistance", "Legal Aid", "Resettlement"],
    contact: {
      phone: "+962-6-530-2500",
      email: "joran@unhcr.org",
      website: "https://www.unhcr.org/jordan"
    },
    location: { lat: 31.9539, lon: 35.9106, label: "Amman", country: "Jordan" },
    operatingHours: "Sun-Thu 8AM-4PM"
  },
  {
    id: "un-7",
    name: "UNHCR Lebanon",
    agency: "UNHCR",
    description: "UNHCR Lebanon office - refugee protection and assistance",
    services: ["Registration", "Protection", "Cash Assistance", "Education Support"],
    contact: {
      phone: "+961-1-849-201",
      email: "lebbd@unhcr.org",
      website: "https://www.unhcr.org/lebanon"
    },
    location: { lat: 33.8938, lon: 35.5018, label: "Beirut", country: "Lebanon" },
    operatingHours: "Mon-Fri 8AM-4PM"
  },
  {
    id: "un-8",
    name: "UNHCR Turkey",
    agency: "UNHCR",
    description: "UNHCR Turkey office - largest refugee population support",
    services: ["Protection", "Registration", "Resettlement", "Integration Support"],
    contact: {
      phone: "+90-312-409-7100",
      email: "turan@unhcr.org",
      website: "https://www.unhcr.org/turkey"
    },
    location: { lat: 39.9334, lon: 32.8597, label: "Ankara", country: "Turkey" },
    operatingHours: "Mon-Fri 9AM-5PM"
  },
  {
    id: "un-9",
    name: "UNHCR Kenya",
    agency: "UNHCR",
    description: "UNHCR Kenya office - East African refugee operations",
    services: ["Camp Management", "Protection", "Resettlement", "Livelihood Support"],
    contact: {
      phone: "+254-20-423-2000",
      email: "kenai@unhcr.org",
      website: "https://www.unhcr.org/kenya"
    },
    location: { lat: -1.2921, lon: 36.8219, label: "Nairobi", country: "Kenya" },
    operatingHours: "Mon-Fri 8AM-5PM"
  },
  {
    id: "un-10",
    name: "UNHCR Germany",
    agency: "UNHCR",
    description: "UNHCR Germany office - European refugee support",
    services: ["Legal Advice", "Integration", "Advocacy", "Information"],
    contact: {
      phone: "+49-30-202-2020",
      email: "gerbe@unhcr.org",
      website: "https://www.unhcr.org/germany"
    },
    location: { lat: 52.5200, lon: 13.4050, label: "Berlin", country: "Germany" },
    operatingHours: "Mon-Fri 9AM-5PM"
  },
  {
    id: "un-11",
    name: "UNICEF Syria",
    agency: "UNICEF",
    description: "UNICEF Syria - child protection in conflict",
    services: ["Child Protection", "Education", "Health", "Water & Sanitation"],
    contact: {
      phone: "+963-11-619-2901",
      email: "damascus@unicef.org",
      website: "https://www.unicef.org/syria"
    },
    location: { lat: 33.5138, lon: 36.2765, label: "Damascus", country: "Syria" },
    operatingHours: "Sun-Thu 8AM-4PM"
  },
  {
    id: "un-12",
    name: "WFP South Sudan",
    agency: "WFP",
    description: "WFP South Sudan - famine prevention and food assistance",
    services: ["Food Distribution", "Nutrition", "School Feeding", "Emergency Response"],
    contact: {
      phone: "+211-920-017-800",
      email: "wfp.juba@wfp.org",
      website: "https://www.wfp.org/countries/south-sudan"
    },
    location: { lat: 4.8594, lon: 31.5713, label: "Juba", country: "South Sudan" },
    operatingHours: "Mon-Fri 8AM-5PM"
  },
  {
    id: "un-13",
    name: "UNHCR Poland",
    agency: "UNHCR",
    description: "UNHCR Poland - Ukrainian refugee response",
    services: ["Registration", "Protection", "Cash Assistance", "Legal Aid"],
    contact: {
      phone: "+48-22-628-6930",
      email: "polwa@unhcr.org",
      website: "https://www.unhcr.org/poland"
    },
    location: { lat: 52.2297, lon: 21.0122, label: "Warsaw", country: "Poland" },
    operatingHours: "Mon-Fri 9AM-5PM"
  },
  {
    id: "un-14",
    name: "OCHA New York",
    agency: "OCHA",
    description: "Office for Coordination of Humanitarian Affairs - emergency coordination",
    services: ["Humanitarian Coordination", "Emergency Response", "Advocacy", "Funding"],
    contact: {
      phone: "+1-212-963-1234",
      email: "ochany@un.org",
      website: "https://www.unocha.org"
    },
    location: { lat: 40.7489, lon: -73.9680, label: "New York HQ", country: "USA" },
    operatingHours: "Mon-Fri 9AM-5PM"
  }
]

export function getUNOfficeById(id: string): UNOffice | undefined {
  return UN_OFFICES.find(office => office.id === id)
}

export function searchUNOffices(query: string): UNOffice[] {
  const lowerQuery = query.toLowerCase()
  return UN_OFFICES.filter(office =>
    office.name.toLowerCase().includes(lowerQuery) ||
    office.agency.toLowerCase().includes(lowerQuery) ||
    office.services.some(s => s.toLowerCase().includes(lowerQuery)) ||
    office.location.country?.toLowerCase().includes(lowerQuery)
  )
}

export function getUNOfficesByAgency(agency: string): UNOffice[] {
  return UN_OFFICES.filter(office => office.agency.toLowerCase() === agency.toLowerCase())
}
