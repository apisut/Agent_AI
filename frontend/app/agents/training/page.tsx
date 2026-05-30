import { agents } from '@/lib/mockData'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { AgentAvatar } from '@/components/ui/AgentAvatar'
import { ProgressBar } from '@/components/ui/ProgressBar'

const trainingPrograms = [
  { id: 'tp1', name: 'Advanced Technical Analysis', duration: '4 weeks', level: 'Advanced', enrolled: 3, icon: '📊', color: '#6366f1', skills: ['Elliott Wave', 'Harmonic Patterns', 'Volume Profile'] },
  { id: 'tp2', name: 'Quantitative Risk Modeling', duration: '6 weeks', level: 'Expert', enrolled: 2, icon: '🔢', color: '#8b5cf6', skills: ['VaR Modeling', 'Monte Carlo', 'Copula Functions'] },
  { id: 'tp3', name: 'NLP & Sentiment Engineering', duration: '3 weeks', level: 'Intermediate', enrolled: 2, icon: '💬', color: '#06b6d4', skills: ['Transformer Models', 'BERT Fine-tuning', 'Sentiment Scoring'] },
  { id: 'tp4', name: 'Biotech Pipeline Analysis', duration: '5 weeks', level: 'Advanced', enrolled: 1, icon: '🧬', color: '#22c55e', skills: ['FDA Process', 'Clinical Trial Design', 'Pipeline Valuation'] },
  { id: 'tp5', name: 'Execution Algorithm Design', duration: '4 weeks', level: 'Expert', enrolled: 1, icon: '⚡', color: '#f97316', skills: ['TWAP/VWAP', 'Market Impact', 'Latency Optimization'] },
  { id: 'tp6', name: 'Portfolio Construction', duration: '3 weeks', level: 'Intermediate', enrolled: 4, icon: '📋', color: '#f59e0b', skills: ['Mean-Variance', 'Factor Exposure', 'Rebalancing'] },
]

export default function TrainingPage() {
  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-mono font-bold text-[#e2e8f0]">Training Center</h1>
        <span className="px-2.5 py-1 text-xs font-mono rounded-full bg-[rgba(99,102,241,0.2)] text-[#6366f1] border border-[rgba(99,102,241,0.3)]">6 Programs Active</span>
      </div>

      {/* Training programs */}
      <div className="grid grid-cols-3 gap-3">
        {trainingPrograms.map((prog) => (
          <GlassPanel key={prog.id} glowColor="indigo">
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{prog.icon}</span>
                <span className="px-2 py-0.5 text-[9px] font-mono rounded-full border" style={{ color: prog.color, borderColor: `${prog.color}50`, background: `${prog.color}15` }}>
                  {prog.level}
                </span>
              </div>
              <div className="text-sm font-mono font-bold text-[#e2e8f0] mb-1">{prog.name}</div>
              <div className="text-[10px] font-mono text-[#64748b] mb-3">Duration: {prog.duration} · {prog.enrolled} enrolled</div>
              <div className="flex flex-col gap-1 mb-3">
                {prog.skills.map((skill) => (
                  <div key={skill} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: prog.color }} />
                    <span className="text-[10px] font-mono text-[#94a3b8]">{skill}</span>
                  </div>
                ))}
              </div>
              <button className="w-full py-1.5 rounded-lg text-xs font-mono font-bold transition-all hover:opacity-90"
                style={{ background: `linear-gradient(135deg, ${prog.color}40, ${prog.color}20)`, border: `1px solid ${prog.color}50`, color: prog.color }}>
                Enroll Agent
              </button>
            </div>
          </GlassPanel>
        ))}
      </div>

      {/* Skill Tree */}
      <GlassPanel title="Agent Skill Profiles" glowColor="violet">
        <div className="p-4 grid grid-cols-1 gap-4">
          {agents.slice(0, 5).map((agent) => (
            <div key={agent.id} className="flex items-start gap-4">
              <AgentAvatar name={agent.name} initial={agent.initial} glow={agent.glow} status={agent.status} size="md" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-[#e2e8f0]">{agent.name}</span>
                  <span className="text-[10px] font-mono text-[#64748b]">{agent.role}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {agent.skills.map((skill) => (
                    <div key={skill.name} className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-[#64748b] w-36 flex-shrink-0">{skill.name}</span>
                      <div className="flex-1">
                        <ProgressBar value={skill.level} color={agent.glow} height="h-1.5" />
                      </div>
                      <span className="text-[10px] font-mono w-6 text-right" style={{ color: agent.glow }}>{skill.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  )
}
