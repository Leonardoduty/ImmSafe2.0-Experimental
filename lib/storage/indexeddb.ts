import type { EncryptedDocument } from "@/types"

const DB_NAME = "RefugeeSurvivalDB"
const DB_VERSION = 1

const STORES = {
  DOCUMENTS: "documents",
  FUND_REQUESTS: "fundRequests",
  POSTS: "posts",
  VICTIMS: "victims"
} as const

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      
      if (!db.objectStoreNames.contains(STORES.DOCUMENTS)) {
        db.createObjectStore(STORES.DOCUMENTS, { keyPath: "id" })
      }
      if (!db.objectStoreNames.contains(STORES.FUND_REQUESTS)) {
        db.createObjectStore(STORES.FUND_REQUESTS, { keyPath: "id" })
      }
      if (!db.objectStoreNames.contains(STORES.POSTS)) {
        db.createObjectStore(STORES.POSTS, { keyPath: "id" })
      }
      if (!db.objectStoreNames.contains(STORES.VICTIMS)) {
        db.createObjectStore(STORES.VICTIMS, { keyPath: "id" })
      }
    }
  })
}

async function generateKey(passphrase: string): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  )
  
  const salt = encoder.encode("refugee-survival-salt")
  
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  )
}

export async function encryptFile(file: File, passphrase: string): Promise<{ encryptedData: ArrayBuffer; iv: Uint8Array }> {
  const key = await generateKey(passphrase)
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const fileBuffer = await file.arrayBuffer()
  
  const encryptedData = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    fileBuffer
  )
  
  return { encryptedData, iv }
}

export async function decryptFile(encryptedData: ArrayBuffer, iv: Uint8Array, passphrase: string): Promise<ArrayBuffer> {
  const key = await generateKey(passphrase)
  
  return crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    encryptedData
  )
}

export async function storeDocument(doc: EncryptedDocument): Promise<void> {
  const db = await openDatabase()
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.DOCUMENTS, "readwrite")
    const store = transaction.objectStore(STORES.DOCUMENTS)
    const request = store.put(doc)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

export async function getDocument(id: string): Promise<EncryptedDocument | undefined> {
  const db = await openDatabase()
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.DOCUMENTS, "readonly")
    const store = transaction.objectStore(STORES.DOCUMENTS)
    const request = store.get(id)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

export async function getAllDocuments(): Promise<EncryptedDocument[]> {
  const db = await openDatabase()
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.DOCUMENTS, "readonly")
    const store = transaction.objectStore(STORES.DOCUMENTS)
    const request = store.getAll()
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

export async function deleteDocument(id: string): Promise<void> {
  const db = await openDatabase()
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.DOCUMENTS, "readwrite")
    const store = transaction.objectStore(STORES.DOCUMENTS)
    const request = store.delete(id)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

export async function storeGenericData<T extends { id: string }>(storeName: string, data: T): Promise<void> {
  const db = await openDatabase()
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite")
    const store = transaction.objectStore(storeName)
    const request = store.put(data)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

export async function getAllFromStore<T>(storeName: string): Promise<T[]> {
  const db = await openDatabase()
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly")
    const store = transaction.objectStore(storeName)
    const request = store.getAll()
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

export async function deleteFromStore(storeName: string, id: string): Promise<void> {
  const db = await openDatabase()
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite")
    const store = transaction.objectStore(storeName)
    const request = store.delete(id)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}
