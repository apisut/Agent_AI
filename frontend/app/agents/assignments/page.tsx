'use client'
import { useState } from 'react'
import { agents } from '@/lib/mockData'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { AgentAvatar } from '@/components/ui/AgentAvatar'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { StatusBadge } from '@/components/ui/StatusBadge'

const tasks = agents.map((a, i) => ({
  id: `T-${String(i + 1).padStart(3, '0')}`,
  title: a.task,
  agent: a.name,
  initial: a.initial,
  glow: a.glow,
  status: a.status,
  department: a.department,
  progress: a.taskProgress,
  priority: ['Critical', 'High', 'High', 'Medium', 'High', 'Medium', 'Critical', 'Medium', 'Low'][i % 9],
  deadline: a.taskDeadline,
}))

export default function AssignmentsPage() {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = tasks.filter((t) => {
    const matchFilter = filter === 'All' || t.priority === filter || (filter === 'Active' && t.progress > 0)
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.agent.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-mono font-bold text-[#e2e8f0]">Work Assignments</h1>
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="px-3 py-1.5 text-xs font-mono bg-[rgba(15,15,25,0.8)] border border-[rgba(99,102,241,0.3)] rounded-lg text-[#e2e8f0] placeholder-[#64748b] focus:outline-none focus:border-[rgba(99,102,241,0.6)] w-48"
          />
          <div className="flex rounded-lg border border-[rgba(99,102,241,0.3)] overflow-hidden">
            {['All', 'Critical', 'High', 'Medium', 'Active'].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-mono transition-all ${filter === f ? 'bg-[rgba(99,102,241,0.25)] text-[#6366f1]' : 'text-[#64748b] hover:text-[#e2e8f0]'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Tasks', value: tasks.length, color: '#6366f1' },
          { label: 'In Progress', value: tasks.filter(t => t.progress > 0 && t.progress < 100).length, color: '#8b5cf6' },
          { label: 'Completed', value: tasks.filter(t => t.progress === 100).length, color: '#22c55e' },
          { label: 'Critical', value: tasks.filter(t => t.priority === 'Critical').length, color: '#ef4444' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl p-3 border border-[rgba(99,102,241,0.2)] bg-[rgba(15,15,25,0.8)] text-center">
            <div className="text-xl font-mono font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[10px] font-mono text-[#64748b] mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <GlassPanel title="Task Queue" glowColor="indigo">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-[rgba(99,102,241,0.15)]">
                {['ID', 'Task', 'Assigned To', 'Department', 'Priority', 'Progress', 'Deadline', 'Status'].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left text-[10px] text-[#64748b] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((task) => {
                const pColor = task.priority === 'Critical' ? '#ef4444' : task.priority === 'High' ? '#f97316' : task.priority === 'Medium' ? '#f59e0b' : '#64748b'
                return (
                  <tr key={task.id} className="border-b border-[rgba(99,102,241,0.05)] hover:bg-[rgba(99,102,241,0.05)] transition-colors">
                    <td className="px-3 py-2 text-[#64748b]">{task.id}</td>
                    <td className="px-3 py-2 text-[#e2e8f0] max-w-[200px] truncate">{task.title}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: task.glow }}>
                          {task.initial}
                        </div>
                        <span className="text-[#94a3b8]">{task.agent}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-[#64748b]">{task.department}</td>
                    <td className="px-3 py-2"><span className="font-bold" style={{ color: pColor }}>{task.priority}</span></td>
                    <td className="px-3 py-2 w-32">
                      <div className="flex items-center gap-2">
                        <ProgressBar value={task.progress} color={task.glow} height="h-1.5" />
                        <span className="text-[9px] text-[#64748b]">{task.progress}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-[#64748b] whitespace-nowrap">{task.deadline.slice(0, 10)}</td>
                    <td className="px-3 py-2"><StatusBadge status={task.status} small /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </GlassPanel>
    </div>
  )
}
