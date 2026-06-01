'use client'
import { useState } from 'react'
import { GlassPanel } from '@/components/ui/GlassPanel'

const tabs = ['General', 'Agents', 'Data Sources', 'Notifications', 'Risk Controls', 'Security', 'Appearance']

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('General')

  return (
    <div className="p-4 flex gap-4">
      {/* Tab nav */}
      <div className="flex flex-col gap-1" style={{ width: '160px' }}>
        <div className="text-[9px] font-mono text-[#64748b] uppercase tracking-widest mb-2 px-2">Settings</div>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 text-xs font-mono rounded-lg text-left transition-all ${activeTab === tab ? 'bg-[rgba(99,102,241,0.2)] text-[#6366f1] border border-[rgba(99,102,241,0.4)] border-l-2' : 'text-[#64748b] hover:text-[#e2e8f0] hover:bg-[rgba(255,255,255,0.04)]'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-4">
        <h1 className="text-lg font-mono font-bold text-[#e2e8f0]">{activeTab}</h1>

        {activeTab === 'General' && (
          <>
            <GlassPanel title="Command Center" glowColor="indigo">
              <div className="p-4 flex flex-col gap-4">
                {[
                  { label: 'Headquarters Name', value: 'Alpha Iris', type: 'text' },
                  { label: 'Commander Name', value: 'Janie', type: 'text' },
                  { label: 'Timezone', value: 'Asia/Bangkok (GMT+7)', type: 'select' },
                  { label: 'Language', value: 'English / Thai', type: 'select' },
                  { label: 'Trading Mode', value: 'Paper Trading', type: 'select' },
                ].map((field) => (
                  <div key={field.label} className="flex items-center justify-between">
                    <label className="text-xs font-mono text-[#94a3b8]">{field.label}</label>
                    <input type={field.type} defaultValue={field.value}
                      className="px-3 py-1.5 text-xs font-mono bg-[rgba(255,255,255,0.05)] border border-[rgba(99,102,241,0.3)] rounded-lg text-[#e2e8f0] focus:outline-none focus:border-[rgba(99,102,241,0.6)] w-60" />
                  </div>
                ))}
              </div>
            </GlassPanel>

            <GlassPanel title="AI Configuration" glowColor="violet">
              <div className="p-4 flex flex-col gap-4">
                {[
                  { label: 'Primary AI Model', value: 'GPT-4 Turbo', type: 'select' },
                  { label: 'Analysis Model', value: 'Claude 3 Opus', type: 'select' },
                  { label: 'Max Concurrent Agents', value: '9', type: 'number' },
                  { label: 'Auto-Task Assignment', toggle: true, enabled: true },
                  { label: 'Agent Learning Mode', toggle: true, enabled: true },
                ].map((field) => (
                  <div key={field.label} className="flex items-center justify-between">
                    <label className="text-xs font-mono text-[#94a3b8]">{field.label}</label>
                    {field.toggle ? (
                      <div className={`w-10 h-5 rounded-full flex items-center px-0.5 cursor-pointer transition-colors ${field.enabled ? 'bg-[#6366f1]' : 'bg-[rgba(255,255,255,0.1)]'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${field.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                      </div>
                    ) : (
                      <input type={field.type} defaultValue={field.value}
                        className="px-3 py-1.5 text-xs font-mono bg-[rgba(255,255,255,0.05)] border border-[rgba(99,102,241,0.3)] rounded-lg text-[#e2e8f0] focus:outline-none w-60" />
                    )}
                  </div>
                ))}
              </div>
            </GlassPanel>
          </>
        )}

        {activeTab === 'Risk Controls' && (
          <GlassPanel title="Risk Management Settings" glowColor="red">
            <div className="p-4 flex flex-col gap-4">
              {[
                { label: 'Max Position Size (%)', value: '5', type: 'number' },
                { label: 'Max Single Loss (%)', value: '2', type: 'number' },
                { label: 'Max Daily Loss (%)', value: '5', type: 'number' },
                { label: 'Max Portfolio Drawdown (%)', value: '15', type: 'number' },
                { label: 'Min Risk/Reward Ratio', value: '3', type: 'number' },
                { label: 'Concentration Limit (%)', value: '20', type: 'number' },
              ].map((field) => (
                <div key={field.label} className="flex items-center justify-between">
                  <label className="text-xs font-mono text-[#94a3b8]">{field.label}</label>
                  <input type={field.type} defaultValue={field.value}
                    className="px-3 py-1.5 text-xs font-mono bg-[rgba(255,255,255,0.05)] border border-[rgba(239,68,68,0.3)] rounded-lg text-[#e2e8f0] focus:outline-none focus:border-[rgba(239,68,68,0.6)] w-32 text-right" />
                </div>
              ))}
              <button className="mt-2 px-4 py-2 rounded-lg text-sm font-mono font-bold bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:opacity-90 transition-opacity">
                Save Risk Controls
              </button>
            </div>
          </GlassPanel>
        )}

        {activeTab === 'Data Sources' && (
          <GlassPanel title="Data Feed Configuration" glowColor="cyan">
            <div className="p-4 flex flex-col gap-4">
              {[
                { name: 'Polygon.io', key: 'pk_***...', status: 'connected', plan: 'Business' },
                { name: 'Alpha Vantage', key: 'av_***...', status: 'connected', plan: 'Premium' },
                { name: 'Twitter API v2', key: 'tw_***...', status: 'degraded', plan: 'Basic' },
                { name: 'Reddit API', key: 'rd_***...', status: 'connected', plan: 'Free' },
                { name: 'OpenAI API', key: 'sk_***...', status: 'connected', plan: 'Pro' },
                { name: 'SEC EDGAR', key: 'Public API', status: 'connected', plan: 'Free' },
              ].map((source) => (
                <div key={source.name} className="flex items-center justify-between p-3 rounded-xl border border-[rgba(99,102,241,0.15)] bg-[rgba(255,255,255,0.02)]">
                  <div>
                    <div className="text-xs font-mono font-bold text-[#e2e8f0]">{source.name}</div>
                    <div className="text-[9px] font-mono text-[#64748b]">{source.plan} · {source.key}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${source.status === 'connected' ? 'bg-[rgba(34,197,94,0.15)] text-[#22c55e]' : 'bg-[rgba(245,158,11,0.15)] text-[#f59e0b]'}`}>
                      {source.status}
                    </span>
                    <button className="px-2 py-1 text-[9px] font-mono border border-[rgba(99,102,241,0.3)] rounded text-[#6366f1] hover:bg-[rgba(99,102,241,0.1)]">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        )}

        {activeTab !== 'General' && activeTab !== 'Risk Controls' && activeTab !== 'Data Sources' && (
          <GlassPanel glowColor="indigo">
            <div className="p-8 text-center">
              <div className="text-4xl mb-4">⚙️</div>
              <div className="text-sm font-mono text-[#64748b]">{activeTab} settings — coming soon</div>
            </div>
          </GlassPanel>
        )}

        {activeTab !== 'Risk Controls' && (
          <div className="flex justify-end gap-3">
            <button className="px-4 py-2 rounded-lg text-xs font-mono text-[#64748b] border border-[rgba(255,255,255,0.1)] hover:border-[rgba(99,102,241,0.3)] transition-colors">
              Cancel
            </button>
            <button className="px-4 py-2 rounded-lg text-xs font-mono font-bold bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:opacity-90 transition-opacity">
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
