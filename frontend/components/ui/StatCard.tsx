import { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  color?: string
  icon?: ReactNode
  trend?: 'up' | 'down' | 'neutral'
}

export function StatCard({ label, value, sub, color = '#6366f1', icon, trend }: StatCardProps) {
  return (
    <div
      className="bg-[rgba(15,15,25,0.8)] border border-[rgba(99,102,241,0.2)] rounded-xl p-4 hover:border-[rgba(99,102,241,0.4)] transition-all duration-200 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]"
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-[10px] font-mono text-[#64748b] uppercase tracking-widest">{label}</span>
        {icon && <span style={{ color }}>{icon}</span>}
      </div>
      <div className="font-mono font-bold text-xl" style={{ color }}>
        {value}
      </div>
      {sub && (
        <div className={`text-xs mt-1 font-mono ${trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-[#64748b]'}`}>
          {sub}
        </div>
      )}
    </div>
  )
}
