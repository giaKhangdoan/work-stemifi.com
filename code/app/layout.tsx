import type React from "react"
import type { Metadata } from "next"
import BackToTopButton from "@/components/back-to-top"
import { Montserrat } from "next/font/google"
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
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
  other: {
    "google-fonts": "Elms+Sans:ital,wght@0,100..900;1,100..900|Montserrat:ital,wght@0,100..900;1,100..900|Quintessential",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        {children}
        <BackToTopButton />
      </body>
    </html>
  )
}
