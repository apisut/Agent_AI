interface AgentAvatarProps {
  name: string
  initial: string
  glow: string
  status?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  level?: number
  showLevel?: boolean
}

const gradients: Record<string, string> = {
  A: 'from-violet-900 to-violet-700',
  N: 'from-indigo-900 to-indigo-700',
  L: 'from-cyan-900 to-cyan-700',
  S: 'from-amber-900 to-amber-700',
  V: 'from-orange-900 to-orange-700',
  B: 'from-teal-900 to-teal-700',
  D: 'from-red-900 to-red-700',
  E: 'from-green-900 to-green-700',
  J: 'from-yellow-900 to-yellow-700',
}

const statusColors: Record<string, string> = {
  online: '#22c55e',
  working: '#6366f1',
  idle: '#f59e0b',
  'on break': '#f97316',
  offline: '#64748b',
  maintenance: '#ef4444',
}

const sizes = {
  sm: { outer: 'w-8 h-8', text: 'text-sm', dot: 'w-2 h-2', ring: '2px' },
  md: { outer: 'w-10 h-10', text: 'text-base', dot: 'w-2.5 h-2.5', ring: '2px' },
  lg: { outer: 'w-14 h-14', text: 'text-xl', dot: 'w-3 h-3', ring: '3px' },
  xl: { outer: 'w-20 h-20', text: 'text-3xl', dot: 'w-4 h-4', ring: '3px' },
}

export function AgentAvatar({ name, initial, glow, status = 'online', size = 'md', level, showLevel = false }: AgentAvatarProps) {
  const s = sizes[size]
  const dotColor = statusColors[status] || '#64748b'
  const grad = gradients[initial] || 'from-indigo-900 to-indigo-700'

  return (
    <div className="relative inline-flex items-center justify-center flex-shrink-0">
      {/* Glow ring */}
      <div
        className={`${s.outer} rounded-full absolute`}
        style={{ boxShadow: `0 0 12px ${glow}60, 0 0 24px ${glow}30`, border: `${s.ring} solid ${glow}60` }}
      />
      {/* Avatar circle */}
      <div
        className={`${s.outer} rounded-full bg-gradient-to-br ${grad} flex items-center justify-center relative z-10`}
      >
        <span className={`${s.text} font-bold text-white font-mono`}>{initial}</span>
      </div>
      {/* Status dot */}
      {status && (
        <div
          className={`${s.dot} rounded-full absolute bottom-0 right-0 z-20 border border-[#0a0a0f]`}
          style={{ backgroundColor: dotColor, boxShadow: status === 'online' || status === 'working' ? `0 0 6px ${dotColor}` : 'none' }}
        />
      )}
      {/* Level badge */}
      {showLevel && level !== undefined && (
        <div className="absolute -bottom-1 -right-1 z-30 bg-[#0a0a0f] border border-[rgba(99,102,241,0.5)] rounded-full px-1 text-[9px] font-mono text-[#6366f1] font-bold">
          {level}
        </div>
      )}
    </div>
  )
}
