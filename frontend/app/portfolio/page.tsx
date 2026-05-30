import { portfolioPositions } from '@/lib/mockData'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { ProgressBar } from '@/components/ui/ProgressBar'

export default function PortfolioPage() {
  const totalValue = portfolioPositions.reduce((sum, p) => sum + p.value, 0)
  const totalPnL = portfolioPositions.reduce((sum, p) => sum + (p.current - p.avgCost) * p.shares, 0)
  const totalCost = portfolioPositions.reduce((sum, p) => sum + p.avgCost * p.shares, 0)
  const totalPnLPct = (totalPnL / totalCost) * 100

  const sectorGroups = portfolioPositions.reduce<Record<string, number>>((acc, p) => {
    acc[p.group] = (acc[p.group] || 0) + p.value
    return acc
  }, {})

  const sectorColors: Record<string, string> = {
    'AI/Tech': '#6366f1',
    'Healthcare': '#22c55e',
    'Biotech': '#8b5cf6',
    'Quantum': '#06b6d4',
    'Cloud': '#f59e0b',
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Portfolio Stats Bar */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Total Value', value: `$${totalValue.toLocaleString()}`, color: '#e2e8f0' },
          { label: 'Total P&L', value: `+$${totalPnL.toLocaleString('en-US', { maximumFractionDigits: 0 })}`, color: '#22c55e' },
          { label: 'P&L %', value: `+${totalPnLPct.toFixed(1)}%`, color: '#22c55e' },
          { label: 'Positions', value: String(portfolioPositions.length), color: '#6366f1' },
          { label: 'Cash Reserve', value: '$48,230', color: '#f59e0b' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl p-4 border border-[rgba(99,102,241,0.2)] bg-[rgba(15,15,25,0.8)] text-center">
            <div className="text-[9px] font-mono text-[#64748b] uppercase tracking-widest mb-1">{stat.label}</div>
            <div className="text-lg font-mono font-bold" style={{ color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        {/* Positions Table */}
        <div className="flex-1 flex flex-col gap-4">
          <GlassPanel title="Active Positions" glowColor="indigo">
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-[rgba(99,102,241,0.15)]">
                    {['Ticker', 'Name', 'Shares', 'Avg Cost', 'Current', 'Market Value', 'P&L', 'P&L%', 'Alloc', 'Entry', 'Stop', 'Target'].map((h) => (
                      <th key={h} className="px-3 py-2.5 text-left text-[10px] text-[#64748b] uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {portfolioPositions.map((pos) => {
                    const pnl = (pos.current - pos.avgCost) * pos.shares
                    const up = pos.pnlPct >= 0
                    return (
                      <tr key={pos.ticker} className="border-b border-[rgba(99,102,241,0.05)] hover:bg-[rgba(99,102,241,0.05)] transition-colors">
                        <td className="px-3 py-2.5 font-bold text-[#6366f1]">{pos.ticker}</td>
                        <td className="px-3 py-2.5 text-[#94a3b8]">{pos.name}</td>
                        <td className="px-3 py-2.5 text-[#e2e8f0]">{pos.shares}</td>
                        <td className="px-3 py-2.5 text-[#94a3b8]">${pos.avgCost.toFixed(2)}</td>
                        <td className="px-3 py-2.5 text-[#e2e8f0] font-bold">${pos.current.toFixed(2)}</td>
                        <td className="px-3 py-2.5 text-[#e2e8f0]">${pos.value.toLocaleString()}</td>
                        <td className={`px-3 py-2.5 font-bold ${up ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                          {up ? '+' : ''}${pnl.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        </td>
                        <td className={`px-3 py-2.5 font-bold ${up ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                          {up ? '+' : ''}{pos.pnlPct.toFixed(1)}%
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-1.5">
                            <ProgressBar value={pos.value} max={totalValue} color="#6366f1" height="h-1" />
                            <span className="text-[9px] text-[#64748b] w-8">{((pos.value / totalValue) * 100).toFixed(0)}%</span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-[#94a3b8]">{pos.entryDate}</td>
                        <td className="px-3 py-2.5 text-[#ef4444]">${pos.stopLoss.toFixed(2)}</td>
                        <td className="px-3 py-2.5 text-[#22c55e]">${pos.target.toFixed(2)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </GlassPanel>

          {/* Sector Exposure */}
          <GlassPanel title="Sector Exposure" glowColor="violet">
            <div className="p-4 flex flex-col gap-3">
              {Object.entries(sectorGroups).sort((a, b) => b[1] - a[1]).map(([sector, value]) => (
                <div key={sector} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-[#94a3b8] w-24 flex-shrink-0">{sector}</span>
                  <div className="flex-1">
                    <ProgressBar value={value} max={totalValue} color={sectorColors[sector] || '#6366f1'} height="h-3" />
                  </div>
                  <span className="text-xs font-mono font-bold w-12 text-right" style={{ color: sectorColors[sector] || '#6366f1' }}>
                    {((value / totalValue) * 100).toFixed(1)}%
                  </span>
                  <span className="text-[10px] font-mono text-[#64748b] w-20 text-right">${value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* Right: Allocation visual */}
        <div className="flex flex-col gap-3" style={{ width: '240px' }}>
          <GlassPanel title="Allocation" glowColor="indigo">
            <div className="p-4">
              {/* Simple donut chart using conic-gradient */}
              <div className="w-40 h-40 rounded-full mx-auto mb-4 flex items-center justify-center" style={{
                background: (() => {
                  let pct = 0
                  const segs = portfolioPositions.map((p, i) => {
                    const alloc = (p.value / totalValue) * 100
                    const colors = ['#6366f1', '#22c55e', '#8b5cf6', '#06b6d4', '#f59e0b']
                    const start = pct
                    pct += alloc
                    return `${colors[i]} ${start}% ${pct}%`
                  })
                  return `conic-gradient(${segs.join(', ')})`
                })(),
                boxShadow: '0 0 30px rgba(99,102,241,0.2)',
              }}>
                <div className="w-24 h-24 rounded-full bg-[#0a0a0f] flex flex-col items-center justify-center">
                  <div className="text-xs font-mono font-bold text-[#e2e8f0]">${Math.round(totalValue / 1000)}k</div>
                  <div className="text-[8px] font-mono text-[#64748b]">total</div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                {portfolioPositions.map((p, i) => {
                  const colors = ['#6366f1', '#22c55e', '#8b5cf6', '#06b6d4', '#f59e0b']
                  return (
                    <div key={p.ticker} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: colors[i] }} />
                      <span className="text-[10px] font-mono text-[#94a3b8] flex-1">{p.ticker}</span>
                      <span className="text-[10px] font-mono font-bold" style={{ color: colors[i] }}>
                        {((p.value / totalValue) * 100).toFixed(1)}%
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </GlassPanel>

          {/* Risk metrics */}
          <GlassPanel title="Risk Metrics" glowColor="red">
            <div className="p-4 flex flex-col gap-2">
              {[
                { label: 'Portfolio Beta', value: '1.24', color: '#f59e0b' },
                { label: 'Sharpe Ratio', value: '2.18', color: '#22c55e' },
                { label: 'Max Drawdown', value: '-8.4%', color: '#ef4444' },
                { label: 'VaR (95%)', value: '$4,230', color: '#f97316' },
                { label: 'Correlation', value: '0.62', color: '#8b5cf6' },
              ].map((m) => (
                <div key={m.label} className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-[#64748b]">{m.label}</span>
                  <span className="text-xs font-mono font-bold" style={{ color: m.color }}>{m.value}</span>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  )
}
