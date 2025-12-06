"use client"

import { X, AlertTriangle, MapPin, Compass } from "lucide-react"

interface EmergencySOSProps {
  onClose: () => void
}

export default function EmergencySOS({ onClose }: EmergencySOSProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-lg border border-accent bg-card p-8 shadow-2xl shadow-accent/20">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-accent danger-pulse" />
              <h2 className="text-2xl font-bold text-accent">EMERGENCY MODE</h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Fastest safe direction analysis</p>
          </div>
          <button onClick={onClose} className="rounded-lg border border-border p-2 hover:bg-muted">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Status */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-3 rounded-lg bg-accent/10 p-3 border border-accent/30">
            <Compass className="h-5 w-5 text-accent flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-accent">NEAREST SAFE ZONE</p>
              <p className="text-sm text-foreground">UN Camp - 12.5 km North</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-primary/10 p-3 border border-primary/30">
            <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-primary">QUICKEST ROUTE</p>
              <p className="text-sm text-foreground">2.5 hours walking through safe zone</p>
            </div>
          </div>
        </div>

        {/* Escape Instructions */}
        <div className="mb-6">
          <p className="mb-3 text-xs font-semibold text-secondary">ESCAPE ROUTE STEPS:</p>
          <ol className="space-y-2 text-sm text-foreground">
            <li>1. Head North following GPS bearing 345°</li>
            <li>2. Avoid main roads - use forest paths</li>
            <li>3. Stay in groups if possible</li>
            <li>4. Stop at checkpoint: show this code</li>
          </ol>
        </div>

        {/* Danger Warnings */}
        <div className="mb-6 rounded-lg bg-accent/5 p-3 border border-accent/20">
          <p className="mb-2 text-xs font-semibold text-accent">ACTIVE DANGERS IN AREA:</p>
          <ul className="space-y-1 text-xs text-foreground">
            <li>• Military checkpoint 4 km east</li>
            <li>• Flooded roads west sector</li>
            <li>• Armed group activity (unconfirmed)</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-border px-4 py-3 font-semibold text-foreground transition hover:bg-muted"
          >
            CLOSE
          </button>
          <button className="flex-1 rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition hover:shadow-lg hover:shadow-primary/50">
            DOWNLOAD OFFLINE GUIDE
          </button>
        </div>
      </div>
    </div>
  )
}
