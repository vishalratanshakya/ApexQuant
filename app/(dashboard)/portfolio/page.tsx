'use client';

import { PieChart, ArrowUpRight, ArrowDownRight, Wallet, Activity, IndianRupee, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const activePositions = [
  { symbol: 'BANKNIFTY 45000 CE', type: 'BUY', qty: 150, avgPrice: 320.50, ltp: 345.20, pnl: 3705, pnlPct: 7.7 },
  { symbol: 'RELIANCE', type: 'SELL', qty: 100, avgPrice: 2450.00, ltp: 2435.50, pnl: 1450, pnlPct: 0.59 },
  { symbol: 'HDFCBANK', type: 'BUY', qty: 250, avgPrice: 1620.10, ltp: 1612.00, pnl: -2025, pnlPct: -0.5 },
];

export default function PortfolioPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text font-display mb-1 flex items-center gap-2">
            <PieChart className="w-6 h-6 text-primary" /> My Portfolio
          </h1>
          <p className="text-sm text-slate-500">Live positions and capital allocation from your connected brokers.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 shadow-sm transition-all">
          <RefreshCw className="w-4 h-4" /> Sync Broker
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
              <Wallet className="w-5 h-5" />
            </div>
            <h3 className="text-slate-500 font-semibold">Total Capital</h3>
          </div>
          <div className="text-3xl font-black font-display text-text">₹12,50,000</div>
          <div className="text-sm text-slate-400 mt-1">₹8,40,000 available margin</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-slate-500 font-semibold">Invested Value</h3>
          </div>
          <div className="text-3xl font-black font-display text-text">₹4,10,000</div>
          <div className="text-sm text-slate-400 mt-1">32% of total capital</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <IndianRupee className="w-5 h-5" />
            </div>
            <h3 className="text-slate-500 font-semibold">Today&apos;s P&L</h3>
          </div>
          <div className="flex items-end gap-3">
            <div className="text-3xl font-black font-display text-success">+₹3,130</div>
            <div className="flex items-center text-success bg-success/10 px-2 py-0.5 rounded-md text-xs font-bold mb-1.5">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> 0.76%
            </div>
          </div>
        </motion.div>
      </div>

      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between bg-slate-50/50">
          <h2 className="font-bold text-text">Live Positions</h2>
          <span className="px-3 py-1 bg-success/10 text-success text-xs font-bold rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Live
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-white border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="p-4 pl-6">Instrument</th>
                <th className="p-4">Type</th>
                <th className="p-4 text-right">Qty</th>
                <th className="p-4 text-right">Avg. Price</th>
                <th className="p-4 text-right">LTP</th>
                <th className="p-4 text-right pr-6">P&L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {activePositions.map((pos, i) => {
                const isProfit = pos.pnl >= 0;
                return (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 pl-6 font-bold text-text">{pos.symbol}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-black tracking-wider ${pos.type === 'BUY' ? 'bg-blue-100 text-blue-700' : 'bg-loss/10 text-loss'}`}>
                        {pos.type}
                      </span>
                    </td>
                    <td className="p-4 text-right font-medium text-slate-600">{pos.qty}</td>
                    <td className="p-4 text-right font-medium text-slate-600">₹{pos.avgPrice.toFixed(2)}</td>
                    <td className="p-4 text-right font-medium text-slate-600">₹{pos.ltp.toFixed(2)}</td>
                    <td className="p-4 text-right pr-6">
                      <div className={`font-bold flex items-center justify-end gap-1 ${isProfit ? 'text-success' : 'text-loss'}`}>
                        {isProfit ? '+' : ''}₹{pos.pnl}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-sm ${isProfit ? 'bg-success/10' : 'bg-loss/10'}`}>
                          {isProfit ? '+' : ''}{pos.pnlPct}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
