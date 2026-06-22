'use client';

import React from 'react';
import { BarChart2, TrendingUp, DollarSign, Activity } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      {/* Header section */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-900/20">
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold font-display mb-2 flex items-center gap-3">
            <Activity className="w-8 h-8 text-indigo-400" />
            Portfolio Analytics
          </h1>
          <p className="text-slate-300 max-w-xl leading-relaxed">
            Deep dive into your portfolio's performance metrics and risk. AI-driven insights to help you optimize your automated trading strategies.
          </p>
        </div>
        {/* Decorative background elements */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none flex justify-end">
          <svg viewBox="0 0 100 100" className="h-full w-auto fill-current" preserveAspectRatio="none">
            <polygon points="50,0 100,0 100,100 0,100" />
          </svg>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-10 w-32 h-32 bg-indigo-500 rounded-full blur-[64px] opacity-50"></div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Win Rate', value: '68%', change: '+2.4%', icon: TrendingUp, color: 'text-success', bg: 'bg-success/10', gradient: 'from-white to-emerald-50/60 border-emerald-100/50 shadow-emerald-900/5' },
          { label: 'Profit Factor', value: '1.85', change: '+0.15', icon: DollarSign, color: 'text-primary', bg: 'bg-primary/10', gradient: 'from-white to-blue-50/60 border-blue-100/50 shadow-blue-900/5' },
          { label: 'Max Drawdown', value: '-4.2%', change: 'Improved', icon: Activity, color: 'text-orange-500', bg: 'bg-orange-500/10', gradient: 'from-white to-orange-50/60 border-orange-100/50 shadow-orange-900/5' },
          { label: 'Sharpe Ratio', value: '1.42', change: 'Good', icon: BarChart2, color: 'text-indigo-500', bg: 'bg-indigo-500/10', gradient: 'from-white to-indigo-50/60 border-indigo-100/50 shadow-indigo-900/5' },
        ].map((stat, i) => (
          <div key={i} className={`rounded-xl p-5 border shadow-sm hover:shadow-md transition-all hover:-translate-y-1 bg-gradient-to-br ${stat.gradient}`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center shadow-inner`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm border ${
                stat.change.includes('+') || stat.change === 'Improved' || stat.change === 'Good' 
                  ? 'bg-success/10 text-success border-success/20' 
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900">{stat.value}</p>
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
