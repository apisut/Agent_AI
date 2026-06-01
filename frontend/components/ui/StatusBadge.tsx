interface StatusBadgeProps {
  status: string
  small?: boolean
}

const statusConfig: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  online: { bg: 'rgba(34,197,94,0.15)', text: '#22c55e', dot: '#22c55e', label: 'Online' },
  working: { bg: 'rgba(99,102,241,0.15)', text: '#6366f1', dot: '#6366f1', label: 'Working' },
  idle: { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b', dot: '#f59e0b', label: 'Idle' },
  'on break': { bg: 'rgba(249,115,22,0.15)', text: '#f97316', dot: '#f97316', label: 'On Break' },
  offline: { bg: 'rgba(100,116,139,0.15)', text: '#64748b', dot: '#64748b', label: 'Offline' },
  maintenance: { bg: 'rgba(239,68,68,0.15)', text: '#ef4444', dot: '#ef4444', label: 'Maintenance' },
  active: { bg: 'rgba(34,197,94,0.15)', text: '#22c55e', dot: '#22c55e', label: 'Active' },
  bullish: { bg: 'rgba(34,197,94,0.15)', text: '#22c55e', dot: '#22c55e', label: 'Bullish' },
  bearish: { bg: 'rgba(239,68,68,0.15)', text: '#ef4444', dot: '#ef4444', label: 'Bearish' },
  neutral: { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b', dot: '#f59e0b', label: 'Neutral' },
  healthy: { bg: 'rgba(34,197,94,0.15)', text: '#22c55e', dot: '#22c55e', label: 'Healthy' },
  degraded: { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b', dot: '#f59e0b', label: 'Degraded' },
  down: { bg: 'rgba(239,68,68,0.15)', text: '#ef4444', dot: '#ef4444', label: 'Down' },
  high: { bg: 'rgba(249,115,22,0.15)', text: '#f97316', dot: '#f97316', label: 'High' },
  medium: { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b', dot: '#f59e0b', label: 'Medium' },
  low: { bg: 'rgba(100,116,139,0.15)', text: '#64748b', dot: '#64748b', label: 'Low' },
  critical: { bg: 'rgba(239,68,68,0.2)', text: '#ef4444', dot: '#ef4444', label: 'Critical' },
}

export function StatusBadge({ status, small = false }: StatusBadgeProps) {
  const cfg = statusConfig[status.toLowerCase()] || statusConfig.offline
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-mono font-medium ${small ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs'}`}
      style={{ background: cfg.bg, color: cfg.text }}
    >
      <span
        className="rounded-full flex-shrink-0"
        style={{
          width: small ? '5px' : '6px',
          height: small ? '5px' : '6px',
          backgroundColor: cfg.dot,
          boxShadow: `0 0 4px ${cfg.dot}`,
        }}
      />
      {cfg.label}
    </span>
  )
}
