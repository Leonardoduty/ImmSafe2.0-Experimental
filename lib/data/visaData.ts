import type { VisaRequirement } from "@/types"

export const VISA_REQUIREMENTS: VisaRequirement[] = [
  {
    country: "Germany",
    countryCode: "DE",
    visaRequired: true,
    visaOnArrival: false,
    eVisaAvailable: false,
    processingTime: "2-4 weeks",
    requiredDocuments: ["Valid passport", "Visa application form", "Passport photos", "Proof of accommodation", "Travel insurance", "Financial proof"],
    fees: "EUR 80",
    notes: "Asylum seekers can apply at the border or at a reception center"
  },
  {
    country: "France",
    countryCode: "FR",
    visaRequired: true,
    visaOnArrival: false,
    eVisaAvailable: false,
    processingTime: "2-3 weeks",
    requiredDocuments: ["Valid passport", "Visa application form", "Passport photos", "Proof of accommodation", "Travel insurance"],
    fees: "EUR 80",
    notes: "Humanitarian visa available for refugees"
  },
  {
    country: "Turkey",
    countryCode: "TR",
    visaRequired: true,
    visaOnArrival: false,
    eVisaAvailable: true,
    processingTime: "1-3 days for e-Visa",
    requiredDocuments: ["Valid passport", "e-Visa application", "Return ticket", "Hotel reservation"],
    fees: "USD 50",
    notes: "Syrians under temporary protection status have special provisions"
  },
  {
    country: "Jordan",
    countryCode: "JO",
    visaRequired: true,
    visaOnArrival: true,
    eVisaAvailable: false,
    processingTime: "On arrival",
    requiredDocuments: ["Valid passport", "Return ticket", "Hotel booking"],
    fees: "JOD 40",
    notes: "Syrian refugees have special registration process through UNHCR"
  },
  {
    country: "Lebanon",
    countryCode: "LB",
    visaRequired: true,
    visaOnArrival: true,
    eVisaAvailable: false,
    processingTime: "On arrival for some nationalities",
    requiredDocuments: ["Valid passport", "Return ticket", "Hotel booking", "Financial proof"],
    fees: "Free for some nationalities",
    notes: "Syrian refugees must register with UNHCR"
  },
  {
    country: "Egypt",
    countryCode: "EG",
    visaRequired: true,
    visaOnArrival: true,
    eVisaAvailable: true,
    processingTime: "On arrival or 7 days for e-Visa",
    requiredDocuments: ["Valid passport", "Return ticket", "Hotel reservation"],
    fees: "USD 25",
    notes: "Refugees should contact UNHCR Egypt for registration"
  },
  {
    country: "Kenya",
    countryCode: "KE",
    visaRequired: true,
    visaOnArrival: false,
    eVisaAvailable: true,
    processingTime: "3-5 days for e-Visa",
    requiredDocuments: ["Valid passport", "e-Visa application", "Yellow fever certificate", "Return ticket"],
    fees: "USD 51",
    notes: "Refugee camps in Kakuma and Dadaab accept registrations"
  },
  {
    country: "Uganda",
    countryCode: "UG",
    visaRequired: true,
    visaOnArrival: true,
    eVisaAvailable: true,
    processingTime: "On arrival or 3 days for e-Visa",
    requiredDocuments: ["Valid passport", "Yellow fever certificate", "Return ticket"],
    fees: "USD 50",
    notes: "Uganda has open-door policy for refugees with work rights"
  },
  {
    country: "Poland",
    countryCode: "PL",
    visaRequired: true,
    visaOnArrival: false,
    eVisaAvailable: false,
    processingTime: "15 days",
    requiredDocuments: ["Valid passport", "Visa application form", "Travel insurance", "Proof of funds"],
    fees: "EUR 80",
    notes: "Ukrainian refugees have visa-free access under temporary protection"
  },
  {
    country: "Greece",
    countryCode: "GR",
    visaRequired: true,
    visaOnArrival: false,
    eVisaAvailable: false,
    processingTime: "2-4 weeks",
    requiredDocuments: ["Valid passport", "Schengen visa application", "Travel insurance", "Proof of accommodation"],
    fees: "EUR 80",
    notes: "Asylum applications accepted at reception centers"
  },
  {
    country: "Italy",
    countryCode: "IT",
    visaRequired: true,
    visaOnArrival: false,
    eVisaAvailable: false,
    processingTime: "2-4 weeks",
    requiredDocuments: ["Valid passport", "Schengen visa application", "Travel insurance", "Financial proof"],
    fees: "EUR 80",
    notes: "Sea arrivals can apply for asylum at disembarkation points"
  },
  {
    country: "Sweden",
    countryCode: "SE",
    visaRequired: true,
    visaOnArrival: false,
    eVisaAvailable: false,
    processingTime: "3-4 weeks",
    requiredDocuments: ["Valid passport", "Schengen visa application", "Travel insurance", "Invitation letter"],
    fees: "EUR 80",
    notes: "Asylum application can be made at Migration Agency"
  },
  {
    country: "Canada",
    countryCode: "CA",
    visaRequired: true,
    visaOnArrival: false,
    eVisaAvailable: true,
    processingTime: "Several weeks to months",
    requiredDocuments: ["Valid passport", "Visa application", "Biometrics", "Medical exam", "Police certificate"],
    fees: "CAD 100",
    notes: "Private sponsorship and government-assisted refugee programs available"
  },
  {
    country: "United States",
    countryCode: "US",
    visaRequired: true,
    visaOnArrival: false,
    eVisaAvailable: false,
    processingTime: "Months to years for refugee status",
    requiredDocuments: ["UNHCR referral", "Extensive background checks", "Medical exam", "Cultural orientation"],
    fees: "No fee for refugees",
    notes: "Refugees must be referred by UNHCR or US Embassy"
  },
  {
    country: "Australia",
    countryCode: "AU",
    visaRequired: true,
    visaOnArrival: false,
    eVisaAvailable: false,
    processingTime: "Months for humanitarian visa",
    requiredDocuments: ["Valid passport", "Health examination", "Character assessment"],
    fees: "No fee for humanitarian visas",
    notes: "Humanitarian program accepts UNHCR referrals"
  },
  {
    country: "Brazil",
    countryCode: "BR",
    visaRequired: true,
    visaOnArrival: false,
    eVisaAvailable: true,
    processingTime: "3-5 days for e-Visa",
    requiredDocuments: ["Valid passport", "Return ticket", "Proof of funds"],
    fees: "USD 44.50",
    notes: "Humanitarian visa available for nationals of certain countries"
  },
  {
    country: "Mexico",
    countryCode: "MX",
    visaRequired: false,
    visaOnArrival: false,
    eVisaAvailable: false,
    processingTime: "N/A",
    requiredDocuments: ["Valid passport for visa-exempt nationalities"],
    fees: "Free for visa-exempt",
    notes: "Humanitarian visa and refugee status available at COMAR"
  },
  {
    country: "South Africa",
    countryCode: "ZA",
    visaRequired: true,
    visaOnArrival: false,
    eVisaAvailable: false,
    processingTime: "5-10 days",
    requiredDocuments: ["Valid passport", "Visa application", "Financial proof", "Return ticket"],
    fees: "Varies by nationality",
    notes: "Asylum seekers can apply at Refugee Reception Offices"
  }
]

export function getVisaRequirementByCountry(country: string): VisaRequirement | undefined {
  return VISA_REQUIREMENTS.find(
    v => v.country.toLowerCase() === country.toLowerCase() ||
         v.countryCode.toLowerCase() === country.toLowerCase()
  )
}

export function getVisaFreeCountries(): VisaRequirement[] {
  return VISA_REQUIREMENTS.filter(v => !v.visaRequired)
}

export function getVisaOnArrivalCountries(): VisaRequirement[] {
  return VISA_REQUIREMENTS.filter(v => v.visaOnArrival)
}

export function getEVisaCountries(): VisaRequirement[] {
  return VISA_REQUIREMENTS.filter(v => v.eVisaAvailable)
}

export function searchVisaRequirements(query: string): VisaRequirement[] {
  const lowerQuery = query.toLowerCase()
  return VISA_REQUIREMENTS.filter(v =>
    v.country.toLowerCase().includes(lowerQuery) ||
    v.countryCode.toLowerCase().includes(lowerQuery)
  )
}
