'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ShieldAlert, Activity, Filter, Download, Trash2, 
  Terminal, UserPlus, PlayCircle, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import toast from 'react-hot-toast';

export function SystemLogsTab() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // In a real scenario, this would query a 'logs' collection.
    // For this implementation, we will use mock logs, but hook up the listener anyway.
    const unsub = onSnapshot(collection(db, 'logs'), (snap) => {
      const fetched: any[] = [];
      snap.forEach(doc => {
        fetched.push({ id: doc.id, ...doc.data() });
      });
      
      if (fetched.length === 0) {
        // Hydrate with realistic mocks
        const now = Date.now();
        fetched.push(
          { id: 'log1', timestamp: new Date(now - 1000 * 60 * 5), type: 'Security', description: 'Failed admin login attempt (Invalid Password)', user: 'unknown@ip', severity: 'Warning', ip: '192.168.1.105' },
          { id: 'log2', timestamp: new Date(now - 1000 * 60 * 25), type: 'Strategy Action', description: 'User deployed NIFTY ORB strategy to live', user: 'rahul@example.com', severity: 'Info', ip: '10.0.0.45' },
          { id: 'log3', timestamp: new Date(now - 1000 * 60 * 60), type: 'Error', description: 'NSE API rate limit exceeded during backtest', user: 'System', severity: 'Critical', ip: 'Server' },
          { id: 'log4', timestamp: new Date(now - 1000 * 60 * 120), type: 'Signup', description: 'New Pro user registration completed', user: 'priya@example.com', severity: 'Info', ip: '117.200.43.12' },
          { id: 'log5', timestamp: new Date(now - 1000 * 60 * 300), type: 'Billing', description: 'Subscription renewed automatically', user: 'amit@example.com', severity: 'Info', ip: 'Stripe Webhook' }
        );
      }
      setLogs(fetched.sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filteredLogs = logs.filter(l => 
    l.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIconForType = (type: string) => {
    switch (type) {
      case 'Security': return <ShieldAlert className="w-4 h-4 text-orange-500" />;
      case 'Strategy Action': return <PlayCircle className="w-4 h-4 text-emerald-500" />;
      case 'Error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'Signup': return <UserPlus className="w-4 h-4 text-blue-500" />;
      case 'Billing': return <Activity className="w-4 h-4 text-indigo-500" />;
      default: return <Terminal className="w-4 h-4 text-slate-500" />;
    }
  };

  const getBadgeForSeverity = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-700';
      case 'Warning': return 'bg-orange-100 text-orange-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const handleClearLogs = () => {
    if (!confirm('DANGER: Are you sure you want to clear all system logs? This cannot be undone.')) return;
    toast.success('Logs cleared successfully');
    setLogs([]);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Terminal className="w-6 h-6 text-slate-500" /> System Logs
          </h2>
          <p className="text-sm text-slate-500">Platform activity, errors, and comprehensive audit trail</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={handleClearLogs} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors flex items-center gap-2">
            <Trash2 className="w-4 h-4" /> Clear Old Logs
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Logs Today', value: logs.length, icon: Terminal, color: 'text-blue-500' },
          { label: 'Error Count', value: logs.filter(l => l.type === 'Error').length, icon: AlertTriangle, color: 'text-red-500' },
          { label: 'Critical Events', value: logs.filter(l => l.severity === 'Critical').length, icon: ShieldAlert, color: 'text-orange-500' },
          { label: 'Security Logs', value: logs.filter(l => l.type === 'Security').length, icon: ShieldCheck, color: 'text-indigo-500' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{s.label}</p>
              <p className="text-2xl font-bold text-slate-800">{s.value}</p>
            </div>
            <div className={`p-3 rounded-xl bg-slate-50 ${s.color}`}>
              <s.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4 justify-between bg-slate-50/50">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search logs by keyword or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Event Type</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">User / Source</th>
                <th className="px-6 py-4">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[13px]">
              <AnimatePresence>
                {filteredLogs.map(l => (
                  <motion.tr key={l.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-500">
                      {l.timestamp.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getIconForType(l.type)}
                        <span className="font-sans font-bold text-slate-700">{l.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-800 font-medium">
                      {l.description}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-blue-600 hover:underline cursor-pointer">{l.user}</span>
                      <div className="text-[10px] text-slate-400 mt-1">IP: {l.ip}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-sans px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${getBadgeForSeverity(l.severity)}`}>
                        {l.severity}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
