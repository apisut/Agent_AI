import { agents } from '@/lib/mockData'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { AgentAvatar } from '@/components/ui/AgentAvatar'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { StatusBadge } from '@/components/ui/StatusBadge'

export default function PerformancePage() {
  const sorted = [...agents].sort((a, b) => b.accuracy - a.accuracy)

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-mono font-bold text-[#e2e8f0]">Performance Dashboard</h1>
        <select className="px-2 py-1.5 text-xs font-mono bg-[rgba(15,15,25,0.8)] border border-[rgba(99,102,241,0.3)] rounded-lg text-[#94a3b8] focus:outline-none">
          <option>This Week</option>
          <option>This Month</option>
          <option>All Time</option>
        </select>
      </div>

      {/* Top 3 podium */}
      <div className="flex items-end justify-center gap-4 py-4">
        {[sorted[1], sorted[0], sorted[2]].map((agent, i) => {
          const heights = ['h-24', 'h-32', 'h-20']
          const labels = ['2nd', '1st', '3rd']
          const medals = ['🥈', '🏆', '🥉']
          return (
            <div key={agent.id} className="flex flex-col items-center">
              <div className="text-xl mb-2">{medals[i]}</div>
              <AgentAvatar name={agent.name} initial={agent.initial} glow={agent.glow} status={agent.status} size={i === 1 ? 'xl' : 'lg'} showLevel level={agent.level} />
              <div className="text-xs font-mono font-bold text-[#e2e8f0] mt-2">{agent.name}</div>
              <div className="text-[10px] font-mono text-[#64748b]">{agent.accuracy}% acc</div>
              <div className={`${heights[i]} w-20 rounded-t-lg mt-2 flex items-center justify-center`}
                style={{ background: `linear-gradient(to top, ${agent.glow}40, ${agent.glow}20)`, border: `1px solid ${agent.glow}50` }}>
                <span className="text-xs font-mono font-bold" style={{ color: agent.glow }}>{labels[i]}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Leaderboard */}
      <GlassPanel title="Performance Leaderboard" glowColor="indigo">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-[rgba(99,102,241,0.15)]">
                {['Rank', 'Agent', 'Role', 'Accuracy', 'Win Rate', 'Tasks Done', 'Response', 'XP Level', 'Status'].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left text-[10px] text-[#64748b] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((agent, i) => (
                <tr key={agent.id} className="border-b border-[rgba(99,102,241,0.05)] hover:bg-[rgba(99,102,241,0.05)] transition-colors">
                  <td className="px-3 py-2">
                    <span className="text-base">{i === 0 ? '🏆' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <AgentAvatar name={agent.name} initial={agent.initial} glow={agent.glow} status={agent.status} size="sm" />
                      <span className="text-[#e2e8f0] font-bold">{agent.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-[#94a3b8]">{agent.role}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <ProgressBar value={agent.accuracy} color={agent.glow} height="h-1.5" />
                      <span className="text-[#22c55e] font-bold w-10">{agent.accuracy}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-[#8b5cf6] font-bold">{agent.winRate}%</td>
                  <td className="px-3 py-2 text-[#94a3b8]">{agent.tasksCompleted.toLocaleString()}</td>
                  <td className="px-3 py-2 text-[#f59e0b]">{agent.responseTime}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold" style={{ color: agent.glow }}>L{agent.level}</span>
                      <ProgressBar value={agent.xp} max={agent.xpMax} color={agent.glow} height="h-1" />
                    </div>
                  </td>
                  <td className="px-3 py-2"><StatusBadge status={agent.status} small /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassPanel>
    </div>
  )
}
