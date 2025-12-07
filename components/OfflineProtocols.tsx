"use client"

import { useState } from "react"
import { FileDown, FileText, Shield, Heart, Droplets, Home, Scale, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { jsPDF } from "jspdf"

interface Protocol {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  content: string[]
  pdfFile?: string
}

const PROTOCOLS: Protocol[] = [
  {
    id: "emergency",
    title: "Emergency Response",
    description: "What to do in immediate danger",
    icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
    pdfFile: "/protocols/emergency-response.pdf",
    content: [
      "1. Stay calm and assess the situation",
      "2. If gunfire: Drop to ground, find cover, stay low",
      "3. If explosion: Move away from windows, get under sturdy furniture",
      "4. Wait for all-clear before moving",
      "5. Help others if safe to do so",
      "6. Contact emergency services when possible",
      "7. Move to designated safe zones",
      "8. Keep emergency contacts accessible"
    ]
  },
  {
    id: "first-aid",
    title: "First Aid Basics",
    description: "Essential medical care when help is unavailable",
    icon: <Heart className="h-5 w-5 text-red-500" />,
    pdfFile: "/protocols/first-aid.pdf",
    content: [
      "BLEEDING: Apply direct pressure with clean cloth",
      "BURNS: Cool with clean water for 10+ minutes",
      "FRACTURES: Immobilize, don't move unless necessary",
      "SHOCK: Lay person down, elevate legs, keep warm",
      "CPR: 30 chest compressions, 2 breaths, repeat",
      "CHOKING: 5 back blows, 5 abdominal thrusts",
      "DEHYDRATION: Small sips of water, oral rehydration salts",
      "WOUND CARE: Clean with water, apply bandage, watch for infection"
    ]
  },
  {
    id: "water",
    title: "Water Purification",
    description: "How to make water safe to drink",
    icon: <Droplets className="h-5 w-5 text-blue-500" />,
    pdfFile: "/protocols/water-purification.pdf",
    content: [
      "BOILING: Bring to rolling boil for 1+ minute (3 min at altitude)",
      "SOLAR: Clear bottles in direct sun 6+ hours",
      "TABLETS: Follow package instructions, wait required time",
      "FILTERS: Use cloth to remove large particles first",
      "BLEACH: 2 drops per liter, wait 30 minutes",
      "AVOID: Stagnant water, water near dead animals/chemicals",
      "STORAGE: Use clean containers, cover to prevent contamination",
      "SIGNS OF BAD WATER: Color, odor, floating particles"
    ]
  },
  {
    id: "shelter",
    title: "Emergency Shelter",
    description: "Creating safe temporary shelter",
    icon: <Home className="h-5 w-5 text-green-500" />,
    pdfFile: "/protocols/emergency-shelter.pdf",
    content: [
      "LOCATION: High ground, away from hazards, near water source",
      "MATERIALS: Tarps, branches, leaves, cardboard",
      "INSULATION: Ground cover is most important - use cardboard, leaves",
      "VENTILATION: Ensure airflow to prevent carbon monoxide",
      "FIRE SAFETY: Keep flames away from shelter materials",
      "SIGNALING: Mark location for rescuers if appropriate",
      "GROUP SHELTER: Huddle together for warmth",
      "WEATHER: Face entrance away from prevailing wind"
    ]
  },
  {
    id: "documents",
    title: "Document Protection",
    description: "Keeping important documents safe",
    icon: <FileText className="h-5 w-5 text-yellow-500" />,
    pdfFile: "/protocols/document-protection.pdf",
    content: [
      "DIGITIZE: Take photos of all important documents",
      "WATERPROOF: Use plastic bags or containers",
      "COPIES: Keep copies in multiple locations",
      "ENCRYPT: Use app's secure vault for digital copies",
      "ESSENTIALS: ID, passport, birth certificates, medical records",
      "HIDE: Keep originals in secure, hidden location",
      "SHARE: Give copies to trusted family/friends",
      "NEVER: Give originals unless legally required"
    ]
  },
  {
    id: "legal",
    title: "Legal Rights",
    description: "Know your rights as a refugee",
    icon: <Scale className="h-5 w-5 text-purple-500" />,
    pdfFile: "/protocols/legal-rights.pdf",
    content: [
      "RIGHT TO SEEK ASYLUM: You can apply at any border",
      "NON-REFOULEMENT: Cannot be returned to danger",
      "REGISTRATION: Register with UNHCR for protection",
      "FAMILY UNITY: Right to keep family together",
      "WORK RIGHTS: Varies by country - ask UNHCR",
      "EDUCATION: Children have right to schooling",
      "HEALTHCARE: Access to emergency medical care",
      "LEGAL AID: Free legal help available through NGOs"
    ]
  },
  {
    id: "security",
    title: "Personal Security",
    description: "Staying safe during displacement",
    icon: <Shield className="h-5 w-5 text-blue-500" />,
    pdfFile: "/protocols/personal-security.pdf",
    content: [
      "TRAVEL IN GROUPS: Especially at night",
      "TRUST CAREFULLY: Verify offers of help",
      "SHARE LOCATION: Tell trusted people your plans",
      "AVOID SHORTCUTS: Stick to known, populated routes",
      "VALUABLES: Keep hidden, don't display",
      "CHILDREN: Keep close, establish meeting points",
      "PHONES: Keep charged, know emergency numbers",
      "INSTINCTS: If something feels wrong, leave"
    ]
  }
]

export default function OfflineProtocols() {
  const [generating, setGenerating] = useState<string | null>(null)

  const generatePDF = async (protocol: Protocol) => {
    setGenerating(protocol.id)
    
    try {
      const doc = new jsPDF()
      
      doc.setFontSize(20)
      doc.setFont("helvetica", "bold")
      doc.text(protocol.title, 20, 20)
      
      doc.setFontSize(12)
      doc.setFont("helvetica", "normal")
      doc.text(protocol.description, 20, 30)
      
      doc.setDrawColor(200)
      doc.line(20, 35, 190, 35)
      
      doc.setFontSize(11)
      let yPosition = 45
      
      protocol.content.forEach((line) => {
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 20
        }
        
        const lines = doc.splitTextToSize(line, 170)
        doc.text(lines, 20, yPosition)
        yPosition += lines.length * 7 + 3
      })
      
      doc.setFontSize(8)
      doc.setTextColor(128)
      doc.text("Generated by Refugee Survival App", 20, 285)
      doc.text(new Date().toLocaleDateString(), 170, 285)
      
      doc.save(`${protocol.id}-protocol.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setGenerating(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <FileDown className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Offline Emergency Protocols</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        Download these protocols for offline access. Generate PDFs to save on your device.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {PROTOCOLS.map((protocol) => (
          <Card key={protocol.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {protocol.icon}
                  <CardTitle className="text-base">{protocol.title}</CardTitle>
                </div>
              </div>
              <CardDescription>{protocol.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {protocol.content.slice(0, 3).map((item, idx) => (
                  <p key={idx} className="text-xs text-muted-foreground">
                    {item}
                  </p>
                ))}
                {protocol.content.length > 3 && (
                  <p className="text-xs text-muted-foreground">
                    ...and {protocol.content.length - 3} more items
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => generatePDF(protocol)}
                disabled={generating === protocol.id}
              >
                <FileDown className="h-4 w-4 mr-2" />
                {generating === protocol.id ? "Generating..." : "Generate PDF"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
