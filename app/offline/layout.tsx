import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Offline Support - SafeRoute",
  description: "Download content packages for offline access",
}

export default function OfflineLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
