"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Droplet, Utensils, AlertCircle, Download } from "lucide-react"
import { analyzeRoute } from "@/lib/route-engine"
import { downloadBlob, generateSurvivalPDF, exportMapAsPNG, createOfflineZip } from "@/lib/export-utils"

interface RouteAnalyzerProps {
  source?: { lat: number; lon: number }
  destination?: { lat: number; lon: number }
  travelMode: "walking" | "vehicle"
  onAnalysisComplete?: (analysis: any) => void
}

export default function RouteAnalyzer({ source, destination, travelMode, onAnalysisComplete }: RouteAnalyzerProps) {
  const [analysis, setAnalysis] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const memoizedOnAnalysisComplete = useCallback(
    (result: any) => {
      onAnalysisComplete?.(result)
    },
    [onAnalysisComplete],
  )

  useEffect(() => {
    if (source && destination) {
      setIsLoading(true)
      setTimeout(() => {
        const result = analyzeRoute(source, destination, travelMode)
        setAnalysis(result)
        memoizedOnAnalysisComplete(result)
        setIsLoading(false)
      }, 800)
    }
  }, [source, destination, travelMode, memoizedOnAnalysisComplete])

  const handleDownloadSurvivalPack = async () => {
    if (!analysis) return
    setIsExporting(true)

    try {
      const pdfBlob = await generateSurvivalPDF({
        routeSummary: `From (${source?.lat}, ${source?.lon}) to (${destination?.lat}, ${destination?.lon}). Distance: ${analysis.distance_km}km, Duration: ${analysis.duration_days}d, Risk: ${analysis.risk_level}`,
        supplies: [
          `Water: ${analysis.estimated_water_liters_per_day}L/day × ${analysis.duration_days} days`,
          `Food: ${analysis.estimated_calories_per_day} cal/day`,
          "First aid kit",
          "Shelter materials",
          "Navigation equipment",
        ],
        weatherWarnings: analysis.recommendations.filter((r: string) => r.includes("⛈️") || r.includes("⚠️")),
        hazardZones: [
          `Conflict intersections: ${analysis.conflict_intersections}`,
          `Terrain: ${analysis.terrain_difficulty}`,
          `Weather risk: ${analysis.weather_risk.toFixed(1)}/10`,
        ],
        waterPoints: ["Query OSM for water sources along route", "Camp near rivers/streams", "Collect rainwater"],
        emergencyContacts: ["Local NGOs", "Red Cross/Red Crescent", "UN agencies", "Border crossing officials"],
      })

      downloadBlob(pdfBlob, "survival-pack.pdf")
    } catch (error) {
      console.error("[v0] Error generating PDF:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleDownloadMap = async () => {
    if (!canvasRef.current) return
    setIsExporting(true)

    try {
      const blob = await exportMapAsPNG(canvasRef.current)
      downloadBlob(blob, "map-snapshot.png")
    } catch (error) {
      console.error("[v0] Error exporting map:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleDownloadOfflinePack = async () => {
    if (!analysis) return
    setIsExporting(true)

    try {
      const pdfBlob = await generateSurvivalPDF({
        routeSummary: `From (${source?.lat}, ${source?.lon}) to (${destination?.lat}, ${destination?.lon}). Distance: ${analysis.distance_km}km`,
        supplies: [
          `Water: ${analysis.estimated_water_liters_per_day}L/day`,
          `Food: ${analysis.estimated_calories_per_day} cal/day`,
        ],
        weatherWarnings: analysis.recommendations,
        hazardZones: [`Conflict: ${analysis.conflict_intersections}`],
        waterPoints: ["Rivers", "Streams", "Wells"],
        emergencyContacts: ["NGOs", "Red Cross"],
      })

      // Map PNG (simulated)
      const mapPngBlob = new Blob(["map data"], { type: "image/png" })

      // Create ZIP
      const zipBlob = await createOfflineZip(
        { source, destination, analysis },
        {
          water: analysis.estimated_water_liters_per_day,
          calories: analysis.estimated_calories_per_day,
        },
        pdfBlob,
        mapPngBlob,
        {
          arabic: "Emergency phrases",
          kurdish: "Emergency phrases",
          turkish: "Emergency phrases",
          farsi: "Emergency phrases",
        },
      )

      downloadBlob(zipBlob, "offline-pack.zip")
    } catch (error) {
      console.error("[v0] Error creating ZIP:", error)
    } finally {
      setIsExporting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-3 rounded-lg border border-border bg-card/50 p-6">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-sm text-muted-foreground">Analyzing global route...</span>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="rounded-lg border border-border bg-card p-4 text-center text-sm text-muted-foreground">
        Enter source and destination to analyze
      </div>
    )
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "LOW":
        return "border-primary text-primary bg-primary/10"
      case "MEDIUM":
        return "border-yellow-500 text-yellow-400 bg-yellow-500/10"
      case "HIGH":
        return "border-orange-500 text-orange-400 bg-orange-500/10"
      case "CRITICAL":
        return "border-accent text-accent bg-accent/10"
      default:
        return "border-muted text-muted-foreground bg-muted/10"
    }
  }

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-5">
      {/* Header with Survival Score */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">ROUTE ANALYSIS</h3>
        <div className={`rounded-lg px-3 py-1 text-sm font-bold border ${getRiskColor(analysis.risk_level)}`}>
          RISK: {analysis.risk_level}
        </div>
      </div>

      {/* Survival Score */}
      <div className="rounded-lg bg-muted/30 p-4 border border-muted/50">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-secondary">SURVIVAL PROBABILITY</span>
          <span className="text-2xl font-bold text-primary">{analysis.survival_score}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted/50">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
            style={{ width: `${analysis.survival_score}%` }}
          />
        </div>
      </div>

      {/* Basic Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border bg-muted/30 p-3">
          <p className="text-xs text-muted-foreground">DISTANCE</p>
          <p className="text-lg font-bold text-foreground">{analysis.distance_km} km</p>
        </div>
        <div className="rounded-lg border border-border bg-muted/30 p-3">
          <p className="text-xs text-muted-foreground">DURATION</p>
          <p className="text-lg font-bold text-foreground">
            {analysis.duration_days}d {Math.round(analysis.duration_hours % 8)}h
          </p>
        </div>
      </div>

      {/* Terrain and Conflicts */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border bg-muted/30 p-3">
          <p className="text-xs text-muted-foreground">TERRAIN</p>
          <p className="text-sm font-semibold text-foreground">{analysis.terrain_difficulty}</p>
        </div>
        <div className="rounded-lg border border-border bg-muted/30 p-3">
          <p className="text-xs text-muted-foreground">CONFLICT AREAS</p>
          <p className="text-sm font-semibold text-accent">{analysis.conflict_intersections}</p>
        </div>
      </div>

      {/* Resource Scores */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Droplet className="h-4 w-4 text-secondary" />
            Water Availability
          </div>
          <span className="text-sm font-semibold text-secondary">{analysis.water_score}/10</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted/50">
          <div
            className="h-full rounded-full bg-secondary"
            style={{ width: `${(analysis.water_score / 10) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Utensils className="h-4 w-4 text-yellow-500" />
            Food Availability
          </div>
          <span className="text-sm font-semibold text-yellow-500">{analysis.food_score}/10</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted/50">
          <div
            className="h-full rounded-full bg-yellow-500"
            style={{ width: `${(analysis.food_score / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* Danger Explanation */}
      <div className="flex gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3">
        <AlertCircle className="h-4 w-4 flex-shrink-0 text-yellow-500 mt-0.5" />
        <p className="text-xs text-yellow-200">{analysis.danger_explanation}</p>
      </div>

      {/* Recommendations */}
      {analysis.recommendations.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-primary">RECOMMENDATIONS:</p>
          <div className="space-y-1">
            {analysis.recommendations.map((rec: string, i: number) => (
              <div key={i} className="flex gap-2 text-xs text-muted-foreground">
                <span className="flex-shrink-0">•</span>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Supply Estimates */}
      <div className="border-t border-border pt-3 space-y-2">
        <p className="text-xs font-semibold text-secondary">ESTIMATED SUPPLY NEEDS:</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg bg-muted/30 p-2 border border-border">
            <p className="text-muted-foreground">Calories/day</p>
            <p className="font-semibold text-foreground">{analysis.estimated_calories_per_day}</p>
          </div>
          <div className="rounded-lg bg-muted/30 p-2 border border-border">
            <p className="text-muted-foreground">Water/day</p>
            <p className="font-semibold text-foreground">{analysis.estimated_water_liters_per_day}L</p>
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="border-t border-border pt-3 space-y-2">
        <p className="text-xs font-semibold text-primary mb-2">DOWNLOAD:</p>
        <button
          onClick={handleDownloadSurvivalPack}
          disabled={isExporting}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-primary bg-primary/10 hover:bg-primary/20 text-primary px-3 py-2 text-sm font-semibold transition disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          {isExporting ? "Exporting..." : "Download Survival Pack (PDF)"}
        </button>
        <button
          onClick={handleDownloadMap}
          disabled={isExporting}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-secondary bg-secondary/10 hover:bg-secondary/20 text-secondary px-3 py-2 text-sm font-semibold transition disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          {isExporting ? "Exporting..." : "Download Map Snapshot (PNG)"}
        </button>
        <button
          onClick={handleDownloadOfflinePack}
          disabled={isExporting}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-accent bg-accent/10 hover:bg-accent/20 text-accent px-3 py-2 text-sm font-semibold transition disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          {isExporting ? "Exporting..." : "Download Full Offline Pack (ZIP)"}
        </button>
      </div>
    </div>
  )
}
