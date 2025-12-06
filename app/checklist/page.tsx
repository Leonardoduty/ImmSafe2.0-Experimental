"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Download, Package2, AlertCircle, CheckCircle } from "lucide-react"
import NavigationBar from "@/components/navigation/navigation-bar"
import { calculateSupplies } from "@/lib/supply-calculator"

const SAMPLE_JOURNEY = {
  distance_km: 45,
  duration_days: 3,
  nights_required: 2,
  terrain_difficulty: "MODERATE",
  weather_risk: 5,
  conflict_level: 4,
  water_availability_score: 5,
  food_availability_score: 3,
  has_children: true,
  has_elderly: false,
  group_size: 4,
  temperature_min: 8,
  temperature_max: 22,
}

export default function ChecklistPage() {
  const [supplies, setSupplies] = useState<any>(null)
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    const result = calculateSupplies(SAMPLE_JOURNEY)
    setSupplies(result)
  }, [])

  if (!supplies) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationBar onSOS={() => {}} />
        <div className="flex items-center justify-center p-4 h-screen">
          <div className="text-muted-foreground">Loading checklist...</div>
        </div>
      </div>
    )
  }

  const toggleItem = (itemId: string) => {
    const newChecked = new Set(checkedItems)
    if (newChecked.has(itemId)) {
      newChecked.delete(itemId)
    } else {
      newChecked.add(itemId)
    }
    setCheckedItems(newChecked)
  }

  const handleDownloadPDF = () => {
    alert("PDF download functionality would be implemented here")
  }

  const renderSupplySection = (title: string, items: any[], icon: React.ReactNode, color: string) => {
    if (items.length === 0) return null

    const checkedCount = items.filter((item) => checkedItems.has(`${title}-${item.name}`)).length

    return (
      <div key={title} className="rounded-lg border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-8 w-8 flex items-center justify-center rounded-lg ${color}`}>{icon}</div>
            <div>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="text-xs text-muted-foreground">
                {checkedCount} of {items.length} items packed
              </p>
            </div>
          </div>
          <div className="h-6 w-full max-w-xs rounded-full bg-muted/30 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
              style={{ width: `${(checkedCount / items.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          {items.map((item) => {
            const itemId = `${title}-${item.name}`
            const isChecked = checkedItems.has(itemId)

            return (
              <label key={itemId} className="flex gap-3 rounded-lg p-2 hover:bg-muted/30 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleItem(itemId)}
                  className="h-5 w-5 mt-1"
                />
                <div className="flex-1">
                  <div
                    className={`text-sm font-medium ${isChecked ? "line-through text-muted-foreground" : "text-foreground"}`}
                  >
                    {item.quantity} {item.unit} - {item.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.weight_grams > 0 && `${(item.weight_grams / 1000).toFixed(2)}kg`}
                    {item.priority && ` • Priority: ${item.priority}`}
                  </div>
                  {item.notes && <div className="text-xs text-muted-foreground italic mt-1">{item.notes}</div>}
                </div>
              </label>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar onSOS={() => {}} />

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
                <Package2 className="h-8 w-8" />
                AUTO-GENERATED PACKING CHECKLIST
              </h1>
              <p className="text-muted-foreground mt-2">Customized for your journey profile</p>
            </div>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground hover:shadow-lg hover:shadow-primary/50"
            >
              <Download className="h-5 w-5" />
              Download PDF
            </button>
          </div>

          {/* Journey Summary */}
          <div className="grid grid-cols-4 gap-4">
            {[
              {
                label: "Distance",
                value: `${SAMPLE_JOURNEY.distance_km}km`,
                color: "bg-secondary/10 border-secondary/30",
              },
              {
                label: "Duration",
                value: `${SAMPLE_JOURNEY.duration_days}d ${SAMPLE_JOURNEY.nights_required}n`,
                color: "bg-yellow-500/10 border-yellow-500/30",
              },
              { label: "Total Weight", value: `${supplies.total_weight_kg}kg`, color: "bg-accent/10 border-accent/30" },
              {
                label: "Water",
                value: `${supplies.water_liters_total.toFixed(1)}L`,
                color: "bg-primary/10 border-primary/30",
              },
            ].map((stat, idx) => (
              <div key={idx} className={`rounded-lg border p-3 ${stat.color}`}>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-lg font-bold text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Warnings */}
        {supplies.critical_warnings.length > 0 && (
          <div className="rounded-lg border border-accent/30 bg-accent/10 p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                {supplies.critical_warnings.map((warning: string, idx: number) => (
                  <p key={idx} className="text-sm text-accent">
                    {warning}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Supply Sections */}
        <div className="space-y-4">
          {renderSupplySection(
            "WATER",
            [
              {
                quantity: supplies.water_liters_total,
                unit: "liters",
                name: "Fresh water",
                weight_grams: supplies.water_liters_total * 1000,
                notes: `${supplies.water_containers_needed} containers needed`,
              },
            ],
            "💧",
            "bg-secondary/20",
          )}

          {renderSupplySection("FOOD", supplies.food_items, "🍽️", "bg-yellow-500/20")}

          {renderSupplySection("MEDICAL", supplies.medical_items, "🏥", "bg-accent/20")}

          {renderSupplySection("CLOTHING", supplies.clothing_items, "👕", "bg-cyan-500/20")}

          {renderSupplySection("SHELTER", supplies.shelter_items, "🏕️", "bg-orange-500/20")}

          {renderSupplySection("OTHER", supplies.miscellaneous_items, "🎒", "bg-purple-500/20")}
        </div>

        {/* Survival Considerations */}
        {supplies.survival_considerations.length > 0 && (
          <div className="rounded-lg border border-primary/30 bg-primary/10 p-4">
            <div className="flex gap-3">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-semibold text-primary">Survival Considerations</h3>
                {supplies.survival_considerations.map((consideration: string, idx: number) => (
                  <p key={idx} className="text-sm text-primary/80">
                    • {consideration}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Export Section */}
        <div className="rounded-lg border border-border bg-card p-4 text-center space-y-3">
          <p className="text-sm text-muted-foreground">Save your checklist for offline access</p>
          <div className="flex gap-3 justify-center">
            <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-muted">
              <Download className="h-4 w-4" />
              Export as PDF
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-muted">
              Download as Text
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
