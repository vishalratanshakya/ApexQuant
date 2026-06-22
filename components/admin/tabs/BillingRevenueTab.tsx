'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, TrendingUp, Users, ArrowUpRight, ArrowDownRight, 
  Download, Receipt, CreditCard, RefreshCw
} from 'lucide-react';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';

const TradingViewChart = dynamic(() => import('@/components/dashboard/TradingViewChart'), { ssr: false });

export function BillingRevenueTab() {
  const [isRefunding, setIsRefunding] = useState<string | null>(null);

  const stats = [
    { label: 'Total Revenue', value: '₹42.5L', change: '+15.2%', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100', trend: 'up' },
    { label: 'MRR', value: '₹12.5L', change: '+8.4%', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-100', trend: 'up' },
    { label: 'New Subs (30d)', value: '342', change: '+12.1%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100', trend: 'up' },
    { label: 'ARPU', value: '₹1,245', change: '-2.4%', icon: CreditCard, color: 'text-orange-600', bg: 'bg-orange-100', trend: 'down' },
  ];

  const mockRevenueData = [
    { time: '2023-01-01', value: 850000 },
    { time: '2023-02-01', value: 920000 },
    { time: '2023-03-01', value: 980000 },
    { time: '2023-04-01', value: 1050000 },
    { time: '2023-05-01', value: 1120000 },
    { time: '2023-06-01', value: 1250000 },
  ];

  const mockTransactions = [
    { id: 'TRX-10492', user: 'rahul@example.com', plan: 'Enterprise (Annual)', amount: '₹1,20,000', date: 'Oct 24, 2023', status: 'Paid' },
    { id: 'TRX-10491', user: 'amit@example.com', plan: 'Pro (Monthly)', amount: '₹1,499', date: 'Oct 23, 2023', status: 'Paid' },
    { id: 'TRX-10490', user: 'priya@example.com', plan: 'Pro (Monthly)', amount: '₹1,499', date: 'Oct 23, 2023', status: 'Failed' },
    { id: 'TRX-10489', user: 'neha@example.com', plan: 'Enterprise (Monthly)', amount: '₹9,999', date: 'Oct 22, 2023', status: 'Refunded' },
    { id: 'TRX-10488', user: 'vikram@example.com', plan: 'Pro (Annual)', amount: '₹14,990', date: 'Oct 21, 2023', status: 'Paid' },
  ];

  const handleRefund = (id: string) => {
    if (!confirm('Are you sure you want to issue a full refund for this transaction?')) return;
    setIsRefunding(id);
    setTimeout(() => {
      toast.success(`Refund processed for ${id}`);
      setIsRefunding(null);
    }, 1500);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Billing & Revenue</h2>
          <p className="text-sm text-slate-500">Platform financial performance and subscription management</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold shadow-sm outline-none">
            <option>This Month</option>
            <option>Last Quarter</option>
            <option>Year to Date</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.bg}`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${s.trend === 'up' ? 'bg-success/10 text-success' : 'bg-red-100 text-red-600'}`}>
                {s.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {s.change}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-slate-800">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Revenue Trend (₹)</h3>
        <div className="h-[350px] w-full">
          <TradingViewChart data={mockRevenueData} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Recent Transactions</h3>
          <button className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockTransactions.map(t => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-sm text-slate-600 font-medium">{t.id}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800">{t.user}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{t.plan}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800">{t.amount}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{t.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                      t.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                      t.status === 'Refunded' ? 'bg-slate-100 text-slate-600' : 'bg-red-100 text-red-700'
                    }`}>{t.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="View Invoice">
                        <Receipt className="w-4 h-4" />
                      </button>
                      {t.status === 'Paid' && (
                        <button 
                          onClick={() => handleRefund(t.id)} 
                          disabled={isRefunding === t.id}
                          className="px-3 py-1.5 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg flex items-center gap-1 disabled:opacity-50"
                        >
                          {isRefunding === t.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : 'Refund'}
                        </button>
                      )}
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
