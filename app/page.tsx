"use client"

import { useState } from "react"
import MapContainer from "@/components/map/map-container"
import RoutePanel from "@/components/route/route-panel"
import EmergencySOS from "@/components/emergency/emergency-sos"
import NavigationBar from "@/components/navigation/navigation-bar"

export default function Home() {
  const [showSOS, setShowSOS] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [routeCoordinates, setRouteCoordinates] = useState<{
    source?: { lat: number; lon: number }
    destination?: { lat: number; lon: number }
  }>({})

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar onSOS={() => setShowSOS(true)} />

      <div className="flex h-screen gap-4 p-4">
        {/* Main Map */}
        <div className="flex-1">
          <MapContainer selectedRoute={selectedRoute} routeCoordinates={routeCoordinates} />
        </div>

        {/* Route Planning Panel */}
        <div className="w-96">
          <RoutePanel onRouteSelect={setSelectedRoute} onCoordinatesChange={setRouteCoordinates} />
        </div>
      </div>

      {/* Emergency SOS Modal */}
      {showSOS && <EmergencySOS onClose={() => setShowSOS(false)} />}
    </div>
  )
}
