'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, PlayCircle, PauseCircle, StopCircle, Eye, Activity, AlertTriangle
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

export function LiveDeploymentsTab() {
  const [deployments, setDeployments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pnlUpdates, setPnlUpdates] = useState<Record<string, number>>({});

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'deployments'), (snap) => {
      const fetched: any[] = [];
      snap.forEach(doc => {
        fetched.push({ id: doc.id, ...doc.data() });
      });
      setDeployments(fetched);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Mock real-time P&L updates
  useEffect(() => {
    if (deployments.length === 0) return;
    const interval = setInterval(() => {
      setPnlUpdates(prev => {
        const next = { ...prev };
        deployments.forEach(d => {
          if (d.status === 'Running') {
            const currentPnl = next[d.id] || (Math.random() * 2000 - 500); // initial random PnL
            const change = (Math.random() * 200 - 100);
            next[d.id] = currentPnl + change;
          }
        });
        return next;
      });
    }, 2000); // tick every 2s
    return () => clearInterval(interval);
  }, [deployments]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'deployments', id), { status });
      toast.success(`Status updated to ${status}`);
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  const activeDeployments = deployments.filter(d => d.status === 'Running');
  const totalPnl = activeDeployments.reduce((sum, d) => sum + (pnlUpdates[d.id] || 0), 0);

  const stats = [
    { label: 'Total Live', value: activeDeployments.length, color: 'text-emerald-600' },
    { label: 'Total P&L Today', value: `₹${totalPnl.toFixed(2)}`, color: totalPnl >= 0 ? 'text-success' : 'text-red-500' },
    { label: 'In Profit', value: activeDeployments.filter(d => (pnlUpdates[d.id] || 0) > 0).length, color: 'text-emerald-600' },
    { label: 'In Loss / Error', value: activeDeployments.filter(d => (pnlUpdates[d.id] || 0) <= 0).length, color: 'text-red-500' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-500" /> Live Deployments
          </h2>
          <p className="text-sm text-slate-500">Real-time control center for active algorithmic trading</p>
        </div>
        <button className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-bold hover:bg-orange-200 transition-colors flex items-center gap-2">
          <PauseCircle className="w-4 h-4" /> Pause All
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Activity className="w-16 h-16" />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 relative z-10">{s.label}</p>
            <p className={`text-2xl font-bold relative z-10 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Deployment</th>
                <th className="px-6 py-4">Instrument</th>
                <th className="px-6 py-4">Current P&L</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">Loading live data...</td></tr>
              ) : deployments.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">No live deployments found.</td></tr>
              ) : (
                <AnimatePresence>
                  {deployments.map(d => {
                    const pnl = pnlUpdates[d.id] || 0;
                    return (
                      <motion.tr key={d.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800">{d.strategyName || 'Deployment ' + d.id.slice(0,4)}</div>
                          <div className="text-xs text-slate-500">Started: {d.createdAt ? new Date(d.createdAt.toDate?.() || d.createdAt).toLocaleTimeString() : 'Recently'}</div>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-600">{d.broker?.instrument || 'NIFTY'}</td>
                        <td className="px-6 py-4">
                          {d.status === 'Running' ? (
                            <motion.div 
                              key={pnl} // forces re-animation on value change
                              initial={{ opacity: 0.5, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className={`text-sm font-bold px-3 py-1 rounded-full w-max ${pnl >= 0 ? 'bg-success/10 text-success' : 'bg-red-100 text-red-600'}`}
                            >
                              {pnl >= 0 ? '+' : ''}₹{pnl.toFixed(2)}
                            </motion.div>
                          ) : (
                            <span className="text-sm font-bold text-slate-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-full flex items-center gap-1.5 w-max ${
                            d.status === 'Running' ? 'bg-emerald-100 text-emerald-700' :
                            d.status === 'Error' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {d.status === 'Running' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>}
                            {d.status || 'Paused'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            {d.status === 'Running' ? (
                              <button onClick={() => updateStatus(d.id, 'Paused')} className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg" title="Pause">
                                <PauseCircle className="w-4 h-4" />
                              </button>
                            ) : (
                              <button onClick={() => updateStatus(d.id, 'Running')} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg" title="Restart">
                                <PlayCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button onClick={() => updateStatus(d.id, 'Stopped')} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Force Stop">
                              <StopCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
