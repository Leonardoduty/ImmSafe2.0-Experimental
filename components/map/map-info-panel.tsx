"use client"

import { AlertCircle, Users, Droplet, Heart } from "lucide-react"

interface MapInfoPanelProps {
  selectedZone?: any
}

export default function MapInfoPanel({ selectedZone }: MapInfoPanelProps) {
  if (!selectedZone) {
    return (
      <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
        Click on a zone to view details
      </div>
    )
  }

  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-4 text-sm">
      <div>
        <h3 className="font-semibold text-primary">{selectedZone.name}</h3>
        <p className="text-xs text-muted-foreground">{selectedZone.type}</p>
      </div>

      <div className="space-y-2 border-t border-border pt-3">
        {selectedZone.capacity && (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-secondary" />
            <span>Capacity: {selectedZone.capacity} people</span>
          </div>
        )}

        {selectedZone.water_available && (
          <div className="flex items-center gap-2">
            <Droplet className="h-4 w-4 text-secondary" />
            <span>Clean water available</span>
          </div>
        )}

        {selectedZone.medical && (
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-accent" />
            <span>Medical level: {selectedZone.medical}</span>
          </div>
        )}
      </div>

      {selectedZone.risk && (
        <div className="flex items-start gap-2 rounded-lg bg-accent/10 p-2 border border-accent/30">
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-accent mt-0.5" />
          <p className="text-xs">Risk level: {selectedZone.risk}/10</p>
        </div>
      )}
    </div>
  )
}
