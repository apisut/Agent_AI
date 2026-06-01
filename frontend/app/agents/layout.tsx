import { AgentsSidebar } from '@/components/layout/AgentsSidebar'

export default function AgentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 48px)' }}>
      <AgentsSidebar />
      <main style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
