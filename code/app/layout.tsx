import type React from "react"
import type { Metadata } from "next"
import BackToTopButton from "@/components/back-to-top"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "Workshop STEMIFI",
  description: "Weekly workshops with beautiful design and 3D effects",
  generator: "v0.app",
  icons: {
    icon: "/stemifi-logo.png",
    shortcut: "/stemifi-logo.png",
    apple: "/stemifi-logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
        <BackToTopButton />
      </body>
    </html>
  )
}
