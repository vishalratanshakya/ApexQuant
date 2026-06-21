'use client';

import { useAuth } from '@/hooks/useAuth';
import { ArrowUpRight, TrendingUp, DollarSign, Activity, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getStrategies, getBacktests, StrategyData, BacktestData } from '@/lib/db';
import dynamic from 'next/dynamic';
import Heatmap from '@/components/dashboard/Heatmap';

// Dynamically import the chart so it only renders on the client side (avoids Next.js SSR errors with lightweight-charts)
const TradingViewChart = dynamic(() => import('@/components/dashboard/TradingViewChart'), { ssr: false });

const mockChartData = [
  { time: '2023-09-01', value: 100000 },
  { time: '2023-09-02', value: 101500 },
  { time: '2023-09-03', value: 102200 },
  { time: '2023-09-04', value: 101800 },
  { time: '2023-09-05', value: 103500 },
  { time: '2023-09-06', value: 105000 },
  { time: '2023-09-07', value: 104500 },
  { time: '2023-09-08', value: 106200 },
  { time: '2023-09-09', value: 108500 },
  { time: '2023-09-10', value: 107000 },
  { time: '2023-09-11', value: 109500 },
  { time: '2023-09-12', value: 112450 },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [strategies, setStrategies] = useState<StrategyData[]>([]);
  const [backtests, setBacktests] = useState<BacktestData[]>([]);

  useEffect(() => {
    if (user) {
      getStrategies(user.uid).then(setStrategies);
      getBacktests(user.uid).then(setBacktests);
    }
  }, [user]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header section */}
      <div>
        <h1 className="text-2xl font-bold text-text font-display mb-1">
          Dashboard Overview
        </h1>
        <p className="text-sm text-text-light">Welcome back, {user?.email?.split('@')[0] || 'Trader'}! Here is your portfolio performance.</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: "Today's P&L", value: '+₹12,450', change: '+0.8% (Today)', icon: TrendingUp, gradient: 'bg-gradient-to-br from-emerald-400 to-emerald-600' },
          { label: 'Total Returns', value: '₹3,45,000', change: '+24.5% (All-time)', icon: DollarSign, gradient: 'bg-gradient-to-br from-blue-500 to-blue-700' },
          { label: 'Built Strategies', value: strategies.length.toString(), change: 'Saved Drafts', icon: Activity, gradient: 'bg-gradient-to-br from-purple-500 to-purple-700' },
          { label: 'Backtests Run', value: backtests.length.toString(), change: 'Total Runs', icon: ArrowUpRight, gradient: 'bg-gradient-to-br from-orange-400 to-orange-600' },
          { label: 'Total Deployed', value: '12', change: 'Lifetime', icon: Settings, gradient: 'bg-gradient-to-br from-indigo-500 to-indigo-700' },
        ].map((stat, i) => (
          <div key={i} className={`rounded-xl p-5 shadow-sm hover:shadow-lg transition-all text-white ${stat.gradient}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-inner">
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider bg-white/20 text-white backdrop-blur-sm shadow-inner">
                {stat.change}
              </span>
            </div>
            <p className="text-[11px] font-medium text-white/80 uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-white drop-shadow-sm">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left column (Chart + Heatmap) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Equity Curve Chart */}
          <div className="glass-card rounded-xl border border-border bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-base font-bold text-text">Equity Curve</h2>
                <p className="text-xs text-slate-500 mt-0.5">Historical portfolio performance</p>
              </div>
              <select className="text-sm bg-white border border-border rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary font-medium text-slate-600 shadow-sm">
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
                <option>All Time</option>
              </select>
            </div>
            <div className="h-[350px] w-full p-6">
              <TradingViewChart data={mockChartData} />
            </div>
          </div>

          {/* Monthly Heatmap */}
          <div className="glass-card rounded-xl border border-border bg-white shadow-sm overflow-hidden p-6">
            <div className="mb-6">
              <h2 className="text-base font-bold text-text">Monthly Performance</h2>
              <p className="text-xs text-slate-500 mt-0.5">P&L Heatmap over the current year</p>
            </div>
            <Heatmap />
          </div>
        </div>

        {/* Right column (Active Strategies + Recent Trades) */}
        <div className="space-y-8">
          {/* Active Strategies Table */}
          <div className="glass-card rounded-xl border border-border bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-slate-50/50">
              <h2 className="text-base font-bold text-text">Active Strategies</h2>
              <button className="text-xs font-semibold text-primary hover:underline">View All</button>
            </div>
            <div className="p-0">
              <table className="w-full text-left">
                <tbody className="divide-y divide-slate-100">
                  {strategies.slice(0, 5).map((s, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-text mb-0.5">{s.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-semibold">{s.instrument}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500`}>
                          {s.status}
                        </span>
                      </td>
                      <td className={`px-5 py-4 text-sm font-bold text-right text-slate-400`}>
                        -
                      </td>
                      <td className="px-5 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center justify-end gap-3">
                          <button className="text-xs font-semibold text-slate-500 hover:text-primary">Edit</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {strategies.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-sm text-slate-500">
                        You have no strategies. Head to the Builder to create one!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Trades */}
          <div className="glass-card rounded-xl border border-border bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-slate-50/50">
              <h2 className="text-base font-bold text-text">Recent Trades</h2>
            </div>
            <div className="p-0">
              <table className="w-full text-left">
                <tbody className="divide-y divide-slate-100">
                  {[...Array(5)].map((_, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3">
                        <p className="text-sm font-bold text-text mb-0.5">NIFTY 24500 CE</p>
                        <p className="text-[10px] text-slate-500">10:{45 - i} AM</p>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${i % 2 === 0 ? 'bg-success/10 text-success' : 'bg-loss/10 text-loss'}`}>
                          {i % 2 === 0 ? 'BUY' : 'SELL'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm font-mono text-slate-600 text-right">
                        ₹124.50
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Quick Insights */}
        <div className="glass-card rounded-xl border border-border bg-white shadow-sm overflow-hidden p-6 mt-8">
          <h2 className="text-base font-bold text-text mb-5">Quick Insights</h2>
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-sm font-bold text-text">Win Rate Increased</p>
                <p className="text-xs text-slate-500 mt-0.5">Your average win rate is up by 4.2% across all strategies this week.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-text">Drawdown Alert</p>
                <p className="text-xs text-slate-500 mt-0.5">NIFTY Breakout hit a -1.5% drawdown today. Consider reviewing exit logic.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
