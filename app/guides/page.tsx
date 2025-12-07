"use client"

import { useState } from "react"
import { BookOpen, Heart, Users, Languages, AlertTriangle } from "lucide-react"
import NavigationBar from "@/components/navigation/navigation-bar"
import { getAvailableLanguages, getLanguageGuide, type LanguageGuide } from "@/lib/language-guides"

interface Guide {
  id: string
  title: string
  icon: any
  color: string
  category: string
  content: string[]
}

const guides: Guide[] = [
  {
    id: "first-aid",
    title: "First Aid Essentials",
    icon: Heart,
    color: "text-accent",
    category: "medical",
    content: [
      "Wounds & Bleeding: Apply pressure with clean cloth, elevate, bandage tightly",
      "Dehydration: Rest in shade, drink water slowly with salt if available, cool body",
      "Hypothermia: Remove wet clothes, warm gradually, give warm drinks",
      "Heat Stroke: Move to shade, cool with water, rest flat with legs elevated",
      "Infection Signs: Redness, pus, fever - treat with antiseptic, keep clean & dry",
      "Sprains: Rest, ice (if available), compress, elevate",
    ],
  },
  {
    id: "water",
    title: "Finding Clean Water",
    icon: BookOpen,
    color: "text-secondary",
    category: "survival",
    content: [
      "Purification: Boil for 1 minute, use purification tablets, or filter through cloth & sand",
      "Sources: Running streams preferred over stagnant water, rainwater collection",
      "Signs of Safety: Clear water, no debris, no smell, upstream from human activity",
      "Danger Signs: Dead animals upstream, chemical smell, discoloration, cloudy appearance",
      "Immediate: Desperate situations - use any water with purification tablets",
      "Storage: Keep in clean, sealed containers away from sun",
    ],
  },
  {
    id: "shelter",
    title: "Emergency Shelter Building",
    icon: BookOpen,
    color: "text-yellow-500",
    category: "survival",
    content: [
      "Quick Shelter: Use fallen trees, rocks, dense bushes to block wind",
      "Lean-To: Prop branch against tree, cover with leaves/branches, insulate with dry material",
      "Snow Cave: Dig into snowbank on leeward side, small entrance keeps cold out",
      "Underground: Dig shallow trench, cover with branches & leaves, insulate floor",
      "Exposed Areas: Stay low, minimize heat loss, avoid high winds",
      "Materials: Use natural resources - branches, leaves, rocks, cloth",
    ],
  },
  {
    id: "fire",
    title: "Starting Fire Without Tools",
    icon: BookOpen,
    color: "text-orange-500",
    category: "survival",
    content: [
      "Friction Method: Dry stick in groove of wood, rub rapidly to create heat & ember",
      "Magnification: Use water drop on cloth to focus sun rays on dry kindling",
      "Friction Bow: Create bow with cord/vine to spin stick rapidly",
      "Tinder: Dry grass, bark, leaves catch easily",
      "Kindling: Small sticks to build flame gradually",
      "Fuel: Larger wood for sustained fire",
    ],
  },
  {
    id: "women-protection",
    title: "Women & Children Safety",
    icon: Users,
    color: "text-pink-500",
    category: "safety",
    content: [
      "Trafficking Warning Signs: Promises of work, separation from group, movement at night",
      "Safe Shelter Verification: Established organizations, multiple women present, reference checking",
      "Emergency Contacts: UNHCR offices, local NGOs, police stations for protection",
      "Travel Safety: Stay in groups, avoid isolated areas, trust instincts about people",
      "Healthcare: Women's clinics exist - ask other refugees for trusted locations",
      "Rights: Children cannot work, healthcare is your right, education is available",
    ],
  },
  {
    id: "mental-health",
    title: "Trauma & Stress Relief",
    icon: Heart,
    color: "text-purple-500",
    category: "mental",
    content: [
      "Panic Attacks: Find safe spot, breathe deeply (4 count in, 4 count out), ground yourself",
      "Grounding: Name 5 things you see, 4 you hear, 3 you feel, 2 you smell, 1 you taste",
      "Stress Relief: Physical activity helps - walk, stretch, dance if safe",
      "Sleep: Try to maintain routine, safe sleeping area reduces anxiety",
      "Connection: Talk to others, shared experience helps normalize trauma reactions",
      "Hope: Remember this is temporary, you are strong, help exists",
    ],
  },
  {
    id: "border",
    title: "Border Crossing Basics",
    icon: AlertTriangle,
    color: "text-secondary",
    category: "legal",
    content: [
      "Documentation: Gather identity documents, photos, medical records in waterproof bag",
      "Legal Crossings: Use official checkpoints when possible - safer than smugglers",
      "Checkpoints: Be honest, cooperate, keep hands visible, don't run",
      "Rights: You have rights even undocumented - state clearly you need assistance",
      "UNHCR Recognition: Mention if registered - increases access to protection",
      "Corruption: Bribery less common at official crossings than hidden routes",
    ],
  },
  {
    id: "food",
    title: "Identifying Edible Plants",
    icon: BookOpen,
    color: "text-green-500",
    category: "survival",
    content: [
      "Rule of Three: If unsure, don't eat - poisoning worse than hunger",
      "Safe Plants: Dandelion greens, clover, acorns (boil first), pine needles (tea)",
      "Danger Signs: White/umbrella flowers, milky sap, three leaflets (poison ivy)",
      "Testing: Rub on skin, wait 5 min, taste tongue, wait 15 min before swallowing",
      "Berries: Red/white/purple usually safer than white - but still test first",
      "Mushrooms: Extremely dangerous - avoid unless expert identification",
    ],
  },
]

// Use language guides from lib
const availableLanguages = getAvailableLanguages()

export default function GuidesPage() {
  const [selectedGuide, setSelectedGuide] = useState<string>("first-aid")
  const [selectedLanguage, setSelectedLanguage] = useState<string>("arabic")

  const activeGuide = guides.find((g) => g.id === selectedGuide)
  const IconComponent = activeGuide?.icon

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar onSOS={() => {}} />

      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3 mb-2">
            <BookOpen className="h-8 w-8" />
            HUMANITARIAN GUIDES & RESOURCES
          </h1>
          <p className="text-muted-foreground">Survival guides, first aid, and essential information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Guide Selection */}
          <div className="space-y-2">
            {guides.map((guide) => {
              const Icon = guide.icon
              const isActive = selectedGuide === guide.id

              return (
                <button
                  key={guide.id}
                  onClick={() => setSelectedGuide(guide.id)}
                  className={`w-full flex items-center gap-3 rounded-lg p-3 transition text-left ${
                    isActive ? "bg-primary/20 border border-primary" : "border border-border hover:bg-muted/30"
                  }`}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 ${guide.color}`} />
                  <span className={`text-sm font-medium ${isActive ? "text-primary" : "text-foreground"}`}>
                    {guide.title}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4">
            {activeGuide && (
              <>
                {/* Guide Header */}
                <div className="rounded-lg border border-border bg-card p-6">
                  <div className="flex items-center gap-4">
                    {IconComponent && <IconComponent className={`h-8 w-8 ${activeGuide.color}`} />}
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">{activeGuide.title}</h2>
                      <p className="text-sm text-muted-foreground">Essential information for survival</p>
                    </div>
                  </div>
                </div>

                {/* Guide Content */}
                <div className="rounded-lg border border-border bg-card p-6 space-y-3">
                  {activeGuide.content.map((paragraph, idx) => (
                    <div key={idx} className="flex gap-3">
                      <span className="flex-shrink-0 text-primary font-bold">•</span>
                      <p className="text-sm text-foreground">{paragraph}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Translation Module - Show for all guides */}
            <div className="rounded-lg border border-border bg-card p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Languages className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Multi-Language Survival Phrases</h3>
              </div>

              <div className="mb-4">
                <label className="text-sm text-muted-foreground mb-2 block">Select Language:</label>
                <div className="grid grid-cols-4 gap-2">
                  {availableLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setSelectedLanguage(lang.code)}
                      className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                        selectedLanguage === lang.code
                          ? "bg-primary text-primary-foreground"
                          : "border border-border hover:bg-muted"
                      }`}
                    >
                      {lang.language}
                    </button>
                  ))}
                </div>
              </div>

              {(() => {
                const langGuide = getLanguageGuide(selectedLanguage)
                if (!langGuide) return null

                return (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">{langGuide.title}</h4>
                    {langGuide.phrases.map((category, catIdx) => (
                      <div key={catIdx} className="space-y-2">
                        <h5 className="text-sm font-semibold text-primary">{category.category}</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {category.items.map((item, itemIdx) => (
                            <div key={itemIdx} className="rounded-lg bg-muted/30 p-3 border border-border">
                              <p className="text-xs text-muted-foreground mb-1">{item.english}</p>
                              <p className="text-sm font-semibold text-foreground">{item.translation}</p>
                              {item.phonetic && (
                                <p className="text-xs text-muted-foreground italic mt-1">({item.phonetic})</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
