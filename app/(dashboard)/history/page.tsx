'use client';

import { useState, useMemo } from 'react';
import { History, Search, Filter, ChevronDown } from 'lucide-react';

export default function TradeHistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterSide, setFilterSide] = useState('All');

  const mockTrades = useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      id: i,
      date: `2023-10-${(15 - Math.floor(i/3)).toString().padStart(2, '0')} 14:30:00`,
      strategy: i % 2 === 0 ? 'NIFTY Breakout Pro' : 'Mean Reversion Bot',
      instrument: i % 2 === 0 ? 'NIFTY 24500 CE' : 'BANKNIFTY 52000 PE',
      side: i % 3 === 0 ? 'SELL' : 'BUY',
      price: i % 3 === 0 ? '₹124.50' : '₹210.00',
      pnl: i % 3 === 0 ? -1200 : 3450
    }));
  }, []);

  const filteredTrades = mockTrades.filter(trade => {
    const matchesSearch = trade.strategy.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          trade.instrument.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSide = filterSide === 'All' || trade.side === filterSide;
    return matchesSearch && matchesSide;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text font-display mb-1 flex items-center gap-2">
            <History className="w-6 h-6 text-primary" /> Trade History
          </h1>
          <p className="text-sm text-text-light">Comprehensive log of all executed orders and their outcomes.</p>
        </div>
        <div className="flex items-center gap-3 relative">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all border ${showFilters ? 'bg-primary/10 text-primary border-primary/20' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-sm'}`}
          >
            <Filter className="w-4 h-4" /> Filters <ChevronDown className="w-3 h-3" />
          </button>
          
          {/* Filters Dropdown */}
          {showFilters && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 shadow-xl rounded-xl p-3 z-20 animate-in slide-in-from-top-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Side</h3>
              <div className="space-y-1">
                {['All', 'BUY', 'SELL'].map(side => (
                  <button 
                    key={side}
                    onClick={() => { setFilterSide(side); setShowFilters(false); }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterSide === side ? 'bg-primary/10 text-primary' : 'hover:bg-slate-50 text-slate-700'}`}
                  >
                    {side === 'All' ? 'All Sides' : side} Only
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="glass-card rounded-xl border border-border bg-white overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border flex gap-4 bg-slate-50/50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by instrument or strategy..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm" 
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-wider">Date/Time</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-wider">Strategy</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-wider">Instrument</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-wider">Side</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-wider">Price</th>
                <th className="px-6 py-4 font-bold text-slate-500 uppercase text-[10px] tracking-wider">P&L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredTrades.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 text-sm font-medium">
                    No trades match your filters.
                  </td>
                </tr>
              ) : (
                filteredTrades.map((trade) => (
                  <tr key={trade.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4 text-slate-500 font-medium">{trade.date}</td>
                    <td className="px-6 py-4 font-bold text-text">{trade.strategy}</td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{trade.instrument}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-bold ${trade.side === 'SELL' ? 'bg-loss/10 text-loss border border-loss/20' : 'bg-success/10 text-success border border-success/20'}`}>
                        {trade.side}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-mono font-medium">{trade.price}</td>
                    <td className={`px-6 py-4 font-bold ${trade.pnl < 0 ? 'text-loss' : 'text-success'}`}>
                      {trade.pnl < 0 ? `-₹${Math.abs(trade.pnl).toLocaleString()}` : `+₹${trade.pnl.toLocaleString()}`}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
