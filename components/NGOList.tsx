"use client"

import { useState } from "react"
import { Search, MapPin, Phone, Mail, Globe, ChevronDown, ChevronUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { NGO_LIST, searchNGOs } from "@/lib/data/ngoData"
import type { NGO } from "@/types"

interface NGOListProps {
  onSelectLocation?: (location: { lat: number; lon: number; label?: string }) => void
}

export default function NGOList({ onSelectLocation }: NGOListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filteredNGOs = searchQuery ? searchNGOs(searchQuery) : NGO_LIST

  const handleMapClick = (ngo: NGO) => {
    onSelectLocation?.(ngo.location)
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search NGOs by name, service, or country..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-2">
        {filteredNGOs.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No NGOs found matching "{searchQuery}"
            </CardContent>
          </Card>
        ) : (
          filteredNGOs.map((ngo) => (
            <Card key={ngo.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{ngo.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {ngo.location.country}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{ngo.description}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleMapClick(ngo)}
                      title="Show on map"
                    >
                      <MapPin className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleExpand(ngo.id)}
                    >
                      {expandedId === ngo.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  {ngo.services.map((service) => (
                    <Badge key={service} variant="outline" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                </div>

                {expandedId === ngo.id && (
                  <div className="mt-4 pt-4 border-t space-y-2">
                    {ngo.contact.phone && (
                      <a
                        href={`tel:${ngo.contact.phone}`}
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <Phone className="h-4 w-4" />
                        {ngo.contact.phone}
                      </a>
                    )}
                    {ngo.contact.email && (
                      <a
                        href={`mailto:${ngo.contact.email}`}
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <Mail className="h-4 w-4" />
                        {ngo.contact.email}
                      </a>
                    )}
                    {ngo.contact.website && (
                      <a
                        href={ngo.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <Globe className="h-4 w-4" />
                        {ngo.contact.website}
                      </a>
                    )}
                    {ngo.operatingHours && (
                      <p className="text-sm text-muted-foreground">
                        Hours: {ngo.operatingHours}
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
