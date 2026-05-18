import type { Metadata } from 'next'
import type React from 'react'
import { Inter, Fira_Code } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SynTech Studios | Assistant IA de Cadrage Projet',
  description: 'Studio de développement premium — Web, Mobile, CRM, Automation & Design',
  icons: {
    icon: '/favicon-32x32.png',
    apple: '/apple-touch-icon-180.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${firaCode.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
