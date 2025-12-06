import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard - SafeRoute",
  description: "System management and data administration",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
