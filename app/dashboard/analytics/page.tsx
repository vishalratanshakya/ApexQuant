'use client';

import React from 'react';
import { BarChart2, TrendingUp, DollarSign, Activity } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text font-display mb-1">
            Analytics
          </h1>
          <p className="text-sm text-text-light">Deep dive into your portfolio's performance metrics and risk.</p>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Win Rate', value: '68%', change: '+2.4%', icon: TrendingUp, color: 'text-success', bg: 'bg-success/10' },
          { label: 'Profit Factor', value: '1.85', change: '+0.15', icon: DollarSign, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Max Drawdown', value: '-4.2%', change: 'Improved', icon: Activity, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { label: 'Sharpe Ratio', value: '1.42', change: 'Good', icon: BarChart2, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
        ].map((stat, i) => (
          <div key={i} className="glass-card rounded-xl p-5 border border-border bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
                stat.change.includes('+') || stat.change === 'Improved' || stat.change === 'Good' ? 'bg-success/10 text-success' : 'bg-slate-100 text-slate-500'
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-text">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-xl border border-border bg-white shadow-sm p-12 text-center text-slate-500">
        <BarChart2 className="w-12 h-12 mx-auto text-slate-300 mb-4" />
        <h3 className="text-lg font-bold text-slate-700 mb-2">More Analytics Coming Soon</h3>
        <p>We are currently gathering enough trading data to generate comprehensive performance heatmaps and equity curves for your portfolio.</p>
      </div>

    </div>
  );
}
