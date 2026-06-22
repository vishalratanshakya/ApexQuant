import React from 'react';
import { CreditCard, ArrowUpRight, ArrowDownRight, Download, DollarSign } from 'lucide-react';

const TRANSACTIONS = [
  { id: 'txn-9281', user: 'John Doe', plan: 'Elite Annual', amount: '₹14,999', date: 'Oct 15, 2023', status: 'Completed' },
  { id: 'txn-9280', user: 'Sarah Williams', plan: 'Pro Monthly', amount: '₹1,499', date: 'Oct 14, 2023', status: 'Completed' },
  { id: 'txn-9279', user: 'Mike Johnson', plan: 'Pro Annual', amount: '₹12,999', date: 'Oct 14, 2023', status: 'Failed' },
  { id: 'txn-9278', user: 'Alex Brown', plan: 'Elite Monthly', amount: '₹2,499', date: 'Oct 12, 2023', status: 'Completed' },
  { id: 'txn-9277', user: 'Jane Smith', plan: 'Pro Monthly', amount: '₹1,499', date: 'Oct 10, 2023', status: 'Completed' },
];

export function BillingTab() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pt-6">
      
      {/* Revenue Metrics */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl border border-border bg-white shadow-sm overflow-hidden p-6 relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <DollarSign className="w-24 h-24 text-success" />
          </div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 relative z-10">Monthly Recurring Revenue</p>
          <div className="flex items-end gap-4 relative z-10">
            <h3 className="text-3xl font-bold text-slate-800">₹4.2M</h3>
            <span className="flex items-center text-sm font-bold text-success mb-1">
              <ArrowUpRight className="w-4 h-4" /> 12%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 relative z-10">vs last month (₹3.7M)</p>
        </div>
        
        <div className="glass-card rounded-2xl border border-border bg-white shadow-sm overflow-hidden p-6 relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <CreditCard className="w-24 h-24 text-indigo-500" />
          </div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 relative z-10">Average Revenue Per User</p>
          <div className="flex items-end gap-4 relative z-10">
            <h3 className="text-3xl font-bold text-slate-800">₹1,240</h3>
            <span className="flex items-center text-sm font-bold text-success mb-1">
              <ArrowUpRight className="w-4 h-4" /> 5%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 relative z-10">Target ARPU: ₹1,500</p>
        </div>
        
        <div className="glass-card rounded-2xl border border-border bg-white shadow-sm overflow-hidden p-6 relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ArrowDownRight className="w-24 h-24 text-loss" />
          </div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 relative z-10">Churn Rate</p>
          <div className="flex items-end gap-4 relative z-10">
            <h3 className="text-3xl font-bold text-slate-800">2.4%</h3>
            <span className="flex items-center text-sm font-bold text-success mb-1">
              <ArrowDownRight className="w-4 h-4" /> -0.5%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 relative z-10">Below industry average (4%)</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Recent Transactions */}
        <div className="lg:col-span-2 glass-card rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-slate-50/50">
            <h2 className="text-base font-bold text-text">Recent Transactions</h2>
            <button className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              View Ledger <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-border">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Transaction ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {TRANSACTIONS.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-500 font-mono">{txn.id}</span>
                      <p className="text-xs text-slate-400">{txn.date}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-700">{txn.user}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider bg-slate-100 text-slate-600">
                        {txn.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-800">{txn.amount}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md w-max uppercase tracking-wider ${
                        txn.status === 'Completed' ? 'bg-success/10 text-success' : 'bg-loss/10 text-loss'
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors tooltip" data-tip="Download Invoice">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Subscription Breakdown */}
        <div className="glass-card rounded-2xl border border-border bg-white shadow-sm overflow-hidden p-6 flex flex-col">
          <h2 className="text-base font-bold text-text mb-6">Revenue by Plan</h2>
          
          <div className="flex-1 flex flex-col justify-center">
            {/* Mock donut chart visualization */}
            <div className="relative w-48 h-48 mx-auto mb-8">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e2e8f0" strokeWidth="20" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#8b5cf6" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="50.24" className="transition-all duration-1000" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="175.84" className="transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold text-slate-800">₹4.2M</span>
                <span className="text-xs font-semibold text-slate-400 uppercase">Total MRR</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                  <span className="text-sm font-semibold text-slate-600">Elite Plan</span>
                </div>
                <span className="text-sm font-bold text-slate-800">₹2.8M</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  <span className="text-sm font-semibold text-slate-600">Pro Plan</span>
                </div>
                <span className="text-sm font-bold text-slate-800">₹1.4M</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
