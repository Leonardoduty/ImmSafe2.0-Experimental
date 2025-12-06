"use client"

import type React from "react"

import { useState } from "react"
import { Upload, AlertCircle, CheckCircle2 } from "lucide-react"
import NavigationBar from "@/components/navigation/navigation-bar"
import { identifyFoodFromImage, commonEdiblePlants } from "@/lib/food-identifier"

export default function FoodIdentifierPage() {
  const [selectedTab, setSelectedTab] = useState<"upload" | "plants" | "water">("upload")
  const [result, setResult] = useState<any>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      // Simulate image analysis
      setTimeout(() => {
        const mockAnalysis = identifyFoodFromImage({
          colors: ["green"],
          shapes: ["leafy"],
          textures: ["smooth"],
        })
        setResult(mockAnalysis)
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar onSOS={() => {}} />

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3 mb-2">
            <Upload className="h-8 w-8" />
            FOOD & PLANT IDENTIFIER
          </h1>
          <p className="text-muted-foreground">Identify edible plants, water safety, and potential dangers</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border">
          {(["upload", "plants", "water"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-3 font-semibold text-sm transition border-b-2 ${
                selectedTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "upload" && "Image Analysis"}
              {tab === "plants" && "Common Plants"}
              {tab === "water" && "Water Safety"}
            </button>
          ))}
        </div>

        {/* Upload Section */}
        {selectedTab === "upload" && (
          <div className="space-y-4">
            <div className="rounded-lg border-2 border-dashed border-border bg-card/50 p-8 text-center cursor-pointer hover:border-primary hover:bg-card/80 transition">
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="upload" />
              <label htmlFor="upload" className="cursor-pointer">
                <div className="text-4xl mb-2">📸</div>
                <p className="text-sm font-semibold text-foreground">Click to upload or drag image</p>
                <p className="text-xs text-muted-foreground">Take photo of food, plant, or water source</p>
              </label>
            </div>

            {result && (
              <div className="space-y-4">
                {/* Results */}
                <div
                  className={`rounded-lg border p-4 ${
                    result.safety_assessment === "SAFE" ? "border-primary bg-primary/10" : "border-accent bg-accent/10"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {result.safety_assessment === "SAFE" ? (
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-accent mt-0.5" />
                    )}
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Identified Items:</h3>
                      <div className="space-y-1 mb-3">
                        {result.identified_items.map((item: string, idx: number) => (
                          <p key={idx} className="text-sm text-foreground">
                            • {item}
                          </p>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground">Safety:</span>
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded ${
                            result.safety_assessment === "SAFE"
                              ? "bg-primary/20 text-primary"
                              : "bg-accent/20 text-accent"
                          }`}
                        >
                          {result.safety_assessment}
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          Confidence: {(result.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preparation */}
                {result.preparation_instructions.length > 0 && (
                  <div className="rounded-lg border border-border bg-card p-4">
                    <h4 className="font-semibold text-foreground mb-2">Preparation Instructions:</h4>
                    <ul className="space-y-1">
                      {result.preparation_instructions.map((instruction: string, idx: number) => (
                        <li key={idx} className="text-sm text-foreground flex gap-2">
                          <span className="text-primary">•</span> {instruction}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Warnings */}
                {result.warnings.length > 0 && (
                  <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
                    <h4 className="font-semibold text-yellow-200 mb-2">Warnings:</h4>
                    <ul className="space-y-1">
                      {result.warnings.map((warning: string, idx: number) => (
                        <li key={idx} className="text-sm text-yellow-200 flex gap-2">
                          <span>⚠️</span> {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Common Plants Reference */}
        {selectedTab === "plants" && (
          <div className="space-y-4">
            {Object.entries(commonEdiblePlants).map(([plant, info]) => (
              <div key={plant} className="rounded-lg border border-border bg-card p-4">
                <h3 className="font-bold text-primary capitalize mb-2">{plant.replace(/_/g, " ")}</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Identification:</p>
                    <p className="text-foreground">{info.identification}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Preparation:</p>
                    <p className="text-foreground">{info.preparation}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Nutrition:</p>
                    <p className="text-foreground">{info.nutrition}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-500 flex-shrink-0">⚠️</span>
                    <p className="text-foreground text-sm">{info.warning}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Water Safety */}
        {selectedTab === "water" && (
          <div className="space-y-4">
            <div className="rounded-lg border border-secondary/30 bg-secondary/10 p-4 space-y-3">
              <h3 className="font-bold text-secondary">Water Safety Assessment</h3>

              <div className="space-y-2 text-sm">
                <h4 className="font-semibold text-foreground">Signs of Safe Water:</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>✓ Clear, no visible particles or discoloration</li>
                  <li>✓ No unusual smell (fresh/earthy is normal)</li>
                  <li>✓ Running water preferred over stagnant</li>
                  <li>✓ Upstream from human/animal activity</li>
                  <li>✓ No dead animals or debris nearby</li>
                </ul>
              </div>

              <div className="space-y-2 text-sm">
                <h4 className="font-semibold text-accent">Danger Signs:</h4>
                <ul className="text-foreground space-y-1">
                  <li>✗ Cloudy, brown, or discolored water</li>
                  <li>✗ Chemical smell, petroleum smell, or unusual odor</li>
                  <li>✗ Dead animals upstream or in water</li>
                  <li>✗ Algae blooms or film on surface</li>
                  <li>✗ Close to military areas or industrial sites</li>
                </ul>
              </div>

              <div className="space-y-2 text-sm">
                <h4 className="font-semibold text-primary">Purification Methods:</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>1. Boil: 1 minute at sea level, 3 minutes at altitude</li>
                  <li>2. Tablets: Follow instructions (chlorine/iodine)</li>
                  <li>3. Filter: Layer sand, gravel, cloth (removes particles only)</li>
                  <li>4. Solar: Clear bottle in sun for 6+ hours (UV disinfects)</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
