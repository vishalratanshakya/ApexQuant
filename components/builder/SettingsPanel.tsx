import { useState } from 'react';

export default function SettingsPanel() {
  const [instrument, setInstrument] = useState('NIFTY 50');
  const [timeframe, setTimeframe] = useState('5m');
  const [period, setPeriod] = useState('1Y');
  const [positionType, setPositionType] = useState('Long');

  return (
    <div className="space-y-6">
      {/* Base Settings */}
      <div className="glass-card rounded-xl p-5 border border-border bg-white shadow-sm">
        <h3 className="font-bold text-text mb-4">Base Settings</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Instrument</label>
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-primary transition-colors"
              value={instrument}
              onChange={(e) => setInstrument(e.target.value)}
            >
              <optgroup label="Indices">
                <option>NIFTY 50</option>
                <option>BANK NIFTY</option>
                <option>FINNIFTY</option>
              </optgroup>
              <optgroup label="Stocks">
                <option>RELIANCE</option>
                <option>HDFC BANK</option>
                <option>INFY</option>
              </optgroup>
              <optgroup label="Options">
                <option>NIFTY Options</option>
                <option>BANK NIFTY Options</option>
              </optgroup>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Timeframe</label>
            <div className="grid grid-cols-5 gap-2">
              {['1m', '5m', '15m', '1H', '1D'].map(t => (
                <button 
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                    timeframe === t 
                      ? 'bg-primary/10 border-primary/30 text-primary' 
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Backtest Period</label>
            <div className="grid grid-cols-4 gap-2">
              {['6M', '1Y', '2Y', 'MAX'].map(p => (
                <button 
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                    period === p 
                      ? 'bg-primary/10 border-primary/30 text-primary' 
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Position Type</label>
            <div className="flex p-1 bg-slate-100 rounded-lg">
              <button 
                onClick={() => setPositionType('Long')}
                className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-colors ${positionType === 'Long' ? 'bg-white shadow-sm text-success' : 'text-slate-500 hover:text-success'}`}
              >Long</button>
              <button 
                onClick={() => setPositionType('Short')}
                className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-colors ${positionType === 'Short' ? 'bg-white shadow-sm text-loss' : 'text-slate-500 hover:text-loss'}`}
              >Short</button>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Management */}
      <div className="glass-card rounded-xl p-5 border border-border bg-white shadow-sm">
        <h3 className="font-bold text-text mb-4">Global Risk</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Stop Loss (%)</label>
            <input type="number" defaultValue="1.5" step="0.1" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-primary transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Target Profit (%)</label>
            <input type="number" defaultValue="3.0" step="0.1" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-primary transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Trailing SL</label>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary" />
              <span className="text-sm font-medium text-slate-600">Activate TSL</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Re-entry Rules</label>
            <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-primary transition-colors">
              <option>No Re-entry</option>
              <option>1 Re-entry on SL</option>
              <option>1 Re-entry on Target</option>
              <option>Infinite Re-entries</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
