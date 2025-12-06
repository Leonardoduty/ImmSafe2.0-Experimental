"use client"

import { AlertTriangle, MapPin } from "lucide-react"

interface NavigationBarProps {
  onSOS: () => void
}

export default function NavigationBar({ onSOS }: NavigationBarProps) {
  return (
    <nav className="border-b border-border bg-card">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <MapPin className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold text-primary">SAFE ROUTE</h1>
          <span className="text-xs text-muted-foreground">Humanitarian Survival Planning</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onSOS}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 font-semibold text-accent-foreground transition hover:shadow-lg hover:shadow-accent/50 danger-pulse"
          >
            <AlertTriangle className="h-5 w-5" />
            SOS
          </button>

          <a
            href="/checklist"
            className="rounded-lg border border-border px-4 py-2 text-sm text-foreground transition hover:bg-card"
          >
            Checklist
          </a>

          <a
            href="/guides"
            className="rounded-lg border border-border px-4 py-2 text-sm text-foreground transition hover:bg-card"
          >
            Guides
          </a>
        </div>
      </div>
    </nav>
  )
}
