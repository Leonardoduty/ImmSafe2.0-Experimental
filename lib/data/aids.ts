import type { AidService } from "@/types"

export const AID_SERVICES: AidService[] = [
  {
    id: "aid-1",
    name: "Zaatari Refugee Camp Shelter",
    type: "shelter",
    description: "Emergency shelter and housing for displaced families",
    provider: "UNHCR",
    contact: {
      phone: "+962-79-555-1234",
      email: "zaatari@unhcr.org",
      address: "Zaatari Camp, Mafraq, Jordan"
    },
    location: { lat: 32.2942, lon: 36.3253, label: "Zaatari Camp", country: "Jordan" },
    availability: "24/7"
  },
  {
    id: "aid-2",
    name: "Kakuma Water Distribution",
    type: "water",
    description: "Clean water distribution and sanitation services",
    provider: "UNICEF",
    contact: {
      phone: "+254-20-762-2000",
      address: "Kakuma Camp, Turkana, Kenya"
    },
    location: { lat: 3.7162, lon: 34.8628, label: "Kakuma Camp", country: "Kenya" },
    availability: "Daily 6AM-6PM"
  },
  {
    id: "aid-3",
    name: "MSF Mobile Clinic - Lesbos",
    type: "medical",
    description: "Mobile medical clinic providing primary healthcare",
    provider: "Doctors Without Borders",
    contact: {
      phone: "+30-210-520-4500",
      email: "greece@msf.org"
    },
    location: { lat: 39.1045, lon: 26.5533, label: "Lesbos", country: "Greece" },
    availability: "Mon-Sat 8AM-4PM"
  },
  {
    id: "aid-4",
    name: "IRC Legal Aid Center - Berlin",
    type: "legal",
    description: "Free legal assistance for asylum seekers",
    provider: "International Rescue Committee",
    contact: {
      phone: "+49-30-2758-9000",
      email: "berlin@rescue.org",
      address: "Greifswalder Str. 4, 10405 Berlin"
    },
    location: { lat: 52.5327, lon: 13.4243, label: "Berlin", country: "Germany" },
    availability: "Mon-Fri 9AM-5PM"
  },
  {
    id: "aid-5",
    name: "WFP Food Distribution - Cox's Bazar",
    type: "food",
    description: "Monthly food rations and nutrition support",
    provider: "World Food Programme",
    contact: {
      phone: "+880-2-5566-7788",
      email: "coxsbazar@wfp.org"
    },
    location: { lat: 21.4272, lon: 92.0058, label: "Cox's Bazar", country: "Bangladesh" },
    availability: "Distribution Days: Mon, Wed, Fri"
  },
  {
    id: "aid-6",
    name: "Caritas Clothing Center - Rome",
    type: "clothing",
    description: "Free clothing and essential supplies for refugees",
    provider: "Caritas",
    contact: {
      phone: "+39-06-6879-7222",
      address: "Via delle Fornaci, 00165 Rome"
    },
    location: { lat: 41.8986, lon: 12.4537, label: "Rome", country: "Italy" },
    availability: "Tue, Thu 10AM-4PM"
  },
  {
    id: "aid-7",
    name: "UNHCR Registration Center - Beirut",
    type: "other",
    description: "Refugee registration and documentation services",
    provider: "UNHCR",
    contact: {
      phone: "+961-1-849-201",
      email: "lebbd@unhcr.org",
      address: "Jnah, Beirut, Lebanon"
    },
    location: { lat: 33.8617, lon: 35.4873, label: "Beirut", country: "Lebanon" },
    availability: "Mon-Fri 8AM-3PM"
  },
  {
    id: "aid-8",
    name: "Medical Tent - Dadaab",
    type: "medical",
    description: "Primary healthcare and emergency medical services",
    provider: "ICRC",
    contact: {
      phone: "+254-20-283-1831"
    },
    location: { lat: 0.0610, lon: 40.3083, label: "Dadaab Camp", country: "Kenya" },
    availability: "24/7 Emergency"
  },
  {
    id: "aid-9",
    name: "NRC Shelter Program - Lviv",
    type: "shelter",
    description: "Emergency and transitional shelter for Ukrainian IDPs",
    provider: "Norwegian Refugee Council",
    contact: {
      phone: "+380-32-255-6000",
      email: "ukraine@nrc.no"
    },
    location: { lat: 49.8397, lon: 24.0297, label: "Lviv", country: "Ukraine" },
    availability: "Mon-Fri 9AM-5PM"
  },
  {
    id: "aid-10",
    name: "CARE Water Station - Yemen",
    type: "water",
    description: "Safe water access and hygiene supplies",
    provider: "CARE International",
    contact: {
      email: "yemen@care.org"
    },
    location: { lat: 15.3694, lon: 44.1910, label: "Sanaa", country: "Yemen" },
    availability: "Daily 7AM-5PM"
  },
  {
    id: "aid-11",
    name: "Legal Aid Society - Istanbul",
    type: "legal",
    description: "Legal counseling and asylum application support",
    provider: "ASAM",
    contact: {
      phone: "+90-212-243-8000",
      email: "info@asam.org.tr",
      address: "Beyoglu, Istanbul, Turkey"
    },
    location: { lat: 41.0351, lon: 28.9777, label: "Istanbul", country: "Turkey" },
    availability: "Mon-Fri 9AM-6PM"
  },
  {
    id: "aid-12",
    name: "Food Bank - Athens",
    type: "food",
    description: "Weekly food packages for refugee families",
    provider: "Solidarity Now",
    contact: {
      phone: "+30-210-609-5600",
      address: "Ippokratous 55, Athens"
    },
    location: { lat: 37.9838, lon: 23.7275, label: "Athens", country: "Greece" },
    availability: "Wed, Sat 10AM-2PM"
  },
  {
    id: "aid-13",
    name: "Emergency Shelter - Calais",
    type: "shelter",
    description: "Emergency accommodation and support services",
    provider: "Refugee Community Kitchen",
    contact: {
      email: "info@refugeecommunitykitchen.com"
    },
    location: { lat: 50.9513, lon: 1.8587, label: "Calais", country: "France" },
    availability: "24/7"
  },
  {
    id: "aid-14",
    name: "Medical Clinic - Tijuana",
    type: "medical",
    description: "Healthcare services for migrants and asylum seekers",
    provider: "MSF",
    contact: {
      phone: "+52-664-680-7600"
    },
    location: { lat: 32.5027, lon: -117.0037, label: "Tijuana", country: "Mexico" },
    availability: "Mon-Fri 8AM-5PM"
  },
  {
    id: "aid-15",
    name: "Clothing Distribution - Warsaw",
    type: "clothing",
    description: "Clothing and winter supplies for Ukrainian refugees",
    provider: "Polish Red Cross",
    contact: {
      phone: "+48-22-326-1200",
      address: "Mokotowska 14, Warsaw"
    },
    location: { lat: 52.2297, lon: 21.0122, label: "Warsaw", country: "Poland" },
    availability: "Tue, Thu, Sat 10AM-4PM"
  }
]

export function getAidServiceById(id: string): AidService | undefined {
  return AID_SERVICES.find(service => service.id === id)
}

export function getAidServicesByType(type: AidService["type"]): AidService[] {
  return AID_SERVICES.filter(service => service.type === type)
}

export function searchAidServices(query: string): AidService[] {
  const lowerQuery = query.toLowerCase()
  return AID_SERVICES.filter(service =>
    service.name.toLowerCase().includes(lowerQuery) ||
    service.type.toLowerCase().includes(lowerQuery) ||
    service.provider.toLowerCase().includes(lowerQuery) ||
    service.location.country?.toLowerCase().includes(lowerQuery)
  )
}
