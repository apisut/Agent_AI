import type { Metadata } from 'next'
import './globals.css'
import { TopBar } from '@/components/layout/TopBar'

export const metadata: Metadata = {
  title: 'Janie Alpha HQ | AI Stock Command Center',
  description: 'AI-powered stock trading command center',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0f] text-[#e2e8f0] min-h-screen cyber-grid">
        <TopBar />
        <div className="pt-12 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
