// Emergency Fund Directory - NGO grants and cash programs

export interface EmergencyFund {
  name: string
  organization: string
  type: "grant" | "cash" | "loan" | "voucher"
  amount?: string
  eligibility: string[]
  countries: string[]
  contact: string
  website?: string
  notes?: string
}

export const EMERGENCY_FUNDS: EmergencyFund[] = [
  {
    name: "UNHCR Emergency Cash Assistance",
    organization: "UNHCR",
    type: "cash",
    amount: "Varies by country",
    eligibility: ["Registered refugees", "Asylum seekers", "IDPs"],
    countries: ["Global"],
    contact: "Contact local UNHCR office",
    website: "https://www.unhcr.org",
    notes: "Available in most refugee-hosting countries",
  },
  {
    name: "Red Cross Emergency Relief",
    organization: "ICRC / National Red Cross",
    type: "cash",
    amount: "Varies",
    eligibility: ["People in crisis", "Displaced persons"],
    countries: ["Global"],
    contact: "Local Red Cross/Red Crescent office",
    website: "https://www.icrc.org",
  },
  {
    name: "World Food Programme Cash Transfers",
    organization: "WFP",
    type: "cash",
    amount: "Varies by location",
    eligibility: ["Food insecure populations"],
    countries: ["Syria", "Lebanon", "Jordan", "Turkey", "Yemen", "Sudan"],
    contact: "Contact WFP country office",
    website: "https://www.wfp.org",
  },
  {
    name: "UNICEF Emergency Cash Grants",
    organization: "UNICEF",
    type: "grant",
    amount: "Varies",
    eligibility: ["Families with children", "Vulnerable households"],
    countries: ["Global"],
    contact: "Local UNICEF office",
    website: "https://www.unicef.org",
  },
  {
    name: "Save the Children Emergency Fund",
    organization: "Save the Children",
    type: "grant",
    amount: "Varies",
    eligibility: ["Families with children under 18"],
    countries: ["Global"],
    contact: "Local Save the Children office",
    website: "https://www.savethechildren.org",
  },
  {
    name: "Oxfam Emergency Cash Assistance",
    organization: "Oxfam",
    type: "cash",
    amount: "Varies",
    eligibility: ["People in crisis", "Displaced persons"],
    countries: ["Syria", "Yemen", "Sudan", "Jordan", "Lebanon"],
    contact: "Local Oxfam office",
    website: "https://www.oxfam.org",
  },
  {
    name: "Mercy Corps Emergency Grants",
    organization: "Mercy Corps",
    type: "grant",
    amount: "Varies",
    eligibility: ["People affected by conflict", "Displaced persons"],
    countries: ["Syria", "Iraq", "Yemen", "Jordan", "Lebanon"],
    contact: "Local Mercy Corps office",
    website: "https://www.mercycorps.org",
  },
  {
    name: "CARE Emergency Cash Program",
    organization: "CARE",
    type: "cash",
    amount: "Varies",
    eligibility: ["Vulnerable households", "Women-headed households"],
    countries: ["Syria", "Jordan", "Lebanon", "Turkey"],
    contact: "Local CARE office",
    website: "https://www.care.org",
  },
  {
    name: "Islamic Relief Emergency Fund",
    organization: "Islamic Relief",
    type: "grant",
    amount: "Varies",
    eligibility: ["People in crisis", "Displaced persons"],
    countries: ["Syria", "Yemen", "Palestine", "Lebanon", "Jordan"],
    contact: "Local Islamic Relief office",
    website: "https://www.islamic-relief.org",
  },
  {
    name: "Norwegian Refugee Council Cash Assistance",
    organization: "NRC",
    type: "cash",
    amount: "Varies",
    eligibility: ["Registered refugees", "IDPs"],
    countries: ["Syria", "Iraq", "Jordan", "Lebanon", "Turkey"],
    contact: "Local NRC office",
    website: "https://www.nrc.no",
  },
]

export function searchEmergencyFunds(query: string, country?: string): EmergencyFund[] {
  const lowerQuery = query.toLowerCase()
  return EMERGENCY_FUNDS.filter((fund) => {
    const matchesQuery =
      fund.name.toLowerCase().includes(lowerQuery) ||
      fund.organization.toLowerCase().includes(lowerQuery) ||
      fund.type.toLowerCase().includes(lowerQuery)
    
    const matchesCountry =
      !country ||
      fund.countries.includes("Global") ||
      fund.countries.some((c) => c.toLowerCase().includes(country.toLowerCase()))
    
    return matchesQuery && matchesCountry
  })
}

