'use client'
import { useState } from 'react'
import { opportunities } from '@/lib/mockData'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { ProgressBar } from '@/components/ui/ProgressBar'

const fundamentals: Record<string, object> = {
  HIMS: {
    ticker: 'HIMS', name: 'Hims & Hers Health', sector: 'Healthcare/DTC', marketCap: '$7.2B', price: 34.82,
    revenue: '$1.48B', revenueGrowth: '+52.3%', grossMargin: '79.2%', operatingMargin: '-4.1%', netMargin: '-3.8%',
    pe: 'N/A', ps: 4.9, pb: 8.2, evEbitda: 'N/A', debtEquity: 0.12,
    fcf: '-$42M', cash: '$245M', subscribers: '2.0M+', yoyGrowth: '89%',
    moat: 85, growth: 92, quality: 78, value: 55, momentum: 88,
    thesis: 'HIMS is the leading DTC telehealth platform capitalizing on the obesity drug revolution. Their compounded GLP-1 offering reaches all 50 states and drives explosive subscriber growth. Low competitive moat risk in short term, FDA approval of compounded semaglutide remains key risk.',
    risks: ['FDA crackdown on compounded GLP-1', 'Competition from Novo Nordisk direct', 'Profitability timeline uncertain'],
  },
  RXRX: {
    ticker: 'RXRX', name: 'Recursion Pharmaceuticals', sector: 'Biotech/AI', marketCap: '$2.1B', price: 8.45,
    revenue: '$58M', revenueGrowth: '+18.2%', grossMargin: '52.1%', operatingMargin: '-180%', netMargin: '-185%',
    pe: 'N/A', ps: 36.2, pb: 2.8, evEbitda: 'N/A', debtEquity: 0.08,
    fcf: '-$185M', cash: '$420M', subscribers: 'N/A', yoyGrowth: 'N/A',
    moat: 72, growth: 68, quality: 65, value: 40, momentum: 81,
    thesis: 'RXRX uses AI to discover drugs at 10x speed of traditional pharma. NVIDIA partnership validates platform. First AI-discovered compound entering Phase 2 is major de-risking catalyst. High burn rate but 2yr+ runway.',
    risks: ['Phase 2 trial failure', 'High cash burn', 'AI drug discovery unproven at scale'],
  },
}

export default function FundamentalsPage() {
  const [selected, setSelected] = useState('HIMS')
  const [search, setSearch] = useState('')
  const data = fundamentals[selected] as Record<string, unknown>

  return (
    <div className="p-4 flex gap-4">
      {/* Left nav */}
      <div className="flex flex-col gap-2" style={{ width: '180px' }}>
        <GlassPanel glowColor="indigo">
          <div className="p-3">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search ticker..."
              className="w-full px-2 py-1.5 text-xs font-mono bg-[rgba(255,255,255,0.05)] border border-[rgba(99,102,241,0.3)] rounded text-[#e2e8f0] placeholder-[#64748b] focus:outline-none mb-2" />
            <div className="flex flex-col gap-1">
              {Object.keys(fundamentals).map(ticker => (
                <button key={ticker} onClick={() => setSelected(ticker)}
                  className={`px-3 py-2 text-xs font-mono rounded-lg text-left transition-all ${selected === ticker ? 'bg-[rgba(99,102,241,0.2)] text-[#6366f1] border border-[rgba(99,102,241,0.4)]' : 'text-[#64748b] hover:text-[#e2e8f0] hover:bg-[rgba(255,255,255,0.04)]'}`}>
                  <div className="font-bold">{ticker}</div>
                  <div className="text-[9px] mt-0.5 opacity-70">{(fundamentals[ticker] as Record<string,string>).name}</div>
                </button>
              ))}
              {opportunities.filter(o => !fundamentals[o.ticker]).map(opp => (
                <button key={opp.ticker}
                  className="px-3 py-2 text-xs font-mono rounded-lg text-left text-[#64748b] hover:text-[#e2e8f0] hover:bg-[rgba(255,255,255,0.04)] transition-all">
                  <div className="font-bold">{opp.ticker}</div>
                  <div className="text-[9px] mt-0.5 opacity-70">{opp.name}</div>
                </button>
              ))}
            </div>
          </div>
        </GlassPanel>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col gap-4">
        {data && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-mono font-bold text-[#6366f1]">{data.ticker as string}</h1>
                <div className="text-sm font-mono text-[#94a3b8]">{data.name as string} · {data.sector as string}</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-mono font-bold text-[#e2e8f0]">${(data.price as number).toFixed(2)}</div>
                <div className="text-xs font-mono text-[#22c55e]">Market Cap: {data.marketCap as string}</div>
              </div>
            </div>

            {/* Metrics grid */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Revenue', value: data.revenue as string, sub: data.revenueGrowth as string, color: '#22c55e' },
                { label: 'Gross Margin', value: data.grossMargin as string, color: '#6366f1' },
                { label: 'Operating Margin', value: data.operatingMargin as string, color: (data.operatingMargin as string).startsWith('-') ? '#ef4444' : '#22c55e' },
                { label: 'Net Margin', value: data.netMargin as string, color: (data.netMargin as string).startsWith('-') ? '#ef4444' : '#22c55e' },
                { label: 'P/S Ratio', value: String(data.ps), color: '#8b5cf6' },
                { label: 'P/B Ratio', value: String(data.pb), color: '#06b6d4' },
                { label: 'Cash', value: data.cash as string, color: '#22c55e' },
                { label: 'FCF', value: data.fcf as string, color: (data.fcf as string).startsWith('-') ? '#ef4444' : '#22c55e' },
              ].map((m) => (
                <div key={m.label} className="rounded-xl p-3 border border-[rgba(99,102,241,0.2)] bg-[rgba(15,15,25,0.8)]">
                  <div className="text-[9px] font-mono text-[#64748b] uppercase tracking-widest mb-1">{m.label}</div>
                  <div className="text-sm font-mono font-bold" style={{ color: m.color }}>{m.value}</div>
                  {m.sub && <div className="text-[9px] font-mono text-[#22c55e] mt-0.5">{m.sub} YoY</div>}
                </div>
              ))}
            </div>

            {/* Valuation Score */}
            <GlassPanel title="Valuation Score" glowColor="violet">
              <div className="p-4 grid grid-cols-5 gap-4">
                {[
                  { label: 'Moat', value: data.moat as number, color: '#8b5cf6' },
                  { label: 'Growth', value: data.growth as number, color: '#22c55e' },
                  { label: 'Quality', value: data.quality as number, color: '#6366f1' },
                  { label: 'Value', value: data.value as number, color: '#f59e0b' },
                  { label: 'Momentum', value: data.momentum as number, color: '#06b6d4' },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-2">
                      <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                        <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(99,102,241,0.2)" strokeWidth="6" />
                        <circle cx="40" cy="40" r="32" fill="none" stroke={s.color} strokeWidth="6"
                          strokeDasharray={`${2 * Math.PI * 32 * s.value / 100} ${2 * Math.PI * 32}`}
                          strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-mono font-bold" style={{ color: s.color }}>{s.value}</span>
                      </div>
                    </div>
                    <div className="text-[10px] font-mono text-[#64748b]">{s.label}</div>
                  </div>
                ))}
              </div>
            </GlassPanel>

            {/* Investment Thesis */}
            <GlassPanel title="Investment Thesis" glowColor="indigo">
              <div className="p-4">
                <p className="text-sm font-mono text-[#94a3b8] leading-relaxed mb-4">{data.thesis as string}</p>
                <div className="text-[10px] font-mono text-[#64748b] uppercase tracking-widest mb-2">Key Risks</div>
                <div className="flex flex-col gap-1.5">
                  {(data.risks as string[]).map((risk, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-[#ef4444] flex-shrink-0" />
                      <span className="text-xs font-mono text-[#94a3b8]">{risk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassPanel>
          </>
        )}
      </div>
    </div>
  )
}
