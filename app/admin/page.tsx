"use client"

import { useState } from "react"
import { BarChart3, Map, AlertTriangle, Users, Settings } from "lucide-react"
import NavigationBar from "@/components/navigation/navigation-bar"

interface ConflictZone {
  id: string
  name: string
  lat: number
  lon: number
  danger_level: number
  updated: string
}

interface SafeZone {
  id: string
  name: string
  type: string
  capacity: number
  medical_level: string
  verified: boolean
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "zones" | "resources" | "updates">("overview")
  const [conflictZones, setConflictZones] = useState<ConflictZone[]>([
    {
      id: "1",
      name: "Active Military Zone A",
      lat: 35.5,
      lon: 39.8,
      danger_level: 9,
      updated: "2024-12-06 14:23",
    },
    {
      id: "2",
      name: "Checkpoint Sector",
      lat: 34.5,
      lon: 41.8,
      danger_level: 6,
      updated: "2024-12-06 08:15",
    },
  ])

  const [safeZones, setSafeZones] = useState<SafeZone[]>([
    {
      id: "1",
      name: "UN Camp Alpha",
      type: "REFUGEE_CAMP",
      capacity: 5000,
      medical_level: "ADVANCED",
      verified: true,
    },
    {
      id: "2",
      name: "Hospital Beta",
      type: "HOSPITAL",
      capacity: 200,
      medical_level: "INTERMEDIATE",
      verified: true,
    },
  ])

  const [newConflictZone, setNewConflictZone] = useState({
    name: "",
    lat: 0,
    lon: 0,
    danger_level: 5,
  })

  const handleAddConflictZone = () => {
    if (newConflictZone.name) {
      setConflictZones([
        ...conflictZones,
        {
          id: String(Date.now()),
          ...newConflictZone,
          updated: new Date().toLocaleString(),
        },
      ])
      setNewConflictZone({ name: "", lat: 0, lon: 0, danger_level: 5 })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar onSOS={() => {}} />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3 mb-2">
            <Settings className="h-8 w-8" />
            ADMIN DASHBOARD
          </h1>
          <p className="text-muted-foreground">Real-time data management and intelligence updates</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Active Conflicts", value: conflictZones.length, icon: AlertTriangle, color: "text-accent" },
            { label: "Safe Zones", value: safeZones.length, icon: Users, color: "text-primary" },
            { label: "Data Points", value: 247, icon: Map, color: "text-secondary" },
            { label: "Last Update", value: "2m ago", icon: BarChart3, color: "text-yellow-500" },
          ].map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div key={idx} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border">
          {(["overview", "zones", "resources", "updates"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-semibold text-sm transition border-b-2 ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "overview" && "Overview"}
              {tab === "zones" && "Conflict Zones"}
              {tab === "resources" && "Safe Zones"}
              {tab === "updates" && "Data Updates"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Status */}
            <div className="rounded-lg border border-border bg-card p-6 space-y-4">
              <h3 className="font-bold text-lg text-foreground">System Status</h3>
              <div className="space-y-2">
                {[
                  { name: "Map Layer Sync", status: "ONLINE" },
                  { name: "Weather Data", status: "ONLINE" },
                  { name: "UN Registry", status: "CONNECTED" },
                  { name: "Image Analysis", status: "READY" },
                  { name: "Offline Cache", status: "100% SYNC" },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{item.name}</span>
                    <span className="text-xs font-bold text-primary">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-lg border border-border bg-card p-6 space-y-3">
              <h3 className="font-bold text-lg text-foreground mb-4">Quick Actions</h3>
              <button className="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground hover:shadow-lg hover:shadow-primary/50">
                Sync All Data
              </button>
              <button className="w-full rounded-lg border border-border px-4 py-2 font-semibold text-foreground hover:bg-muted">
                Export Intelligence Report
              </button>
              <button className="w-full rounded-lg border border-border px-4 py-2 font-semibold text-foreground hover:bg-muted">
                Generate Offline Package
              </button>
              <button className="w-full rounded-lg border border-border px-4 py-2 font-semibold text-foreground hover:bg-muted">
                Broadcast Alert
              </button>
            </div>
          </div>
        )}

        {activeTab === "zones" && (
          <div className="space-y-6">
            {/* Add New Zone */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-bold text-lg text-foreground mb-4">Add Conflict Zone</h3>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <input
                  type="text"
                  placeholder="Zone name"
                  value={newConflictZone.name}
                  onChange={(e) => setNewConflictZone({ ...newConflictZone, name: e.target.value })}
                  className="rounded-lg border border-border bg-input px-3 py-2 text-foreground"
                />
                <input
                  type="number"
                  placeholder="Latitude"
                  value={newConflictZone.lat}
                  onChange={(e) => setNewConflictZone({ ...newConflictZone, lat: Number(e.target.value) })}
                  className="rounded-lg border border-border bg-input px-3 py-2 text-foreground"
                />
                <input
                  type="number"
                  placeholder="Longitude"
                  value={newConflictZone.lon}
                  onChange={(e) => setNewConflictZone({ ...newConflictZone, lon: Number(e.target.value) })}
                  className="rounded-lg border border-border bg-input px-3 py-2 text-foreground"
                />
                <select
                  value={newConflictZone.danger_level}
                  onChange={(e) => setNewConflictZone({ ...newConflictZone, danger_level: Number(e.target.value) })}
                  className="rounded-lg border border-border bg-input px-3 py-2 text-foreground"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                    <option key={level} value={level}>
                      Level {level}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleAddConflictZone}
                className="mt-4 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground hover:shadow-lg"
              >
                Add Zone
              </button>
            </div>

            {/* Conflict Zones List */}
            <div className="space-y-3">
              {conflictZones.map((zone) => (
                <div key={zone.id} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground">{zone.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Coordinates: {zone.lat.toFixed(2)}, {zone.lon.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">Updated: {zone.updated}</p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-2xl font-bold ${
                          zone.danger_level >= 8
                            ? "text-accent"
                            : zone.danger_level >= 6
                              ? "text-orange-500"
                              : "text-yellow-500"
                        }`}
                      >
                        {zone.danger_level}
                      </div>
                      <p className="text-xs text-muted-foreground">Danger Level</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "resources" && (
          <div className="space-y-3">
            {safeZones.map((zone) => (
              <div key={zone.id} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{zone.name}</h4>
                    <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
                      <span>Type: {zone.type}</span>
                      <span>Capacity: {zone.capacity}</span>
                      <span>Medical: {zone.medical_level}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {zone.verified && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">✓ Verified</span>
                    )}
                    <button className="text-xs bg-muted px-2 py-1 rounded hover:bg-muted/80">Edit</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "updates" && (
          <div className="rounded-lg border border-border bg-card p-6 space-y-4">
            <h3 className="font-bold text-lg text-foreground mb-4">Recent Updates</h3>
            <div className="space-y-3">
              {[
                { time: "14:23", event: "Conflict zone Alpha danger level updated to 9" },
                { time: "12:45", event: "UN Camp registration data synchronized" },
                { time: "10:30", event: "Weather alert issued for northern sector" },
                { time: "09:15", event: "New hospital resource point added" },
                { time: "08:00", event: "Daily offline content package generated" },
              ].map((log, idx) => (
                <div key={idx} className="flex gap-4 border-b border-border pb-3 last:border-0">
                  <span className="text-sm font-mono text-muted-foreground">{log.time}</span>
                  <span className="text-sm text-foreground">{log.event}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
