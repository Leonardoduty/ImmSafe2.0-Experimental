"use client"

import { useState, useEffect, useCallback } from "react"
import { AlertCircle, Search, MapPin } from "lucide-react"
import RouteAnalyzer from "./route-analyzer"
import { autocomplete } from "@/lib/geocoder"

interface RoutePanelProps {
  onRouteSelect: (route: any) => void
  onCoordinatesChange?: (coords: {
    source?: { lat: number; lon: number }
    destination?: { lat: number; lon: number }
  }) => void
}

export default function RoutePanel({ onRouteSelect, onCoordinatesChange }: RoutePanelProps) {
  const [sourceInput, setSourceInput] = useState("")
  const [destInput, setDestInput] = useState("")
  const [source, setSource] = useState<{ lat: number; lon: number } | null>(null)
  const [destination, setDestination] = useState<{ lat: number; lon: number } | null>(null)
  const [travelMode, setTravelMode] = useState<"walking" | "vehicle">("walking")
  const [analysis, setAnalysis] = useState<any>(null)
  const [sourceSuggestions, setSourceSuggestions] = useState<any[]>([])
  const [destSuggestions, setDestSuggestions] = useState<any[]>([])
  const [showSourceDropdown, setShowSourceDropdown] = useState(false)
  const [showDestDropdown, setShowDestDropdown] = useState(false)

  const memoizedOnCoordinatesChange = useCallback(() => {
    onCoordinatesChange?.({ source, destination })
  }, [source, destination, onCoordinatesChange])

  useEffect(() => {
    memoizedOnCoordinatesChange()
  }, [memoizedOnCoordinatesChange])

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (sourceInput.length > 1) {
        const suggestions = await autocomplete(sourceInput)
        setSourceSuggestions(suggestions)
        setShowSourceDropdown(true)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [sourceInput])

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (destInput.length > 1) {
        const suggestions = await autocomplete(destInput)
        setDestSuggestions(suggestions)
        setShowDestDropdown(true)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [destInput])

  const handleSelectSource = (suggestion: any) => {
    setSource({ lat: suggestion.lat, lon: suggestion.lon })
    setSourceInput(suggestion.name)
    setShowSourceDropdown(false)
  }

  const handleSelectDestination = (suggestion: any) => {
    setDestination({ lat: suggestion.lat, lon: suggestion.lon })
    setDestInput(suggestion.name)
    setShowDestDropdown(false)
  }

  const handleAnalysisComplete = useCallback(
    (result: any) => {
      setAnalysis(result)
      onRouteSelect(result)
    },
    [onRouteSelect],
  )

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto">
      <div className="rounded-lg border border-border bg-card p-4">
        <h2 className="mb-1 text-sm font-semibold text-primary">ROUTE PLANNER</h2>
        <p className="text-xs text-muted-foreground">Global routing with AI threat assessment</p>

        <div className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-secondary">SOURCE</label>
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search city, village, camp, or enter coords (34.123, 36.559)"
                  value={sourceInput}
                  onChange={(e) => setSourceInput(e.target.value)}
                  onFocus={() => sourceInput.length > 1 && setShowSourceDropdown(true)}
                  className="w-full rounded-lg border border-border bg-input px-3 py-2 pl-8 text-sm text-foreground placeholder:text-muted-foreground hover:bg-muted transition focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              {showSourceDropdown && sourceSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-border bg-card shadow-lg z-10">
                  {sourceSuggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectSource(suggestion)}
                      className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted transition border-b border-border last:border-b-0"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-secondary flex-shrink-0" />
                        <div>
                          <p className="font-medium">{suggestion.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {suggestion.lat.toFixed(3)}, {suggestion.lon.toFixed(3)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {source && (
              <div className="mt-1 text-xs text-primary flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {source.lat.toFixed(4)}, {source.lon.toFixed(4)}
              </div>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-secondary">DESTINATION</label>
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search city, border, camp, or enter coords (34.456, 36.789)"
                  value={destInput}
                  onChange={(e) => setDestInput(e.target.value)}
                  onFocus={() => destInput.length > 1 && setShowDestDropdown(true)}
                  className="w-full rounded-lg border border-border bg-input px-3 py-2 pl-8 text-sm text-foreground placeholder:text-muted-foreground hover:bg-muted transition focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              {showDestDropdown && destSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-border bg-card shadow-lg z-10">
                  {destSuggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectDestination(suggestion)}
                      className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted transition border-b border-border last:border-b-0"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-accent flex-shrink-0" />
                        <div>
                          <p className="font-medium">{suggestion.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {suggestion.lat.toFixed(3)}, {suggestion.lon.toFixed(3)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {destination && (
              <div className="mt-1 text-xs text-accent flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {destination.lat.toFixed(4)}, {destination.lon.toFixed(4)}
              </div>
            )}
          </div>

          {/* Travel Mode */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-secondary">TRAVEL MODE</label>
            <div className="flex gap-2">
              {(["walking", "vehicle"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setTravelMode(mode)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                    travelMode === mode
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-input text-foreground hover:bg-muted"
                  }`}
                >
                  {mode === "walking" ? "🚶" : "🚗"} {mode.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-yellow-500 mt-0.5" />
          <p className="text-xs text-yellow-200">
            Works globally. Analyze terrain, conflict zones, weather, and resources automatically.
          </p>
        </div>
      </div>

      {/* Route Analysis */}
      {source && destination && (
        <RouteAnalyzer
          source={source}
          destination={destination}
          travelMode={travelMode}
          onAnalysisComplete={handleAnalysisComplete}
        />
      )}
    </div>
  )
}
