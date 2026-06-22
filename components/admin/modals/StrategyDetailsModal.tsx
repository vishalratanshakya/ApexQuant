import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, Settings, Target, Percent, Clock } from 'lucide-react';

export function StrategyDetailsModal({ strategy, onClose }: { strategy: any, onClose: () => void }) {
  if (!strategy) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex justify-center items-center py-10 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.95 }} 
          animate={{ opacity: 1, y: 0, scale: 1 }} 
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl relative overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">{strategy.name || 'Unnamed Strategy'}</h2>
                <p className="text-xs text-slate-500 font-mono">ID: {strategy.id}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-100 rounded-full transition-colors border border-slate-200 shadow-sm">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
            
            {/* Core Settings */}
            <section>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
                <Settings className="w-4 h-4 text-indigo-500" /> Core Settings
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Instrument</p>
                  <p className="text-sm font-bold text-slate-700">{strategy.instrument || 'N/A'}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Timeframe</p>
                  <p className="text-sm font-bold text-slate-700 flex items-center gap-1"><Clock className="w-3 h-3" /> {strategy.timeframe || 'N/A'}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Position</p>
                  <p className="text-sm font-bold text-slate-700">{strategy.positionType || 'N/A'}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-md ${
                    strategy.status === 'Live' ? 'bg-emerald-100 text-emerald-700' :
                    strategy.status === 'Paused' ? 'bg-orange-100 text-orange-700' :
                    strategy.status === 'Error' ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-700'
                  }`}>{strategy.status || 'Draft'}</span>
                </div>
              </div>
            </section>

            {/* Risk Management */}
            <section>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-emerald-500" /> Risk Management
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                  <span className="text-xs font-bold text-emerald-800">Target Profit</span>
                  <span className="text-sm font-bold text-emerald-600">+{strategy.targetProfit || 0}%</span>
                </div>
                <div className="flex items-center justify-between bg-red-50/50 p-3 rounded-xl border border-red-100">
                  <span className="text-xs font-bold text-red-800">Stop Loss</span>
                  <span className="text-sm font-bold text-red-600">-{strategy.stopLoss || 0}%</span>
                </div>
              </div>
            </section>

            {/* Entry Conditions */}
            <section>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
                <Percent className="w-4 h-4 text-blue-500" /> Technical Conditions
              </h3>
              
              {!strategy.conditions || strategy.conditions.length === 0 ? (
                <div className="text-center p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-sm text-slate-500">
                  No technical conditions defined for this strategy.
                </div>
              ) : (
                <div className="space-y-2">
                  {strategy.conditions.map((cond: any, i: number) => (
                    <div key={cond.id || i} className="flex items-center gap-3 bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1 flex flex-wrap items-center gap-2 text-sm">
                        <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{cond.indicator}</span>
                        <span className="font-medium text-slate-500">{cond.operator?.replace('_', ' ')}</span>
                        <span className="font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">{cond.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Metadata */}
            <section className="pt-4 border-t border-slate-100">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Created: {strategy.createdAt ? new Date(strategy.createdAt.toDate?.() || strategy.createdAt).toLocaleString() : 'Unknown'}</span>
                <span>User ID: {strategy.userId || 'Unknown'}</span>
              </div>
            </section>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
