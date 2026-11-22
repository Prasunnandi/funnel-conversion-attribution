import React, { useState } from 'react';
import { 
  GitFork, 
  DollarSign, 
  PieChart, 
  Layers, 
  TrendingUp, 
  HelpCircle,
  Percent
} from 'lucide-react';

export default function AttributionModelComparisonView({ channels }) {
  const [activeModel, setActiveModel] = useState('uShapedPct');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <GitFork className="w-5 h-5 text-blue-400" />
            <span>Multi-Touch Attribution Modeling</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Compare First-Touch, Last-Touch, Linear, and U-Shaped (Position-Based) revenue attribution models.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400">Active View:</span>
          <select
            value={activeModel}
            onChange={(e) => setActiveModel(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-cyan-400 font-semibold px-3 py-1.5 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="uShapedPct">U-Shaped (Position Based 40-20-40)</option>
            <option value="firstTouchPct">First-Touch Model</option>
            <option value="lastTouchPct">Last-Touch Model</option>
            <option value="linearPct">Linear Model (Equal Split)</option>
          </select>
        </div>
      </div>

      {/* Model Definition Callout */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 leading-relaxed grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-1">
          <strong className="text-slate-200 block font-semibold">First-Touch:</strong>
          <span>100% credit to the first customer touchpoint (identifies acquisition drivers).</span>
        </div>
        <div className="space-y-1">
          <strong className="text-slate-200 block font-semibold">Last-Touch:</strong>
          <span>100% credit to the final touchpoint before conversion (highlights closing channels).</span>
        </div>
        <div className="space-y-1">
          <strong className="text-slate-200 block font-semibold">Linear:</strong>
          <span>Evenly divides credit across all touches in the customer conversion journey.</span>
        </div>
        <div className="space-y-1">
          <strong className="text-cyan-300 block font-semibold">U-Shaped (Recommended):</strong>
          <span>Allocates 40% to discovery, 40% to signup, and 20% divided across nurture touches.</span>
        </div>
      </div>

      {/* Attribution Comparison Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-4 font-semibold">Marketing Channel</th>
                <th className="py-3 px-4 font-semibold">First-Touch</th>
                <th className="py-3 px-4 font-semibold">Last-Touch</th>
                <th className="py-3 px-4 font-semibold">Linear</th>
                <th className="py-3 px-4 font-semibold">U-Shaped Weight</th>
                <th className="py-3 px-4 font-semibold text-right">Attributed ARR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {channels.map((ch, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-bold text-white font-sans">
                    {ch.channel}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {ch.firstTouchPct}%
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {ch.lastTouchPct}%
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {ch.linearPct}%
                  </td>
                  <td className="py-3 px-4 text-cyan-400 font-bold">
                    {ch.uShapedPct}%
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-400">
                    ${(ch.attributedArrUsd / 1000000).toFixed(2)}M
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
