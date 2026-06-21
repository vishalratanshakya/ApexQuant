'use client';

import { History, Search, Filter } from 'lucide-react';

export default function TradeHistoryPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text font-display mb-1 flex items-center gap-2">
            <History className="w-6 h-6 text-primary" /> Trade History
          </h1>
          <p className="text-sm text-text-light">Comprehensive log of all executed orders and their outcomes.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      <div className="glass-card rounded-xl border border-border bg-white overflow-hidden">
        <div className="p-4 border-b border-border flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search by instrument or strategy..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-500 uppercase text-[10px] tracking-wider">Date/Time</th>
                <th className="px-6 py-4 font-semibold text-slate-500 uppercase text-[10px] tracking-wider">Strategy</th>
                <th className="px-6 py-4 font-semibold text-slate-500 uppercase text-[10px] tracking-wider">Instrument</th>
                <th className="px-6 py-4 font-semibold text-slate-500 uppercase text-[10px] tracking-wider">Side</th>
                <th className="px-6 py-4 font-semibold text-slate-500 uppercase text-[10px] tracking-wider">Price</th>
                <th className="px-6 py-4 font-semibold text-slate-500 uppercase text-[10px] tracking-wider">P&L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {[...Array(10)].map((_, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-500">2023-10-15 14:30:00</td>
                  <td className="px-6 py-4 font-medium text-text">NIFTY Breakout Pro</td>
                  <td className="px-6 py-4 text-slate-500">NIFTY 24500 CE</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${i % 3 === 0 ? 'bg-loss/10 text-loss' : 'bg-success/10 text-success'}`}>
                      {i % 3 === 0 ? 'SELL' : 'BUY'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-mono">₹124.50</td>
                  <td className={`px-6 py-4 font-bold ${i % 3 === 0 ? 'text-loss' : 'text-success'}`}>
                    {i % 3 === 0 ? '-₹1,200' : '+₹3,450'}
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
