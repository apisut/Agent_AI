'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, Zap } from 'lucide-react'

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/scanner', label: 'Scanner' },
  { href: '/chart-lab', label: 'Chart Lab' },
  { href: '/news-room', label: 'News Room' },
  { href: '/fundamentals', label: 'Fundamentals' },
  { href: '/social-radar', label: 'Social Radar' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/trading-desk', label: 'Trading Desk' },
  { href: '/agents', label: 'Agents' },
  { href: '/dev-room', label: 'Dev Room' },
  { href: '/settings', label: 'Settings' },
]

export function TopBar() {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-12 flex items-center justify-between px-4 border-b border-[rgba(99,102,241,0.2)] bg-[rgba(10,10,15,0.95)] backdrop-blur-xl">
      {/* Logo */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.6)]">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <div className="leading-none">
          <div className="text-xs font-mono font-bold text-[#6366f1] tracking-wider">ALPHA IRIS</div>
          <div className="text-[9px] font-mono text-[#64748b] tracking-widest uppercase">AI Stock Command Center</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex items-center gap-0.5 overflow-x-auto mx-4">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href))
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-2.5 py-1.5 text-[11px] font-mono font-medium rounded whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? 'bg-[rgba(99,102,241,0.2)] text-[#6366f1] border border-[rgba(99,102,241,0.4)]'
                  : 'text-[#64748b] hover:text-[#e2e8f0] hover:bg-[rgba(255,255,255,0.05)]'
              }`}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Notification bell */}
        <button className="relative p-1.5 rounded-lg hover:bg-[rgba(99,102,241,0.1)] transition-colors">
          <Bell className="w-4 h-4 text-[#64748b]" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#ec4899] text-[9px] font-mono font-bold text-white flex items-center justify-center shadow-[0_0_8px_rgba(236,72,153,0.6)]">
            12
          </span>
        </button>

        {/* User */}
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-[11px] font-mono text-[#e2e8f0] font-semibold leading-none">Janie Commander</div>
            <div className="text-[9px] font-mono text-[#eab308] leading-none mt-0.5">CEO</div>
          </div>
          <div
            className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-800 to-yellow-600 flex items-center justify-center text-sm font-bold font-mono text-white"
            style={{ boxShadow: '0 0 10px rgba(234,179,8,0.5)', border: '2px solid rgba(234,179,8,0.5)' }}
          >
            J
          </div>
        </div>
      </div>
    </header>
  )
}
