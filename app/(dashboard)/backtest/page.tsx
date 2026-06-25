'use client';

import React, { useEffect, useState } from 'react';
import { Activity, Play, Plus, History } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { getBacktests, BacktestData } from '@/lib/db';

export default function BacktestPage() {
  const { user } = useAuth();
  const [backtests, setBacktests] = useState<BacktestData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getBacktests(user.uid).then(data => {
        setBacktests(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text font-display mb-1">
            Backtests
          </h1>
          <p className="text-sm text-text-light">Analyze historical performance of your strategies before taking them live.</p>
        </div>
        <Link href="/strategy-builder" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors">
          <Plus className="w-4 h-4" />
          New Backtest
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Backtests */}
          <div className="glass-card rounded-xl border border-border bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-slate-50/50">
              <h2 className="text-base font-bold text-text flex items-center gap-2">
                <History className="w-4 h-4 text-slate-400" /> Recent Backtests
              </h2>
            </div>
            <div className="p-0">
              {loading ? (
                <div className="p-12 text-center text-slate-500">Loading backtests...</div>
              ) : backtests.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <p>No recent backtests found. Head over to the Strategy Builder to start one.</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <tbody className="divide-y divide-slate-100">
                    {backtests.map((bt) => (
                      <tr key={bt.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-4">
                          <p className="text-sm font-bold text-text mb-0.5">{bt.strategyName}</p>
                          <p className="text-[10px] text-slate-500 uppercase font-semibold">Strategy ID: {bt.strategyId?.substring(0,8)}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            bt.status === 'Completed' ? 'bg-success/10 text-success' : 'bg-orange-500/10 text-orange-500'
                          }`}>
                            {bt.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Link href={`/backtest/${bt.id}`} className="text-xs font-semibold text-primary hover:underline">View Report</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-xl border border-border bg-white shadow-sm p-6">
             <h2 className="text-base font-bold text-text flex items-center gap-2 mb-4">
               <Activity className="w-4 h-4 text-slate-400" /> Backtest Engine Status
             </h2>
             <div className="space-y-4 text-sm text-slate-600">
                <div className="flex justify-between items-center">
                   <span>Server Status</span>
                   <span className="text-success font-bold flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success animate-pulse" /> Online</span>
                </div>
                <div className="flex justify-between items-center">
                   <span>Available Credits</span>
                   <span className="font-bold">850</span>
                </div>
                <div className="flex justify-between items-center">
                   <span>Historical Data</span>
                   <span className="font-bold">Updated Today</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
