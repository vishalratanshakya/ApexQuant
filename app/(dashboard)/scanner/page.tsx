'use client';

import { useState, useEffect } from 'react';
import { ScanEye, Filter, Search, TrendingUp, TrendingDown, ArrowRight, Activity, Lock } from 'lucide-react';
import Link from 'next/link';

const mockOpportunities = [
  { id: 1, symbol: 'NIFTY50', type: 'Breakout', timeframe: '15m', score: 92, signal: 'BUY', price: '24,150.50' },
  { id: 2, symbol: 'BANKNIFTY', type: 'Mean Reversion', timeframe: '5m', score: 88, signal: 'SELL', price: '52,340.00' },
  { id: 3, symbol: 'RELIANCE', type: 'Volume Spike', timeframe: '1H', score: 85, signal: 'BUY', price: '2,945.10' },
  { id: 4, symbol: 'HDFCBANK', type: 'Trend Reversal', timeframe: '1D', score: 81, signal: 'BUY', price: '1,640.25' },
  { id: 5, symbol: 'TCS', type: 'Overbought (RSI)', timeframe: '15m', score: 79, signal: 'SELL', price: '3,890.00' },
];

export default function MarketScannerPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Breakouts', 'Reversals', 'Volume Surges', 'Options Setup'];
  const [opportunities, setOpportunities] = useState(mockOpportunities);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Simulate real-time price updates
    const interval = setInterval(() => {
      setOpportunities(prev => prev.map(opp => {
        const currentPrice = parseFloat(opp.price.replace(/,/g, ''));
        const change = (Math.random() - 0.5) * (currentPrice * 0.001); // 0.1% volatility
        const newPrice = currentPrice + change;
        
        return {
          ...opp,
          price: newPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          score: Math.max(1, Math.min(100, opp.score + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2))) // slightly vary score too
        };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null);

  const sortedOpportunities = [...opportunities].sort((a, b) => {
    if (!sortConfig) return 0;
    
    let aVal: any = a[sortConfig.key as keyof typeof a];
    let bVal: any = b[sortConfig.key as keyof typeof b];

    if (sortConfig.key === 'price') {
      aVal = parseFloat((aVal as string).replace(/,/g, ''));
      bVal = parseFloat((bVal as string).replace(/,/g, ''));
    }

    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full">
      {/* Custom Scanner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-4">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Create Custom Scanner</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Scanner Name</label>
                <input type="text" placeholder="e.g. High Volume Breakouts" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:bg-white transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Instrument</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:bg-white transition-colors appearance-none">
                    <option>NIFTY 50</option>
                    <option>BANK NIFTY</option>
                    <option>F&O Stocks</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Timeframe</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:bg-white transition-colors appearance-none">
                    <option>5 Minutes</option>
                    <option>15 Minutes</option>
                    <option>1 Hour</option>
                    <option>1 Day</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Primary Condition</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:bg-white transition-colors appearance-none">
                  <option>RSI Crossed Above 70</option>
                  <option>MACD Bullish Crossover</option>
                  <option>Volume 2x Average</option>
                  <option>Price Crosses VWAP</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button onClick={() => setIsModalOpen(false)} className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md">
                Save & Run Scanner
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <ScanEye className="w-8 h-8 text-primary" />
            Market Scanner
          </h1>
          <p className="text-slate-500 mt-2">Discover real-time trading opportunities generated by your active scanners.</p>
        </div>
        
        <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-primary shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5">
          <Filter className="w-4 h-4" />
          Create Custom Scanner
        </button>
      </div>

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-6 md:p-8 mb-8 text-white relative overflow-hidden shadow-lg shadow-primary/20">
        <div className="relative z-10 md:w-2/3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold tracking-wider uppercase mb-4 backdrop-blur-sm border border-white/10">
            <Activity className="w-3 h-3" /> Live Feed Active
          </div>
          <h2 className="text-2xl font-bold mb-2">AI-Powered Pattern Recognition</h2>
          <p className="text-blue-100 mb-6 leading-relaxed">
            Our scanner is constantly analyzing thousands of instruments across multiple timeframes to spot high-probability setups before the breakout happens.
          </p>
          <button className="px-5 py-2.5 bg-white text-primary rounded-xl text-sm font-bold shadow-md hover:bg-slate-50 transition-colors flex items-center gap-2">
            View Live Stream
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-current" preserveAspectRatio="none">
            <polygon points="0,100 100,0 100,100" />
          </svg>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto custom-scrollbar">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
                activeFilter === filter
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm transition-all"
            placeholder="Search symbols..."
          />
        </div>
      </div>

      {/* Opportunities Table */}
      <div className="bg-white rounded-2xl border border-border shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-border">
                <th onClick={() => handleSort('symbol')} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors">Symbol {sortConfig?.key === 'symbol' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                <th onClick={() => handleSort('type')} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors">Setup Type {sortConfig?.key === 'type' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                <th onClick={() => handleSort('timeframe')} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors">Timeframe {sortConfig?.key === 'timeframe' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                <th onClick={() => handleSort('signal')} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors">Signal {sortConfig?.key === 'signal' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                <th onClick={() => handleSort('score')} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors">AI Score {sortConfig?.key === 'score' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedOpportunities.map((opp) => (
                <tr key={opp.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{opp.symbol}</div>
                    <div className="text-xs font-medium text-slate-500 mt-0.5">{opp.price}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-slate-700">{opp.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                      {opp.timeframe}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {opp.signal === 'BUY' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-success/10 text-success text-xs font-bold border border-success/20">
                        <TrendingUp className="w-3 h-3" /> BUY
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-loss/10 text-loss text-xs font-bold border border-loss/20">
                        <TrendingDown className="w-3 h-3" /> SELL
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${opp.score >= 90 ? 'bg-success' : opp.score >= 80 ? 'bg-primary' : 'bg-warning'}`} 
                          style={{ width: `${opp.score}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-slate-700">{opp.score}/100</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/scanner/${opp.symbol}`} className="px-4 py-1.5 rounded-lg text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 transition-all">
                      Analyze
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Premium Lock */}
      <div className="mt-8 bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center">
            <Lock className="w-6 h-6 text-slate-400" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Unlock Custom Screeners</h3>
            <p className="text-sm text-slate-500">Upgrade to Pro to build custom screeners using 80+ technical indicators.</p>
          </div>
        </div>
        <Link href="/pricing" className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-colors shadow-md whitespace-nowrap">
          Upgrade to Pro
        </Link>
      </div>

    </div>
  );
}
