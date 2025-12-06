import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Guides & Resources - SafeRoute",
  description: "First aid, survival guides, and emergency information",
}

export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
