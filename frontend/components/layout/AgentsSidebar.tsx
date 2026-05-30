'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Users, Shield, Building2, ClipboardList, BarChart2, GraduationCap } from 'lucide-react'
import { ProgressBar } from '@/components/ui/ProgressBar'

const agentNav = [
  { href: '/agents', label: 'Team Overview', icon: Users },
  { href: '/agents/roles', label: 'Role & Position', icon: Shield },
  { href: '/agents/departments', label: 'Department', icon: Building2 },
  { href: '/agents/assignments', label: 'Work Assignments', icon: ClipboardList },
  { href: '/agents/performance', label: 'Performance', icon: BarChart2 },
  { href: '/agents/training', label: 'Training Center', icon: GraduationCap },
]

export function AgentsSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-44 flex-shrink-0 border-r border-[rgba(99,102,241,0.2)] bg-[rgba(10,10,15,0.6)] flex flex-col overflow-hidden">
      {/* Section label */}
      <div className="px-3 pt-3 pb-2">
        <div className="text-[9px] font-mono text-[#64748b] uppercase tracking-widest">AI Agents</div>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-0.5 px-2">
        {agentNav.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-2 py-2 rounded-lg text-xs font-mono transition-all duration-150 ${
                isActive
                  ? 'bg-[rgba(99,102,241,0.15)] text-[#6366f1] border-l-2 border-[#6366f1]'
                  : 'text-[#64748b] hover:text-[#e2e8f0] hover:bg-[rgba(255,255,255,0.04)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-[rgba(99,102,241,0.1)] mx-2 my-3" />

      {/* Team stats */}
      <div className="px-3 flex flex-col gap-2">
        <div className="text-[9px] font-mono text-[#64748b] uppercase tracking-widest mb-1">Team Status</div>
        {[
          { label: 'Online', count: 12, color: '#22c55e' },
          { label: 'Working', count: 8, color: '#6366f1' },
          { label: 'Idle', count: 3, color: '#f59e0b' },
          { label: 'On Break', count: 1, color: '#f97316' },
          { label: 'Maintenance', count: 2, color: '#ef4444' },
        ].map((s) => (
          <div key={s.label} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-[10px] font-mono text-[#64748b]">{s.label}</span>
            </div>
            <span className="text-[10px] font-mono font-bold" style={{ color: s.color }}>{s.count}</span>
          </div>
        ))}

        <div className="border-t border-[rgba(99,102,241,0.1)] my-1" />

        {/* Morale */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-[10px] font-mono text-[#64748b]">Team Morale</span>
            <span className="text-[10px] font-mono text-[#22c55e] font-bold">85%</span>
          </div>
          <ProgressBar value={85} color="#22c55e" height="h-1" />
        </div>

        {/* Resource Usage */}
        <div className="mt-1">
          <div className="text-[9px] font-mono text-[#64748b] uppercase tracking-widest mb-2">Resource Usage</div>
          {[
            { name: 'Data Feed', value: 78, color: '#6366f1' },
            { name: 'Compute', value: 62, color: '#8b5cf6' },
            { name: 'API Calls', value: 55, color: '#ec4899' },
          ].map((r) => (
            <div key={r.name} className="mb-1.5">
              <div className="flex justify-between mb-0.5">
                <span className="text-[9px] font-mono text-[#64748b]">{r.name}</span>
                <span className="text-[9px] font-mono" style={{ color: r.color }}>{r.value}%</span>
              </div>
              <ProgressBar value={r.value} color={r.color} height="h-0.5" />
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
