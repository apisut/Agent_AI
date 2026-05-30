import { agents, roles } from '@/lib/mockData'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { AgentAvatar } from '@/components/ui/AgentAvatar'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ProgressBar } from '@/components/ui/ProgressBar'

export default function RolesPage() {
  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-mono font-bold text-[#e2e8f0]">Role & Position Registry</h1>
        <span className="text-xs font-mono text-[#64748b]">{roles.length} Roles Defined</span>
      </div>

      {/* Role cards */}
      <div className="grid grid-cols-3 gap-3">
        {roles.map((role) => (
          <GlassPanel key={role.name} glowColor="indigo">
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{role.icon}</span>
                  <div>
                    <div className="text-sm font-mono font-bold text-[#e2e8f0]">{role.name}</div>
                    <div className="text-[10px] font-mono text-[#64748b]">Level Req: {role.levelReq}+</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-[rgba(34,197,94,0.15)] text-[#22c55e] border border-[rgba(34,197,94,0.3)]">
                  {role.status}
                </span>
              </div>
              <p className="text-xs font-mono text-[#94a3b8] mb-3">{role.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-sm" style={{ background: i < role.importance ? '#6366f1' : 'rgba(99,102,241,0.2)' }} />
                  ))}
                  <span className="text-[9px] font-mono text-[#64748b] ml-1">Priority</span>
                </div>
                <span className="text-xs font-mono text-[#6366f1] font-bold">{role.agents} agent{role.agents > 1 ? 's' : ''}</span>
              </div>
            </div>
          </GlassPanel>
        ))}
      </div>

      {/* Agent Roster table */}
      <GlassPanel title="Agent Roster by Role" glowColor="indigo">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-[rgba(99,102,241,0.15)]">
                {['Agent', 'Role', 'Position', 'Department', 'Level', 'XP Progress', 'Accuracy', 'Tasks Done', 'Status'].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left text-[10px] text-[#64748b] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id} className="border-b border-[rgba(99,102,241,0.05)] hover:bg-[rgba(99,102,241,0.05)] transition-colors">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <AgentAvatar name={agent.name} initial={agent.initial} glow={agent.glow} status={agent.status} size="sm" />
                      <span className="text-[#e2e8f0] font-bold">{agent.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-[#94a3b8]">{agent.role}</td>
                  <td className="px-3 py-2 text-[#94a3b8] max-w-[140px] truncate">{agent.position}</td>
                  <td className="px-3 py-2 text-[#64748b]">{agent.department}</td>
                  <td className="px-3 py-2"><span className="font-bold" style={{ color: agent.glow }}>L{agent.level}</span></td>
                  <td className="px-3 py-2 w-32">
                    <div className="flex items-center gap-1.5">
                      <ProgressBar value={agent.xp} max={agent.xpMax} color={agent.glow} height="h-1.5" />
                      <span className="text-[9px] text-[#64748b] whitespace-nowrap">{Math.round(agent.xp / agent.xpMax * 100)}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-[#22c55e] font-bold">{agent.accuracy}%</td>
                  <td className="px-3 py-2 text-[#94a3b8]">{agent.tasksCompleted.toLocaleString()}</td>
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
