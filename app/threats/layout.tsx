import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Threat Analysis & Borders - SafeRoute",
  description: "AI-powered threat detection and border crossing intelligence",
}

export default function ThreatsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
