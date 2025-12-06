import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Food Identifier - SafeRoute",
  description: "Identify edible plants, assess water safety, and get survival information",
}

export default function IdentifierLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
