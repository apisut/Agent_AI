'use client'
import { useState } from 'react'
import { agents, departments, teamStats, consoleLogs } from '@/lib/mockData'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { AgentAvatar } from '@/components/ui/AgentAvatar'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { StatusBadge } from '@/components/ui/StatusBadge'

const filterTabs = ['All', 'Online', 'Working', 'Idle', 'Offline']

export default function AgentsPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedAgent, setSelectedAgent] = useState(agents[0])

  const filtered = agents.filter((a) => {
    if (activeFilter === 'All') return true
    return a.status.toLowerCase() === activeFilter.toLowerCase()
  })

  return (
    <div className="flex h-full min-h-screen">
      {/* Main Content */}
      <div className="flex-1 p-4 flex flex-col gap-4 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-mono font-bold text-[#e2e8f0]">AGENTS OVERVIEW</h1>
            <span className="px-2.5 py-0.5 text-xs font-mono rounded-full bg-[rgba(99,102,241,0.2)] text-[#6366f1] border border-[rgba(99,102,241,0.3)]">
              {agents.length} Agents ↑1
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-[rgba(99,102,241,0.3)] overflow-hidden">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-3 py-1.5 text-xs font-mono transition-all duration-150 ${
                    activeFilter === tab
                      ? 'bg-[rgba(99,102,241,0.25)] text-[#6366f1]'
                      : 'text-[#64748b] hover:text-[#e2e8f0] hover:bg-[rgba(255,255,255,0.05)]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <select className="px-2 py-1.5 text-xs font-mono bg-[rgba(15,15,25,0.8)] border border-[rgba(99,102,241,0.3)] rounded-lg text-[#94a3b8] focus:outline-none focus:border-[rgba(99,102,241,0.6)]">
              <option>Sort by Role</option>
              <option>Sort by Level</option>
              <option>Sort by Status</option>
              <option>Sort by Department</option>
            </select>
          </div>
        </div>

        {/* Agent Cards horizontal scroll */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {filtered.map((agent) => {
            const isSelected = selectedAgent.id === agent.id
            return (
              <div
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className="flex-shrink-0 w-36 rounded-xl p-3 cursor-pointer transition-all duration-200 hover:transform hover:-translate-y-1 agent-card"
                style={{
                  background: 'rgba(15,15,25,0.8)',
                  border: `1px solid ${isSelected ? agent.glow : 'rgba(99,102,241,0.2)'}`,
                  boxShadow: isSelected ? `0 0 20px ${agent.glow}40` : 'none',
                }}
              >
                <div className="flex justify-center mb-2">
                  <div className="agent-avatar-ring">
                    <AgentAvatar name={agent.name} initial={agent.initial} glow={agent.glow} status={agent.status} size="lg" showLevel level={agent.level} />
                  </div>
                </div>
                <div className="text-center mb-2">
                  <div className="text-xs font-mono font-bold text-[#e2e8f0]">{agent.name}</div>
                  <div className="text-[9px] font-mono text-[#64748b] mb-1.5">Lv. {agent.level}</div>
                  <span className="px-2 py-0.5 text-[9px] font-mono rounded-full border" style={{ color: agent.glow, borderColor: `${agent.glow}50`, background: `${agent.glow}15` }}>
                    {agent.role}
                  </span>
                </div>
                <p className="text-[9px] font-mono text-[#64748b] text-center line-clamp-2 mb-2">{agent.task}</p>
                <ProgressBar value={agent.taskProgress} color={agent.glow} height="h-1" />
                <div className="flex justify-center mt-2">
                  <StatusBadge status={agent.status} small />
                </div>
              </div>
            )
          })}
        </div>

        {/* Department Structure */}
        <GlassPanel title="Department Structure" glowColor="violet">
          <div className="px-4 pb-4 mt-3">
            {/* CEO */}
            <div className="flex justify-center mb-4">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl text-white border-2 border-[rgba(234,179,8,0.6)]"
                  style={{ background: 'linear-gradient(135deg, #78350f, #b45309)', boxShadow: '0 0 20px rgba(234,179,8,0.5)' }}>J</div>
                <div className="text-[10px] font-mono text-[#eab308] mt-1.5 font-bold">Janie — CEO</div>
                <div className="w-px h-4 bg-[rgba(99,102,241,0.3)] mt-1" />
              </div>
            </div>
            {/* Departments grid */}
            <div className="grid grid-cols-6 gap-2">
              {departments.map((dept) => (
                <div key={dept.name} className="flex flex-col items-center p-3 rounded-xl border border-[rgba(99,102,241,0.2)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(99,102,241,0.4)] transition-all">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white mb-2"
                    style={{ background: `linear-gradient(135deg, ${dept.headGlow}80, ${dept.headGlow}40)`, border: `2px solid ${dept.headGlow}50`, boxShadow: `0 0 10px ${dept.headGlow}30` }}>
                    {dept.headInitial}
                  </div>
                  <div className="text-[10px] font-mono font-bold text-[#e2e8f0] text-center">{dept.head}</div>
                  <div className="text-[9px] font-mono text-[#64748b] text-center leading-tight mt-0.5">{dept.name}</div>
                  <div className="text-[9px] font-mono mt-1" style={{ color: dept.headGlow }}>{dept.count} agents</div>
                </div>
              ))}
            </div>
          </div>
        </GlassPanel>

        {/* Stats bar */}
        <div className="grid grid-cols-6 gap-2">
          {[
            { label: 'Departments', value: '9' },
            { label: 'Total Agents', value: String(teamStats.total) },
            { label: 'Active Tasks', value: '27' },
            { label: 'Completed', value: '156' },
            { label: 'Avg Response', value: '2.4m' },
            { label: 'Uptime', value: '99.8%' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-3 text-center border border-[rgba(99,102,241,0.2)] bg-[rgba(15,15,25,0.6)]">
              <div className="text-base font-mono font-bold text-[#6366f1]">{s.value}</div>
              <div className="text-[9px] font-mono text-[#64748b] mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Assignments Table */}
        <GlassPanel title="Current Assignments" glowColor="indigo">
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-[rgba(99,102,241,0.15)]">
                  {['Task', 'Assigned To', 'Department', 'Priority', 'Progress', 'Deadline', 'Status'].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left text-[10px] text-[#64748b] uppercase tracking-wider font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {agents.slice(0, 9).map((agent, idx) => {
                  const priorities = ['Critical', 'High', 'High', 'Medium', 'High', 'Medium', 'Critical', 'Medium', 'Low']
                  const pColor = priorities[idx] === 'Critical' ? '#ef4444' : priorities[idx] === 'High' ? '#f97316' : priorities[idx] === 'Medium' ? '#f59e0b' : '#64748b'
                  const deadlines = ['06-01', '06-02', '06-02', '06-03', '06-04', '06-05', '06-01', '06-06', '06-10']
                  return (
                    <tr key={agent.id} className="border-b border-[rgba(99,102,241,0.05)] hover:bg-[rgba(99,102,241,0.05)] transition-colors">
                      <td className="px-3 py-2 text-[#e2e8f0] max-w-[180px] truncate">{agent.task}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1.5">
                          <AgentAvatar name={agent.name} initial={agent.initial} glow={agent.glow} status={agent.status} size="sm" />
                          <span className="text-[#94a3b8]">{agent.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-[#64748b]">{agent.department}</td>
                      <td className="px-3 py-2"><span className="font-bold text-[11px]" style={{ color: pColor }}>{priorities[idx]}</span></td>
                      <td className="px-3 py-2 w-28">
                        <div className="flex items-center gap-2">
                          <ProgressBar value={agent.taskProgress} color={agent.glow} height="h-1.5" />
                          <span className="text-[9px] text-[#64748b]">{agent.taskProgress}%</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-[#64748b]">2025-{deadlines[idx]}</td>
                      <td className="px-3 py-2"><StatusBadge status={agent.status} small /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </GlassPanel>

        {/* Performance Snapshot */}
        <div className="grid grid-cols-2 gap-4">
          <GlassPanel title="Performance Snapshot" glowColor="violet">
            <div className="p-4 flex flex-col items-center">
              {/* CSS polygon radar chart */}
              <svg width="200" height="200" viewBox="0 0 200 200">
                <polygon points="100,10 180,60 160,160 40,160 20,60" fill="rgba(99,102,241,0.1)" stroke="rgba(99,102,241,0.3)" strokeWidth="1" />
                <polygon points="100,35 155,72 140,138 60,138 45,72" fill="rgba(139,92,246,0.15)" stroke="rgba(139,92,246,0.4)" strokeWidth="1" />
                <polygon
                  points="100,28 148,72 135,142 65,142 52,72"
                  fill="rgba(99,102,241,0.25)"
                  stroke="#6366f1"
                  strokeWidth="1.5"
                />
                {['Accuracy', 'Speed', 'Quality', 'Tasks', 'Morale'].map((label, i) => {
                  const angles = [-90, -18, 54, 126, 198]
                  const r = 105
                  const x = 100 + r * Math.cos((angles[i] * Math.PI) / 180)
                  const y = 100 + r * Math.sin((angles[i] * Math.PI) / 180)
                  return <text key={label} x={x} y={y} textAnchor="middle" fontSize="9" fill="#64748b" fontFamily="monospace">{label}</text>
                })}
              </svg>
              <div className="grid grid-cols-2 gap-2 w-full mt-2">
                {[{ label: 'Avg Accuracy', value: '91.2%', color: '#6366f1' }, { label: 'Avg Speed', value: '1.1s', color: '#8b5cf6' }, { label: 'Win Rate', value: '76.4%', color: '#22c55e' }, { label: 'Tasks/Day', value: '18.3', color: '#f59e0b' }].map((m) => (
                  <div key={m.label} className="text-center p-2 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(99,102,241,0.15)]">
                    <div className="text-sm font-mono font-bold" style={{ color: m.color }}>{m.value}</div>
                    <div className="text-[9px] font-mono text-[#64748b]">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </GlassPanel>

          <GlassPanel title="Top Performer" glowColor="gold">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <AgentAvatar name="Nova" initial="N" glow="#6366f1" status="working" size="xl" showLevel level={15} />
                <div>
                  <div className="text-lg font-mono font-bold text-[#e2e8f0]">Nova</div>
                  <div className="text-xs font-mono text-[#64748b]">Quant Strategist</div>
                  <div className="text-xs font-mono text-[#eab308] mt-1">🏆 Top Performer — Week 22</div>
                </div>
              </div>
              {[
                { label: 'Tasks Completed', value: '1,203', color: '#6366f1' },
                { label: 'Accuracy', value: '92%', color: '#22c55e' },
                { label: 'Win Rate', value: '78%', color: '#8b5cf6' },
                { label: 'Response Time', value: '0.8s', color: '#f59e0b' },
              ].map((m) => (
                <div key={m.label} className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-[#64748b]">{m.label}</span>
                  <span className="text-xs font-mono font-bold" style={{ color: m.color }}>{m.value}</span>
                </div>
              ))}
              <div className="mt-3">
                <div className="text-[9px] font-mono text-[#64748b] mb-1">XP Progress to Level 16</div>
                <ProgressBar value={12500} max={15000} color="#6366f1" height="h-2" shimmer />
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>

      {/* Right Panel — CEO Office */}
      <div className="flex-shrink-0 flex flex-col gap-3 p-4 overflow-y-auto" style={{ width: '320px', borderLeft: '1px solid rgba(99,102,241,0.15)' }}>
        {/* CEO Office */}
        <div className="rounded-xl p-4" style={{ background: 'rgba(15,15,25,0.9)', border: '1px solid rgba(234,179,8,0.3)', boxShadow: '0 0 30px rgba(234,179,8,0.1)' }}>
          <div className="text-[9px] font-mono text-[#eab308] uppercase tracking-widest mb-3">⬡ CEO OFFICE</div>
          <div className="flex flex-col items-center mb-4">
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)', border: '3px solid rgba(234,179,8,0.7)', boxShadow: '0 0 40px rgba(234,179,8,0.4), inset 0 0 20px rgba(0,0,0,0.3)' }}>
              J
            </div>
            <div className="mt-3 text-center">
              <div className="font-mono font-bold text-[#eab308]">Janie</div>
              <div className="text-xs font-mono text-[#64748b]">Commander / CEO</div>
              <div className="text-xs font-mono text-[#eab308] mt-1">Level MAX</div>
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] status-dot-online" />
                <span className="text-[10px] font-mono text-[#22c55e]">Online</span>
              </div>
              <div className="text-[10px] font-mono text-[#64748b] mt-0.5">Since 2024-01-01</div>
            </div>
          </div>
          <div className="text-[10px] font-mono text-[#94a3b8] italic text-center border-y border-[rgba(234,179,8,0.15)] py-2.5 mb-3">
            "เราไม่ได้แค่เล่นหุ้น — เราสร้างอนาคต"
          </div>
          {/* Privileges */}
          <div className="text-[9px] font-mono text-[#64748b] uppercase tracking-widest mb-2">CEO PRIVILEGES</div>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { icon: '⚡', label: 'Strategy' },
              { icon: '🤖', label: 'Agents' },
              { icon: '✅', label: 'Approval' },
              { icon: '📊', label: 'Portfolio' },
              { icon: '🛡️', label: 'Risk' },
              { icon: '⚙️', label: 'System' },
              { icon: '🗄️', label: 'Data' },
              { icon: '📋', label: 'Reports' },
            ].map((p) => (
              <div key={p.label} className="rounded-lg p-2 text-center border border-[rgba(234,179,8,0.2)] bg-[rgba(234,179,8,0.05)] hover:bg-[rgba(234,179,8,0.12)] transition-colors cursor-pointer">
                <div className="text-lg mb-0.5">{p.icon}</div>
                <div className="text-[8px] font-mono text-[#eab308] leading-tight">{p.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Role & Position */}
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
                {agents.slice(0, 9).map((a) => (
                  <tr key={a.id} className="border-b border-[rgba(99,102,241,0.05)] hover:bg-[rgba(99,102,241,0.04)]">
                    <td className="px-3 py-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{ background: a.glow }}>
                          {a.initial}
                        </div>
                        <span className="text-[10px] text-[#e2e8f0]">{a.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-1.5 text-[#64748b] text-[9px] max-w-[80px] truncate">{a.role}</td>
                    <td className="px-3 py-1.5 text-[10px] font-bold" style={{ color: a.glow }}>L{a.level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassPanel>

        {/* Team Activity Feed */}
        <GlassPanel title="Team Activity Feed" glowColor="indigo">
          <div className="px-3 pb-3 mt-2 flex flex-col gap-2">
            {consoleLogs.map((log, i) => (
              <div key={i} className="flex gap-2 items-start p-1.5 rounded-lg hover:bg-[rgba(99,102,241,0.05)] transition-colors">
                <span className="text-[9px] font-mono text-[#64748b] flex-shrink-0 mt-0.5 tabular-nums">{log.time}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-mono font-bold" style={{ color: log.level === 'SUCCESS' ? '#22c55e' : log.level === 'WARN' ? '#f59e0b' : '#6366f1' }}>
                    {log.agent}
                  </span>
                  <p className="text-[9px] font-mono text-[#94a3b8] leading-tight mt-0.5">{log.message}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </div>
  )
}
