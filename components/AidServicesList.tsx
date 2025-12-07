"use client"

import { useState } from "react"
import { Search, MapPin, Phone, Mail, Home, Droplets, Heart, Scale, Utensils, Shirt, HelpCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AID_SERVICES, searchAidServices, getAidServicesByType } from "@/lib/data/aids"
import type { AidService } from "@/types"

interface AidServicesListProps {
  onSelectLocation?: (location: { lat: number; lon: number; label?: string }) => void
}

const TYPE_ICONS: Record<AidService["type"], React.ReactNode> = {
  shelter: <Home className="h-4 w-4" />,
  water: <Droplets className="h-4 w-4" />,
  medical: <Heart className="h-4 w-4" />,
  legal: <Scale className="h-4 w-4" />,
  food: <Utensils className="h-4 w-4" />,
  clothing: <Shirt className="h-4 w-4" />,
  other: <HelpCircle className="h-4 w-4" />
}

const TYPE_COLORS: Record<AidService["type"], string> = {
  shelter: "bg-green-500",
  water: "bg-blue-500",
  medical: "bg-red-500",
  legal: "bg-purple-500",
  food: "bg-orange-500",
  clothing: "bg-pink-500",
  other: "bg-gray-500"
}

const SERVICE_TYPES: AidService["type"][] = ["shelter", "water", "medical", "legal", "food", "clothing", "other"]

export default function AidServicesList({ onSelectLocation }: AidServicesListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeType, setActiveType] = useState<AidService["type"] | null>(null)

  const getFilteredServices = () => {
    if (activeType) {
      const typeFiltered = getAidServicesByType(activeType)
      if (searchQuery) {
        return typeFiltered.filter(s => 
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.location.country?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      return typeFiltered
    }
    if (searchQuery) {
      return searchAidServices(searchQuery)
    }
    return AID_SERVICES
  }

  const filteredServices = getFilteredServices()

  const handleMapClick = (service: AidService) => {
    onSelectLocation?.(service.location)
  }

  const toggleType = (type: AidService["type"]) => {
    setActiveType(activeType === type ? null : type)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Heart className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Aid Services</h2>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, provider, or country..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {SERVICE_TYPES.map((type) => (
          <Badge
            key={type}
            className={`cursor-pointer capitalize ${
              activeType === type ? TYPE_COLORS[type] : "bg-muted text-muted-foreground"
            }`}
            onClick={() => toggleType(type)}
          >
            <span className="mr-1">{TYPE_ICONS[type]}</span>
            {type}
          </Badge>
        ))}
        {(activeType || searchQuery) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setActiveType(null)
              setSearchQuery("")
            }}
          >
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {filteredServices.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No aid services found
            </CardContent>
          </Card>
        ) : (
          filteredServices.map((service) => (
            <Card key={service.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge className={TYPE_COLORS[service.type]}>
                        <span className="mr-1">{TYPE_ICONS[service.type]}</span>
                        {service.type}
                      </Badge>
                      <h3 className="font-semibold">{service.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Provider: {service.provider} | {service.location.label}, {service.location.country}
                    </p>
                    {service.availability && (
                      <p className="text-xs text-green-600 mt-1">
                        Available: {service.availability}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleMapClick(service)}
                    title="Show on map"
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-3 pt-3 border-t flex flex-wrap gap-4 text-sm">
                  {service.contact.phone && (
                    <a
                      href={`tel:${service.contact.phone}`}
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      <Phone className="h-3 w-3" />
                      {service.contact.phone}
                    </a>
                  )}
                  {service.contact.email && (
                    <a
                      href={`mailto:${service.contact.email}`}
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      <Mail className="h-3 w-3" />
                      {service.contact.email}
                    </a>
                  )}
                  {service.contact.address && (
                    <span className="text-muted-foreground text-xs">
                      {service.contact.address}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
