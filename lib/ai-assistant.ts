// AI Assistant for survival help

export interface AIResponse {
  response: string
  suggestions?: string[]
  resources?: string[]
}

// Simple rule-based AI assistant (functional only, no fancy UI)
export async function getAIResponse(query: string): Promise<AIResponse> {
  const lowerQuery = query.toLowerCase()
  
  // Water-related queries
  if (lowerQuery.includes("water") || lowerQuery.includes("thirst") || lowerQuery.includes("drink")) {
    return {
      response: "Water is critical for survival. Here's what you need to know:",
      suggestions: [
        "Drink at least 2-3 liters per day in normal conditions, more in hot weather",
        "Boil water for 1 minute to kill bacteria and viruses",
        "Use water purification tablets if available",
        "Collect rainwater in clean containers",
        "Avoid drinking from stagnant water sources",
        "Look for running water (rivers, streams) - still needs purification",
      ],
      resources: ["Water purification guide", "Finding water sources"],
    }
  }
  
  // Food-related queries
  if (lowerQuery.includes("food") || lowerQuery.includes("hunger") || lowerQuery.includes("eat")) {
    return {
      response: "Food security is essential. Here are survival tips:",
      suggestions: [
        "Carry high-calorie, non-perishable foods (nuts, dried fruits, energy bars)",
        "Look for food distribution points (WFP, Red Cross)",
        "Only eat plants you can positively identify as safe",
        "Avoid wild mushrooms unless you're an expert",
        "Cook all meat thoroughly",
        "Store food in sealed containers to prevent spoilage",
      ],
      resources: ["Food identification guide", "Emergency food sources"],
    }
  }
  
  // Shelter-related queries
  if (lowerQuery.includes("shelter") || lowerQuery.includes("sleep") || lowerQuery.includes("camp")) {
    return {
      response: "Shelter protects you from weather and danger:",
      suggestions: [
        "Find or build shelter before dark",
        "Look for natural shelters (caves, overhangs)",
        "Build a simple lean-to with branches and leaves",
        "Stay dry - use plastic sheets or tarps if available",
        "Keep shelter well-ventilated",
        "Stay away from low-lying areas (flood risk)",
        "Contact UNHCR or Red Cross for official shelter",
      ],
      resources: ["Shelter building guide", "Refugee camp locations"],
    }
  }
  
  // Medical/health queries
  if (lowerQuery.includes("medical") || lowerQuery.includes("health") || lowerQuery.includes("sick") || lowerQuery.includes("injured")) {
    return {
      response: "Medical emergencies require immediate attention:",
      suggestions: [
        "For serious injuries, seek medical help immediately (MSF, Red Cross hospitals)",
        "Keep wounds clean and covered",
        "Carry a basic first aid kit",
        "Stay hydrated to prevent illness",
        "Wash hands regularly with soap and water",
        "Avoid contaminated water sources",
        "Get vaccinations if available (UNHCR, UNICEF)",
      ],
      resources: ["First aid guide", "Hospital locations", "Medical services directory"],
    }
  }
  
  // Route/navigation queries
  if (lowerQuery.includes("route") || lowerQuery.includes("direction") || lowerQuery.includes("lost") || lowerQuery.includes("navigation")) {
    return {
      response: "Navigation and route planning:",
      suggestions: [
        "Use the route planner in this app to analyze safe routes",
        "Avoid conflict zones and dangerous areas",
        "Travel during daylight hours when possible",
        "Stay on known paths when available",
        "Carry a compass or use phone GPS (if available)",
        "Tell someone your planned route",
        "Check weather conditions before traveling",
      ],
      resources: ["Route analyzer", "Map with borders", "Country danger levels"],
    }
  }
  
  // Safety/security queries
  if (lowerQuery.includes("safe") || lowerQuery.includes("danger") || lowerQuery.includes("security") || lowerQuery.includes("conflict")) {
    return {
      response: "Safety is paramount. Follow these guidelines:",
      suggestions: [
        "Avoid conflict zones - check country danger levels in this app",
        "Stay in groups when possible",
        "Keep important documents safe and hidden",
        "Avoid traveling at night in dangerous areas",
        "Contact local authorities or NGOs for safety information",
        "Register with UNHCR for protection",
        "Know emergency contact numbers",
      ],
      resources: ["Country danger levels", "Emergency contacts", "NGO directory"],
    }
  }
  
  // Documents/legal queries
  if (lowerQuery.includes("document") || lowerQuery.includes("paper") || lowerQuery.includes("legal") || lowerQuery.includes("visa")) {
    return {
      response: "Document management and legal assistance:",
      suggestions: [
        "Keep all documents in a waterproof container",
        "Make copies of important documents",
        "Store digital copies if possible",
        "Contact UNHCR or NRC for legal assistance",
        "Check visa requirements in this app's Visa Help Center",
        "Register with authorities upon arrival in new country",
        "Keep passport and ID safe at all times",
      ],
      resources: ["Document vault", "Visa help center", "Legal assistance directory"],
    }
  }
  
  // General survival
  return {
    response: "I'm here to help with survival questions. Here are key areas I can assist with:",
    suggestions: [
      "Water purification and finding water sources",
      "Food security and emergency food",
      "Building shelter and finding safe places",
      "Medical emergencies and first aid",
      "Route planning and navigation",
      "Safety and security",
      "Document management and legal help",
    ],
    resources: [
      "Emergency protocols PDF",
      "NGO directory",
      "Aid services directory",
      "Visa help center",
      "Emergency funds directory",
    ],
  }
}

