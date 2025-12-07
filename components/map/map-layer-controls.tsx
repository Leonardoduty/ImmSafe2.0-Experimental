"use client"

import { AlertTriangle, Droplet, Heart, Home, MapPin, Globe, Mountain } from "lucide-react"

interface MapLayerControlsProps {
  activeLayers: string[]
  onToggleLayer: (layerId: string) => void
}

export default function MapLayerControls({ activeLayers, onToggleLayer }: MapLayerControlsProps) {
  const layers = [
    {
      id: "safe_zones",
      name: "Safe Zones",
      icon: Home,
      color: "text-primary",
    },
    {
      id: "conflict_zones",
      name: "Conflict Zones",
      icon: AlertTriangle,
      color: "text-accent",
    },
    {
      id: "water_points",
      name: "Water Points",
      icon: Droplet,
      color: "text-secondary",
    },
    {
      id: "hospitals",
      name: "UN/NGO Centers",
      icon: Heart,
      color: "text-yellow-500",
    },
    {
      id: "checkpoints",
      name: "Border Crossings",
      icon: MapPin,
      color: "text-orange-400",
    },
  ]

  const mapStyleLayers = [
    {
      id: "country_borders",
      name: "Country Borders",
      icon: Globe,
      color: "text-blue-400",
    },
    {
      id: "terrain",
      name: "Terrain View",
      icon: Mountain,
      color: "text-emerald-500",
    },
  ]

  return (
    <div className="flex flex-col gap-3 w-48">
      <div className="text-xs font-semibold text-primary uppercase">Map Layers</div>

      <div className="space-y-2">
        {layers.map((layer) => {
          const Icon = layer.icon
          const isActive = activeLayers.includes(layer.id)

          return (
            <button
              key={layer.id}
              onClick={() => onToggleLayer(layer.id)}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 transition text-sm ${
                isActive ? "bg-muted border border-primary" : "border border-border bg-card hover:bg-muted"
              }`}
            >
              <input type="checkbox" checked={isActive} readOnly className="h-4 w-4 cursor-pointer" />
              <Icon className={`h-4 w-4 ${layer.color}`} />
              <span className="text-foreground">{layer.name}</span>
            </button>
          )
        })}
      </div>

      <div className="border-t border-border pt-3 space-y-2">
        <div className="text-xs font-semibold text-muted-foreground uppercase">Map Style</div>
        {mapStyleLayers.map((layer) => {
          const Icon = layer.icon
          const isActive = activeLayers.includes(layer.id)

          return (
            <button
              key={layer.id}
              onClick={() => onToggleLayer(layer.id)}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 transition text-sm ${
                isActive ? "bg-muted border border-primary" : "border border-border bg-card hover:bg-muted"
              }`}
            >
              <input type="checkbox" checked={isActive} readOnly className="h-4 w-4 cursor-pointer" />
              <Icon className={`h-4 w-4 ${layer.color}`} />
              <span className="text-foreground">{layer.name}</span>
            </button>
          )
        })}
      </div>

      <div className="border-t border-border pt-3 space-y-2 text-xs">
        <div className="font-semibold text-primary">ZONE STATS</div>
        <div className="flex justify-between text-muted-foreground">
          <span>Safe Zones:</span>
          <span className="text-primary font-semibold">2</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Danger Areas:</span>
          <span className="text-accent font-semibold">5</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Resources:</span>
          <span className="text-secondary font-semibold">8</span>
        </div>
      </div>
    </div>
  )
}
