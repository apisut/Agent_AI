import { ReactNode } from 'react'

interface GlassPanelProps {
  children: ReactNode
  className?: string
  glowColor?: 'indigo' | 'violet' | 'cyan' | 'pink' | 'amber' | 'green' | 'red' | 'teal' | 'gold'
  title?: string
  titleExtra?: ReactNode
}

const glowStyles: Record<string, string> = {
  indigo: 'border-[rgba(99,102,241,0.3)] shadow-[0_0_20px_rgba(99,102,241,0.1)]',
  violet: 'border-[rgba(139,92,246,0.3)] shadow-[0_0_20px_rgba(139,92,246,0.1)]',
  cyan: 'border-[rgba(6,182,212,0.3)] shadow-[0_0_20px_rgba(6,182,212,0.1)]',
  pink: 'border-[rgba(236,72,153,0.3)] shadow-[0_0_20px_rgba(236,72,153,0.1)]',
  amber: 'border-[rgba(245,158,11,0.3)] shadow-[0_0_20px_rgba(245,158,11,0.1)]',
  green: 'border-[rgba(34,197,94,0.3)] shadow-[0_0_20px_rgba(34,197,94,0.1)]',
  red: 'border-[rgba(239,68,68,0.3)] shadow-[0_0_20px_rgba(239,68,68,0.1)]',
  teal: 'border-[rgba(20,184,166,0.3)] shadow-[0_0_20px_rgba(20,184,166,0.1)]',
  gold: 'border-[rgba(234,179,8,0.3)] shadow-[0_0_20px_rgba(234,179,8,0.1)]',
}

export function GlassPanel({ children, className = '', glowColor = 'indigo', title, titleExtra }: GlassPanelProps) {
  return (
    <div
      className={`bg-[rgba(15,15,25,0.8)] border backdrop-blur-[10px] rounded-xl shadow-inner ${glowStyles[glowColor]} ${className}`}
      style={{ boxShadow: undefined }}
    >
      {title && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(99,102,241,0.15)]">
          <span className="text-xs font-mono font-semibold text-[#94a3b8] uppercase tracking-widest">{title}</span>
          {titleExtra}
        </div>
      )}
      {children}
    </div>
  )
}
