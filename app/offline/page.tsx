"use client"

import { useState } from "react"
import { Download, Package, Wifi, WifiOff, BookOpen } from "lucide-react"
import NavigationBar from "@/components/navigation/navigation-bar"

export default function OfflineSupport() {
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null)
  const [offlineSections, setOfflineSections] = useState({
    map: false,
    guides: false,
    translation: false,
    checklist: false,
    medical: false,
  })

  const handleDownloadPackage = (section: string) => {
    setDownloadProgress(0)
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev === null || prev >= 100) {
          clearInterval(interval)
          return null
        }
        return prev + 10
      })
    }, 300)
  }

  const totalSize = {
    map: "45 MB",
    guides: "12 MB",
    translation: "5 MB",
    checklist: "3 MB",
    medical: "8 MB",
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar onSOS={() => {}} />

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3 mb-2">
            <WifiOff className="h-8 w-8" />
            OFFLINE SUPPORT & DOWNLOADS
          </h1>
          <p className="text-muted-foreground">Download content for offline access in low-connectivity areas</p>
        </div>

        {/* Info Banner */}
        <div className="rounded-lg border border-primary/30 bg-primary/10 p-4">
          <div className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm text-primary/80">
              <p className="font-semibold mb-1">Offline Content Available</p>
              <p>
                Download content packages to access guides, maps, medical information, and translations without internet
                connection. Perfect for areas with unreliable connectivity.
              </p>
            </div>
          </div>
        </div>

        {/* Download Options */}
        <div className="space-y-4">
          {[
            {
              id: "map",
              title: "Interactive Map (Offline)",
              description: "Tactical map with safe zones, conflict areas, resources, and route data",
              size: "45 MB",
              content: ["Safe zones", "Conflict zones", "Water points", "Hospitals", "Border checkpoints"],
              icon: "🗺️",
            },
            {
              id: "guides",
              title: "Survival Guides",
              description: "First aid, shelter building, fire starting, water purification instructions",
              size: "12 MB",
              content: ["Medical guides", "Survival techniques", "Emergency procedures", "Risk management"],
              icon: "📚",
            },
            {
              id: "translation",
              title: "Emergency Phrases",
              description: "Multilingual translation module with essential survival phrases",
              size: "5 MB",
              content: ["Arabic phrases", "Kurdish phrases", "Turkish phrases", "Farsi phrases"],
              icon: "🗣️",
            },
            {
              id: "checklist",
              title: "Packing Checklist",
              description: "Auto-generated supply calculations and packing lists",
              size: "3 MB",
              content: ["Supply calculator", "Journey profiles", "Checklist templates"],
              icon: "✓",
            },
            {
              id: "medical",
              title: "Medical Reference",
              description: "First aid, disease identification, emergency treatment procedures",
              size: "8 MB",
              content: ["Wound treatment", "Illness identification", "Medication guide", "Trauma response"],
              icon: "🏥",
            },
          ].map((package_) => (
            <div key={package_.id} className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{package_.icon}</span>
                    <div>
                      <h3 className="font-bold text-foreground text-lg">{package_.title}</h3>
                      <p className="text-sm text-muted-foreground">{package_.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {package_.content.map((item) => (
                      <span key={item} className="text-xs bg-muted/50 text-muted-foreground px-2 py-1 rounded">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-right ml-4">
                  <p className="text-sm font-semibold text-primary mb-3">{package_.size}</p>
                  <button
                    onClick={() => handleDownloadPackage(package_.id)}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground hover:shadow-lg hover:shadow-primary/50"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              </div>

              {downloadProgress !== null && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Downloading...</span>
                    <span className="text-primary font-semibold">{downloadProgress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted/30">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${downloadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Complete Package */}
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-6">
          <div className="flex items-start gap-4">
            <Package className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-yellow-200 mb-2">Complete Offline Package</h3>
              <p className="text-sm text-yellow-200/80 mb-4">
                Download all content at once for complete offline access (90 MB total)
              </p>
              <button className="flex items-center gap-2 rounded-lg bg-yellow-500/20 px-4 py-2 font-semibold text-yellow-200 border border-yellow-500/50 hover:bg-yellow-500/30">
                <Download className="h-4 w-4" />
                Download All (90 MB)
              </button>
            </div>
          </div>
        </div>

        {/* Storage Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Wifi className="h-5 w-5 text-secondary" />
              <h4 className="font-semibold text-foreground">Online Features</h4>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Real-time conflict updates</li>
              <li>• Live weather data</li>
              <li>• Current resource availability</li>
              <li>• Up-to-date border information</li>
              <li>• Emergency SOS functionality</li>
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <WifiOff className="h-5 w-5 text-primary" />
              <h4 className="font-semibold text-foreground">Offline Features</h4>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Pre-downloaded maps</li>
              <li>• Survival guides & first aid</li>
              <li>• Phrase translations</li>
              <li>• Supply calculations</li>
              <li>• Medical references</li>
            </ul>
          </div>
        </div>

        {/* Tips */}
        <div className="rounded-lg border border-primary/30 bg-primary/10 p-4">
          <h4 className="font-bold text-primary mb-3">Offline Usage Tips:</h4>
          <ul className="space-y-2 text-sm text-primary/80">
            <li>• Download all packages before entering areas with poor connectivity</li>
            <li>• Keep device charged - use power-saving mode when battery is low</li>
            <li>• Offline map updates weekly when internet is available</li>
            <li>• All personal data remains local - never sent to servers</li>
            <li>• Use offline mode to preserve mobile data and battery</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
