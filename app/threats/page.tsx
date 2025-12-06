"use client"

import type React from "react"

import { useState } from "react"
import { AlertTriangle, MapPin } from "lucide-react"
import NavigationBar from "@/components/navigation/navigation-bar"
import { analyzeThreatFromImage, sampleBorderCheckpoints } from "@/lib/image-threat-analyzer"

export default function ThreatAnalysisPage() {
  const [selectedTab, setSelectedTab] = useState<"threats" | "borders">("threats")
  const [threatResult, setThreatResult] = useState<any>(null)
  const [selectedBorder, setSelectedBorder] = useState<any>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      // Simulate threat analysis
      setTimeout(() => {
        const mockAnalysis = analyzeThreatFromImage({
          colors: ["green", "brown"],
          shapes: ["rectangular"],
          objects: ["vehicle"],
          patterns: ["camouflage"],
        })
        setThreatResult(mockAnalysis)
      }, 1000)
    }
  }

  const getThreatColor = (level: string) => {
    switch (level) {
      case "SAFE":
        return "border-primary text-primary bg-primary/10"
      case "CAUTION":
        return "border-yellow-500 text-yellow-400 bg-yellow-500/10"
      case "DANGER":
        return "border-orange-500 text-orange-400 bg-orange-500/10"
      case "CRITICAL":
        return "border-accent text-accent bg-accent/10"
      default:
        return "border-muted text-muted-foreground bg-muted/10"
    }
  }

  const getRiskScore = (score: number) => {
    const color =
      score < 3 ? "text-primary" : score < 5 ? "text-yellow-500" : score < 7 ? "text-orange-500" : "text-accent"
    const label = score < 3 ? "LOW" : score < 5 ? "MEDIUM" : score < 7 ? "HIGH" : "CRITICAL"
    return { color, label }
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar onSOS={() => {}} />

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-accent flex items-center gap-3 mb-2">
            <AlertTriangle className="h-8 w-8" />
            THREAT ANALYSIS & BORDER INTELLIGENCE
          </h1>
          <p className="text-muted-foreground">Detect dangers, assess border crossings, evaluate risk levels</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border">
          {(["threats", "borders"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-3 font-semibold text-sm transition border-b-2 ${
                selectedTab === tab
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "threats" && "Image Threat Scanner"}
              {tab === "borders" && "Border Crossings"}
            </button>
          ))}
        </div>

        {/* Threat Analysis Tab */}
        {selectedTab === "threats" && (
          <div className="space-y-6">
            {/* Upload */}
            <div className="rounded-lg border-2 border-dashed border-border bg-card/50 p-8 text-center cursor-pointer hover:border-accent hover:bg-card/80 transition">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="threat-upload" />
              <label htmlFor="threat-upload" className="cursor-pointer">
                <div className="text-4xl mb-2">📸</div>
                <p className="text-sm font-semibold text-foreground">Click to upload or drag image</p>
                <p className="text-xs text-muted-foreground">
                  Analyze military vehicles, landmines, conflict zones, collapsed buildings, etc.
                </p>
              </label>
            </div>

            {/* Results */}
            {threatResult && (
              <div className="space-y-4">
                {/* Threat Level Banner */}
                <div className={`rounded-lg border p-4 ${getThreatColor(threatResult.threat_level)}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg">THREAT LEVEL: {threatResult.threat_level}</h3>
                      <p className="text-sm mt-1">Analysis confidence: {(threatResult.confidence * 100).toFixed(0)}%</p>
                    </div>
                    <AlertTriangle className="h-8 w-8" />
                  </div>
                </div>

                {/* Threats Detected */}
                <div className="rounded-lg border border-border bg-card p-4">
                  <h4 className="font-bold text-foreground mb-3">Threats Detected:</h4>
                  <div className="space-y-2">
                    {threatResult.threats_detected.map((threat: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-accent" />
                        <span className="text-foreground">{threat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual Indicators */}
                {threatResult.visual_indicators.length > 0 && (
                  <div className="rounded-lg border border-border bg-card p-4">
                    <h4 className="font-bold text-foreground mb-3">Visual Indicators:</h4>
                    <div className="space-y-1">
                      {threatResult.visual_indicators.map((indicator: string, idx: number) => (
                        <p key={idx} className="text-sm text-muted-foreground">
                          • {indicator}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Affected Areas */}
                <div className="rounded-lg border border-border bg-card p-4">
                  <h4 className="font-bold text-foreground mb-3">Affected Areas:</h4>
                  <div className="space-y-1">
                    {threatResult.affected_areas.map((area: string, idx: number) => (
                      <p key={idx} className="text-sm text-muted-foreground">
                        • {area}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
                  <h4 className="font-bold text-yellow-200 mb-3">Immediate Actions:</h4>
                  <ol className="space-y-2">
                    {threatResult.recommendations.map((rec: string, idx: number) => (
                      <li key={idx} className="text-sm text-yellow-200 flex gap-2">
                        <span className="font-bold flex-shrink-0">{idx + 1}.</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            {/* Safety Tips */}
            <div className="rounded-lg border border-primary/30 bg-primary/10 p-4">
              <h4 className="font-bold text-primary mb-3">How to Use Threat Scanner:</h4>
              <ul className="space-y-2 text-sm text-primary/80">
                <li>✓ Photograph suspicious areas, military vehicles, damage</li>
                <li>✓ System analyzes visual features for threat indicators</li>
                <li>✓ Get risk assessment and recommended actions</li>
                <li>✓ Share findings only with trusted UN/NGO workers</li>
                <li>✓ Never confront or follow-up on military sightings</li>
              </ul>
            </div>
          </div>
        )}

        {/* Border Intelligence Tab */}
        {selectedTab === "borders" && (
          <div className="space-y-4">
            {/* Border Selection */}
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-secondary" />
                Available Border Crossings
              </h3>
              <div className="space-y-2">
                {sampleBorderCheckpoints.map((checkpoint, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedBorder(checkpoint)}
                    className={`w-full text-left rounded-lg px-4 py-3 border transition ${
                      selectedBorder?.name === checkpoint.name
                        ? "border-primary bg-primary/10"
                        : "border-border hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{checkpoint.name}</p>
                        <p className="text-xs text-muted-foreground">{checkpoint.country_pair}</p>
                      </div>
                      <div className="text-right text-xs">
                        <p className={`font-bold ${checkpoint.legal_crossing ? "text-primary" : "text-accent"}`}>
                          {checkpoint.legal_crossing ? "LEGAL" : "ILLEGAL"}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Border Details */}
            {selectedBorder && (
              <div className="space-y-4">
                {/* Risk Scores */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg border border-border bg-card p-4">
                    <p className="text-xs text-muted-foreground mb-2">CORRUPTION RISK</p>
                    <div className="flex items-end justify-between">
                      <span className={`text-3xl font-bold ${getRiskScore(selectedBorder.corruption_risk).color}`}>
                        {selectedBorder.corruption_risk}
                      </span>
                      <span className={`text-xs ${getRiskScore(selectedBorder.corruption_risk).color}`}>
                        {getRiskScore(selectedBorder.corruption_risk).label}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-4">
                    <p className="text-xs text-muted-foreground mb-2">VIOLENCE RISK</p>
                    <div className="flex items-end justify-between">
                      <span className={`text-3xl font-bold ${getRiskScore(selectedBorder.violence_risk).color}`}>
                        {selectedBorder.violence_risk}
                      </span>
                      <span className={`text-xs ${getRiskScore(selectedBorder.violence_risk).color}`}>
                        {getRiskScore(selectedBorder.violence_risk).label}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-4">
                    <p className="text-xs text-muted-foreground mb-2">SMUGGLER ACTIVITY</p>
                    <div>
                      <p
                        className={`text-lg font-bold ${selectedBorder.smuggler_activity ? "text-accent" : "text-primary"}`}
                      >
                        {selectedBorder.smuggler_activity ? "PRESENT" : "MINIMAL"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-secondary mb-1">LEGAL STATUS</p>
                    <p className={`text-sm ${selectedBorder.legal_crossing ? "text-primary" : "text-accent"}`}>
                      {selectedBorder.legal_crossing
                        ? "Official crossing point - recommended for documentation"
                        : "Illegal route - high risk, avoid if possible"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-secondary mb-1">UN RECOGNITION</p>
                    <p className="text-sm text-foreground">
                      {selectedBorder.unhcr_recognition
                        ? "Recognized by UNHCR - refugees have protections"
                        : "Not officially recognized - limited protections"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-secondary mb-2">REQUIRED DOCUMENTS</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedBorder.required_docs.map((doc, idx) => (
                        <span key={idx} className="rounded-lg bg-muted/50 px-2 py-1 text-xs text-foreground">
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border">
                    <p className="text-xs font-semibold text-secondary mb-1">ASSESSMENT NOTES</p>
                    <p className="text-sm text-foreground leading-relaxed">{selectedBorder.notes}</p>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
                  <h4 className="font-bold text-yellow-200 mb-2">Crossing Recommendations:</h4>
                  <ul className="space-y-1 text-sm text-yellow-200">
                    <li>• Travel during daylight hours</li>
                    <li>• Keep documents organized and accessible</li>
                    <li>• Don't carry large amounts of cash</li>
                    <li>• Travel in groups when possible</li>
                    <li>• Register with UNHCR before crossing if possible</li>
                    {selectedBorder.corruption_risk > 5 && (
                      <li>• Expect requests for bribes - negotiate respectfully</li>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
