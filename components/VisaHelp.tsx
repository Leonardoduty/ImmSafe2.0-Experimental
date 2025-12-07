"use client"

import { useState } from "react"
import { Search, Plane, Clock, FileText, DollarSign, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { VISA_REQUIREMENTS, searchVisaRequirements } from "@/lib/data/visaData"
import type { VisaRequirement } from "@/types"

export default function VisaHelp() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState<VisaRequirement | null>(null)

  const filteredCountries = searchQuery
    ? searchVisaRequirements(searchQuery)
    : VISA_REQUIREMENTS

  const handleSelect = (country: VisaRequirement) => {
    setSelectedCountry(selectedCountry?.country === country.country ? null : country)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Plane className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Visa Requirements</h2>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search country..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {selectedCountry && (
        <Card className="border-primary">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{selectedCountry.country}</CardTitle>
              <Badge variant="outline">{selectedCountry.countryCode}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {selectedCountry.visaRequired ? (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
                  Visa Required
                </Badge>
              ) : (
                <Badge className="bg-green-500 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Visa Free
                </Badge>
              )}
              {selectedCountry.visaOnArrival && (
                <Badge className="bg-yellow-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Visa on Arrival
                </Badge>
              )}
              {selectedCountry.eVisaAvailable && (
                <Badge className="bg-blue-500 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  e-Visa Available
                </Badge>
              )}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Processing Time</p>
                  <p className="text-sm text-muted-foreground">{selectedCountry.processingTime}</p>
                </div>
              </div>
              {selectedCountry.fees && (
                <div className="flex items-start gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Fees</p>
                    <p className="text-sm text-muted-foreground">{selectedCountry.fees}</p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Required Documents</p>
              </div>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {selectedCountry.requiredDocuments.map((doc, idx) => (
                  <li key={idx}>{doc}</li>
                ))}
              </ul>
            </div>

            {selectedCountry.notes && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">
                  <span className="font-medium">Note for Refugees: </span>
                  {selectedCountry.notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
        {filteredCountries.map((country) => (
          <Card
            key={country.countryCode}
            className={`cursor-pointer transition-all hover:border-primary ${
              selectedCountry?.country === country.country ? "border-primary bg-primary/5" : ""
            }`}
            onClick={() => handleSelect(country)}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{country.country}</p>
                  <div className="flex gap-1 mt-1">
                    {!country.visaRequired && (
                      <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                        Visa Free
                      </Badge>
                    )}
                    {country.visaOnArrival && (
                      <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-600">
                        VOA
                      </Badge>
                    )}
                    {country.eVisaAvailable && (
                      <Badge variant="outline" className="text-xs text-blue-600 border-blue-600">
                        e-Visa
                      </Badge>
                    )}
                  </div>
                </div>
                <span className="text-2xl font-bold text-muted-foreground">
                  {country.countryCode}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
