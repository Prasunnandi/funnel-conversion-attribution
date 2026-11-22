import React from 'react';
import { 
  Filter, 
  RefreshCw, 
  TrendingUp, 
  DollarSign, 
  Users,
  CheckCircle
} from 'lucide-react';

export default function Navbar({ onRefresh, loading, overallConversion }) {
  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <Filter className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-slate-300 font-mono">Cohort: 2026 Q1 Full Traffic</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Multi-Touch Attribution Synced</span>
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden lg:flex items-center space-x-4 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
          <div className="flex items-center space-x-1.5 text-slate-300">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span>Visitors:</span>
            <span className="font-semibold text-white">125,000</span>
          </div>
          <div className="w-px h-3 bg-slate-700" />
          <div className="flex items-center space-x-1.5 text-slate-300">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Paid Customers:</span>
            <span className="font-semibold text-emerald-400">4,850</span>
          </div>
          <div className="w-px h-3 bg-slate-700" />
          <div className="flex items-center space-x-1.5 text-slate-300">
            <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
            <span>End-to-End Rate:</span>
            <span className="font-semibold text-purple-400">3.88%</span>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-400' : ''}`} />
          <span>Sync Funnel</span>
        </button>

        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-blue-500/30">
          PA
        </div>
      </div>
    </header>
  );
}
