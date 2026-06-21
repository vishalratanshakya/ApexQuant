import { useBuilder } from '@/contexts/BuilderContext';
import dynamic from 'next/dynamic';

const TradingViewChart = dynamic(() => import('@/components/dashboard/TradingViewChart'), { ssr: false });

const mockChartData = [
  { time: '2023-09-01', value: 24100 },
  { time: '2023-09-02', value: 24150 },
  { time: '2023-09-03', value: 24220 },
  { time: '2023-09-04', value: 24180 },
  { time: '2023-09-05', value: 24350 },
  { time: '2023-09-06', value: 24500 },
  { time: '2023-09-07', value: 24450 },
  { time: '2023-09-08', value: 24620 },
  { time: '2023-09-09', value: 24850 },
  { time: '2023-09-10', value: 24700 },
];

export default function SettingsPanel() {
  const { 
    instrument, setInstrument,
    timeframe, setTimeframe,
    period, setPeriod,
    positionType, setPositionType,
    stopLoss, setStopLoss,
    targetProfit, setTargetProfit,
    trailingSL, setTrailingSL,
    reEntry, setReEntry,
    showErrors
  } = useBuilder();

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
      <div className={`glass-card rounded-xl p-5 border shadow-sm transition-colors ${showErrors && (stopLoss <= 0 || targetProfit <= 0) ? 'border-loss bg-loss/5' : 'border-border bg-white'}`}>
        <h3 className="font-bold text-text mb-4 flex items-center gap-2">
          Global Risk
          {showErrors && (stopLoss <= 0 || targetProfit <= 0) && (
            <span className="text-xs font-semibold text-loss bg-loss/10 px-2 py-0.5 rounded-md">Error</span>
          )}
        </h3>
        <div className="space-y-4">
          <div>
            <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wider ${showErrors && stopLoss <= 0 ? 'text-loss' : 'text-slate-500'}`}>Stop Loss (%)</label>
            <input type="number" value={stopLoss} onChange={(e) => setStopLoss(Number(e.target.value))} step="0.1" className={`w-full bg-slate-50 border rounded-lg px-3 py-2 text-sm font-medium focus:outline-none transition-colors ${showErrors && stopLoss <= 0 ? 'border-loss focus:border-loss focus:ring-1 focus:ring-loss bg-loss/5 text-loss' : 'border-slate-200 focus:border-primary'}`} />
            {showErrors && stopLoss <= 0 && <p className="text-[10px] font-bold text-loss mt-1">Must be {'>'} 0</p>}
          </div>
          <div>
            <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wider ${showErrors && targetProfit <= 0 ? 'text-loss' : 'text-slate-500'}`}>Target Profit (%)</label>
            <input type="number" value={targetProfit} onChange={(e) => setTargetProfit(Number(e.target.value))} step="0.1" className={`w-full bg-slate-50 border rounded-lg px-3 py-2 text-sm font-medium focus:outline-none transition-colors ${showErrors && targetProfit <= 0 ? 'border-loss focus:border-loss focus:ring-1 focus:ring-loss bg-loss/5 text-loss' : 'border-slate-200 focus:border-primary'}`} />
            {showErrors && targetProfit <= 0 && <p className="text-[10px] font-bold text-loss mt-1">Must be {'>'} 0</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Trailing SL</label>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={trailingSL} onChange={(e) => setTrailingSL(e.target.checked)} className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary" />
              <span className="text-sm font-medium text-slate-600">Activate TSL</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Re-entry Rules</label>
            <select value={reEntry} onChange={(e) => setReEntry(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-primary transition-colors">
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
