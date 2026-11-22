import React from 'react';
import { 
  Filter, 
  ArrowDown, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  Flame, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export default function FunnelExplorerView({ stages, dropOffs }) {
  return (
    <div className="space-y-6">
      {/* Top Banner KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Overall Conversion Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-emerald-400 font-mono">3.88%</span>
            <span className="text-xs text-emerald-500/80 font-medium">Visitor to Paid</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            4,850 converted from 125,000 visitors
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Critical Drop-off Step</span>
            <TrendingDown className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-rose-400 font-mono">73.6%</span>
            <span className="text-xs text-rose-400/80 font-medium">Trial to Paid</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Post-trial paywall friction
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Top Inflow Channel</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-blue-400 font-mono">Google Ads</span>
            <span className="text-xs text-slate-400">38.5% First Touch</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            High intent commercial search
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Annual Pipeline ARR</span>
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-purple-400 font-mono">$6.15M</span>
            <span className="text-xs text-purple-400/80 font-medium">Generated</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Average customer contract value $1,268/yr
          </div>
        </div>
      </div>

      {/* Visual Multi-Step Funnel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Filter className="w-4 h-4 text-blue-400" />
              <span>Multi-Step SaaS Acquisition Funnel</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Track conversion progression and step drop-offs from initial visit to contract renewal.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400">Cohort: 2026 Q1</span>
        </div>

        <div className="space-y-4">
          {stages.map((stage, idx) => {
            const widthPct = (stage.count / stages[0].count) * 100;

            return (
              <div key={stage.stepNum} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200 flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center font-mono text-[10px]">
                      {stage.stepNum}
                    </span>
                    <span>{stage.stage}</span>
                  </span>

                  <div className="flex items-center space-x-4 font-mono">
                    <span className="text-white font-bold">{stage.count.toLocaleString()} users</span>
                    <span className="text-cyan-400 font-semibold">{stage.conversionRatePct}% of total</span>
                    {stage.dropOffPct > 0 && (
                      <span className="text-rose-400 text-[10px] bg-rose-950/40 border border-rose-800/60 px-1.5 py-0.5 rounded">
                        -{stage.dropOffPct}% drop-off
                      </span>
                    )}
                  </div>
                </div>

                <div className="w-full bg-slate-950 h-5 rounded-lg overflow-hidden border border-slate-800 p-0.5">
                  <div
                    className="h-full rounded bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 transition-all duration-500"
                    style={{ width: `${Math.max(4, widthPct)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Root-Cause Drop-off Breakdown Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Drop-Off Root Cause Attribution
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dropOffs.map((item, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">{item.cause}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  item.impactScore === 'CRITICAL' 
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {item.impactScore} IMPACT
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800 font-mono">
                <span>Funnel Stage: <code className="text-cyan-400">{item.funnelStep}</code></span>
                <span className="text-rose-400 font-bold">{item.dropOffCount.toLocaleString()} lost users</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
