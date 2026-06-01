import { sprintTasks, apiHealth } from '@/lib/mockData'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { StatusBadge } from '@/components/ui/StatusBadge'

export default function DevRoomPage() {
  const columns = [
    { key: 'backlog', label: 'Backlog', color: '#64748b', tasks: sprintTasks.backlog },
    { key: 'inProgress', label: 'In Progress', color: '#6366f1', tasks: sprintTasks.inProgress },
    { key: 'review', label: 'In Review', color: '#f59e0b', tasks: sprintTasks.review },
    { key: 'done', label: 'Done', color: '#22c55e', tasks: sprintTasks.done },
  ]

  const priorityColor = (p: string) => p === 'high' ? '#ef4444' : p === 'medium' ? '#f59e0b' : '#64748b'

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-mono font-bold text-[#e2e8f0]">Dev Room</h1>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#64748b]">Sprint 8 · Ends Jun 7</span>
          <span className="px-2.5 py-1 text-xs font-mono rounded-full bg-[rgba(99,102,241,0.2)] text-[#6366f1] border border-[rgba(99,102,241,0.3)]">
            {Object.values(sprintTasks).flat().length} Tasks
          </span>
        </div>
      </div>

      {/* Sprint Board */}
      <GlassPanel title="Sprint Board" glowColor="indigo">
        <div className="p-4">
          <div className="grid grid-cols-4 gap-3">
            {columns.map((col) => (
              <div key={col.key}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: col.color }}>{col.label}</span>
                  <span className="text-[9px] font-mono rounded-full px-1.5 py-0.5" style={{ background: `${col.color}20`, color: col.color }}>{col.tasks.length}</span>
                </div>
                <div className="flex flex-col gap-2 min-h-32 p-2 rounded-xl border border-dashed border-[rgba(99,102,241,0.2)] bg-[rgba(255,255,255,0.01)]">
                  {col.tasks.map((task) => (
                    <div key={task.id} className="p-3 rounded-lg border border-[rgba(99,102,241,0.2)] bg-[rgba(15,15,25,0.9)] hover:border-[rgba(99,102,241,0.4)] transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-1.5">
                        <span className="text-[9px] font-mono text-[#64748b]">{task.id}</span>
                        <span className="text-[9px] font-mono font-bold" style={{ color: priorityColor(task.priority) }}>●</span>
                      </div>
                      <p className="text-[10px] font-mono text-[#e2e8f0] leading-tight mb-2">{task.title}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}>{task.dept}</span>
                        {'assignee' in task && task.assignee != null && (
                          <span className="text-[8px] font-mono text-[#64748b]">{String(task.assignee)}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassPanel>

      <div className="flex gap-4">
        {/* API Health */}
        <GlassPanel title="API Health Monitor" glowColor="green" className="flex-1">
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-[rgba(99,102,241,0.15)]">
                  {['Service', 'Status', 'Latency', 'Uptime', 'Actions'].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left text-[10px] text-[#64748b] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {apiHealth.map((api) => (
                  <tr key={api.name} className="border-b border-[rgba(99,102,241,0.05)] hover:bg-[rgba(99,102,241,0.05)] transition-colors">
                    <td className="px-3 py-2.5 text-[#e2e8f0] font-bold">{api.name}</td>
                    <td className="px-3 py-2.5"><StatusBadge status={api.status} small /></td>
                    <td className="px-3 py-2.5">
                      <span className={`font-mono font-bold ${parseInt(api.latency) > 200 ? 'text-[#f59e0b]' : 'text-[#22c55e]'}`}>{api.latency}</span>
                    </td>
                    <td className="px-3 py-2.5 text-[#22c55e] font-bold">{api.uptime}</td>
                    <td className="px-3 py-2.5">
                      <button className="px-2.5 py-1 text-[9px] font-mono rounded border border-[rgba(99,102,241,0.3)] text-[#6366f1] hover:bg-[rgba(99,102,241,0.1)] transition-colors">
                        Ping
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassPanel>

        {/* System Logs */}
        <GlassPanel title="System Logs" glowColor="indigo" className="flex-1">
          <div className="p-4 font-mono text-[10px]">
            {[
              { time: '09:42:18', level: 'INFO', msg: 'All data feeds nominal — 847,392 records/min' },
              { time: '09:41:55', level: 'SUCCESS', msg: 'Agent XP system: 9 level-ups processed' },
              { time: '09:41:32', level: 'INFO', msg: 'Sentiment model inference: 12ms avg latency' },
              { time: '09:40:47', level: 'WARN', msg: 'Twitter API rate limit at 78% — throttling enabled' },
              { time: '09:40:12', level: 'INFO', msg: 'Portfolio snapshot saved to DB — 5 positions' },
              { time: '09:39:58', level: 'SUCCESS', msg: 'Backtest engine: 10M simulations in 4.2s' },
              { time: '09:39:21', level: 'ERROR', msg: 'Polygon.io reconnect after timeout — recovered in 220ms' },
              { time: '09:38:44', level: 'INFO', msg: 'Daily report generation completed — PDF exported' },
            ].map((log, i) => (
              <div key={i} className="flex gap-3 mb-2 p-1.5 rounded hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                <span className="text-[#64748b] flex-shrink-0 tabular-nums">{log.time}</span>
                <span className={`flex-shrink-0 w-14 ${log.level === 'ERROR' ? 'text-[#ef4444]' : log.level === 'WARN' ? 'text-[#f59e0b]' : log.level === 'SUCCESS' ? 'text-[#22c55e]' : 'text-[#6366f1]'}`}>
                  [{log.level}]
                </span>
                <span className="text-[#94a3b8]">{log.msg}</span>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </div>
  )
}
