import React from 'react';
import { 
  Filter, 
  GitFork, 
  PieChart, 
  AlertOctagon, 
  Layers, 
  ExternalLink,
  TrendingDown,
  Compass
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'funnel', label: 'Multi-Step Funnel & Drop-offs', icon: Filter, badge: '5 Stages' },
    { id: 'attribution', label: 'Multi-Touch Attribution', icon: GitFork, badge: '4 Models' },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
      <div>
        <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Filter className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-slate-100 text-sm tracking-wide">FunnelMetrics</h1>
            <p className="text-xs text-blue-400 font-medium">Attribution & Analytics</p>
          </div>
        </div>

        <nav className="p-4 space-y-1.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Conversion Analytics
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 mx-3 mt-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs">
          <div className="flex items-center justify-between text-slate-300 mb-2 font-medium">
            <span className="flex items-center space-x-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
              <span>Highest Drop-off</span>
            </span>
            <span className="text-rose-400 text-[10px] font-semibold">73.6% LOSS</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Major drop-off detected between 14-Day Trial and Paid Enterprise Plan due to credit card 3D Secure friction.
          </p>
        </div>
      </div>

      <div className="p-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
        <div>
          <p className="text-slate-300 font-semibold text-[11px]">Attribution Engine</p>
          <p className="text-[10px] text-slate-400">First • Last • U-Shaped</p>
        </div>
        <a 
          href="https://github.com/Prasunnandi/funnel-conversion-attribution" 
          target="_blank" 
          rel="noreferrer" 
          className="text-blue-400 hover:text-blue-300 p-1.5 hover:bg-slate-800 rounded"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </aside>
  );
}
