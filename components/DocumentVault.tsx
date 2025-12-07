"use client"

import { useState, useEffect, useRef } from "react"
import { Shield, Upload, Download, Trash2, Lock, Unlock, FileText, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import {
  encryptFile,
  decryptFile,
  storeDocument,
  getAllDocuments,
  deleteDocument,
  generateId
} from "@/lib/storage/indexeddb"
import type { EncryptedDocument } from "@/types"

export default function DocumentVault() {
  const [documents, setDocuments] = useState<EncryptedDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [uploadPassphrase, setUploadPassphrase] = useState("")
  const [showUploadPassphrase, setShowUploadPassphrase] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [decryptDialog, setDecryptDialog] = useState<{ open: boolean; doc: EncryptedDocument | null }>({
    open: false,
    doc: null
  })
  const [decryptPassphrase, setDecryptPassphrase] = useState("")
  const [showDecryptPassphrase, setShowDecryptPassphrase] = useState(false)
  const [error, setError] = useState("")
  const [processing, setProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      const docs = await getAllDocuments()
      setDocuments(docs)
    } catch (err) {
      console.error("Failed to load documents:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setError("")
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !uploadPassphrase) {
      setError("Please select a file and enter a passphrase")
      return
    }

    if (uploadPassphrase.length < 8) {
      setError("Passphrase must be at least 8 characters")
      return
    }

    setProcessing(true)
    setError("")

    try {
      const { encryptedData, iv } = await encryptFile(selectedFile, uploadPassphrase)

      const doc: EncryptedDocument = {
        id: generateId(),
        name: selectedFile.name,
        type: selectedFile.type || "application/octet-stream",
        size: selectedFile.size,
        encryptedData,
        iv,
        createdAt: new Date().toISOString()
      }

      await storeDocument(doc)
      setDocuments(prev => [...prev, doc])
      setSelectedFile(null)
      setUploadPassphrase("")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (err) {
      console.error("Upload failed:", err)
      setError("Failed to encrypt and store document")
    } finally {
      setProcessing(false)
    }
  }

  const handleDecrypt = async () => {
    if (!decryptDialog.doc || !decryptPassphrase) return

    setProcessing(true)
    setError("")

    try {
      const decryptedData = await decryptFile(
        decryptDialog.doc.encryptedData,
        decryptDialog.doc.iv,
        decryptPassphrase
      )

      const blob = new Blob([decryptedData], { type: decryptDialog.doc.type })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = decryptDialog.doc.name
      link.click()
      URL.revokeObjectURL(url)

      setDecryptDialog({ open: false, doc: null })
      setDecryptPassphrase("")
    } catch (err) {
      console.error("Decryption failed:", err)
      setError("Decryption failed. Incorrect passphrase.")
    } finally {
      setProcessing(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteDocument(id)
      setDocuments(prev => prev.filter(d => d.id !== id))
    } catch (err) {
      console.error("Delete failed:", err)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Shield className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Secure Document Vault</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Upload & Encrypt Document
          </CardTitle>
          <CardDescription>
            Documents are encrypted with AES-GCM. Your passphrase is never stored.
            Remember it - without it, documents cannot be recovered.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">Select Document</Label>
            <Input
              ref={fileInputRef}
              id="file"
              type="file"
              onChange={handleFileSelect}
              className="cursor-pointer"
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="passphrase">Encryption Passphrase</Label>
            <div className="relative">
              <Input
                id="passphrase"
                type={showUploadPassphrase ? "text" : "password"}
                value={uploadPassphrase}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUploadPassphrase(e.target.value)}
                placeholder="Enter a strong passphrase (min 8 characters)"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowUploadPassphrase(!showUploadPassphrase)}
              >
                {showUploadPassphrase ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || !uploadPassphrase || processing}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {processing ? "Encrypting..." : "Encrypt & Store"}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Stored Documents ({documents.length})</h3>

        {isLoading ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Loading documents...
            </CardContent>
          </Card>
        ) : documents.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No documents stored. Upload a document to get started.
            </CardContent>
          </Card>
        ) : (
          documents.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(doc.size)} | {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDecryptDialog({ open: true, doc })}
                    >
                      <Unlock className="h-4 w-4 mr-1" />
                      Decrypt
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(doc.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={decryptDialog.open} onOpenChange={(open) => {
        if (!open) {
          setDecryptDialog({ open: false, doc: null })
          setDecryptPassphrase("")
          setError("")
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decrypt Document</DialogTitle>
            <DialogDescription>
              Enter the passphrase used to encrypt "{decryptDialog.doc?.name}"
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="decryptPassphrase">Passphrase</Label>
              <div className="relative">
                <Input
                  id="decryptPassphrase"
                  type={showDecryptPassphrase ? "text" : "password"}
                  value={decryptPassphrase}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setDecryptPassphrase(e.target.value)
                    setError("")
                  }}
                  placeholder="Enter passphrase"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowDecryptPassphrase(!showDecryptPassphrase)}
                >
                  {showDecryptPassphrase ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDecryptDialog({ open: false, doc: null })}>
              Cancel
            </Button>
            <Button onClick={handleDecrypt} disabled={!decryptPassphrase || processing}>
              <Download className="h-4 w-4 mr-2" />
              {processing ? "Decrypting..." : "Decrypt & Download"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
