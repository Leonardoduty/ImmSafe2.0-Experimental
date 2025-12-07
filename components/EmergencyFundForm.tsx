"use client"

import { useState, useEffect } from "react"
import { DollarSign, Download, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { FundRequest } from "@/types"

const STORAGE_KEY = "emergency_fund_requests"

function generateId(): string {
  return `fund-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export default function EmergencyFundForm() {
  const [requests, setRequests] = useState<FundRequest[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    reason: "",
    contact: ""
  })

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setRequests(JSON.parse(stored))
      } catch {
        console.error("Failed to parse stored fund requests")
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests))
  }, [requests])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newRequest: FundRequest = {
      id: generateId(),
      name: formData.name,
      amount: parseFloat(formData.amount) || 0,
      reason: formData.reason,
      contact: formData.contact,
      createdAt: new Date().toISOString(),
      status: "pending"
    }

    setRequests(prev => [...prev, newRequest])
    setFormData({ name: "", amount: "", reason: "", contact: "" })
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id))
  }

  const exportToCSV = () => {
    if (requests.length === 0) return

    const headers = ["ID", "Name", "Amount", "Reason", "Contact", "Created At", "Status"]
    const csvContent = [
      headers.join(","),
      ...requests.map(r => [
        r.id,
        `"${r.name.replace(/"/g, '""')}"`,
        r.amount,
        `"${r.reason.replace(/"/g, '""')}"`,
        `"${r.contact.replace(/"/g, '""')}"`,
        r.createdAt,
        r.status
      ].join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `emergency_fund_requests_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const getStatusColor = (status: FundRequest["status"]) => {
    switch (status) {
      case "approved": return "bg-green-500"
      case "rejected": return "bg-red-500"
      default: return "bg-yellow-500"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Emergency Fund Requests</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportToCSV} disabled={requests.length === 0}>
            <Download className="h-4 w-4 mr-1" />
            Export CSV
          </Button>
          <Button size="sm" onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-1" />
            New Request
          </Button>
        </div>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Submit Fund Request</CardTitle>
            <CardDescription>Fill out the form to request emergency funds</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount Needed (USD)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    required
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Information</Label>
                <Input
                  id="contact"
                  value={formData.contact}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                  required
                  placeholder="Phone or email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Request</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                  required
                  placeholder="Explain why you need emergency funds..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Submit Request</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {requests.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No fund requests yet. Click "New Request" to submit one.
            </CardContent>
          </Card>
        ) : (
          requests.map((request) => (
            <Card key={request.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{request.name}</span>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold">${request.amount.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">{request.reason}</p>
                    <p className="text-xs text-muted-foreground">
                      Contact: {request.contact} | {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(request.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
