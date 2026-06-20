import { Search, Plus, Hash } from 'lucide-react';
import { toast } from 'react-hot-toast';

const indicatorCategories = [
  {
    name: 'Momentum',
    items: ['RSI', 'MACD', 'Stochastic', 'CCI', 'ROC']
  },
  {
    name: 'Trend',
    items: ['Supertrend', 'SMA', 'EMA', 'VWAP', 'ADX', 'Parabolic SAR']
  },
  {
    name: 'Volatility',
    items: ['Bollinger Bands', 'ATR', 'Keltner Channels']
  },
  {
    name: 'Volume',
    items: ['OBV', 'Volume Oscillator', 'Chaikin Money Flow']
  }
];

export default function IndicatorsSidebar() {
  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Search & List */}
      <div className="glass-card rounded-xl p-5 border border-border bg-white shadow-sm flex-1 flex flex-col h-[600px]">
        <h3 className="font-bold text-text mb-4">Indicators Library</h3>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search 80+ indicators..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
          {indicatorCategories.map(category => (
            <div key={category.name}>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{category.name}</h4>
              <div className="space-y-1">
                {category.items.map(item => (
                  <button 
                    key={item} 
                    onClick={() => {
                      toast.success(`Added ${item} to Entry Conditions`);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 group transition-colors"
                  >
                    <span className="text-sm font-medium text-slate-600 group-hover:text-primary transition-colors">{item}</span>
                    <Plus className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Card */}
      <div className="glass-card rounded-xl p-5 border border-border bg-gradient-to-br from-primary/5 to-accent/5 shadow-sm">
        <h3 className="font-bold text-text mb-4 flex items-center gap-2">
          <Hash className="w-4 h-4 text-primary" />
          Strategy Summary
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Instrument</span>
            <span className="font-bold text-text">NIFTY 50</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Timeframe</span>
            <span className="font-bold text-text">5m</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Conditions</span>
            <span className="font-bold text-text">2 Entry, 1 Exit</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Risk Mgmt</span>
            <span className="font-bold text-success">SL 1.5% | TGT 3.0%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
