'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, PlayCircle, StopCircle, Eye, Trash2, Download, PauseCircle, AlertTriangle
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

export function StrategiesManagementTab() {
  const [strategies, setStrategies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'strategies'), (snap) => {
      const fetched: any[] = [];
      snap.forEach(doc => {
        fetched.push({ id: doc.id, ...doc.data() });
      });
      setStrategies(fetched);
      setLoading(false);
    }, (error) => {
      console.error(error);
      toast.error('Failed to load strategies');
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = strategies.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleForceStop = async (id: string) => {
    if (!confirm('Are you sure you want to force stop this strategy?')) return;
    try {
      await updateDoc(doc(db, 'strategies', id), { status: 'Paused' });
      toast.success('Strategy stopped');
    } catch (e) {
      toast.error('Failed to stop strategy');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('DANGER: Delete this strategy permanently?')) return;
    try {
      await deleteDoc(doc(db, 'strategies', id));
      toast.success('Strategy deleted');
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  // Mock global stats since Firestore doesn't support easy global counts
  const stats = [
    { label: 'Total Strategies', value: strategies.length },
    { label: 'Live Strategies', value: strategies.filter(s => s.status === 'Live').length },
    { label: 'Paused', value: strategies.filter(s => s.status === 'Paused').length },
    { label: 'With Errors', value: strategies.filter(s => s.status === 'Error').length },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Strategies Management</h2>
          <p className="text-sm text-slate-500">Monitor and manage all strategies created on the platform</p>
        </div>
        <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" /> Export All
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-slate-800">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search strategies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Strategy Name</th>
                <th className="px-6 py-4">Instrument</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created At</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">No strategies found.</td></tr>
              ) : (
                <AnimatePresence>
                  {filtered.map(s => (
                    <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{s.name || 'Unnamed'}</div>
                        <div className="text-xs text-slate-500">ID: {s.id.slice(0, 8)}...</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-600">{s.instrument || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                          s.status === 'Live' ? 'bg-emerald-100 text-emerald-700' :
                          s.status === 'Paused' ? 'bg-orange-100 text-orange-700' :
                          s.status === 'Error' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                        }`}>{s.status || 'Draft'}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {s.createdAt ? new Date(s.createdAt.toDate?.() || s.createdAt).toLocaleDateString() : 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="View Details">
                            <Eye className="w-4 h-4" />
                          </button>
                          {s.status === 'Live' && (
                            <button onClick={() => handleForceStop(s.id)} className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg" title="Force Stop">
                              <StopCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button onClick={() => handleDelete(s.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
