'use client';

import { Activity, Download, Play, ShieldAlert, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Link from 'next/link';

export default function BacktestReportPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/dashboard" className="text-sm font-semibold text-slate-400 hover:text-primary transition-colors">Dashboard</Link>
            <span className="text-slate-300">/</span>
            <span className="text-sm font-semibold text-text">Report #{params.id}</span>
          </div>
          <h1 className="text-2xl font-bold text-text font-display flex items-center gap-3">
            NIFTY Breakout Pro
            <span className="px-2.5 py-1 rounded-md bg-success/10 text-success text-[10px] font-bold uppercase tracking-wider">High Profitability</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button className="btn-primary px-4 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-2">
            <Play className="w-4 h-4 fill-current" /> Deploy Live
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Net Profit', value: '₹42,500', sub: '+12.4%', up: true },
          { label: 'Total Trades', value: '142', sub: '68% Win Rate', up: true },
          { label: 'Max Drawdown', value: '₹5,200', sub: '-1.8%', up: false },
          { label: 'Profit Factor', value: '1.85', sub: 'Excellent', up: true },
          { label: 'Expectancy', value: '₹299', sub: 'Per trade', up: true },
        ].map((stat, i) => (
          <div key={i} className="glass-card rounded-xl p-4 border border-border bg-white">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-xl font-bold text-text mb-1">{stat.value}</p>
            <p className={`text-xs font-semibold flex items-center gap-1 ${stat.up ? 'text-success' : 'text-loss'}`}>
              {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {stat.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Charts area */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-xl border border-border p-6 bg-white min-h-[400px] flex flex-col">
          <h2 className="text-base font-bold text-text mb-6">Equity Curve</h2>
          <div className="flex-1 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex items-center justify-center">
            <p className="text-sm text-slate-400 font-medium">Chart visualization here</p>
          </div>
        </div>
        <div className="glass-card rounded-xl border border-border p-6 bg-white min-h-[400px] flex flex-col">
          <h2 className="text-base font-bold text-text mb-6">Drawdown Profile</h2>
          <div className="flex-1 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex items-center justify-center">
            <p className="text-sm text-slate-400 font-medium">Drawdown chart here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
