export interface Location {
  lat: number
  lon: number
  label?: string
  country?: string
}

export interface NGO {
  id: string
  name: string
  description: string
  services: string[]
  contact: {
    phone?: string
    email?: string
    website?: string
  }
  location: Location
  operatingHours?: string
}

export interface UNOffice {
  id: string
  name: string
  agency: string
  description: string
  services: string[]
  contact: {
    phone?: string
    email?: string
    website?: string
  }
  location: Location
  operatingHours?: string
}

export interface AidService {
  id: string
  name: string
  type: "shelter" | "water" | "medical" | "legal" | "food" | "clothing" | "other"
  description: string
  provider: string
  contact: {
    phone?: string
    email?: string
    address?: string
  }
  location: Location
  availability?: string
}

export interface FundRequest {
  id: string
  name: string
  amount: number
  reason: string
  contact: string
  createdAt: string
  status: "pending" | "approved" | "rejected"
}

export interface Post {
  id: string
  author: string
  content: string
  createdAt: string
  comments: Comment[]
}

export interface Comment {
  id: string
  postId: string
  author: string
  content: string
  createdAt: string
}

export interface VictimRecord {
  id: string
  name: string
  photo?: string
  description: string
  status: "missing" | "found" | "deceased" | "unknown"
  lastSeenLocation?: string
  lastSeenDate?: string
  contactInfo?: string
  createdAt: string
  updatedAt: string
}

export interface VisaRequirement {
  country: string
  countryCode: string
  visaRequired: boolean
  visaOnArrival: boolean
  eVisaAvailable: boolean
  processingTime: string
  requiredDocuments: string[]
  fees?: string
  notes?: string
}

export interface EncryptedDocument {
  id: string
  name: string
  type: string
  size: number
  encryptedData: ArrayBuffer
  iv: Uint8Array
  createdAt: string
}
