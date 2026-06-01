import { opportunities, heatmapData } from '@/lib/mockData'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { ProgressBar } from '@/components/ui/ProgressBar'

const kanbanStages = ['Watchlist', 'News Checked', 'Fundamental Passed', 'Technical Passed', 'Trade Plan Ready', 'CEO Review']

export default function ScannerPage() {
  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-mono font-bold text-[#e2e8f0]">Opportunity Scanner</h1>
        <div className="flex items-center gap-2">
          <select className="px-2 py-1.5 text-xs font-mono bg-[rgba(15,15,25,0.8)] border border-[rgba(99,102,241,0.3)] rounded-lg text-[#94a3b8] focus:outline-none">
            <option>All Sectors</option>
            <option>Healthcare</option>
            <option>Biotech</option>
            <option>Tech</option>
            <option>Crypto</option>
          </select>
          <select className="px-2 py-1.5 text-xs font-mono bg-[rgba(15,15,25,0.8)] border border-[rgba(99,102,241,0.3)] rounded-lg text-[#94a3b8] focus:outline-none">
            <option>All Stages</option>
            {kanbanStages.map(s => <option key={s}>{s}</option>)}
          </select>
          <select className="px-2 py-1.5 text-xs font-mono bg-[rgba(15,15,25,0.8)] border border-[rgba(99,102,241,0.3)] rounded-lg text-[#94a3b8] focus:outline-none">
            <option>Score: All</option>
            <option>Score: 80+</option>
            <option>Score: 90+</option>
          </select>
        </div>
      </div>

      {/* Opportunity Pipeline Kanban */}
      <GlassPanel title="Opportunity Pipeline" glowColor="indigo">
        <div className="p-4">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {kanbanStages.map((stage) => {
              const stageOpps = opportunities.filter(o => o.stage === stage)
              const colors = ['#64748b', '#06b6d4', '#8b5cf6', '#6366f1', '#f59e0b', '#eab308']
              const color = colors[kanbanStages.indexOf(stage)]
              return (
                <div key={stage} className="flex-shrink-0 w-44">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color }}>{stage}</span>
                    <span className="text-[9px] font-mono rounded-full px-1.5 py-0.5" style={{ background: `${color}20`, color }}>{stageOpps.length}</span>
                  </div>
                  <div className="flex flex-col gap-2 min-h-20 p-2 rounded-lg border border-dashed border-[rgba(99,102,241,0.2)] bg-[rgba(255,255,255,0.01)]">
                    {stageOpps.map((opp) => (
                      <div key={opp.ticker} className="p-2.5 rounded-lg border bg-[rgba(15,15,25,0.9)] hover:border-[rgba(99,102,241,0.4)] transition-all cursor-pointer"
                        style={{ borderColor: `${color}40` }}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-mono font-bold" style={{ color }}>{opp.ticker}</span>
                          <span className="text-[9px] font-mono font-bold text-[#22c55e]">{opp.score}</span>
                        </div>
                        <div className="text-[9px] font-mono text-[#64748b] truncate">{opp.name}</div>
                        <div className="text-[9px] font-mono mt-1" style={{ color: opp.positive ? '#22c55e' : '#ef4444' }}>{opp.change}</div>
                      </div>
                    ))}
                    {stageOpps.length === 0 && (
                      <div className="text-center text-[9px] font-mono text-[#64748b] py-4">Empty</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </GlassPanel>

      {/* Top Candidates Table */}
      <GlassPanel title="Top Candidates" glowColor="indigo">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-[rgba(99,102,241,0.15)]">
                {['Ticker', 'Company', 'Price', 'Change', 'Volume', 'Sector', 'Setup', 'Score', 'Stage'].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left text-[10px] text-[#64748b] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {opportunities.map((opp) => (
                <tr key={opp.ticker} className="border-b border-[rgba(99,102,241,0.05)] hover:bg-[rgba(99,102,241,0.05)] transition-colors cursor-pointer">
                  <td className="px-3 py-2.5 font-bold text-[#6366f1]">{opp.ticker}</td>
                  <td className="px-3 py-2.5 text-[#e2e8f0]">{opp.name}</td>
                  <td className="px-3 py-2.5 text-[#e2e8f0] font-mono">${opp.price}</td>
                  <td className="px-3 py-2.5">
                    <span className={`font-bold ${opp.positive ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>{opp.change}</span>
                  </td>
                  <td className="px-3 py-2.5 text-[#94a3b8]">{opp.volume}</td>
                  <td className="px-3 py-2.5 text-[#94a3b8]">{opp.sector}</td>
                  <td className="px-3 py-2.5 text-[#8b5cf6]">{opp.setup}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <ProgressBar value={opp.score} color={opp.score >= 90 ? '#22c55e' : '#6366f1'} height="h-1.5" />
                      <span className="font-bold w-6" style={{ color: opp.score >= 90 ? '#22c55e' : '#6366f1' }}>{opp.score}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="px-2 py-0.5 text-[9px] font-mono rounded-full bg-[rgba(99,102,241,0.15)] text-[#6366f1] border border-[rgba(99,102,241,0.3)]">
                      {opp.stage}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassPanel>

      {/* Market Heatmap */}
      <GlassPanel title="Market Heatmap" glowColor="cyan">
        <div className="p-4">
          <div className="grid grid-cols-8 gap-1.5">
            {heatmapData.map((item) => {
              const positive = item.change > 0
              const intensity = Math.min(Math.abs(item.change) / 5, 1)
              const bg = positive
                ? `rgba(34,197,94,${0.15 + intensity * 0.5})`
                : `rgba(239,68,68,${0.15 + intensity * 0.5})`
              return (
                <div key={item.ticker} className="rounded-lg p-2 text-center cursor-pointer hover:scale-105 transition-transform"
                  style={{ background: bg, border: `1px solid ${positive ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
                  <div className="text-xs font-mono font-bold text-white">{item.ticker}</div>
                  <div className="text-[9px] font-mono text-[#94a3b8]">{item.sector}</div>
                  <div className={`text-[10px] font-mono font-bold ${positive ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                    {positive ? '+' : ''}{item.change}%
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </GlassPanel>
    </div>
  )
}
