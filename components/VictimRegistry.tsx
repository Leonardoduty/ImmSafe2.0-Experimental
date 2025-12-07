"use client"

import { useState, useEffect, useRef } from "react"
import { UserSearch, Plus, Download, Trash2, Camera, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { VictimRecord } from "@/types"

const STORAGE_KEY = "victim_records"

function generateId(): string {
  return `victim-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

const STATUS_COLORS: Record<VictimRecord["status"], string> = {
  missing: "bg-yellow-500",
  found: "bg-green-500",
  deceased: "bg-gray-500",
  unknown: "bg-blue-500"
}

export default function VictimRegistry() {
  const [records, setRecords] = useState<VictimRecord[]>([])
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<VictimRecord["status"] | "all">("all")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: "",
    photo: "",
    description: "",
    status: "missing" as VictimRecord["status"],
    lastSeenLocation: "",
    lastSeenDate: "",
    contactInfo: ""
  })

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setRecords(JSON.parse(stored))
      } catch {
        console.error("Failed to parse stored victim records")
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  }, [records])

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, photo: reader.result as string }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newRecord: VictimRecord = {
      id: generateId(),
      name: formData.name,
      photo: formData.photo || undefined,
      description: formData.description,
      status: formData.status,
      lastSeenLocation: formData.lastSeenLocation || undefined,
      lastSeenDate: formData.lastSeenDate || undefined,
      contactInfo: formData.contactInfo || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setRecords(prev => [newRecord, ...prev])
    setFormData({
      name: "",
      photo: "",
      description: "",
      status: "missing",
      lastSeenLocation: "",
      lastSeenDate: "",
      contactInfo: ""
    })
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id))
  }

  const updateStatus = (id: string, status: VictimRecord["status"]) => {
    setRecords(prev =>
      prev.map(r =>
        r.id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r
      )
    )
  }

  const exportToJSON = () => {
    if (records.length === 0) return

    const dataStr = JSON.stringify(records, null, 2)
    const blob = new Blob([dataStr], { type: "application/json" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `victim_registry_${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || record.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserSearch className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Victim Identification Registry</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportToJSON} disabled={records.length === 0}>
            <Download className="h-4 w-4 mr-1" />
            Export for NGOs
          </Button>
          <Button size="sm" onClick={() => setShowForm(!showForm)}>
            {showForm ? <X className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
            {showForm ? "Cancel" : "Add Record"}
          </Button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        This registry helps track missing persons and reunite families. Export data to share with UN and NGO partners.
      </p>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add Victim Record</CardTitle>
            <CardDescription>Enter information about the missing or identified person</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-4">
                <div className="space-y-2">
                  <Label>Photo</Label>
                  <div
                    className="h-32 w-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted/50 overflow-hidden"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {formData.photo ? (
                      <img src={formData.photo} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <Camera className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                        placeholder="Enter full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status *</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value: VictimRecord["status"]) => setFormData(prev => ({ ...prev, status: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="missing">Missing</SelectItem>
                          <SelectItem value="found">Found</SelectItem>
                          <SelectItem value="deceased">Deceased</SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="lastSeenLocation">Last Seen Location</Label>
                      <Input
                        id="lastSeenLocation"
                        value={formData.lastSeenLocation}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, lastSeenLocation: e.target.value }))}
                        placeholder="City, country"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastSeenDate">Last Seen Date</Label>
                      <Input
                        id="lastSeenDate"
                        type="date"
                        value={formData.lastSeenDate}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, lastSeenDate: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                  placeholder="Physical description, age, clothing when last seen, any identifying features..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactInfo">Contact Information</Label>
                <Input
                  id="contactInfo"
                  value={formData.contactInfo}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, contactInfo: e.target.value }))}
                  placeholder="Phone or email for anyone with information"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Add Record</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or description..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={filterStatus}
          onValueChange={(value: VictimRecord["status"] | "all") => setFilterStatus(value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="missing">Missing</SelectItem>
            <SelectItem value="found">Found</SelectItem>
            <SelectItem value="deceased">Deceased</SelectItem>
            <SelectItem value="unknown">Unknown</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        {filteredRecords.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              {records.length === 0
                ? "No records yet. Add a record to help identify and track missing persons."
                : "No records match your search criteria."}
            </CardContent>
          </Card>
        ) : (
          filteredRecords.map((record) => (
            <Card key={record.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {record.photo && (
                    <img
                      src={record.photo}
                      alt={record.name}
                      className="h-20 w-20 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{record.name}</h3>
                          <Badge className={STATUS_COLORS[record.status]}>
                            {record.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{record.description}</p>
                        {record.lastSeenLocation && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Last seen: {record.lastSeenLocation}
                            {record.lastSeenDate && ` on ${record.lastSeenDate}`}
                          </p>
                        )}
                        {record.contactInfo && (
                          <p className="text-xs text-primary mt-1">Contact: {record.contactInfo}</p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Select
                          value={record.status}
                          onValueChange={(value: VictimRecord["status"]) => updateStatus(record.id, value)}
                        >
                          <SelectTrigger className="h-8 w-24 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="missing">Missing</SelectItem>
                            <SelectItem value="found">Found</SelectItem>
                            <SelectItem value="deceased">Deceased</SelectItem>
                            <SelectItem value="unknown">Unknown</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(record.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
