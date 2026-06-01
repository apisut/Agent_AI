import { newsItems, catalystCalendar } from '@/lib/mockData'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { StatusBadge } from '@/components/ui/StatusBadge'

export default function NewsRoomPage() {
  const tickerHeadlines = [
    ...newsItems.map(n => `${n.ticker || 'MACRO'}: ${n.headline}`),
    'BTC: Bitcoin holds above $67k as institutional buying accelerates',
    'FED: Powell reiterates data-dependent approach to rate decisions',
    'AAPL: WWDC keynote reveals major AI integration across all Apple devices',
  ]

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Breaking News Ticker */}
      <div className="rounded-xl overflow-hidden border border-[rgba(239,68,68,0.4)] bg-[rgba(239,68,68,0.08)]" style={{ boxShadow: '0 0 20px rgba(239,68,68,0.1)' }}>
        <div className="flex items-center">
          <div className="flex-shrink-0 px-3 py-2 bg-[#ef4444] text-white text-xs font-mono font-bold">LIVE</div>
          <div className="overflow-hidden flex-1 py-2">
            <div className="ticker-scroll text-xs font-mono text-[#e2e8f0]">
              {tickerHeadlines.join('  •  ')}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Main news feed */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-mono font-bold text-[#e2e8f0]">News Room</h1>
            <div className="flex gap-1">
              {['All', 'Bullish', 'Bearish', 'FDA', 'Earnings', 'Macro'].map(f => (
                <button key={f} className="px-2.5 py-1 text-xs font-mono text-[#64748b] hover:text-[#e2e8f0] hover:bg-[rgba(255,255,255,0.05)] rounded transition-all">
                  {f}
                </button>
              ))}
            </div>
          </div>

          {newsItems.map((item) => (
            <GlassPanel key={item.id} glowColor={item.sentiment === 'bullish' ? 'green' : item.sentiment === 'bearish' ? 'red' : 'indigo'}>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {item.ticker && (
                        <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-[rgba(99,102,241,0.2)] text-[#6366f1] border border-[rgba(99,102,241,0.3)]">
                          {item.ticker}
                        </span>
                      )}
                      <span className="px-2 py-0.5 text-[9px] font-mono rounded bg-[rgba(255,255,255,0.05)] text-[#64748b]">
                        {item.category}
                      </span>
                      <StatusBadge status={item.sentiment} small />
                    </div>
                    <h3 className="text-sm font-mono font-bold text-[#e2e8f0] mb-1.5 leading-snug">{item.headline}</h3>
                    <p className="text-xs font-mono text-[#94a3b8] leading-relaxed">{item.summary}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-[10px] font-mono text-[#64748b]">{item.source}</div>
                    <div className="text-[10px] font-mono text-[#64748b]">{item.time}</div>
                    <div className="mt-2">
                      <span className={`text-xs font-mono font-bold ${item.impact === 'high' ? 'text-[#ef4444]' : item.impact === 'medium' ? 'text-[#f59e0b]' : 'text-[#64748b]'}`}>
                        {item.impact.toUpperCase()} IMPACT
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </GlassPanel>
          ))}
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-3" style={{ width: '280px' }}>
          {/* Catalyst Calendar */}
          <GlassPanel title="Catalyst Calendar" glowColor="amber">
            <div className="p-4 flex flex-col gap-2">
              {catalystCalendar.map((event, i) => {
                const importanceColor = event.importance === 'critical' ? '#ef4444' : event.importance === 'high' ? '#f59e0b' : '#64748b'
                return (
                  <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg border border-[rgba(99,102,241,0.1)] bg-[rgba(255,255,255,0.02)]">
                    <div className="flex-shrink-0 text-center">
                      <div className="text-[9px] font-mono text-[#64748b]">{event.date.split(' ')[0]}</div>
                      <div className="text-xs font-mono font-bold text-[#e2e8f0]">{event.date.split(' ')[1]}</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-mono font-bold text-[#6366f1]">{event.ticker}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: `${importanceColor}20`, color: importanceColor }}>
                          {event.type}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-[#94a3b8] leading-tight">{event.event}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </GlassPanel>

          {/* Source Reliability */}
          <GlassPanel title="Source Reliability" glowColor="indigo">
            <div className="p-4 flex flex-col gap-2">
              {[
                { source: 'Reuters', reliability: 96, color: '#22c55e' },
                { source: 'Bloomberg', reliability: 94, color: '#22c55e' },
                { source: 'WSJ', reliability: 92, color: '#22c55e' },
                { source: 'SEC EDGAR', reliability: 99, color: '#22c55e' },
                { source: 'BioPharma Dive', reliability: 88, color: '#f59e0b' },
                { source: 'TechCrunch', reliability: 78, color: '#f59e0b' },
                { source: 'Reddit', reliability: 42, color: '#ef4444' },
                { source: 'Twitter/X', reliability: 38, color: '#ef4444' },
              ].map((src) => (
                <div key={src.source} className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[#94a3b8] w-28 flex-shrink-0">{src.source}</span>
                  <div className="flex-1 h-1.5 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${src.reliability}%`, background: src.color }} />
                  </div>
                  <span className="text-[9px] font-mono w-7 text-right" style={{ color: src.color }}>{src.reliability}%</span>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  )
}
