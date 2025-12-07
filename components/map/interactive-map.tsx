"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { MapPin } from "lucide-react"
import { loadWorldBorders, calculateBounds, projectToCanvas, drawGeoJSONBorders, generateRoutePolyline } from "@/lib/map-utils"
import { getGlobalRoute } from "@/lib/routing-engine"
import { HELP_CENTERS } from "@/lib/ngo-centers"
import { getLayerPoints, getPointsInBounds, type LayerPoint } from "@/lib/data/mapLayers/global-layers"

interface MapPoint {
  id: string
  lat: number
  lon: number
  type: "source" | "destination" | "safe_zone" | "conflict" | "water" | "hospital"
  label: string
  risk?: number
}

interface InteractiveMapProps {
  onSourceSelect: (point: MapPoint) => void
  onDestinationSelect: (point: MapPoint) => void
  selectedRoute?: any
  routeCoordinates?: {
    source?: { lat: number; lon: number }
    destination?: { lat: number; lon: number }
  }
  activeLayers?: string[]
}

export default function InteractiveMap({
  onSourceSelect,
  onDestinationSelect,
  selectedRoute,
  routeCoordinates,
  activeLayers = [],
}: InteractiveMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // Removed hardcoded Gaza/Israel points - now using global layers
  const [mapPoints, setMapPoints] = useState<MapPoint[]>([])

  const [selectionMode, setSelectionMode] = useState<"source" | "destination" | null>(null)
  const [worldBorders, setWorldBorders] = useState<any>(null)
  const [routePolyline, setRoutePolyline] = useState<Array<{ lat: number; lon: number }>>([])

  // Build dynamic map points from route coordinates
  const dynamicMapPoints: MapPoint[] = []
  if (routeCoordinates?.source) {
    dynamicMapPoints.push({
      id: "route_source",
      lat: routeCoordinates.source.lat,
      lon: routeCoordinates.source.lon,
      type: "source",
      label: "📍 Source",
      risk: 0,
    })
  }
  if (routeCoordinates?.destination) {
    dynamicMapPoints.push({
      id: "route_destination",
      lat: routeCoordinates.destination.lat,
      lon: routeCoordinates.destination.lon,
      type: "destination",
      label: "🎯 Destination",
      risk: 0,
    })
  }

  // Load world borders on mount
  useEffect(() => {
    loadWorldBorders()
      .then((borders) => {
        if (borders) {
          setWorldBorders(borders)
        }
      })
      .catch((error) => {
        // Silently fail - borders are optional
        console.warn("[v0] Could not load world borders:", error)
      })
  }, [])

  // Load route polyline when coordinates change
  useEffect(() => {
    if (routeCoordinates?.source && routeCoordinates?.destination) {
      const source = routeCoordinates.source
      const destination = routeCoordinates.destination
      
      // Clear previous route first
      setRoutePolyline([])
      
      getGlobalRoute(source, destination, "walking")
        .then((route) => {
          // Ensure route has valid coordinates
          if (route && route.length > 0) {
            // Validate coordinates are in correct format [lat, lon]
            const validRoute = route.filter(
              (point) =>
                typeof point.lat === "number" &&
                typeof point.lon === "number" &&
                !isNaN(point.lat) &&
                !isNaN(point.lon) &&
                point.lat >= -90 &&
                point.lat <= 90 &&
                point.lon >= -180 &&
                point.lon <= 180,
            )
            if (validRoute.length > 0) {
              setRoutePolyline(validRoute)
            } else {
              // Fallback if validation fails
              setRoutePolyline(generateRoutePolyline(source, destination))
            }
          } else {
            setRoutePolyline(generateRoutePolyline(source, destination))
          }
        })
        .catch((error) => {
          // Fallback to simple polyline
          console.warn("[v0] Could not load route, using fallback:", error)
          setRoutePolyline(generateRoutePolyline(source, destination))
        })
    } else {
      setRoutePolyline([])
    }
  }, [routeCoordinates])

  const getPointColor = (point: MapPoint) => {
    switch (point.type) {
      case "safe_zone":
        return "#00ff41"
      case "conflict":
        return "#ff1744"
      case "water":
        return "#0099ff"
      case "hospital":
        return "#ffd700"
      case "source":
        return "#00ffff"
      case "destination":
        return "#ff9800"
      default:
        return "#e0e6ff"
    }
  }

  const drawMap = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.fillStyle = "#0f1423"
    ctx.fillRect(0, 0, width, height)

    // Calculate bounds ONCE - include route polyline for proper zoom and auto-fit
    // This ensures the route is always visible with proper padding
    const bounds = calculateBounds(routeCoordinates?.source, routeCoordinates?.destination, routePolyline)
    
    // Helper function to project points using the calculated bounds
    const projectPointLocal = (lat: number, lon: number) => {
      return projectToCanvas(lat, lon, bounds, width, height)
    }

    // Draw world borders if loaded
    if (worldBorders) {
      drawGeoJSONBorders(ctx, worldBorders, bounds, width, height)
    }

    // Draw grid
    ctx.strokeStyle = "rgba(0, 255, 65, 0.1)"
    ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) {
      const x = (i * width) / 10
      const y = (i * height) / 10
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Draw global layers based on activeLayers
    // Safe Zones Layer
    if (activeLayers.includes("safe_zones")) {
      const safeZones = getPointsInBounds(getLayerPoints("safe_zones"), bounds)
      safeZones.forEach((zone) => {
        const { x, y } = projectPointLocal(zone.lat, zone.lon)
        const radius = 8
        ctx.fillStyle = "rgba(0, 255, 65, 0.2)"
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = "rgba(0, 255, 65, 0.6)"
        ctx.lineWidth = 2
        ctx.stroke()
        
        // Label
        ctx.fillStyle = "#00ff41"
        ctx.font = "9px monospace"
        ctx.textAlign = "center"
        ctx.fillText(zone.label?.substring(0, 10) || "Safe", x, y - 12)
      })
    }

    // Conflict Zones Layer
    if (activeLayers.includes("conflict_zones")) {
      const conflictZones = getPointsInBounds(getLayerPoints("conflict_zones"), bounds)
      conflictZones.forEach((zone) => {
        const { x, y } = projectPointLocal(zone.lat, zone.lon)
        const radius = 8
        ctx.fillStyle = "rgba(255, 23, 68, 0.15)"
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = "rgba(255, 23, 68, 0.6)"
        ctx.lineWidth = 2
        ctx.stroke()
        
        // Label
        ctx.fillStyle = "#ff1744"
        ctx.font = "9px monospace"
        ctx.textAlign = "center"
        ctx.fillText(zone.label?.substring(0, 10) || "Conflict", x, y - 12)
      })
    }

    // Water Points Layer
    if (activeLayers.includes("water_points")) {
      const waterPoints = getPointsInBounds(getLayerPoints("water_points"), bounds)
      waterPoints.forEach((point) => {
        const { x, y } = projectPointLocal(point.lat, point.lon)
        ctx.fillStyle = "rgba(0, 153, 255, 0.3)"
        ctx.beginPath()
        ctx.arc(x, y, 6, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = "#0099ff"
        ctx.lineWidth = 2
        ctx.stroke()
        
        // Label
        ctx.fillStyle = "#0099ff"
        ctx.font = "8px monospace"
        ctx.textAlign = "center"
        ctx.fillText("💧", x, y - 10)
      })
    }

    // Border Checkpoints Layer
    if (activeLayers.includes("checkpoints")) {
      const checkpoints = getPointsInBounds(getLayerPoints("checkpoints"), bounds)
      checkpoints.forEach((point) => {
        const { x, y } = projectPointLocal(point.lat, point.lon)
        ctx.fillStyle = "rgba(255, 193, 7, 0.3)"
        ctx.beginPath()
        ctx.arc(x, y, 7, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = "#ffc107"
        ctx.lineWidth = 2
        ctx.stroke()
        
        // Label
        ctx.fillStyle = "#ffc107"
        ctx.font = "8px monospace"
        ctx.textAlign = "center"
        ctx.fillText("🚧", x, y - 10)
      })
    }

    dynamicMapPoints.forEach((point) => {
      const { x, y } = projectPointLocal(point.lat, point.lon)
      const color = getPointColor(point)

      // Draw point with pulse
      ctx.fillStyle = color + "40"
      ctx.beginPath()
      ctx.arc(x, y, 12, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x, y, 6, 0, Math.PI * 2)
      ctx.fill()

      // Draw label
      ctx.fillStyle = color
      ctx.font = "11px monospace"
      ctx.textAlign = "center"
      ctx.fillText(point.label.substring(0, 12), x, y - 20)
    })

    // Draw route polyline if available - with smooth rendering
    if (routePolyline.length > 0) {
      // Clear any previous route drawing
      ctx.save()
      
      // Draw route line with proper styling
      ctx.strokeStyle = "#0099ff"
      ctx.lineWidth = 4
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.setLineDash([])
      ctx.shadowColor = "rgba(0, 153, 255, 0.5)"
      ctx.shadowBlur = 8
      
      ctx.beginPath()
      
      // Draw smooth polyline
      routePolyline.forEach((point, index) => {
        const { x, y } = projectPointLocal(point.lat, point.lon)
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          // Use quadratic curves for smoother lines
          const prevPoint = routePolyline[index - 1]
          const prevProj = projectPointLocal(prevPoint.lat, prevPoint.lon)
          const midX = (prevProj.x + x) / 2
          const midY = (prevProj.y + y) / 2
          ctx.quadraticCurveTo(prevProj.x, prevProj.y, midX, midY)
          ctx.lineTo(x, y)
        }
      })
      
      ctx.stroke()
      ctx.restore()
      
      // Draw route start and end markers
      if (routePolyline.length > 0) {
        const start = projectPointLocal(routePolyline[0].lat, routePolyline[0].lon)
        const end = projectPointLocal(routePolyline[routePolyline.length - 1].lat, routePolyline[routePolyline.length - 1].lon)
        
        // Start marker
        ctx.fillStyle = "#00ffff"
        ctx.beginPath()
        ctx.arc(start.x, start.y, 8, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 2
        ctx.stroke()
        
        // End marker
        ctx.fillStyle = "#ff9800"
        ctx.beginPath()
        ctx.arc(end.x, end.y, 8, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 2
        ctx.stroke()
      }
    } else if (selectedRoute || (routeCoordinates?.source && routeCoordinates?.destination)) {
      // Fallback to simple line if polyline not loaded
      ctx.strokeStyle = "#0099ff"
      ctx.lineWidth = 3
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      const startLat = routeCoordinates?.source?.lat ?? selectedRoute?.sourceLat
      const startLon = routeCoordinates?.source?.lon ?? selectedRoute?.sourceLon
      const endLat = routeCoordinates?.destination?.lat ?? selectedRoute?.destLat
      const endLon = routeCoordinates?.destination?.lon ?? selectedRoute?.destLon

      if (startLat !== undefined && startLon !== undefined && endLat !== undefined && endLon !== undefined) {
        const start = projectPointLocal(startLat, startLon)
        const end = projectPointLocal(endLat, endLon)
        ctx.moveTo(start.x, start.y)
        ctx.lineTo(end.x, end.y)
        ctx.stroke()
      }
      ctx.setLineDash([])
    }

    // Draw UN/NGO Help Centers (if hospitals layer is active)
    if (activeLayers.includes("hospitals")) {
      const visibleCenters = HELP_CENTERS.filter(
        (c) =>
          c.lat >= bounds.minLat - 5 &&
          c.lat <= bounds.maxLat + 5 &&
          c.lon >= bounds.minLon - 5 &&
          c.lon <= bounds.maxLon + 5,
      )
      visibleCenters.forEach((helpCenter) => {
        const { x, y } = projectPointLocal(helpCenter.lat, helpCenter.lon)
        
        // Determine color by organization type
        let color = "#00ff41" // Default green
        if (helpCenter.type === "unhcr") color = "#0066cc"
        else if (helpCenter.type === "red_cross") color = "#ff0000"
        else if (helpCenter.type === "msf") color = "#ff9900"
        else if (helpCenter.type === "unicef") color = "#00a0e3"
        else if (helpCenter.type === "wfp") color = "#ff6b35"
        
        // Draw center marker
        ctx.fillStyle = color + "80"
        ctx.beginPath()
        ctx.arc(x, y, 10, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(x, y, 6, 0, Math.PI * 2)
        ctx.fill()
        
        // Draw label
        ctx.fillStyle = color
        ctx.font = "9px monospace"
        ctx.textAlign = "center"
        ctx.fillText(helpCenter.organization.substring(0, 8), x, y - 15)
      })
    }
  }

  useEffect(() => {
    drawMap()
  }, [dynamicMapPoints, selectedRoute, routeCoordinates, worldBorders, routePolyline, activeLayers])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectionMode) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Check if clicked near a point (route source/destination)
    const bounds = calculateBounds(routeCoordinates?.source, routeCoordinates?.destination, routePolyline)
    for (const point of dynamicMapPoints) {
      const projected = projectToCanvas(point.lat, point.lon, bounds, canvas.width, canvas.height)
      const distance = Math.sqrt((x - projected.x) ** 2 + (y - projected.y) ** 2)

      if (distance < 20) {
        if (selectionMode === "source") {
          onSourceSelect(point)
        } else {
          onDestinationSelect(point)
        }
        setSelectionMode(null)
        return
      }
    }
  }

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex gap-2">
        <button
          onClick={() => setSelectionMode(selectionMode === "source" ? null : "source")}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
            selectionMode === "source"
              ? "bg-primary text-primary-foreground"
              : "border border-border bg-card text-foreground hover:bg-muted"
          }`}
        >
          <MapPin className="h-4 w-4" />
          {selectionMode === "source" ? "CLICK TO SET SOURCE" : "SET SOURCE"}
        </button>

        <button
          onClick={() => setSelectionMode(selectionMode === "destination" ? null : "destination")}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
            selectionMode === "destination"
              ? "bg-primary text-primary-foreground"
              : "border border-border bg-card text-foreground hover:bg-muted"
          }`}
        >
          <MapPin className="h-4 w-4" />
          {selectionMode === "destination" ? "CLICK TO SET DESTINATION" : "SET DESTINATION"}
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onClick={handleCanvasClick}
        className="flex-1 cursor-crosshair rounded-lg border border-border bg-card"
      />

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {[
          { color: "#00ff41", label: "Safe Zones" },
          { color: "#ff1744", label: "Danger Zones" },
          { color: "#0099ff", label: "Water Points" },
          { color: "#ffd700", label: "Medical" },
          { color: "#00ffff", label: "Source" },
          { color: "#ff9800", label: "Destination" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-muted-foreground">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  )
}
