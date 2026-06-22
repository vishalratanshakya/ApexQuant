import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, CheckCircle, Save, Settings, Target, Percent } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

interface Condition {
  id: string;
  indicator: string;
  operator: string;
  value: string;
}

export function AddTemplateModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  // Basic Info
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Intraday');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [shortDesc, setShortDesc] = useState('');
  const [detailedDesc, setDetailedDesc] = useState('');

  // Strategy Config
  const [instruments, setInstruments] = useState<string[]>([]);
  const availableInstruments = ['NIFTY50', 'BANKNIFTY', 'FINNIFTY', 'Stocks'];
  const [timeframe, setTimeframe] = useState('5m');
  const [tradingType, setTradingType] = useState('Long Only');

  // Conditions
  const [entryConditions, setEntryConditions] = useState<Condition[]>([]);
  const [exitConditions, setExitConditions] = useState<Condition[]>([]);
  
  // Performance & Meta
  const [winRate, setWinRate] = useState('');
  const [profitFactor, setProfitFactor] = useState('');
  const [riskLevel, setRiskLevel] = useState('Medium');
  const [tags, setTags] = useState('');

  const handleAddCondition = (type: 'entry' | 'exit') => {
    const newCondition = { id: Date.now().toString(), indicator: 'RSI', operator: '>', value: '' };
    if (type === 'entry') setEntryConditions([...entryConditions, newCondition]);
    else setExitConditions([...exitConditions, newCondition]);
  };

  const handleUpdateCondition = (type: 'entry' | 'exit', id: string, field: string, val: string) => {
    const list = type === 'entry' ? entryConditions : exitConditions;
    const newList = list.map(c => c.id === id ? { ...c, [field]: val } : c);
    if (type === 'entry') setEntryConditions(newList);
    else setExitConditions(newList);
  };

  const handleRemoveCondition = (type: 'entry' | 'exit', id: string) => {
    if (type === 'entry') setEntryConditions(entryConditions.filter(c => c.id !== id));
    else setExitConditions(exitConditions.filter(c => c.id !== id));
  };

  const toggleInstrument = (inst: string) => {
    if (instruments.includes(inst)) {
      setInstruments(instruments.filter(i => i !== inst));
    } else {
      setInstruments([...instruments, inst]);
    }
  };

  const validate = () => {
    if (!name.trim()) return 'Template Name is required';
    if (!shortDesc.trim()) return 'Short Description is required';
    if (instruments.length === 0) return 'Select at least one instrument';
    return null;
  };

  const handleSave = async (status: 'Active' | 'Draft') => {
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    const templateData = {
      name,
      category,
      difficulty,
      description: shortDesc,
      detailedDescription: detailedDesc,
      instruments,
      timeframe,
      tradingType,
      entryConditions,
      exitConditions,
      winRate: winRate || '0%',
      profitFactor: profitFactor || '1.0',
      riskLevel,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      status,
      users: 0,
      createdAt: new Date(),
    };

    const promise = setDoc(doc(collection(db, 'templates')), templateData);

    toast.promise(promise, {
      loading: status === 'Draft' ? 'Saving draft...' : 'Publishing template...',
      success: status === 'Draft' ? 'Draft saved successfully!' : 'Template published globally!',
      error: 'Failed to save template',
    });

    try {
      await promise;
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex justify-center items-start overflow-y-auto py-10 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.95 }} 
          animate={{ opacity: 1, y: 0, scale: 1 }} 
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-slate-50 rounded-2xl shadow-2xl w-full max-w-4xl relative overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 z-10 shadow-sm">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Add New Template</h2>
              <p className="text-sm text-slate-500">Configure a new strategy template for the public library.</p>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            
            {/* Basic Info */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" /> Basic Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Template Name *</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. NIFTY Scalper Pro" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category *</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer">
                    <option>Intraday</option>
                    <option>Options Strategies</option>
                    <option>Swing Trading</option>
                    <option>Momentum</option>
                    <option>Mean Reversion</option>
                    <option>Scalping</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Difficulty Level *</label>
                  <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer">
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Short Description *</label>
                  <input type="text" value={shortDesc} onChange={e => setShortDesc(e.target.value)} placeholder="One liner about the strategy..." className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Detailed Description</label>
                <textarea value={detailedDesc} onChange={e => setDetailedDesc(e.target.value)} rows={3} placeholder="Explain the strategy thesis in detail..." className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"></textarea>
              </div>
            </section>

            {/* Strategy Configuration */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" /> Strategy Configuration
              </h3>
              
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Supported Instruments *</label>
                <div className="flex flex-wrap gap-2">
                  {availableInstruments.map(inst => (
                    <button 
                      key={inst} 
                      onClick={() => toggleInstrument(inst)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-colors ${
                        instruments.includes(inst) 
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {inst}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Timeframe</label>
                  <select value={timeframe} onChange={e => setTimeframe(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer">
                    <option>1m</option><option>5m</option><option>15m</option><option>30m</option><option>1H</option><option>Daily</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Trading Type</label>
                  <select value={tradingType} onChange={e => setTradingType(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer">
                    <option>Long Only</option><option>Short Only</option><option>Long & Short</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Conditions Builder */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Percent className="w-5 h-5 text-emerald-600" /> Entry & Exit Conditions
              </h3>

              {/* Entry Conditions */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-slate-700">Entry Conditions</h4>
                  <button onClick={() => handleAddCondition('entry')} className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md">
                    <Plus className="w-3 h-3" /> Add Condition
                  </button>
                </div>
                
                {entryConditions.length === 0 ? (
                  <div className="text-center p-4 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-sm text-slate-500">
                    No entry conditions defined.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {entryConditions.map((cond, index) => (
                      <div key={cond.id} className="flex flex-col sm:flex-row gap-2 items-center bg-slate-50 p-2 rounded-lg border border-slate-200">
                        <span className="text-xs font-bold text-slate-400 w-6 text-center">{index + 1}.</span>
                        <select value={cond.indicator} onChange={e => handleUpdateCondition('entry', cond.id, 'indicator', e.target.value)} className="w-full sm:w-1/3 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm outline-none">
                          <option>RSI</option><option>EMA</option><option>MACD</option><option>VWAP</option><option>Supertrend</option>
                        </select>
                        <select value={cond.operator} onChange={e => handleUpdateCondition('entry', cond.id, 'operator', e.target.value)} className="w-full sm:w-1/4 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm outline-none">
                          <option value=">">Greater Than</option><option value="<">Less Than</option><option value="cross_above">Crosses Above</option><option value="cross_below">Crosses Below</option>
                        </select>
                        <input type="text" value={cond.value} onChange={e => handleUpdateCondition('entry', cond.id, 'value', e.target.value)} placeholder="Value (e.g. 60)" className="w-full sm:flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm outline-none" />
                        <button onClick={() => handleRemoveCondition('entry', cond.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Exit Conditions */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-slate-700">Exit Conditions</h4>
                  <button onClick={() => handleAddCondition('exit')} className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md">
                    <Plus className="w-3 h-3" /> Add Condition
                  </button>
                </div>
                
                {exitConditions.length === 0 ? (
                  <div className="text-center p-4 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-sm text-slate-500">
                    No exit conditions defined.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {exitConditions.map((cond, index) => (
                      <div key={cond.id} className="flex flex-col sm:flex-row gap-2 items-center bg-slate-50 p-2 rounded-lg border border-slate-200">
                        <span className="text-xs font-bold text-slate-400 w-6 text-center">{index + 1}.</span>
                        <select value={cond.indicator} onChange={e => handleUpdateCondition('exit', cond.id, 'indicator', e.target.value)} className="w-full sm:w-1/3 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm outline-none">
                          <option>RSI</option><option>EMA</option><option>MACD</option><option>VWAP</option><option>Price</option>
                        </select>
                        <select value={cond.operator} onChange={e => handleUpdateCondition('exit', cond.id, 'operator', e.target.value)} className="w-full sm:w-1/4 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm outline-none">
                          <option value=">">Greater Than</option><option value="<">Less Than</option><option value="cross_above">Crosses Above</option><option value="cross_below">Crosses Below</option>
                        </select>
                        <input type="text" value={cond.value} onChange={e => handleUpdateCondition('exit', cond.id, 'value', e.target.value)} placeholder="Value (e.g. 40)" className="w-full sm:flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm outline-none" />
                        <button onClick={() => handleRemoveCondition('exit', cond.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Performance Metadata */}
            <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Performance & Metadata</h3>
              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Expected Win Rate</label>
                  <input type="text" value={winRate} onChange={e => setWinRate(e.target.value)} placeholder="e.g. 65%" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Profit Factor</label>
                  <input type="text" value={profitFactor} onChange={e => setProfitFactor(e.target.value)} placeholder="e.g. 1.8" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Risk Level</label>
                  <select value={riskLevel} onChange={e => setRiskLevel(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer">
                    <option>Low</option><option>Medium</option><option>High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tags (Comma Separated)</label>
                <input type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="nifty, options, high-probability..." className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" />
              </div>
            </section>
          </div>

          {/* Footer Actions */}
          <div className="bg-white px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 sticky bottom-0">
            <button onClick={onClose} className="px-5 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors">
              Cancel
            </button>
            <button onClick={() => handleSave('Draft')} className="px-5 py-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-2">
              <Save className="w-4 h-4" /> Save as Draft
            </button>
            <button onClick={() => handleSave('Active')} className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md rounded-lg transition-colors flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Publish Template
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
