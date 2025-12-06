// Supply & Survival Calculation Engine

interface JourneyProfile {
  distance_km: number
  duration_days: number
  nights_required: number
  terrain_difficulty: string
  weather_risk: number
  conflict_level: number
  water_availability_score: number
  food_availability_score: number
  has_children: boolean
  has_elderly: boolean
  group_size: number
  temperature_min: number
  temperature_max: number
}

interface SupplyItem {
  category: string
  name: string
  quantity: number
  unit: string
  weight_grams: number
  calories?: number
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
  notes: string
}

interface SupplyCalculation {
  water_liters_total: number
  water_containers_needed: number
  food_items: SupplyItem[]
  medical_items: SupplyItem[]
  clothing_items: SupplyItem[]
  shelter_items: SupplyItem[]
  miscellaneous_items: SupplyItem[]
  total_weight_kg: number
  survival_considerations: string[]
  critical_warnings: string[]
}

export function calculateSupplies(profile: JourneyProfile): SupplyCalculation {
  const items: SupplyItem[] = []
  const warnings: string[] = []
  const considerations: string[] = []

  // ===== WATER CALCULATION =====
  let waterPerDay = 3 // liters base
  if (profile.weather_risk > 7) waterPerDay += 2 // extreme heat
  if (profile.terrain_difficulty === "EXTREME") waterPerDay += 1 // mountainous
  if (profile.temperature_max > 40) waterPerDay += 2 // very hot
  if (profile.has_children) waterPerDay += 0.5 * profile.group_size * 0.3 // children drink less
  if (profile.has_elderly) waterPerDay += 0.5 * profile.group_size * 0.2 // elderly need more

  const totalWater = waterPerDay * profile.duration_days
  const containerSize = 1.5 // liters per standard container
  const containersNeeded = Math.ceil(totalWater / containerSize)

  if (profile.water_availability_score < 3) {
    warnings.push("CRITICAL: Severe water scarcity - maximum water containers and purification tablets essential")
  }

  // ===== FOOD CALCULATION =====
  let caloriesPerDay = 2200 // base for moderate activity
  if (profile.terrain_difficulty === "DIFFICULT") caloriesPerDay += 500
  else if (profile.terrain_difficulty === "EXTREME") caloriesPerDay += 800
  if (profile.weather_risk > 6) caloriesPerDay += 300 // cold/extreme weather
  if (profile.has_children) caloriesPerDay += profile.group_size * 0.3 * 1500 // children eat ~1500/day
  if (profile.has_elderly) caloriesPerDay += profile.group_size * 0.2 * 1800

  const totalCalories = caloriesPerDay * profile.duration_days

  // High-energy food recommendations
  const foodItems = [
    {
      name: "High-energy bars",
      quantity: Math.ceil((totalCalories / 200) * 0.3),
      unit: "bars",
      calories: 200,
      weight_grams: 40,
    },
    {
      name: "Dried nuts & seeds",
      quantity: Math.ceil((totalCalories / 600) * 0.25),
      unit: "servings",
      calories: 600,
      weight_grams: 100,
    },
    {
      name: "Instant rice/noodles",
      quantity: Math.ceil((totalCalories / 400) * 0.25),
      unit: "packets",
      calories: 400,
      weight_grams: 80,
    },
    {
      name: "Canned fish/beans",
      quantity: Math.ceil((totalCalories / 300) * 0.15),
      unit: "cans",
      calories: 300,
      weight_grams: 150,
    },
    {
      name: "Dried fruit",
      quantity: Math.ceil((totalCalories / 250) * 0.05),
      unit: "packs",
      calories: 250,
      weight_grams: 50,
    },
  ]

  foodItems.forEach((food, idx) => {
    items.push({
      category: "FOOD",
      name: food.name,
      quantity: food.quantity,
      unit: food.unit,
      weight_grams: food.quantity * food.weight_grams,
      calories: food.calories * food.quantity,
      priority: idx === 0 ? "CRITICAL" : idx < 3 ? "HIGH" : "MEDIUM",
      notes: `Provides ${food.calories} cal per ${food.unit}`,
    })
  })

  if (profile.food_availability_score < 3) {
    warnings.push("CRITICAL: Food scarcity - carry maximum calorie-dense supplies")
  }

  if (profile.food_availability_score < 3 && profile.has_children) {
    warnings.push("Children at risk from malnutrition - prioritize high-calorie foods")
  }

  // ===== MEDICAL ITEMS =====
  const medicalBase: SupplyItem[] = [
    {
      category: "MEDICAL",
      name: "First-aid kit",
      quantity: 1,
      unit: "kit",
      weight_grams: 400,
      priority: "CRITICAL",
      notes: "Bandages, antiseptic, wound dressing",
    },
    {
      category: "MEDICAL",
      name: "Prescription medicines",
      quantity: profile.duration_days + 3,
      unit: "doses",
      weight_grams: 0.5 * (profile.duration_days + 3),
      priority: "CRITICAL",
      notes: "Any required daily medications",
    },
    {
      category: "MEDICAL",
      name: "Antibiotics",
      quantity: 2,
      unit: "courses",
      weight_grams: 50,
      priority: "HIGH",
      notes: "For infection treatment",
    },
    {
      category: "MEDICAL",
      name: "Pain relief",
      quantity: 10,
      unit: "tablets",
      weight_grams: 20,
      priority: "HIGH",
      notes: "Paracetamol/ibuprofen for pain",
    },
    {
      category: "MEDICAL",
      name: "Anti-diarrhea medication",
      quantity: 10,
      unit: "tablets",
      weight_grams: 20,
      priority: "HIGH",
      notes: "Critical for water-borne illness",
    },
    {
      category: "MEDICAL",
      name: "ORS packets",
      quantity: 10,
      unit: "packets",
      weight_grams: 30,
      priority: "HIGH",
      notes: "Oral rehydration for dehydration",
    },
  ]

  if (profile.weather_risk > 6) {
    medicalBase.push({
      category: "MEDICAL",
      name: "Burn/cold treatment",
      quantity: 2,
      unit: "tubes",
      weight_grams: 50,
      priority: "HIGH",
      notes: "For extreme temperature injuries",
    })
  }

  if (profile.conflict_level > 6) {
    medicalBase.push({
      category: "MEDICAL",
      name: "Trauma/bleeding kit",
      quantity: 1,
      unit: "kit",
      weight_grams: 300,
      priority: "CRITICAL",
      notes: "For serious injuries",
    })
  }

  items.push(...medicalBase)

  // ===== CLOTHING ITEMS =====
  const clothingBase: SupplyItem[] = [
    {
      category: "CLOTHING",
      name: "Sturdy walking shoes",
      quantity: 1,
      unit: "pair",
      weight_grams: 500,
      priority: "CRITICAL",
      notes: "Essential for long-distance travel",
    },
    {
      category: "CLOTHING",
      name: "Quick-dry shirt/top",
      quantity: 2,
      unit: "pieces",
      weight_grams: 200,
      priority: "HIGH",
      notes: "Moisture-wicking material",
    },
    {
      category: "CLOTHING",
      name: "Pants/trousers",
      quantity: 1,
      unit: "pair",
      weight_grams: 300,
      priority: "HIGH",
      notes: "Durable, protective",
    },
    {
      category: "CLOTHING",
      name: "Warm layers",
      quantity: 2,
      unit: "pieces",
      weight_grams: 400,
      priority: "HIGH",
      notes: "Fleece or wool",
    },
  ]

  if (profile.temperature_min < 10) {
    clothingBase.push({
      category: "CLOTHING",
      name: "Winter coat/jacket",
      quantity: 1,
      unit: "piece",
      weight_grams: 800,
      priority: "CRITICAL",
      notes: "Insulated, waterproof",
    })
  }

  if (profile.weather_risk > 6) {
    clothingBase.push({
      category: "CLOTHING",
      name: "Raincoat/poncho",
      quantity: 1,
      unit: "piece",
      weight_grams: 300,
      priority: "HIGH",
      notes: "Waterproof protection",
    })
  }

  if (profile.has_children) {
    clothingBase.push({
      category: "CLOTHING",
      name: "Children's clothing set",
      quantity: profile.group_size * 0.3,
      unit: "sets",
      weight_grams: 400,
      priority: "HIGH",
      notes: "Sized appropriately",
    })
  }

  items.push(...clothingBase)

  // ===== SHELTER ITEMS =====
  const shelterBase: SupplyItem[] = []

  const blankets = Math.ceil(profile.group_size / 2) + 1 // extra for warmth
  shelterBase.push({
    category: "SHELTER",
    name: "Blankets/thermal blankets",
    quantity: blankets,
    unit: "pieces",
    weight_grams: blankets * 400,
    priority: profile.temperature_min < 15 ? "CRITICAL" : "HIGH",
    notes: "Emergency blankets for warmth",
  })

  if (profile.nights_required > 2) {
    shelterBase.push({
      category: "SHELTER",
      name: "Lightweight tarp/shelter",
      quantity: 1,
      unit: "piece",
      weight_grams: 500,
      priority: "HIGH",
      notes: "Weather protection",
    })
  }

  shelterBase.push({
    category: "SHELTER",
    name: "Sleeping mat/foam",
    quantity: profile.group_size,
    unit: "mats",
    weight_grams: profile.group_size * 300,
    priority: "MEDIUM",
    notes: "Insulation from ground",
  })

  items.push(...shelterBase)

  // ===== MISCELLANEOUS =====
  const miscBase: SupplyItem[] = [
    {
      category: "MISC",
      name: "Water purification tablets",
      quantity: Math.ceil(totalWater / 2),
      unit: "tablets",
      weight_grams: 50,
      priority: "CRITICAL",
      notes: "Each purifies ~1L water",
    },
    {
      category: "MISC",
      name: "Flashlight/headlamp",
      quantity: 1,
      unit: "piece",
      weight_grams: 200,
      priority: "HIGH",
      notes: "With extra batteries",
    },
    {
      category: "MISC",
      name: "Map/compass/GPS",
      quantity: 1,
      unit: "set",
      weight_grams: 300,
      priority: "CRITICAL",
      notes: "Navigation essential",
    },
    {
      category: "MISC",
      name: "Whistle",
      quantity: 1,
      unit: "piece",
      weight_grams: 20,
      priority: "HIGH",
      notes: "Emergency signaling",
    },
    {
      category: "MISC",
      name: "Rope/cordage",
      quantity: 20,
      unit: "meters",
      weight_grams: 200,
      priority: "MEDIUM",
      notes: "Multiple uses",
    },
    {
      category: "MISC",
      name: "Matches/lighter",
      quantity: 2,
      unit: "pieces",
      weight_grams: 50,
      priority: "HIGH",
      notes: "Waterproof container",
    },
    {
      category: "MISC",
      name: "Emergency documents",
      quantity: 1,
      unit: "set",
      weight_grams: 50,
      priority: "CRITICAL",
      notes: "Papers in waterproof bag",
    },
  ]

  if (profile.has_children) {
    miscBase.push({
      category: "MISC",
      name: "Child supplies (diapers/milk)",
      quantity: Math.ceil(profile.duration_days * profile.group_size * 0.3),
      unit: "portions",
      weight_grams: 150,
      priority: "CRITICAL",
      notes: "As needed for children",
    })
  }

  if (profile.has_elderly) {
    miscBase.push({
      category: "MISC",
      name: "Elderly care items",
      quantity: profile.group_size * 0.2,
      unit: "kits",
      weight_grams: 200,
      priority: "HIGH",
      notes: "Mobility aids, comfort items",
    })
  }

  items.push(...miscBase)

  // ===== CALCULATE TOTAL WEIGHT =====
  const totalWeight = items.reduce((sum, item) => sum + item.weight_grams, 0) / 1000

  // ===== CONSIDERATIONS =====
  if (totalWeight > 25) {
    considerations.push("⚠️ Pack weight exceeds 25kg - consider priority items only for carrying")
  }
  if (profile.terrain_difficulty === "EXTREME") {
    considerations.push("Extreme terrain requires proper footwear and climbing equipment")
  }
  if (profile.conflict_level > 7) {
    considerations.push("High conflict - minimize visibility, avoid main routes, travel in groups")
  }
  if (profile.weather_risk > 7) {
    considerations.push("Severe weather expected - seek shelter regularly, monitor conditions")
  }

  return {
    water_liters_total: totalWater,
    water_containers_needed: containersNeeded,
    food_items: items.filter((i) => i.category === "FOOD"),
    medical_items: items.filter((i) => i.category === "MEDICAL"),
    clothing_items: items.filter((i) => i.category === "CLOTHING"),
    shelter_items: items.filter((i) => i.category === "SHELTER"),
    miscellaneous_items: items.filter((i) => i.category === "MISC"),
    total_weight_kg: Number.parseFloat(totalWeight.toFixed(2)),
    survival_considerations: considerations,
    critical_warnings: warnings,
  }
}
