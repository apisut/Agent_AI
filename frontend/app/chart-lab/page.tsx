'use client'
import { useState, useMemo } from 'react'
import { GlassPanel } from '@/components/ui/GlassPanel'

const tickers = ['HIMS', 'RXRX', 'NVDA', 'PLTR', 'BTCX', 'CRDO', 'IONQ', 'AMD']

function generateCandles(n = 35) {
  let price = 100 + Math.random() * 50
  return Array.from({ length: n }, (_, i) => {
    const open = price
    const move = (Math.random() - 0.48) * 8
    const close = Math.max(5, open + move)
    const high = Math.max(open, close) + Math.random() * 4
    const low = Math.min(open, close) - Math.random() * 4
    price = close
    return { open, close, high, low, volume: 1000000 + Math.random() * 9000000, index: i }
  })
}

export default function ChartLabPage() {
  const [selected, setSelected] = useState('HIMS')
  const [timeframe, setTimeframe] = useState('1D')
  const candles = useMemo(() => generateCandles(35), [selected, timeframe])

  const minLow = Math.min(...candles.map(c => c.low))
  const maxHigh = Math.max(...candles.map(c => c.high))
  const range = maxHigh - minLow
  const chartH = 200

  function toY(price: number) {
    return chartH - ((price - minLow) / range) * chartH
  }

  const lastCandle = candles[candles.length - 1]
  const firstCandle = candles[0]
  const isUp = lastCandle.close >= firstCandle.open

  return (
    <div className="p-4 flex gap-4">
      {/* Main chart area */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <select value={selected} onChange={e => setSelected(e.target.value)}
              className="px-3 py-2 text-sm font-mono font-bold bg-[rgba(15,15,25,0.9)] border border-[rgba(99,102,241,0.4)] rounded-lg text-[#6366f1] focus:outline-none">
              {tickers.map(t => <option key={t}>{t}</option>)}
            </select>
            <h1 className="text-lg font-mono font-bold text-[#e2e8f0]">Chart Lab</h1>
            <span className={`text-sm font-mono font-bold ${isUp ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
              ${lastCandle.close.toFixed(2)} {isUp ? '▲' : '▼'} {((lastCandle.close - firstCandle.open) / firstCandle.open * 100).toFixed(2)}%
            </span>
          </div>
          <div className="flex items-center gap-1">
            {['1m', '5m', '15m', '1H', '4H', '1D', '1W'].map(tf => (
              <button key={tf} onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1.5 text-xs font-mono rounded transition-all ${timeframe === tf ? 'bg-[rgba(99,102,241,0.25)] text-[#6366f1] border border-[rgba(99,102,241,0.4)]' : 'text-[#64748b] hover:text-[#e2e8f0]'}`}>
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Candlestick Chart */}
        <GlassPanel glowColor="indigo">
          <div className="p-4">
            <svg width="100%" height={chartH + 30} viewBox={`0 0 700 ${chartH + 30}`} preserveAspectRatio="none">
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map(frac => {
                const y = frac * chartH
                const price = maxHigh - frac * range
                return (
                  <g key={frac}>
                    <line x1={0} y1={y} x2={700} y2={y} stroke="rgba(99,102,241,0.1)" strokeDasharray="4,4" />
                    <text x={700} y={y - 2} textAnchor="end" fontSize={9} fill="#64748b" fontFamily="monospace">${price.toFixed(1)}</text>
                  </g>
                )
              })}
              {/* Candles */}
              {candles.map((c, i) => {
                const x = (i / candles.length) * 680 + 5
                const w = Math.max(8, 680 / candles.length - 2)
                const up = c.close >= c.open
                const color = up ? '#22c55e' : '#ef4444'
                const bodyTop = toY(Math.max(c.open, c.close))
                const bodyBot = toY(Math.min(c.open, c.close))
                const bodyH = Math.max(1, bodyBot - bodyTop)
                return (
                  <g key={i}>
                    <line x1={x + w / 2} y1={toY(c.high)} x2={x + w / 2} y2={toY(c.low)} stroke={color} strokeWidth={1} />
                    <rect x={x} y={bodyTop} width={w} height={bodyH} fill={color} fillOpacity={up ? 0.9 : 0.8} rx={1} />
                  </g>
                )
              })}
            </svg>

            {/* Volume bars */}
            <div className="flex items-end gap-0.5 h-10 mt-1">
              {candles.map((c, i) => {
                const maxVol = Math.max(...candles.map(c => c.volume))
                const pct = (c.volume / maxVol) * 100
                const up = c.close >= c.open
                return (
                  <div key={i} className="flex-1 rounded-sm opacity-60"
                    style={{ height: `${pct}%`, background: up ? '#22c55e' : '#ef4444' }} />
                )
              })}
            </div>
            <div className="text-[9px] font-mono text-[#64748b] mt-0.5">Volume</div>
          </div>
        </GlassPanel>

        {/* Technical Indicators */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { name: 'RSI (14)', value: '64.2', signal: 'Neutral', color: '#f59e0b' },
            { name: 'MACD', value: '+2.14', signal: 'Bullish', color: '#22c55e' },
            { name: 'BB Width', value: '0.082', signal: 'Contracting', color: '#06b6d4' },
            { name: 'ATR (14)', value: '1.82', signal: 'Moderate', color: '#8b5cf6' },
          ].map((ind) => (
            <GlassPanel key={ind.name} glowColor="indigo">
              <div className="p-3">
                <div className="text-[9px] font-mono text-[#64748b] uppercase tracking-widest mb-1">{ind.name}</div>
                <div className="text-lg font-mono font-bold" style={{ color: ind.color }}>{ind.value}</div>
                <div className="text-[10px] font-mono mt-0.5" style={{ color: ind.color }}>{ind.signal}</div>
              </div>
            </GlassPanel>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-col gap-3" style={{ width: '240px' }}>
        {/* Entry/Stop/Target zones */}
        {[
          { label: 'Entry Zone', low: 32.20, high: 33.50, color: '#6366f1', icon: '📥' },
          { label: 'Stop Loss', low: 28.00, high: 28.50, color: '#ef4444', icon: '🛑' },
          { label: 'Target 1', low: 40.00, high: 42.00, color: '#22c55e', icon: '🎯' },
          { label: 'Target 2', low: 48.00, high: 52.00, color: '#eab308', icon: '⭐' },
        ].map((zone) => (
          <GlassPanel key={zone.label} glowColor="indigo">
            <div className="p-3">
              <div className="text-[9px] font-mono text-[#64748b] uppercase tracking-widest mb-1.5">{zone.icon} {zone.label}</div>
              <div className="font-mono font-bold" style={{ color: zone.color }}>${zone.low.toFixed(2)} – ${zone.high.toFixed(2)}</div>
            </div>
          </GlassPanel>
        ))}

        {/* Technical Score */}
        <GlassPanel title="Technical Score" glowColor="violet">
          <div className="p-3">
            <div className="flex items-center justify-center my-3">
              <div className="relative w-24 h-24">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(99,102,241,0.2)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#6366f1" strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 40 * 0.82} ${2 * Math.PI * 40}`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-xl font-mono font-bold text-[#6366f1]">82</div>
                  <div className="text-[8px] font-mono text-[#64748b]">/100</div>
                </div>
              </div>
            </div>
            <div className="text-center text-xs font-mono text-[#22c55e] font-bold mb-2">Strong Buy</div>
            {[
              { name: 'Trend', score: 85 },
              { name: 'Momentum', score: 78 },
              { name: 'Volume', score: 82 },
              { name: 'Pattern', score: 88 },
            ].map((s) => (
              <div key={s.name} className="flex items-center gap-2 mb-1.5">
                <span className="text-[9px] font-mono text-[#64748b] w-16">{s.name}</span>
                <div className="flex-1 h-1.5 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${s.score}%`, background: '#6366f1' }} />
                </div>
                <span className="text-[9px] font-mono text-[#6366f1] w-6 text-right">{s.score}</span>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </div>
  )
}
