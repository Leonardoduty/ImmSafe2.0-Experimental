// Route Planning & AI Threat Assessment Engine

interface RoutePoint {
  lat: number
  lon: number
  type: "source" | "destination"
}

interface TerritoryData {
  lat: number
  lon: number
  terrain: "flat" | "hilly" | "mountainous" | "water"
  conflict_level: number
  weather_severity: number
  water_availability: number
  food_availability: number
}

interface RouteAnalysis {
  distance_km: number
  duration_hours: number
  duration_days: number
  nights_required: number
  survival_score: number
  risk_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  terrain_difficulty: "EASY" | "MODERATE" | "DIFFICULT" | "EXTREME"
  conflict_intersections: number
  water_score: number
  food_score: number
  weather_risk: number
  danger_explanation: string
  recommendations: string[]
  estimated_calories_per_day: number
  estimated_water_liters_per_day: number
}

// Simple haversine distance calculation
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Generate synthetic territory data for route points
function generateTerritoryData(lat: number, lon: number): TerritoryData {
  // Simulated ML model approximation
  const noise = Math.sin(lat * lon) * Math.cos(lat + lon)

  return {
    lat,
    lon,
    terrain: ["flat", "hilly", "mountainous"][Math.floor(Math.abs(noise * 3)) % 3] as any,
    conflict_level: Math.max(1, Math.min(10, Math.floor((Math.sin(lat * 0.5) + Math.cos(lon * 0.5)) * 5 + 5))),
    weather_severity: Math.max(0, Math.floor(Math.abs(Math.sin(lat - lon)) * 10 - 3)),
    water_availability: Math.max(1, Math.floor((Math.cos(lat * lon) * 10 + 10) / 2)),
    food_availability: Math.max(1, Math.floor((Math.sin(lat + lon) * 10 + 10) / 2)),
  }
}

// Calculate average walking speed based on terrain
function calculateWalkingSpeed(terrain: string): number {
  switch (terrain) {
    case "flat":
      return 5 // km/h
    case "hilly":
      return 3 // km/h
    case "mountainous":
      return 2 // km/h
    case "water":
      return 1 // km/h (crossing required)
    default:
      return 4
  }
}

// Main route analysis function
export function analyzeRoute(
  source: RoutePoint,
  destination: RoutePoint,
  travelMode: "walking" | "vehicle",
): RouteAnalysis {
  const distance = calculateDistance(source.lat, source.lon, destination.lat, destination.lon)

  // Generate route profile by sampling points
  const routeSteps = 10
  let totalConflict = 0
  let totalWeatherRisk = 0
  let totalWaterScore = 0
  let totalFoodScore = 0
  let conflictIntersections = 0
  let terrainDifficulty = 0

  for (let i = 0; i <= routeSteps; i++) {
    const ratio = i / routeSteps
    const stepLat = source.lat + (destination.lat - source.lat) * ratio
    const stepLon = source.lon + (destination.lon - source.lon) * ratio

    const data = generateTerritoryData(stepLat, stepLon)
    totalConflict += data.conflict_level
    totalWeatherRisk += data.weather_severity
    totalWaterScore += data.water_availability
    totalFoodScore += data.food_availability

    if (data.conflict_level >= 6) {
      conflictIntersections++
    }

    // Terrain difficulty scoring
    if (data.terrain === "mountainous") terrainDifficulty += 3
    else if (data.terrain === "hilly") terrainDifficulty += 2
    else if (data.terrain === "water") terrainDifficulty += 4
    else terrainDifficulty += 1
  }

  // Averages
  const avgConflict = totalConflict / (routeSteps + 1)
  const avgWeatherRisk = totalWeatherRisk / (routeSteps + 1)
  const waterScore = Math.round((totalWaterScore / (routeSteps + 1)) * 10)
  const foodScore = Math.round((totalFoodScore / (routeSteps + 1)) * 10)
  const terrainDifficultyAvg = terrainDifficulty / (routeSteps + 1)

  // Calculate duration
  const avgTerrain = terrainDifficulty / (routeSteps + 1)
  let terrainType: "EASY" | "MODERATE" | "DIFFICULT" | "EXTREME" = "MODERATE"
  let speed = 4 // default km/h
  if (travelMode === "vehicle") {
    speed = 40
    terrainType = "EASY"
  } else if (avgTerrain < 1.5) {
    speed = 5
    terrainType = "EASY"
  } else if (avgTerrain < 2.5) {
    speed = 3
    terrainType = "MODERATE"
  } else if (avgTerrain < 3.5) {
    speed = 2
    terrainType = "DIFFICULT"
  } else {
    speed = 1
    terrainType = "EXTREME"
  }

  const duration_hours = distance / speed
  const duration_days = Math.ceil(duration_hours / 8) // 8 hours walking per day
  const nights_required = Math.max(0, duration_days - 1)

  // Survival Score calculation (0-100)
  const conflictScore = Math.max(0, 100 - avgConflict * 8)
  const weatherScore = Math.max(0, 100 - avgWeatherRisk * 6)
  const resourceScore = (waterScore + foodScore) / 2
  const survivalScore = Math.round(conflictScore * 0.4 + weatherScore * 0.3 + resourceScore * 0.3)

  // Risk Level
  let riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "LOW"
  if (survivalScore < 30) riskLevel = "CRITICAL"
  else if (survivalScore < 50) riskLevel = "HIGH"
  else if (survivalScore < 75) riskLevel = "MEDIUM"

  // Calorie and water calculations
  const estimatedCaloriesPerDay = travelMode === "walking" ? 2500 : 2000
  const estimatedWaterPerDay = 3 // liters, adjusted for weather
  const adjustedWaterPerDay = estimatedWaterPerDay + (avgWeatherRisk > 7 ? 2 : 0) + (duration_hours > 24 ? 1 : 0)

  // Generate recommendations
  const recommendations: string[] = []
  if (survivalScore < 50) recommendations.push("⚠️ High risk route - consider alternatives")
  if (conflictIntersections > 3) recommendations.push("⚠️ Multiple conflict zones detected - use evasion tactics")
  if (waterScore < 4) recommendations.push("🚨 Water scarcity - bring maximum water containers")
  if (foodScore < 4) recommendations.push("🚨 Food scarcity - carry high-calorie supplies")
  if (nights_required > 5) recommendations.push("🏕️ Long journey - extra shelter/blankets needed")
  if (terrainType === "EXTREME") recommendations.push("⛏️ Extreme terrain - professional equipment required")
  if (avgWeatherRisk > 6) recommendations.push("⛈️ Severe weather risk - check daily forecasts")
  if (waterScore > 6 && foodScore > 6) recommendations.push("✅ Good resource availability on route")
  if (survivalScore > 75) recommendations.push("✅ Relatively safer route - standard supplies sufficient")

  // Danger explanation
  let dangerExplanation = `Route analysis: ${distance.toFixed(1)} km across `
  if (terrainType === "EXTREME") dangerExplanation += "extreme terrain. "
  else if (terrainType === "DIFFICULT") dangerExplanation += "difficult terrain. "
  else dangerExplanation += "varied terrain. "

  if (avgConflict > 6) dangerExplanation += "High conflict presence. "
  if (avgWeatherRisk > 6) dangerExplanation += "Severe weather conditions. "
  if (waterScore < 3) dangerExplanation += "Limited water sources. "
  if (foodScore < 3) dangerExplanation += "Limited food availability. "

  return {
    distance_km: Number.parseFloat(distance.toFixed(1)),
    duration_hours: Number.parseFloat(duration_hours.toFixed(1)),
    duration_days,
    nights_required,
    survival_score: Math.max(0, Math.min(100, survivalScore)),
    risk_level: riskLevel,
    terrain_difficulty: terrainType,
    conflict_intersections: conflictIntersections, // Declared variable here
    water_score: waterScore,
    food_score: foodScore,
    weather_risk: avgWeatherRisk,
    danger_explanation: dangerExplanation,
    recommendations,
    estimated_calories_per_day: estimatedCaloriesPerDay,
    estimated_water_liters_per_day: Number.parseFloat(adjustedWaterPerDay.toFixed(1)),
  }
}

// Find alternate routes with different risk profiles
export function findAlternateRoutes(
  source: RoutePoint,
  destination: RoutePoint,
  travelMode: "walking" | "vehicle",
): RouteAnalysis[] {
  const routes: RouteAnalysis[] = []

  // Generate 3 alternative routes with slight variations
  for (let i = 0; i < 3; i++) {
    const variance = 0.1 + i * 0.05
    const altDest = {
      lat: destination.lat + (Math.random() - 0.5) * variance,
      lon: destination.lon + (Math.random() - 0.5) * variance,
    }
    routes.push(analyzeRoute(source, altDest, travelMode))
  }

  return routes.sort((a, b) => b.survival_score - a.survival_score)
}
