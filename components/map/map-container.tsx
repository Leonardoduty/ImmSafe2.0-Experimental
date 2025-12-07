"use client"

import { useState } from "react"
import InteractiveMap from "./interactive-map"
import MapLayerControls from "./map-layer-controls"

interface MapContainerProps {
  selectedRoute: any
  routeCoordinates?: {
    source?: { lat: number; lon: number }
    destination?: { lat: number; lon: number }
  }
}

interface MapPoint {
  id: string
  lat: number
  lon: number
  type: string
  label: string
  risk?: number
}

export default function MapContainer({ selectedRoute, routeCoordinates }: MapContainerProps) {
  const [activeLayers, setActiveLayers] = useState<string[]>([
    "safe_zones",
    "conflict_zones",
    "water_points",
    "hospitals",
    "checkpoints",
    "country_borders",
  ])
  const [sourcePoint, setSourcePoint] = useState<MapPoint | null>(null)
  const [destPoint, setDestPoint] = useState<MapPoint | null>(null)

  const toggleLayer = (layerId: string) => {
    setActiveLayers((prev) => (prev.includes(layerId) ? prev.filter((l) => l !== layerId) : [...prev, layerId]))
  }

  return (
    <div className="relative h-full w-full rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex h-full gap-4 p-4">
        <div className="flex-1">
          <InteractiveMap
            onSourceSelect={setSourcePoint}
            onDestinationSelect={setDestPoint}
            selectedRoute={selectedRoute}
            routeCoordinates={routeCoordinates}
            activeLayers={activeLayers}
          />
        </div>

        <MapLayerControls activeLayers={activeLayers} onToggleLayer={toggleLayer} />
      </div>

      {/* Selected Points Info */}
      {(sourcePoint || destPoint) && (
        <div className="absolute bottom-4 left-4 rounded-lg bg-card/90 p-3 backdrop-blur border border-border text-xs space-y-1">
          {sourcePoint && (
            <div className="flex items-center gap-2 text-primary">
              <span className="font-semibold">SOURCE:</span>
              <span>{sourcePoint.label}</span>
            </div>
          )}
          {destPoint && (
            <div className="flex items-center gap-2 text-secondary">
              <span className="font-semibold">DESTINATION:</span>
              <span>{destPoint.label}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
