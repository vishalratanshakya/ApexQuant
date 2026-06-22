'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, PieChart, LineChart, Download, Calendar, 
  FileText, RefreshCw, Eye, Trash2, Activity
} from 'lucide-react';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';

const TradingViewChart = dynamic(() => import('@/components/dashboard/TradingViewChart'), { ssr: false });

export function ReportsTab() {
  const [generating, setGenerating] = useState(false);

  const mockGrowthData = [
    { time: '2023-01-01', value: 1200 },
    { time: '2023-02-01', value: 1500 },
    { time: '2023-03-01', value: 1850 },
    { time: '2023-04-01', value: 2400 },
    { time: '2023-05-01', value: 3100 },
    { time: '2023-06-01', value: 4285 },
  ];

  const reports = [
    { id: 'rep-001', name: 'Q2 Financial Summary', date: 'Jul 01, 2023', type: 'Revenue', size: '2.4 MB' },
    { id: 'rep-002', name: 'User Churn Analysis', date: 'Jun 15, 2023', type: 'Users', size: '1.1 MB' },
    { id: 'rep-003', name: 'Live Strategy Performance', date: 'Jun 01, 2023', type: 'Strategies', size: '4.8 MB' },
    { id: 'rep-004', name: 'System Error Log Export', date: 'May 30, 2023', type: 'System', size: '8.2 MB' },
  ];

  const handleGenerate = () => {
    setGenerating(true);
    toast.loading('Generating comprehensive report...', { id: 'gen' });
    setTimeout(() => {
      toast.success('Report generated successfully!', { id: 'gen' });
      setGenerating(false);
    }, 2500);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Reports & Analytics</h2>
          <p className="text-sm text-slate-500">Export detailed platform reports and business intelligence</p>
        </div>
        <div className="flex gap-3">
          <select className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold shadow-sm outline-none">
            <option>Last 30 Days</option>
            <option>Last Quarter</option>
            <option>Year to Date</option>
            <option>All Time</option>
          </select>
          <button 
            onClick={handleGenerate} disabled={generating}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <BarChart className="w-4 h-4" />}
            Generate New Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'User Acquisition', icon: PieChart, color: 'text-blue-500', desc: 'Signups & Onboarding' },
          { label: 'Revenue Report', icon: BarChart, color: 'text-emerald-500', desc: 'MRR & Subscriptions' },
          { label: 'Strategy Usage', icon: LineChart, color: 'text-indigo-500', desc: 'Deployments & Win Rates' },
          { label: 'System Health', icon: Activity, color: 'text-orange-500', desc: 'Latency & Error Rates' },
        ].map((card, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-50 mb-4 group-hover:bg-blue-50 transition-colors">
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <h3 className="font-bold text-slate-800 mb-1">{card.label}</h3>
            <p className="text-xs text-slate-500">{card.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Platform Growth (Users)</h3>
        <div className="h-[350px] w-full">
          <TradingViewChart data={mockGrowthData} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-500" /> Available Reports
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Report Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Generated On</th>
                <th className="px-6 py-4">Size</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map(r => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-bold text-slate-800">{r.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                      r.type === 'Revenue' ? 'bg-emerald-100 text-emerald-700' :
                      r.type === 'Users' ? 'bg-blue-100 text-blue-700' :
                      r.type === 'Strategies' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                    }`}>{r.type}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 flex items-center gap-1.5 mt-1"><Calendar className="w-3.5 h-3.5" /> {r.date}</td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-500">{r.size}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="View"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => toast.success('Downloading report...')} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg" title="Download"><Download className="w-4 h-4" /></button>
                      <button onClick={() => toast.success('Report deleted')} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
