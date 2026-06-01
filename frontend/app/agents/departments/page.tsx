import { departments, agents } from '@/lib/mockData'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { AgentAvatar } from '@/components/ui/AgentAvatar'
import { StatusBadge } from '@/components/ui/StatusBadge'

export default function DepartmentsPage() {
  const getAgent = (name: string) => agents.find((a) => a.name === name)

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-mono font-bold text-[#e2e8f0]">Department Structure</h1>
        <span className="text-xs font-mono text-[#64748b]">{departments.length} Departments</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {departments.map((dept) => {
          const head = getAgent(dept.head)
          const memberAgents = dept.agents.map((name) => getAgent(name)).filter(Boolean)
          return (
            <GlassPanel key={dept.name} glowColor="indigo">
              <div className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg text-white"
                      style={{ background: `linear-gradient(135deg, ${dept.headGlow}80, ${dept.headGlow}40)`, border: `2px solid ${dept.headGlow}50`, boxShadow: `0 0 15px ${dept.headGlow}30` }}>
                      {dept.headInitial}
                    </div>
                    <div>
                      <div className="text-sm font-mono font-bold text-[#e2e8f0]">{dept.name}</div>
                      <div className="text-[10px] font-mono text-[#64748b]">Head: {dept.head}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-[rgba(34,197,94,0.15)] text-[#22c55e] border border-[rgba(34,197,94,0.3)]">
                    {dept.count} agents
                  </span>
                </div>

                <p className="text-xs font-mono text-[#94a3b8] mb-4">{dept.mission}</p>

                <div className="text-[9px] font-mono text-[#64748b] uppercase tracking-widest mb-2">Team Members</div>
                <div className="flex flex-col gap-2">
                  {memberAgents.map((agent) => {
                    if (!agent) return null
                    return (
                      <div key={agent.id} className="flex items-center justify-between p-2 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(99,102,241,0.1)]">
                        <div className="flex items-center gap-2">
                          <AgentAvatar name={agent.name} initial={agent.initial} glow={agent.glow} status={agent.status} size="sm" />
                          <div>
                            <div className="text-xs font-mono font-bold text-[#e2e8f0]">{agent.name}</div>
                            <div className="text-[9px] font-mono text-[#64748b]">{agent.role}</div>
                          </div>
                        </div>
                        <StatusBadge status={agent.status} small />
                      </div>
                    )
                  })}
                </div>
              </div>
            </GlassPanel>
          )
        })}
      </div>
    </div>
  )
}
