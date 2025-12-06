// AI Image Threat Analysis System (Offline-capable approximation)

interface ThreatDetectionResult {
  threats_detected: string[]
  threat_level: "SAFE" | "CAUTION" | "DANGER" | "CRITICAL"
  confidence: number
  recommendations: string[]
  affected_areas: string[]
  visual_indicators: string[]
}

// Simulated threat detection from image features
export function analyzeThreatFromImage(imageFeatures: any): ThreatDetectionResult {
  const threats: string[] = []
  let threatLevel: "SAFE" | "CAUTION" | "DANGER" | "CRITICAL" = "SAFE"
  const indicators: string[] = []
  const recommendations: string[] = []
  const affectedAreas: string[] = []

  // Simulate feature detection
  const { colors = [], shapes = [], objects = [], patterns = [] } = imageFeatures

  // Military vehicle detection
  if (objects.includes("vehicle") && (colors.includes("green") || colors.includes("tan"))) {
    threats.push("Military vehicle")
    indicators.push("Vehicle with military-typical camouflage coloring")
    threatLevel = "CRITICAL"
    recommendations.push("Avoid immediate area, take alternate route")
    recommendations.push("Do not approach or photograph")
    affectedAreas.push("Route vicinity: 5-10 km radius")
  }

  // Landmine/unexploded ordnance
  if (objects.includes("ground_object") && (patterns.includes("metallic") || colors.includes("dark"))) {
    threats.push("Possible unexploded ordnance")
    indicators.push("Metallic object partially buried")
    threatLevel = "CRITICAL"
    recommendations.push("DO NOT TOUCH - DANGER")
    recommendations.push("Mark location, report to UN demining")
    recommendations.push("Large detour around location")
    affectedAreas.push("500 meter danger zone minimum")
  }

  // Flooded/water hazard
  if (colors.includes("brown") && colors.includes("blue") && patterns.includes("waves")) {
    threats.push("Flooding hazard")
    indicators.push("Rising or turbulent water")
    threatLevel = "DANGER"
    recommendations.push("Avoid water crossing until levels drop")
    recommendations.push("Check for bridge or ford upstream")
    affectedAreas.push("River/flood zone: impassable currently")
  }

  // Burned/conflict area
  if (colors.includes("black") && colors.includes("grey") && objects.includes("building")) {
    threats.push("Recent conflict/burned area")
    indicators.push("Charred buildings, blast damage visible")
    threatLevel = "DANGER"
    recommendations.push("Recent military activity - avoid")
    recommendations.push("Check wind direction for smoke/chemical hazards")
    affectedAreas.push("Settlement area: 10+ km radius")
  }

  // Collapsed structure/earthquake damage
  if (objects.includes("building") && patterns.includes("broken")) {
    threats.push("Structural instability")
    indicators.push("Collapsed or severely damaged building")
    threatLevel = "CAUTION"
    recommendations.push("Risk of further collapse")
    recommendations.push("Keep safe distance")
    affectedAreas.push("Building vicinity: 50-100m clearance")
  }

  // Smoke/chemical hazard
  if (colors.includes("grey") && patterns.includes("smoke")) {
    threats.push("Smoke/possible chemical hazard")
    indicators.push("Visible smoke plume")
    threatLevel = "CAUTION"
    recommendations.push("Check wind direction")
    recommendations.push("Cover mouth/nose, move upwind")
    recommendations.push("Do not enter smoke zone")
  }

  // Dead animals (disease risk)
  if (objects.includes("animal") && colors.includes("dark")) {
    threats.push("Dead animal - disease risk")
    indicators.push("Carcass present")
    threatLevel = "CAUTION"
    recommendations.push("Do not touch or consume")
    recommendations.push("May indicate contaminated area")
    recommendations.push("Use alternate route if possible")
  }

  // Armed groups (non-political assessment)
  if (objects.includes("person") && objects.includes("weapon")) {
    threats.push("Armed individuals detected")
    indicators.push("People carrying weapons")
    threatLevel = "CRITICAL"
    recommendations.push("Avoid confrontation")
    recommendations.push("If safe, identify group/allegiance")
    recommendations.push("Consider alternate route")
  }

  return {
    threats_detected: threats.length > 0 ? threats : ["No significant threats detected"],
    threat_level: threatLevel,
    confidence: 0.7,
    recommendations,
    affected_areas: affectedAreas.length > 0 ? affectedAreas : ["Immediate area appears safe"],
    visual_indicators: indicators,
  }
}

// Border checkpoint risk assessment
export interface BorderCheckpoint {
  name: string
  country_pair: string
  legal_crossing: boolean
  corruption_risk: number
  violence_risk: number
  smuggler_activity: boolean
  unhcr_recognition: boolean
  required_docs: string[]
  notes: string
}

export const sampleBorderCheckpoints: BorderCheckpoint[] = [
  {
    name: "Official Border Crossing - Type A",
    country_pair: "Country A → Country B",
    legal_crossing: true,
    corruption_risk: 3,
    violence_risk: 2,
    smuggler_activity: false,
    unhcr_recognition: true,
    required_docs: ["Passport", "Travel visa", "UN refugee document"],
    notes: "Most reliable route. Long wait times but consistent processing.",
  },
  {
    name: "Mountain Pass Checkpoint",
    country_pair: "Border Region",
    legal_crossing: true,
    corruption_risk: 5,
    violence_risk: 4,
    smuggler_activity: true,
    unhcr_recognition: false,
    required_docs: ["Any ID", "Bribe suggested"],
    notes: "Remote location. Higher corruption but less scrutiny.",
  },
  {
    name: "Urban Border Gate",
    country_pair: "City Border",
    legal_crossing: true,
    corruption_risk: 6,
    violence_risk: 5,
    smuggler_activity: true,
    unhcr_recognition: true,
    required_docs: ["Passport", "Vaccination records if required"],
    notes: "Heavily trafficked. Smugglers operate openly. Verify guides.",
  },
  {
    name: "River Crossing Point",
    country_pair: "Riverine Border",
    legal_crossing: false,
    corruption_risk: 8,
    violence_risk: 6,
    smuggler_activity: true,
    unhcr_recognition: false,
    required_docs: ["Swimming ability essential"],
    notes: "Illegal crossing. High danger. Guards may fire on crossers.",
  },
]

export function assessBorderRoute(checkpointName: string): BorderCheckpoint | null {
  return sampleBorderCheckpoints.find((cp) => cp.name === checkpointName) || null
}
