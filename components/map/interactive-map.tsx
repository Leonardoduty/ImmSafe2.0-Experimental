"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { MapPin } from "lucide-react"

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
}

export default function InteractiveMap({
  onSourceSelect,
  onDestinationSelect,
  selectedRoute,
  routeCoordinates,
}: InteractiveMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mapPoints, setMapPoints] = useState<MapPoint[]>([
    {
      id: "safe1",
      lat: 35.0,
      lon: 40.0,
      type: "safe_zone",
      label: "UN Camp Alpha",
      risk: 1,
    },
    {
      id: "safe2",
      lat: 34.8,
      lon: 41.2,
      type: "safe_zone",
      label: "Hospital Beta",
      risk: 2,
    },
    {
      id: "water1",
      lat: 35.2,
      lon: 40.5,
      type: "water",
      label: "Clean Water Point",
      risk: 3,
    },
    {
      id: "conflict1",
      lat: 35.5,
      lon: 39.8,
      type: "conflict",
      label: "Active Military",
      risk: 9,
    },
    {
      id: "conflict2",
      lat: 34.5,
      lon: 41.8,
      type: "conflict",
      label: "Checkpoint Zone",
      risk: 6,
    },
  ])

  const [selectionMode, setSelectionMode] = useState<"source" | "destination" | null>(null)

  const dynamicMapPoints = [...mapPoints]
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

  // Map projection (simple mercator-like)
  const projectPoint = (lat: number, lon: number, width: number, height: number) => {
    let minLat = 34
    let maxLat = 36
    let minLon = 39
    let maxLon = 42

    // Expand bounds if route coordinates are outside the default range
    if (routeCoordinates?.source) {
      minLat = Math.min(minLat, routeCoordinates.source.lat)
      maxLat = Math.max(maxLat, routeCoordinates.source.lat)
      minLon = Math.min(minLon, routeCoordinates.source.lon)
      maxLon = Math.max(maxLon, routeCoordinates.source.lon)
    }
    if (routeCoordinates?.destination) {
      minLat = Math.min(minLat, routeCoordinates.destination.lat)
      maxLat = Math.max(maxLat, routeCoordinates.destination.lat)
      minLon = Math.min(minLon, routeCoordinates.destination.lon)
      maxLon = Math.max(maxLon, routeCoordinates.destination.lon)
    }

    // Add padding to bounds
    const latPadding = (maxLat - minLat) * 0.1
    const lonPadding = (maxLon - minLon) * 0.1
    minLat -= latPadding
    maxLat += latPadding
    minLon -= lonPadding
    maxLon += lonPadding

    const x = ((lon - minLon) / (maxLon - minLon)) * width
    const y = ((maxLat - lat) / (maxLat - minLat)) * height

    return { x, y }
  }

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

    // Draw zones (background)
    const safeZones = [
      { lat: 35.0, lon: 40.0, radius: 0.5, type: "safe" },
      { lat: 34.8, lon: 41.2, radius: 0.4, type: "safe" },
    ]

    safeZones.forEach((zone) => {
      const { x, y } = projectPoint(zone.lat, zone.lon, width, height)
      const radius = (zone.radius / 2) * width
      ctx.fillStyle = "rgba(0, 255, 65, 0.1)"
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = "rgba(0, 255, 65, 0.3)"
      ctx.lineWidth = 2
      ctx.stroke()
    })

    // Draw danger zones
    const dangerZones = [
      { lat: 35.5, lon: 39.8, radius: 0.4, type: "danger" },
      { lat: 34.5, lon: 41.8, radius: 0.3, type: "danger" },
    ]

    dangerZones.forEach((zone) => {
      const { x, y } = projectPoint(zone.lat, zone.lon, width, height)
      const radius = (zone.radius / 2) * width
      ctx.fillStyle = "rgba(255, 23, 68, 0.08)"
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = "rgba(255, 23, 68, 0.4)"
      ctx.lineWidth = 2
      ctx.stroke()
    })

    dynamicMapPoints.forEach((point) => {
      const { x, y } = projectPoint(point.lat, point.lon, width, height)
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

    // Draw route if selected
    if (selectedRoute || (routeCoordinates?.source && routeCoordinates?.destination)) {
      ctx.strokeStyle = "#0099ff"
      ctx.lineWidth = 3
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      const startLat = routeCoordinates?.source?.lat ?? selectedRoute?.sourceLat
      const startLon = routeCoordinates?.source?.lon ?? selectedRoute?.sourceLon
      const endLat = routeCoordinates?.destination?.lat ?? selectedRoute?.destLat
      const endLon = routeCoordinates?.destination?.lon ?? selectedRoute?.destLon

      if (startLat !== undefined && startLon !== undefined && endLat !== undefined && endLon !== undefined) {
        const start = projectPoint(startLat, startLon, width, height)
        const end = projectPoint(endLat, endLon, width, height)
        ctx.moveTo(start.x, start.y)
        ctx.lineTo(end.x, end.y)
        ctx.stroke()
      }
      ctx.setLineDash([])
    }
  }

  useEffect(() => {
    drawMap()
  }, [dynamicMapPoints, selectedRoute, routeCoordinates])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectionMode) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Check if clicked near a point
    for (const point of mapPoints) {
      const projected = projectPoint(point.lat, point.lon, canvas.width, canvas.height)
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
