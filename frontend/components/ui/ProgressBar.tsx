interface ProgressBarProps {
  value: number
  max?: number
  color?: string
  label?: string
  showValue?: boolean
  height?: string
  shimmer?: boolean
}

export function ProgressBar({
  value,
  max = 100,
  color = '#6366f1',
  label,
  showValue = false,
  height = 'h-1.5',
  shimmer = false,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-xs text-[#64748b]">{label}</span>}
          {showValue && <span className="text-xs font-mono" style={{ color }}>{value}{max === 100 ? '%' : `/${max}`}</span>}
        </div>
      )}
      <div className={`w-full ${height} bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${shimmer ? 'progress-shimmer' : ''}`}
          style={{
            width: `${pct}%`,
            background: shimmer ? undefined : `linear-gradient(90deg, ${color}cc, ${color})`,
            boxShadow: `0 0 8px ${color}60`,
          }}
        />
      </div>
    </div>
  )
}
