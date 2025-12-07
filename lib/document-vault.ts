// Document Vault - Store documents locally in browser using IndexedDB

export interface StoredDocument {
  id: string
  name: string
  type: string
  size: number
  data: string // Base64 encoded
  uploadedAt: string
}

const DB_NAME = "RefugeeDocumentsDB"
const DB_VERSION = 1
const STORE_NAME = "documents"

/**
 * Initialize IndexedDB database
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" })
      }
    }
  })
}

/**
 * Save document to IndexedDB
 */
export async function saveDocument(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const db = await openDB()
        const document: StoredDocument = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          size: file.size,
          data: reader.result as string,
          uploadedAt: new Date().toISOString(),
        }

        const transaction = db.transaction([STORE_NAME], "readwrite")
        const store = transaction.objectStore(STORE_NAME)
        const request = store.add(document)

        request.onsuccess = () => resolve(document.id)
        request.onerror = () => reject(request.error)
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Get all documents from IndexedDB
 */
export async function getDocuments(): Promise<StoredDocument[]> {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], "readonly")
    const store = transaction.objectStore(STORE_NAME)
    const request = store.getAll()

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error("[v0] Error reading documents:", error)
    return []
  }
}

/**
 * Get document by ID
 */
export async function getDocument(id: string): Promise<StoredDocument | null> {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], "readonly")
    const store = transaction.objectStore(STORE_NAME)
    const request = store.get(id)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error("[v0] Error getting document:", error)
    return null
  }
}

/**
 * Delete document from IndexedDB
 */
export async function deleteDocument(id: string): Promise<boolean> {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], "readwrite")
    const store = transaction.objectStore(STORE_NAME)
    const request = store.delete(id)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(true)
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error("[v0] Error deleting document:", error)
    return false
  }
}

/**
 * Download document
 */
export function downloadDocument(id: string): Promise<boolean> {
  return new Promise(async (resolve) => {
    try {
      const storedDoc = await getDocument(id)
      if (!storedDoc) {
        resolve(false)
        return
      }

      const link = document.createElement("a")
      link.href = storedDoc.data
      link.download = storedDoc.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      resolve(true)
    } catch (error) {
      console.error("[v0] Error downloading document:", error)
      resolve(false)
    }
  })
}

/**
 * Get storage usage estimate
 */
export async function getStorageUsage(): Promise<{ used: number; limit: number }> {
  try {
    const documents = await getDocuments()
    const totalSize = documents.reduce((sum, doc) => sum + doc.size, 0)
    
    // IndexedDB typically has much larger limits (50MB+)
    return {
      used: totalSize,
      limit: 50 * 1024 * 1024, // 50MB estimate
    }
  } catch (error) {
    return { used: 0, limit: 50 * 1024 * 1024 }
  }
}

