import { socialTrending } from '@/lib/mockData'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { ProgressBar } from '@/components/ui/ProgressBar'

export default function SocialRadarPage() {
  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-mono font-bold text-[#e2e8f0]">Social Radar</h1>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#22c55e] status-dot-online" />
          <span className="text-xs font-mono text-[#22c55e]">Live Monitoring</span>
        </div>
      </div>

      {/* Social Heat Scores */}
      <div className="grid grid-cols-5 gap-3">
        {socialTrending.map((item) => {
          const hypeColor = item.hype === 'extreme' ? '#ef4444' : item.hype === 'high' ? '#f97316' : item.hype === 'medium' ? '#f59e0b' : '#64748b'
          return (
            <GlassPanel key={item.ticker} glowColor="indigo">
              <div className="p-4 text-center">
                <div className="text-lg font-mono font-bold text-[#6366f1] mb-1">{item.ticker}</div>
                <div className="text-2xl font-mono font-bold text-[#e2e8f0] mb-1">{item.mentions.toLocaleString()}</div>
                <div className="text-[9px] font-mono text-[#64748b] mb-2">mentions</div>
                <div className="flex items-center justify-center gap-1.5 mb-3">
                  <span className="text-[10px] font-mono text-[#22c55e]">+{item.change}%</span>
                  <span className="text-[9px] font-mono text-[#64748b]">24h</span>
                </div>
                <div className="flex flex-col gap-1.5 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-[#22c55e] w-10">Bull</span>
                    <ProgressBar value={item.bullish} color="#22c55e" height="h-1.5" />
                    <span className="text-[9px] font-mono text-[#22c55e] w-6">{item.bullish}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-[#ef4444] w-10">Bear</span>
                    <ProgressBar value={item.bearish} color="#ef4444" height="h-1.5" />
                    <span className="text-[9px] font-mono text-[#ef4444] w-6">{item.bearish}%</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-[9px] font-mono rounded-full uppercase" style={{ background: `${hypeColor}20`, color: hypeColor, border: `1px solid ${hypeColor}40` }}>
                  {item.hype} hype
                </span>
              </div>
            </GlassPanel>
          )
        })}
      </div>

      <div className="flex gap-4">
        {/* Trending Tickers + Mention Bars */}
        <div className="flex-1 flex flex-col gap-3">
          <GlassPanel title="Mention Volume (24h)" glowColor="indigo">
            <div className="p-4 flex flex-col gap-3">
              {socialTrending.sort((a, b) => b.mentions - a.mentions).map((item) => {
                const maxMentions = Math.max(...socialTrending.map(i => i.mentions))
                return (
                  <div key={item.ticker} className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-[#6366f1] w-12">{item.ticker}</span>
                    <div className="flex-1">
                      <ProgressBar value={item.mentions} max={maxMentions} color="#6366f1" height="h-3" />
                    </div>
                    <span className="text-xs font-mono text-[#94a3b8] w-16 text-right">{item.mentions.toLocaleString()}</span>
                    <span className="text-[10px] font-mono text-[#22c55e] w-10">+{item.change}%</span>
                  </div>
                )
              })}
            </div>
          </GlassPanel>

          {/* Platform breakdown */}
          <GlassPanel title="Platform Breakdown" glowColor="indigo">
            <div className="p-4 grid grid-cols-3 gap-3">
              {[
                { platform: 'Reddit', mentions: 42800, icon: '📱', color: '#f97316' },
                { platform: 'Twitter/X', mentions: 28400, icon: '🐦', color: '#06b6d4' },
                { platform: 'StockTwits', mentions: 8900, icon: '📈', color: '#8b5cf6' },
              ].map((p) => (
                <div key={p.platform} className="text-center p-4 rounded-xl border border-[rgba(99,102,241,0.2)] bg-[rgba(255,255,255,0.02)]">
                  <div className="text-2xl mb-2">{p.icon}</div>
                  <div className="text-xs font-mono font-bold text-[#e2e8f0]">{p.platform}</div>
                  <div className="text-lg font-mono font-bold mt-1" style={{ color: p.color }}>{p.mentions.toLocaleString()}</div>
                  <div className="text-[9px] font-mono text-[#64748b]">total mentions</div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* Hype Risk Warning Panel */}
        <div className="flex flex-col gap-3" style={{ width: '280px' }}>
          <div className="rounded-xl p-4 border border-[rgba(239,68,68,0.4)] bg-[rgba(239,68,68,0.08)]" style={{ boxShadow: '0 0 20px rgba(239,68,68,0.1)' }}>
            <div className="text-[9px] font-mono text-[#ef4444] uppercase tracking-widest mb-3">⚠️ Hype Risk Alert</div>
            <div className="flex flex-col gap-2">
              {socialTrending.filter(i => i.hype === 'extreme' || i.hype === 'high').map((item) => (
                <div key={item.ticker} className="flex items-center justify-between p-2.5 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)]">
                  <div>
                    <div className="text-xs font-mono font-bold text-[#ef4444]">{item.ticker}</div>
                    <div className="text-[9px] font-mono text-[#94a3b8]">{item.mentions.toLocaleString()} mentions</div>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full uppercase" style={{
                    background: item.hype === 'extreme' ? 'rgba(239,68,68,0.25)' : 'rgba(249,115,22,0.25)',
                    color: item.hype === 'extreme' ? '#ef4444' : '#f97316',
                    border: `1px solid ${item.hype === 'extreme' ? 'rgba(239,68,68,0.5)' : 'rgba(249,115,22,0.5)'}`,
                  }}>
                    {item.hype}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[9px] font-mono text-[#94a3b8] mt-3 leading-relaxed">
              ⚡ Extreme hype = potential retail FOMO trap. Always verify with fundamentals before entry.
            </p>
          </div>

          <GlassPanel title="Sentiment Trend" glowColor="green">
            <div className="p-4">
              {socialTrending.map((item) => (
                <div key={item.ticker} className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-[#e2e8f0]">{item.ticker}</span>
                    <span className="text-[9px] font-mono text-[#64748b]">{item.bullish}% bullish</span>
                  </div>
                  <div className="h-3 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden flex">
                    <div className="h-full" style={{ width: `${item.bullish}%`, background: '#22c55e' }} />
                    <div className="h-full" style={{ width: `${item.bearish}%`, background: '#ef4444' }} />
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  )
}
