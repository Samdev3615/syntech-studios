import type { Metadata } from 'next'
import './globals.css'

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
    <html lang="fr">
      <body className="font-sans antialiased bg-[#0a0a0f] text-white">
        {children}
      </body>
    </html>
  )
}
