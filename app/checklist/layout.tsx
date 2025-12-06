import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Packing Checklist - SafeRoute",
  description: "Auto-generated packing checklist for your survival journey",
}

export default function ChecklistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
