"use client"

import { useState } from "react"
import { User, Upload, Download, Save } from "lucide-react"
import NavigationBar from "@/components/navigation/navigation-bar"
import { downloadBlob } from "@/lib/export-utils"

interface VictimInfo {
  name?: string
  age?: number
  gender?: "male" | "female" | "other" | "unknown"
  nationality?: string
  lastSeenLocation?: string
  lastSeenDate?: string
  physicalDescription?: string
  clothing?: string
  distinguishingFeatures?: string
  contactInfo?: string
  photo?: string // Base64
  additionalNotes?: string
}

export default function VictimIdentificationPage() {
  const [formData, setFormData] = useState<VictimInfo>({})
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setPhotoPreview(reader.result as string)
        setFormData((prev) => ({ ...prev, photo: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    try {
      const data = JSON.stringify(formData, null, 2)
      const blob = new Blob([data], { type: "application/json" })
      downloadBlob(blob, `victim-identification-${Date.now()}.json`)
    } catch (error) {
      console.error("[v0] Error saving victim info:", error)
      alert("Error saving information. Please try again.")
    }
  }

  const handleExport = () => {
    handleSave()
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar onSOS={() => {}} />

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <User className="h-8 w-8" />
            VICTIM IDENTIFICATION SYSTEM
          </h1>
          <p className="text-muted-foreground">
            Report missing persons information for NGO/UN assistance
          </p>
        </div>

        {/* Form */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Basic Information</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Name (if known)</label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground"
                  placeholder="Full name or nickname"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Age (if known)</label>
                <input
                  type="number"
                  value={formData.age || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, age: parseInt(e.target.value) || undefined }))}
                  className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground"
                  placeholder="Age in years"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Gender</label>
                <select
                  value={formData.gender || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, gender: e.target.value as any }))}
                  className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground"
                >
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Nationality</label>
                <input
                  type="text"
                  value={formData.nationality || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nationality: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground"
                  placeholder="Country of origin"
                />
              </div>
            </div>
          </div>

          {/* Last Seen Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Last Seen Information</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Last Seen Location</label>
                <input
                  type="text"
                  value={formData.lastSeenLocation || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, lastSeenLocation: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground"
                  placeholder="City, region, or coordinates"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Last Seen Date</label>
                <input
                  type="date"
                  value={formData.lastSeenDate || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, lastSeenDate: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground"
                />
              </div>
            </div>
          </div>

          {/* Physical Description */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Physical Description</h2>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Physical Description</label>
              <textarea
                value={formData.physicalDescription || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, physicalDescription: e.target.value }))}
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground"
                rows={3}
                placeholder="Height, build, hair color, eye color, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Clothing</label>
              <textarea
                value={formData.clothing || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, clothing: e.target.value }))}
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground"
                rows={2}
                placeholder="Description of clothing when last seen"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Distinguishing Features</label>
              <textarea
                value={formData.distinguishingFeatures || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, distinguishingFeatures: e.target.value }))}
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground"
                rows={2}
                placeholder="Scars, tattoos, birthmarks, etc."
              />
            </div>
          </div>

          {/* Photo Upload */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Photo</h2>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Upload Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground"
              />
              {photoPreview && (
                <div className="mt-4">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="max-w-xs rounded-lg border border-border"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Contact Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Contact Information</label>
              <textarea
                value={formData.contactInfo || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, contactInfo: e.target.value }))}
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground"
                rows={2}
                placeholder="Phone number, email, or other contact method"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Additional Notes</label>
              <textarea
                value={formData.additionalNotes || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, additionalNotes: e.target.value }))}
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground"
                rows={3}
                placeholder="Any other relevant information"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
            >
              <Save className="h-4 w-4" />
              Save Locally
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition"
            >
              <Download className="h-4 w-4" />
              Export as JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


