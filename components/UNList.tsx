"use client"

import { useState } from "react"
import { Search, MapPin, Phone, Mail, Globe, ChevronDown, ChevronUp, Building } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UN_OFFICES, searchUNOffices } from "@/lib/data/unData"
import type { UNOffice } from "@/types"

interface UNListProps {
  onSelectLocation?: (location: { lat: number; lon: number; label?: string }) => void
}

const AGENCY_COLORS: Record<string, string> = {
  UNHCR: "bg-blue-500",
  UNICEF: "bg-cyan-500",
  WFP: "bg-orange-500",
  WHO: "bg-green-500",
  IOM: "bg-purple-500",
  OCHA: "bg-red-500"
}

export default function UNList({ onSelectLocation }: UNListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filteredOffices = searchQuery ? searchUNOffices(searchQuery) : UN_OFFICES

  const handleMapClick = (office: UNOffice) => {
    onSelectLocation?.(office.location)
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Building className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">UN Offices</h2>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by agency, location, or service..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.keys(AGENCY_COLORS).map((agency) => (
          <Badge
            key={agency}
            className={`${AGENCY_COLORS[agency]} cursor-pointer hover:opacity-80`}
            onClick={() => setSearchQuery(agency)}
          >
            {agency}
          </Badge>
        ))}
        {searchQuery && (
          <Button variant="ghost" size="sm" onClick={() => setSearchQuery("")}>
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {filteredOffices.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No UN offices found matching "{searchQuery}"
            </CardContent>
          </Card>
        ) : (
          filteredOffices.map((office) => (
            <Card key={office.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge className={AGENCY_COLORS[office.agency] || "bg-gray-500"}>
                        {office.agency}
                      </Badge>
                      <h3 className="font-semibold">{office.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{office.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {office.location.label}, {office.location.country}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleMapClick(office)}
                      title="Show on map"
                    >
                      <MapPin className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleExpand(office.id)}
                    >
                      {expandedId === office.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  {office.services.map((service) => (
                    <Badge key={service} variant="outline" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                </div>

                {expandedId === office.id && (
                  <div className="mt-4 pt-4 border-t space-y-2">
                    {office.contact.phone && (
                      <a
                        href={`tel:${office.contact.phone}`}
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <Phone className="h-4 w-4" />
                        {office.contact.phone}
                      </a>
                    )}
                    {office.contact.email && (
                      <a
                        href={`mailto:${office.contact.email}`}
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <Mail className="h-4 w-4" />
                        {office.contact.email}
                      </a>
                    )}
                    {office.contact.website && (
                      <a
                        href={office.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <Globe className="h-4 w-4" />
                        {office.contact.website}
                      </a>
                    )}
                    {office.operatingHours && (
                      <p className="text-sm text-muted-foreground">
                        Hours: {office.operatingHours}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
