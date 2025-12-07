// Visa Help Center - Visa rules for major countries

export interface VisaRule {
  country: string
  visaType: string
  requirements: string[]
  duration: string
  cost?: string
  applicationProcess: string[]
  notes?: string
  emergencyEntry?: string
}

export const VISA_RULES: Record<string, VisaRule[]> = {
  Lebanon: [
    {
      country: "Lebanon",
      visaType: "Tourist Visa",
      requirements: ["Valid passport", "Return ticket", "Proof of accommodation"],
      duration: "1-3 months",
      cost: "Free for many nationalities",
      applicationProcess: ["Apply at border or embassy", "Can be obtained on arrival for many"],
      notes: "Syrian refugees may have different requirements",
    },
  ],
  Turkey: [
    {
      country: "Turkey",
      visaType: "Tourist Visa",
      requirements: ["Valid passport", "Return ticket"],
      duration: "90 days",
      cost: "Varies by nationality",
      applicationProcess: ["Apply online (e-Visa) or at border"],
      notes: "Syrian refugees have special status",
    },
    {
      country: "Turkey",
      visaType: "Temporary Protection",
      requirements: ["Registration with authorities"],
      duration: "Temporary protection status",
      applicationProcess: ["Register with migration office"],
      notes: "For Syrian refugees",
    },
  ],
  Jordan: [
    {
      country: "Jordan",
      visaType: "Tourist Visa",
      requirements: ["Valid passport", "Return ticket"],
      duration: "1 month",
      cost: "40 JOD (approx)",
      applicationProcess: ["Apply at border or embassy"],
      notes: "Syrian refugees may have different requirements",
    },
  ],
  Poland: [
    {
      country: "Poland",
      visaType: "Schengen Visa",
      requirements: ["Valid passport", "Travel insurance", "Proof of funds", "Accommodation proof"],
      duration: "Up to 90 days",
      cost: "80 EUR",
      applicationProcess: ["Apply at Polish embassy", "Biometric data required"],
      notes: "Part of EU Schengen area",
    },
    {
      country: "Poland",
      visaType: "Humanitarian Visa",
      requirements: ["Valid passport", "Proof of humanitarian need"],
      duration: "Varies",
      applicationProcess: ["Apply at Polish embassy", "Special circumstances"],
      notes: "For humanitarian cases",
    },
  ],
  Germany: [
    {
      country: "Germany",
      visaType: "Schengen Visa",
      requirements: ["Valid passport", "Travel insurance", "Proof of funds", "Accommodation"],
      duration: "Up to 90 days",
      cost: "80 EUR",
      applicationProcess: ["Apply at German embassy", "Biometric data required"],
      notes: "Part of EU Schengen area",
    },
    {
      country: "Germany",
      visaType: "Asylum",
      requirements: ["Valid passport or ID", "Arrival in Germany"],
      duration: "During asylum process",
      applicationProcess: ["Apply at arrival", "Registration required"],
      notes: "Asylum seekers can apply upon arrival",
    },
  ],
  USA: [
    {
      country: "USA",
      visaType: "Tourist Visa (B-2)",
      requirements: ["Valid passport", "DS-160 form", "Interview", "Proof of ties to home country"],
      duration: "Up to 6 months",
      cost: "160 USD",
      applicationProcess: ["Complete DS-160", "Pay fee", "Schedule interview", "Attend interview"],
      notes: "Very strict requirements",
    },
    {
      country: "USA",
      visaType: "Refugee Status",
      requirements: ["Referral from UNHCR", "Security screening", "Medical exam"],
      duration: "Permanent",
      applicationProcess: ["UNHCR referral", "USRAP processing", "Resettlement"],
      notes: "Must be referred by UNHCR",
    },
  ],
  "United Kingdom": [
    {
      country: "United Kingdom",
      visaType: "Standard Visitor Visa",
      requirements: ["Valid passport", "Proof of funds", "Accommodation proof"],
      duration: "Up to 6 months",
      cost: "100 GBP",
      applicationProcess: ["Apply online", "Biometric appointment", "Decision"],
      notes: "Post-Brexit visa requirements",
    },
    {
      country: "United Kingdom",
      visaType: "Asylum",
      requirements: ["Arrival in UK", "Valid passport or ID"],
      duration: "During asylum process",
      applicationProcess: ["Apply upon arrival", "Screening interview", "Full interview"],
      notes: "Asylum seekers can apply upon arrival",
    },
  ],
  UAE: [
    {
      country: "UAE",
      visaType: "Tourist Visa",
      requirements: ["Valid passport", "Return ticket", "Hotel booking"],
      duration: "30-90 days",
      cost: "Varies",
      applicationProcess: ["Apply online or through sponsor", "Can be obtained on arrival for some"],
      notes: "Visa on arrival for many nationalities",
    },
  ],
}

export function getVisaRules(country: string): VisaRule[] {
  return VISA_RULES[country] || []
}

export function searchVisaRules(query: string): Array<{ country: string; rules: VisaRule[] }> {
  const lowerQuery = query.toLowerCase()
  const results: Array<{ country: string; rules: VisaRule[] }> = []
  
  for (const [country, rules] of Object.entries(VISA_RULES)) {
    if (country.toLowerCase().includes(lowerQuery)) {
      results.push({ country, rules })
    } else {
      const matchingRules = rules.filter(
        (rule) =>
          rule.visaType.toLowerCase().includes(lowerQuery) ||
          rule.requirements.some((r) => r.toLowerCase().includes(lowerQuery)),
      )
      if (matchingRules.length > 0) {
        results.push({ country, rules: matchingRules })
      }
    }
  }
  
  return results
}

