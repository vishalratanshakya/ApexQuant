'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, Eye, Copy, Trash2, Library, Zap, Edit
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, deleteDoc, updateDoc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

export function TemplatesTab() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Intraday', 'Options', 'Swing', 'Momentum', 'Mean Reversion'];

  useEffect(() => {
    // In a real app, you might have a specific global templates collection.
    // We'll use the 'templates' collection defined in your rules.
    const unsub = onSnapshot(collection(db, 'templates'), (snap) => {
      const fetched: any[] = [];
      snap.forEach(doc => {
        fetched.push({ id: doc.id, ...doc.data() });
      });
      // Add some realistic mocks if the collection is empty
      if (fetched.length === 0) {
        fetched.push(
          { id: 'mock1', name: 'Nifty ORB Master', category: 'Intraday', instruments: ['NIFTY'], description: 'Opening range breakout strategy optimized for Nifty 50.', winRate: '68%', users: 1245, status: 'Active' },
          { id: 'mock2', name: 'BankNifty Straddle', category: 'Options', instruments: ['BANKNIFTY'], description: 'Short straddle with dynamic stop loss adjustments.', winRate: '72%', users: 890, status: 'Active' },
          { id: 'mock3', name: 'Reliance Swing', category: 'Swing', instruments: ['RELIANCE'], description: 'Moving average crossover swing strategy.', winRate: '55%', users: 432, status: 'Draft' }
        );
      }
      setTemplates(fetched);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = templates.filter(t => {
    const matchesSearch = t.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateMock = async () => {
    const id = `template-${Date.now()}`;
    const newTemplate = {
      name: 'New Momentum Strategy',
      category: 'Momentum',
      instruments: ['NIFTY', 'BANKNIFTY'],
      description: 'A newly created template draft.',
      winRate: '0%',
      users: 0,
      status: 'Draft',
      createdAt: new Date()
    };
    try {
      await setDoc(doc(db, 'templates', id), newTemplate);
      toast.success('Template created successfully');
    } catch (e) {
      toast.error('Failed to create template');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    if (id.startsWith('mock')) return toast.success(`Status changed to ${currentStatus === 'Active' ? 'Draft' : 'Active'}`);
    try {
      await updateDoc(doc(db, 'templates', id), { status: currentStatus === 'Active' ? 'Draft' : 'Active' });
      toast.success('Template status updated');
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    if (id.startsWith('mock')) {
      setTemplates(prev => prev.filter(t => t.id !== id));
      return toast.success('Template deleted');
    }
    try {
      await deleteDoc(doc(db, 'templates', id));
      toast.success('Template deleted');
    } catch (e) {
      toast.error('Failed to delete template');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Strategy Templates</h2>
          <p className="text-sm text-slate-500">Manage public templates available to all users</p>
        </div>
        <button onClick={handleCreateMock} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add New Template
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto hide-scrollbar">
          {categories.map(c => (
            <button 
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-4 py-2 text-sm font-bold rounded-lg whitespace-nowrap transition-colors ${
                activeCategory === c ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {filtered.map(t => (
            <motion.div 
              key={t.id} 
              layout
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all"
            >
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    t.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <Library className="w-6 h-6" />
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                    t.status === 'Active' ? 'bg-success/10 text-success' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {t.status}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-800 mb-1">{t.name}</h3>
                <p className="text-sm font-medium text-blue-600 mb-3">{t.category}</p>
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">{t.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {t.instruments?.map((inst: string) => (
                    <span key={inst} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider">
                      {inst}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Win Rate</p>
                    <p className="text-sm font-bold text-slate-800">{t.winRate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Active Users</p>
                    <p className="text-sm font-bold text-slate-800 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-orange-500" /> {t.users}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-blue-600 bg-white rounded-lg border border-slate-200 shadow-sm transition-colors" title="Preview">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-indigo-600 bg-white rounded-lg border border-slate-200 shadow-sm transition-colors" title="Duplicate">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleToggleStatus(t.id, t.status)} className={`p-2 bg-white rounded-lg border border-slate-200 shadow-sm transition-colors ${t.status === 'Active' ? 'text-orange-500 hover:bg-orange-50' : 'text-emerald-500 hover:bg-emerald-50'}`} title={t.status === 'Active' ? 'Deactivate' : 'Activate'}>
                    <Zap className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-blue-600 bg-white rounded-lg border border-slate-200 shadow-sm transition-colors" title="Edit">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="p-2 text-slate-400 hover:text-red-600 bg-white rounded-lg border border-slate-200 shadow-sm transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {filtered.length === 0 && !loading && (
        <div className="text-center py-12">
          <Library className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700">No templates found</h3>
          <p className="text-slate-500">Try adjusting your filters or create a new template.</p>
        </div>
      )}
    </motion.div>
  );
}
