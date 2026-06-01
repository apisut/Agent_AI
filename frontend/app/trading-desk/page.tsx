'use client'
import { useState } from 'react'
import { tradePlans } from '@/lib/mockData'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { ProgressBar } from '@/components/ui/ProgressBar'

export default function TradingDeskPage() {
  const [selectedPlan, setSelectedPlan] = useState(tradePlans[0])
  const [riskAmount, setRiskAmount] = useState(5000)
  const [entry, setEntry] = useState(selectedPlan.entryZone.high)
  const [stop, setStop] = useState(selectedPlan.stopLoss)
  const [target, setTarget] = useState(selectedPlan.tp1)

  const riskPerShare = Math.abs(entry - stop)
  const rewardPerShare = Math.abs(target - entry)
  const rr = riskPerShare > 0 ? (rewardPerShare / riskPerShare).toFixed(2) : '0'
  const shares = riskPerShare > 0 ? Math.floor(riskAmount / riskPerShare) : 0
  const positionValue = shares * entry

  return (
    <div className="p-4 flex gap-4">
      {/* Trade Plans column */}
      <div className="flex flex-col gap-3" style={{ width: '280px' }}>
        <h2 className="text-sm font-mono font-bold text-[#e2e8f0] uppercase tracking-widest">Active Trade Plans</h2>
        {tradePlans.map((plan) => {
          const isSelected = selectedPlan.ticker === plan.ticker
          return (
            <div key={plan.ticker} onClick={() => { setSelectedPlan(plan); setEntry(plan.entryZone.high); setStop(plan.stopLoss); setTarget(plan.tp1); }}
              className="rounded-xl p-4 cursor-pointer transition-all hover:transform hover:-translate-y-0.5"
              style={{
                background: 'rgba(15,15,25,0.8)',
                border: `1px solid ${isSelected ? 'rgba(99,102,241,0.6)' : 'rgba(99,102,241,0.2)'}`,
                boxShadow: isSelected ? '0 0 20px rgba(99,102,241,0.2)' : 'none',
              }}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-base font-mono font-bold text-[#6366f1]">{plan.ticker}</div>
                  <div className="text-[10px] font-mono text-[#64748b]">{plan.setup}</div>
                </div>
                <span className="px-2 py-0.5 text-[9px] font-mono rounded-full border border-[rgba(245,158,11,0.4)] bg-[rgba(245,158,11,0.1)] text-[#f59e0b]">
                  {plan.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div className="text-center p-1.5 rounded bg-[rgba(255,255,255,0.03)]">
                  <div className="text-[8px] font-mono text-[#64748b]">Entry</div>
                  <div className="text-[10px] font-mono text-[#6366f1] font-bold">{plan.entryZone.low}–{plan.entryZone.high}</div>
                </div>
                <div className="text-center p-1.5 rounded bg-[rgba(255,255,255,0.03)]">
                  <div className="text-[8px] font-mono text-[#64748b]">Stop</div>
                  <div className="text-[10px] font-mono text-[#ef4444] font-bold">{plan.stopLoss}</div>
                </div>
                <div className="text-center p-1.5 rounded bg-[rgba(255,255,255,0.03)]">
                  <div className="text-[8px] font-mono text-[#64748b]">R/R</div>
                  <div className="text-[10px] font-mono text-[#22c55e] font-bold">{plan.riskReward}</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-mono text-[#64748b]">Confidence:</span>
                  <ProgressBar value={plan.confidence} color="#6366f1" height="h-1" />
                  <span className="text-[9px] font-mono text-[#6366f1]">{plan.confidence}%</span>
                </div>
              </div>
              <p className="text-[9px] font-mono text-[#64748b] mt-2 truncate">{plan.catalyst}</p>
            </div>
          )
        })}
      </div>

      {/* Detail View */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-mono font-bold text-[#6366f1]">{selectedPlan.ticker}</h1>
            <div className="text-sm font-mono text-[#94a3b8]">{selectedPlan.name} · {selectedPlan.setup}</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-mono rounded-full bg-[rgba(245,158,11,0.15)] text-[#f59e0b] border border-[rgba(245,158,11,0.3)]">
              {selectedPlan.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Risk/Reward', value: selectedPlan.riskReward, color: '#22c55e' },
            { label: 'Position Size', value: String(selectedPlan.positionSize), color: '#6366f1' },
            { label: 'Risk Amount', value: `$${selectedPlan.riskAmount.toLocaleString()}`, color: '#ef4444' },
            { label: 'Max Loss', value: selectedPlan.maxLoss, color: '#f97316' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-3 border border-[rgba(99,102,241,0.2)] bg-[rgba(15,15,25,0.8)] text-center">
              <div className="text-[9px] font-mono text-[#64748b] uppercase tracking-widest mb-1">{s.label}</div>
              <div className="text-sm font-mono font-bold" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Price levels */}
        <GlassPanel title="Price Levels" glowColor="indigo">
          <div className="p-4 grid grid-cols-3 gap-3">
            {[
              { label: 'Entry Zone', value: `${selectedPlan.entryZone.low}–${selectedPlan.entryZone.high}`, color: '#6366f1', icon: '📥' },
              { label: 'Add Zone', value: `${selectedPlan.addZone.low}–${selectedPlan.addZone.high}`, color: '#8b5cf6', icon: '➕' },
              { label: 'Stop Loss', value: String(selectedPlan.stopLoss), color: '#ef4444', icon: '🛑' },
              { label: 'Target 1', value: String(selectedPlan.tp1), color: '#22c55e', icon: '🎯' },
              { label: 'Target 2', value: String(selectedPlan.tp2), color: '#22c55e', icon: '🎯' },
              { label: 'Target 3', value: String(selectedPlan.tp3), color: '#eab308', icon: '⭐' },
            ].map((l) => (
              <div key={l.label} className="p-3 rounded-xl border border-[rgba(99,102,241,0.15)] bg-[rgba(255,255,255,0.02)] text-center">
                <div className="text-lg mb-1">{l.icon}</div>
                <div className="text-[9px] font-mono text-[#64748b] mb-1">{l.label}</div>
                <div className="text-sm font-mono font-bold" style={{ color: l.color }}>${l.value}</div>
              </div>
            ))}
          </div>
        </GlassPanel>

        <div className="flex gap-4">
          {/* Risk/Reward Calculator */}
          <GlassPanel title="R/R Calculator" glowColor="indigo" className="flex-1">
            <div className="p-4 flex flex-col gap-3">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Entry', value: entry, setter: setEntry, color: '#6366f1' },
                  { label: 'Stop', value: stop, setter: setStop, color: '#ef4444' },
                  { label: 'Target', value: target, setter: setTarget, color: '#22c55e' },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="text-[9px] font-mono text-[#64748b] uppercase tracking-widest block mb-1">{f.label}</label>
                    <input type="number" step="0.01" value={f.value}
                      onChange={e => f.setter(parseFloat(e.target.value))}
                      className="w-full px-2 py-1.5 text-xs font-mono bg-[rgba(255,255,255,0.05)] border rounded text-[#e2e8f0] focus:outline-none"
                      style={{ borderColor: `${f.color}50` }} />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-[9px] font-mono text-[#64748b] uppercase tracking-widest block mb-1">Risk Amount ($)</label>
                <input type="number" value={riskAmount} onChange={e => setRiskAmount(parseInt(e.target.value))}
                  className="w-full px-2 py-1.5 text-xs font-mono bg-[rgba(255,255,255,0.05)] border border-[rgba(99,102,241,0.3)] rounded text-[#e2e8f0] focus:outline-none" />
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[rgba(99,102,241,0.15)]">
                <div className="text-center">
                  <div className="text-[9px] font-mono text-[#64748b]">R/R Ratio</div>
                  <div className="text-sm font-mono font-bold text-[#22c55e]">{rr}:1</div>
                </div>
                <div className="text-center">
                  <div className="text-[9px] font-mono text-[#64748b]">Shares</div>
                  <div className="text-sm font-mono font-bold text-[#6366f1]">{shares}</div>
                </div>
                <div className="text-center">
                  <div className="text-[9px] font-mono text-[#64748b]">Pos Value</div>
                  <div className="text-sm font-mono font-bold text-[#e2e8f0]">${positionValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
                </div>
              </div>
            </div>
          </GlassPanel>

          {/* Execution Checklist */}
          <GlassPanel title="Execution Checklist" glowColor="green" className="flex-1">
            <div className="p-4 flex flex-col gap-2.5">
              {[
                { item: 'Fundamental analysis confirmed', done: true },
                { item: 'Technical setup validated', done: true },
                { item: 'Catalyst timing aligned', done: true },
                { item: 'Risk/reward > 3:1', done: parseFloat(rr) >= 3 },
                { item: 'Position size approved by Doc', done: false },
                { item: 'Market conditions favorable', done: true },
                { item: 'Entry order placed', done: false },
                { item: 'Stop loss order confirmed', done: false },
              ].map((check, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 text-[10px] ${check.done ? 'bg-[#22c55e]' : 'border border-[rgba(99,102,241,0.4)]'}`}>
                    {check.done ? '✓' : ''}
                  </div>
                  <span className={`text-xs font-mono ${check.done ? 'text-[#94a3b8] line-through' : 'text-[#e2e8f0]'}`}>{check.item}</span>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  )
}
