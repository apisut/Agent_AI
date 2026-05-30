import { agents, teamStats, marketIndices, opportunities, consoleLogs, portfolioPositions, departments } from '@/lib/mockData'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { AgentAvatar } from '@/components/ui/AgentAvatar'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { StatCard } from '@/components/ui/StatCard'
import { StatusBadge } from '@/components/ui/StatusBadge'

export default function DashboardPage() {
  const coreAgents = agents.slice(0, 8)

  return (
    <div className="min-h-screen p-4 flex gap-4">
      {/* LEFT COLUMN */}
      <div className="flex flex-col gap-3" style={{ width: '22%' }}>
        {/* Team Status */}
        <GlassPanel title="Team Status" glowColor="indigo">
          <div className="px-4 pb-4 flex flex-col gap-2 mt-3">
            {[
              { label: 'Online', count: teamStats.online, total: teamStats.total, color: '#22c55e' },
              { label: 'Working', count: teamStats.working, color: '#6366f1' },
              { label: 'Idle', count: teamStats.idle, color: '#f59e0b' },
              { label: 'On Break', count: teamStats.onBreak, color: '#f97316' },
              { label: 'Maintenance', count: teamStats.maintenance, color: '#ef4444' },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color, boxShadow: `0 0 6px ${s.color}` }} />
                  <span className="text-xs font-mono text-[#94a3b8]">{s.label}</span>
                </div>
                <span className="text-xs font-mono font-bold" style={{ color: s.color }}>
                  {s.count}{s.total ? `/${s.total}` : ''}
                </span>
              </div>
            ))}
            <div className="border-t border-[rgba(99,102,241,0.15)] pt-2 mt-1">
              <div className="flex justify-between mb-1">
                <span className="text-[10px] font-mono text-[#64748b]">Team Morale</span>
                <span className="text-[10px] font-mono text-[#22c55e] font-bold">😊 {teamStats.morale}%</span>
              </div>
              <ProgressBar value={teamStats.morale} color="#22c55e" height="h-1.5" />
              <p className="text-[9px] text-[#64748b] font-mono mt-1.5">Excellent — keep up the great work!</p>
            </div>
          </div>
        </GlassPanel>

        {/* Daily Activity mini chart */}
        <GlassPanel title="Daily Activity" glowColor="indigo">
          <div className="px-4 pb-4 mt-3">
            <div className="flex items-end gap-1 h-16">
              {[40, 65, 45, 80, 55, 90, 72, 88, 60, 95, 78, 85].map((v, i) => (
                <div key={i} className="flex-1 rounded-sm" style={{
                  height: `${v}%`,
                  background: `linear-gradient(to top, #6366f1, #8b5cf6)`,
                  opacity: i === 11 ? 1 : 0.5 + i * 0.04,
                }} />
              ))}
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[9px] font-mono text-[#64748b]">08:00</span>
              <span className="text-[9px] font-mono text-[#64748b]">Now</span>
            </div>
          </div>
        </GlassPanel>

        {/* Resource Usage */}
        <GlassPanel title="Resource Usage" glowColor="indigo">
          <div className="px-4 pb-4 mt-3 flex flex-col gap-3">
            {[
              { name: 'Data Feed', value: 78, color: '#6366f1' },
              { name: 'Compute Power', value: 62, color: '#8b5cf6' },
              { name: 'Storage', value: 41, color: '#06b6d4' },
              { name: 'API Calls', value: 55, color: '#ec4899' },
            ].map((r) => (
              <ProgressBar key={r.name} value={r.value} label={r.name} showValue color={r.color} height="h-1.5" />
            ))}
          </div>
        </GlassPanel>

        {/* Market Indices */}
        <GlassPanel title="Market Indices" glowColor="cyan">
          <div className="px-4 pb-4 mt-2 flex flex-col gap-1.5">
            {marketIndices.slice(0, 6).map((idx) => (
              <div key={idx.name} className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#94a3b8]">{idx.name}</span>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-[#e2e8f0] font-bold">{idx.value}</span>
                  <span className={`text-[9px] font-mono ml-1.5 ${idx.positive ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>{idx.pct}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>

      {/* CENTER COLUMN */}
      <div className="flex flex-col gap-3 flex-1">
        {/* Mission briefing banner */}
        <div className="rounded-xl px-5 py-3" style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))',
          border: '1px solid rgba(99,102,241,0.4)',
          boxShadow: '0 0 30px rgba(99,102,241,0.15)',
        }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-mono text-[#6366f1] uppercase tracking-widest">⚡ Mission Briefing</span>
            <span className="text-[9px] font-mono text-[#64748b]">• Updated 09:42</span>
          </div>
          <p className="text-xs font-mono text-[#c4b5fd] leading-relaxed">
            โฟกัสการหาหุ้นคุณภาพเติบโตสูง ควบคุมความเสี่ยง ไม่แข่งกับตลาด แต่ชนะในระยะยาว
          </p>
          <p className="text-[10px] font-mono text-[#64748b] mt-1">Focus on finding high-quality, high-growth stocks. Control risk. Don't compete with the market — but win in the long run.</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-5 gap-2">
          <StatCard label="Total Agents" value={teamStats.total} color="#6366f1" />
          <StatCard label="In Progress" value={teamStats.working * 3 + 3} color="#8b5cf6" />
          <StatCard label="Completed" value="156" sub="All time" color="#22c55e" trend="up" />
          <StatCard label="Productivity" value="87%" color="#f59e0b" />
          <StatCard label="Team Morale" value="85%" sub="Excellent" color="#22c55e" trend="up" />
        </div>

        {/* Agent Overview grid */}
        <GlassPanel title="Agent Overview" glowColor="indigo">
          <div className="px-4 pb-4 mt-2">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {coreAgents.map((agent) => (
                <div key={agent.id} className="flex-shrink-0 w-28 rounded-lg p-2.5 border border-[rgba(99,102,241,0.2)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(99,102,241,0.5)] transition-all duration-200 cursor-pointer">
                  <div className="flex justify-center mb-2">
                    <AgentAvatar name={agent.name} initial={agent.initial} glow={agent.glow} status={agent.status} size="md" showLevel level={agent.level} />
                  </div>
                  <div className="text-center">
                    <div className="text-[11px] font-mono font-bold text-[#e2e8f0]">{agent.name}</div>
                    <div className="text-[9px] font-mono text-[#64748b] truncate">{agent.role}</div>
                    <StatusBadge status={agent.status} small />
                  </div>
                  <div className="mt-2">
                    <ProgressBar value={agent.xp} max={agent.xpMax} color={agent.glow} height="h-0.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassPanel>

        {/* Department Structure */}
        <GlassPanel title="Department Structure" glowColor="violet">
          <div className="px-4 pb-4 mt-2">
            {/* CEO at top */}
            <div className="flex justify-center mb-3">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-900 to-yellow-600 flex items-center justify-center font-bold text-white text-sm border-2 border-[rgba(234,179,8,0.5)]" style={{ boxShadow: '0 0 12px rgba(234,179,8,0.4)' }}>J</div>
                <div className="text-[10px] font-mono text-[#eab308] mt-1">Janie CEO</div>
              </div>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {departments.map((dept) => (
                <div key={dept.name} className="text-center p-2 rounded-lg border border-[rgba(99,102,241,0.2)] bg-[rgba(255,255,255,0.02)]">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white mx-auto mb-1 border border-[rgba(99,102,241,0.3)]"
                    style={{ background: `linear-gradient(135deg, ${dept.headGlow}60, ${dept.headGlow}30)`, borderColor: `${dept.headGlow}50` }}>
                    {dept.headInitial}
                  </div>
                  <div className="text-[9px] font-mono text-[#64748b] leading-tight">{dept.name}</div>
                  <div className="text-[9px] font-mono text-[#6366f1]">{dept.count}</div>
                </div>
              ))}
            </div>
          </div>
        </GlassPanel>

        {/* Current Assignments table */}
        <GlassPanel title="Current Assignments" glowColor="indigo">
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-[rgba(99,102,241,0.15)]">
                  {['Task', 'Agent', 'Dept', 'Priority', 'Progress', 'Status'].map((h) => (
                    <th key={h} className="px-3 py-2 text-left text-[10px] text-[#64748b] uppercase tracking-wider font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {agents.slice(0, 7).map((agent) => (
                  <tr key={agent.id} className="border-b border-[rgba(99,102,241,0.05)] hover:bg-[rgba(99,102,241,0.05)] transition-colors">
                    <td className="px-3 py-2 text-[#e2e8f0] max-w-[160px] truncate">{agent.task}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        <AgentAvatar name={agent.name} initial={agent.initial} glow={agent.glow} status={agent.status} size="sm" />
                        <span className="text-[#94a3b8]">{agent.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-[#64748b]">{agent.department}</td>
                    <td className="px-3 py-2"><span className="text-[#f97316]">High</span></td>
                    <td className="px-3 py-2 w-24"><ProgressBar value={agent.taskProgress} color={agent.glow} height="h-1.5" /></td>
                    <td className="px-3 py-2"><StatusBadge status={agent.status} small /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassPanel>
      </div>

      {/* RIGHT COLUMN */}
      <div className="flex flex-col gap-3" style={{ width: '28%' }}>
        {/* CEO Office */}
        <GlassPanel glowColor="gold">
          <div className="p-4">
            <div className="text-[9px] font-mono text-[#eab308] uppercase tracking-widest mb-3">⬡ CEO Office</div>
            {/* Janie avatar */}
            <div className="flex flex-col items-center mb-4">
              <div className="w-20 h-20 rounded-full flex items-center justify-center font-mono font-bold text-3xl text-white border-4 border-[rgba(234,179,8,0.6)]"
                style={{ background: 'linear-gradient(135deg, #78350f, #b45309)', boxShadow: '0 0 30px rgba(234,179,8,0.4)' }}>J</div>
              <div className="mt-2 text-center">
                <div className="text-sm font-mono font-bold text-[#eab308]">Janie</div>
                <div className="text-[10px] font-mono text-[#64748b]">Commander / CEO</div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <div className="w-2 h-2 rounded-full bg-[#22c55e] status-dot-online" />
                  <span className="text-[10px] font-mono text-[#22c55e]">Online — Since 2024-01-01</span>
                </div>
              </div>
            </div>
            {/* Quote */}
            <div className="text-[10px] font-mono text-[#94a3b8] italic text-center border-t border-[rgba(234,179,8,0.15)] pt-3 mb-3">
              "เราไม่ได้แค่เล่นหุ้น — เราสร้างอนาคต"
            </div>
            {/* CEO Privileges grid */}
            <div className="grid grid-cols-4 gap-1.5">
              {['Strategy', 'Agents', 'Approval', 'Portfolio', 'Risk', 'System', 'Data', 'Reports'].map((priv) => (
                <div key={priv} className="rounded-lg p-1.5 text-center border border-[rgba(234,179,8,0.2)] bg-[rgba(234,179,8,0.05)] hover:bg-[rgba(234,179,8,0.1)] transition-colors cursor-pointer">
                  <div className="text-base mb-0.5">
                    {priv === 'Strategy' ? '⚡' : priv === 'Agents' ? '🤖' : priv === 'Approval' ? '✅' : priv === 'Portfolio' ? '📊' : priv === 'Risk' ? '🛡️' : priv === 'System' ? '⚙️' : priv === 'Data' ? '🗄️' : '📋'}
                  </div>
                  <div className="text-[8px] font-mono text-[#eab308]">{priv}</div>
                </div>
              ))}
            </div>
          </div>
        </GlassPanel>

        {/* Role & Position Overview */}
        <GlassPanel title="Role & Position Overview" glowColor="indigo">
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-[rgba(99,102,241,0.15)]">
                  <th className="px-3 py-2 text-left text-[9px] text-[#64748b] uppercase">Agent</th>
                  <th className="px-3 py-2 text-left text-[9px] text-[#64748b] uppercase">Role</th>
                  <th className="px-3 py-2 text-left text-[9px] text-[#64748b] uppercase">Lvl</th>
                </tr>
              </thead>
              <tbody>
                {agents.slice(0, 7).map((a) => (
                  <tr key={a.id} className="border-b border-[rgba(99,102,241,0.05)]">
                    <td className="px-3 py-1.5">
                      <div className="flex items-center gap-1.5">
                        <AgentAvatar name={a.name} initial={a.initial} glow={a.glow} status={a.status} size="sm" />
                        <span className="text-[#e2e8f0] text-[10px]">{a.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-1.5 text-[#94a3b8] text-[10px]">{a.role}</td>
                    <td className="px-3 py-1.5">
                      <span className="text-[10px] font-bold" style={{ color: a.glow }}>L{a.level}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassPanel>

        {/* Team Activity Feed */}
        <GlassPanel title="Team Activity Feed" glowColor="indigo">
          <div className="px-4 pb-4 mt-2 flex flex-col gap-2">
            {consoleLogs.map((log, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="text-[9px] font-mono text-[#64748b] flex-shrink-0 mt-0.5">{log.time}</span>
                <div>
                  <span className="text-[10px] font-mono font-bold" style={{ color: log.level === 'SUCCESS' ? '#22c55e' : log.level === 'WARN' ? '#f59e0b' : '#6366f1' }}>
                    {log.agent}
                  </span>
                  <span className="text-[10px] font-mono text-[#94a3b8] ml-1">{log.message}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </div>
  )
}
