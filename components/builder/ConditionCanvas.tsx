import { Plus, Settings, CheckCircle2, ChevronRight, X, Layers } from 'lucide-react';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const TradingViewChart = dynamic(() => import('@/components/dashboard/TradingViewChart'), { ssr: false });

const mockChartData = Array.from({ length: 150 }, (_, i) => {
  const time = new Date('2023-01-01');
  time.setDate(time.getDate() + i);
  const value = 24000 + i * 25 + Math.sin(i * 0.2) * 400 + Math.cos(i * 0.5) * 200;
  return {
    time: time.toISOString().split('T')[0],
    value: Math.round(value * 100) / 100
  };
});
export default function ConditionCanvas() {
  const [activeTab, setActiveTab] = useState<'technical' | 'options'>('technical');

  const [techConditions, setTechConditions] = useState([
    { id: 1, type: 'indicator' },
    { id: 2, type: 'comparison' }
  ]);
  
  const [exits, setExits] = useState<{id: number}[]>([]);
  
  const [legs, setLegs] = useState([
    { id: 1, action: 'BUY', type: 'CALL (CE)' },
    { id: 2, action: 'SELL', type: 'PUT (PE)' }
  ]);

  const addTechCondition = () => {
    setTechConditions([...techConditions, { id: Date.now(), type: 'indicator' }]);
  };

  const removeTechCondition = (id: number) => {
    setTechConditions(techConditions.filter(c => c.id !== id));
  };

  const addExit = () => {
    setExits([...exits, { id: Date.now() }]);
  };

  const removeExit = (id: number) => {
    setExits(exits.filter(e => e.id !== id));
  };

  const addLeg = () => {
    setLegs([...legs, { id: Date.now(), action: 'BUY', type: 'CALL (CE)' }]);
  };

  const removeLeg = (id: number) => {
    setLegs(legs.filter(l => l.id !== id));
  };

  return (
    <div className="space-y-6 flex flex-col h-full">
      {/* Builder Type Toggle */}
      <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('technical')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-colors ${
            activeTab === 'technical' ? 'bg-white shadow-sm text-text' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Technical Indicators
        </button>
        <button 
          onClick={() => setActiveTab('options')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'options' ? 'bg-white shadow-sm text-text' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Layers className="w-4 h-4" />
          Multi-Leg Options
        </button>
      </div>

      {activeTab === 'technical' ? (
        <div className="space-y-6 animate-in fade-in">
          {/* Entry conditions */}
          <div className="glass-card rounded-xl p-6 border border-border bg-white shadow-sm">
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                  <span className="text-success font-bold text-sm">1</span>
                </div>
                <h2 className="text-lg font-bold text-text">Entry Conditions</h2>
              </div>
            </div>

            <div className="space-y-4">
              {techConditions.map((condition, index) => (
                <div key={condition.id} className="flex flex-col sm:flex-row sm:items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 group">
                  {index > 0 && <span className="px-2 py-1 bg-primary/10 text-primary font-bold text-[10px] rounded uppercase tracking-wider w-fit">AND</span>}
                  
                  {condition.type === 'indicator' ? (
                    <>
                      <select className="bg-white border border-border rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:border-primary flex-1 sm:flex-none">
                        <option>RSI (14)</option>
                        <option>MACD (12,26,9)</option>
                        <option>Supertrend</option>
                      </select>
                      <span className="text-sm font-bold text-slate-400">CROSSES ABOVE</span>
                      <input type="number" defaultValue="60" className="w-24 bg-white border border-border rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:border-primary" />
                    </>
                  ) : (
                    <>
                      <select className="bg-white border border-border rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:border-primary flex-1 sm:flex-none">
                        <option>Close Price</option>
                        <option>Open Price</option>
                        <option>Volume</option>
                      </select>
                      <span className="text-sm font-bold text-slate-400">IS GREATER THAN</span>
                      <select className="bg-white border border-border rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:border-primary flex-1 sm:flex-none">
                        <option>VWAP</option>
                        <option>SMA (20)</option>
                        <option>EMA (50)</option>
                      </select>
                    </>
                  )}
                  
                  <div className="ml-auto flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-slate-400 hover:text-primary bg-white border border-border rounded-lg">
                      <Settings className="w-4 h-4" />
                    </button>
                    <button onClick={() => removeTechCondition(condition.id)} className="p-1.5 text-slate-400 hover:text-loss bg-white border border-border rounded-lg">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <button onClick={addTechCondition} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-sm font-semibold text-primary hover:bg-primary/5 hover:border-primary/30 transition-all flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Condition
              </button>
            </div>
          </div>

          {/* Exit conditions */}
          <div className="glass-card rounded-xl p-6 border border-border bg-white shadow-sm">
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-loss/10 flex items-center justify-center">
                  <span className="text-loss font-bold text-sm">2</span>
                </div>
                <h2 className="text-lg font-bold text-text">Exit Conditions</h2>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-5 h-5 text-success" />
                Global Target Profit or Stop Loss will trigger automatically.
              </div>
              
              {exits.map((exit, index) => (
                 <div key={exit.id} className="flex flex-col sm:flex-row sm:items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 group">
                  {index > 0 && <span className="px-2 py-1 bg-primary/10 text-primary font-bold text-[10px] rounded uppercase tracking-wider w-fit">OR</span>}
                  <select className="bg-white border border-border rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:border-primary flex-1 sm:flex-none">
                    <option>RSI (14)</option>
                    <option>Supertrend</option>
                  </select>
                  <span className="text-sm font-bold text-slate-400">CROSSES BELOW</span>
                  <input type="number" defaultValue="40" className="w-24 bg-white border border-border rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:border-primary" />
                  
                  <div className="ml-auto flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => removeExit(exit.id)} className="p-1.5 text-slate-400 hover:text-loss bg-white border border-border rounded-lg">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <button onClick={addExit} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-text hover:border-slate-300 transition-all flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Technical Exit (Optional)
              </button>
            </div>
          </div>


        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in">
          {/* Multi-Leg Options Builder */}
          <div className="glass-card rounded-xl p-6 border border-border bg-white shadow-sm">
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-indigo-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-text">Options Builder</h2>
                  <p className="text-xs text-slate-500 font-medium">Build complex multi-leg strategies like Straddles or Strangles.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {legs.map((leg) => (
                <div key={leg.id} className="grid grid-cols-2 sm:grid-cols-6 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 items-center">
                  <select 
                    defaultValue={leg.action}
                    className={`col-span-1 bg-white border border-border rounded-lg px-3 py-1.5 text-sm font-bold focus:outline-none focus:border-primary ${leg.action === 'BUY' ? 'text-success' : 'text-loss'}`}
                    onChange={(e) => {
                       const val = e.target.value;
                       e.target.className = `col-span-1 bg-white border border-border rounded-lg px-3 py-1.5 text-sm font-bold focus:outline-none focus:border-primary ${val === 'BUY' ? 'text-success' : 'text-loss'}`;
                    }}
                  >
                    <option value="BUY" className="text-success">BUY</option>
                    <option value="SELL" className="text-loss">SELL</option>
                  </select>
                  
                  <select defaultValue={leg.type} className="col-span-1 bg-white border border-border rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:border-primary">
                    <option>CALL (CE)</option>
                    <option>PUT (PE)</option>
                  </select>
                  
                  <div className="col-span-2 sm:col-span-2 flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-400 text-right w-16">STRIKE:</span>
                    <select className="flex-1 bg-white border border-border rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:border-primary">
                      <option>ATM</option>
                      <option>ATM + 100</option>
                      <option>ATM - 100</option>
                    </select>
                  </div>
                  
                  <div className="col-span-1 flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-400">LOTS:</span>
                    <input type="number" defaultValue="1" className="w-16 bg-white border border-border rounded-lg px-2 py-1.5 text-sm font-medium focus:outline-none focus:border-primary" />
                  </div>
                  
                  <div className="col-span-1 text-right">
                    <button onClick={() => removeLeg(leg.id)} className="p-1.5 text-slate-400 hover:text-loss bg-white border border-border rounded-lg shadow-sm">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <button onClick={addLeg} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-sm font-semibold text-primary hover:bg-primary/5 hover:border-primary/30 transition-all flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Leg
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Strategy Preview Chart */}
      <div className="glass-card rounded-xl p-5 border border-border bg-white shadow-sm flex flex-col flex-1" style={{ minHeight: '400px' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-text">Live Strategy Preview</h3>
          <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-md uppercase tracking-wider">Historical</span>
        </div>
        <div className="flex-1 w-full h-full min-h-[300px] bg-slate-50/50 rounded-lg overflow-hidden border border-border relative">
          <div className="absolute inset-0">
            <TradingViewChart data={mockChartData} />
          </div>
        </div>
      </div>
    </div>
  );
}
