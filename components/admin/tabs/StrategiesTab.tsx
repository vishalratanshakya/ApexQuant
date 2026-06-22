import React, { useState } from 'react';
import { Search, Filter, Play, Pause, MoreVertical, Edit2, ExternalLink, Activity, ArrowRightLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

const MOCK_STRATEGIES = [
  { id: 'str-001', name: 'NIFTY Breakout Pro', owner: 'John Doe', instrument: 'NIFTY 50', status: 'Live', type: 'Intraday', pnl: '+₹14,500', updated: '2 hours ago' },
  { id: 'str-002', name: 'BankNifty Reversion', owner: 'Sarah Williams', instrument: 'BANKNIFTY', status: 'Paused', type: 'Swing', pnl: '-₹1,200', updated: '1 day ago' },
  { id: 'str-003', name: 'Reliance Earnings', owner: 'Mike Johnson', instrument: 'RELIANCE', status: 'Draft', type: 'Positional', pnl: '₹0', updated: '3 days ago' },
  { id: 'str-004', name: 'FinNifty Expiry Scalp', owner: 'John Doe', instrument: 'FINNIFTY', status: 'Live', type: 'Scalping', pnl: '+₹45,200', updated: 'Just now' },
  { id: 'str-005', name: 'TCS Momentum', owner: 'Jane Smith', instrument: 'TCS', status: 'Live', type: 'Intraday', pnl: '+₹3,400', updated: '5 hours ago' },
  { id: 'str-006', name: 'HDFC Straddle', owner: 'Alex Brown', instrument: 'HDFCBANK', status: 'Draft', type: 'Options', pnl: '₹0', updated: '1 week ago' },
];

export function StrategiesTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [strategies, setStrategies] = useState(MOCK_STRATEGIES);
  
  const handleToggleStatus = (id: string, currentStatus: string) => {
    if (currentStatus === 'Draft') return;
    
    const newStatus = currentStatus === 'Live' ? 'Paused' : 'Live';
    setStrategies(strategies.map(s => s.id === id ? { ...s, status: newStatus } : s));
    toast.success(`Strategy ${newStatus === 'Live' ? 'resumed' : 'paused'}`);
  };

  const filteredStrategies = strategies.filter(strategy => 
    strategy.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    strategy.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pt-6">
      
      {/* Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search strategies or owners..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-border rounded-xl focus:outline-none focus:border-primary text-sm shadow-sm"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-border rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-2 shadow-sm">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      {/* Strategies Table */}
      <div className="glass-card rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-border">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Strategy Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Owner</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type / Instrument</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Live P&L</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredStrategies.map((strategy) => (
                <tr key={strategy.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 border border-slate-200 shadow-sm">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{strategy.name}</p>
                        <p className="text-xs text-slate-500">ID: {strategy.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-700 hover:text-primary cursor-pointer transition-colors flex items-center gap-1.5">
                      {strategy.owner} <ExternalLink className="w-3 h-3 text-slate-400" />
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-1 rounded bg-slate-100 text-slate-600">
                        {strategy.type}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <ArrowRightLeft className="w-3 h-3" /> {strategy.instrument}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-bold ${
                      strategy.pnl.startsWith('+') ? 'text-success' : strategy.pnl.startsWith('-') ? 'text-loss' : 'text-slate-400'
                    }`}>
                      {strategy.pnl}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md w-max uppercase tracking-wider ${
                      strategy.status === 'Live' ? 'bg-success/10 text-success' : 
                      strategy.status === 'Paused' ? 'bg-orange-500/10 text-orange-500' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {strategy.status === 'Live' && <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>}
                      {strategy.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {strategy.status !== 'Draft' && (
                        <button 
                          onClick={() => handleToggleStatus(strategy.id, strategy.status)}
                          className={`p-2 rounded-lg transition-colors tooltip ${
                            strategy.status === 'Live' ? 'text-slate-400 hover:text-orange-500 hover:bg-orange-50' : 'text-slate-400 hover:text-success hover:bg-success/10'
                          }`}
                          data-tip={strategy.status === 'Live' ? 'Pause Execution' : 'Resume Execution'}
                        >
                          {strategy.status === 'Live' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                      )}
                      
                      <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors tooltip" data-tip="View Strategy">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      
                      <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredStrategies.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No strategies found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
