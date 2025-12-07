"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { analyzeRoute } from "./route-engine"

interface RouteData {
  source?: { lat: number; lon: number }
  destination?: { lat: number; lon: number }
  travelMode: "walking" | "vehicle"
  analysis?: any
}

interface RouteContextType {
  routeData: RouteData
  setRouteData: (data: RouteData) => void
  updateAnalysis: () => void
}

const RouteContext = createContext<RouteContextType | undefined>(undefined)

export function RouteProvider({ children }: { children: React.ReactNode }) {
  const [routeData, setRouteData] = useState<RouteData>({
    travelMode: "walking",
  })

  const updateAnalysis = useCallback(() => {
    if (routeData.source && routeData.destination) {
      const analysis = analyzeRoute(routeData.source, routeData.destination, routeData.travelMode)
      setRouteData((prev) => ({ ...prev, analysis }))
      
      // Store in localStorage for persistence
      try {
        localStorage.setItem("currentRoute", JSON.stringify({
          source: routeData.source,
          destination: routeData.destination,
          travelMode: routeData.travelMode,
          analysis,
        }))
      } catch (error) {
        console.warn("[v0] Could not save route to localStorage:", error)
      }
    }
  }, [routeData.source, routeData.destination, routeData.travelMode])

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("currentRoute")
      if (stored) {
        const parsed = JSON.parse(stored)
        setRouteData(parsed)
      }
    } catch (error) {
      console.warn("[v0] Could not load route from localStorage:", error)
    }
  }, [])

  // Auto-update analysis when route changes
  useEffect(() => {
    if (routeData.source && routeData.destination) {
      updateAnalysis()
    }
  }, [routeData.source, routeData.destination, routeData.travelMode, updateAnalysis])

  return (
    <RouteContext.Provider value={{ routeData, setRouteData, updateAnalysis }}>
      {children}
    </RouteContext.Provider>
  )
}

export function useRoute() {
  const context = useContext(RouteContext)
  if (!context) {
    throw new Error("useRoute must be used within RouteProvider")
  }
  return context
}


