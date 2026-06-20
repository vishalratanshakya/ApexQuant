'use client';

import { CreditCard, Download, Search } from 'lucide-react';

export default function CRMBillingPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-text font-display mb-1 flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-slate-500" /> Billing & Subscriptions
        </h1>
        <p className="text-sm text-slate-500">Manage payment gateways, plans, and revenue analytics.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-border shadow-sm p-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">MRR (Monthly Rec. Rev)</p>
          <p className="text-3xl font-bold text-text">₹8.4L</p>
          <p className="text-sm text-success font-medium mt-1">+14% vs last month</p>
        </div>
        <div className="bg-white rounded-xl border border-border shadow-sm p-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Active Subscribers</p>
          <p className="text-3xl font-bold text-text">1,240</p>
          <p className="text-sm text-success font-medium mt-1">+85 new this month</p>
        </div>
        <div className="bg-white rounded-xl border border-border shadow-sm p-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Churn Rate</p>
          <p className="text-3xl font-bold text-text">2.4%</p>
          <p className="text-sm text-success font-medium mt-1">Healthy</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-bold text-text">Recent Transactions</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search invoices..." className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary" />
          </div>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-border">
            <tr>
              <th className="px-6 py-3 font-semibold text-slate-500 uppercase text-[10px] tracking-wider">Invoice ID</th>
              <th className="px-6 py-3 font-semibold text-slate-500 uppercase text-[10px] tracking-wider">User</th>
              <th className="px-6 py-3 font-semibold text-slate-500 uppercase text-[10px] tracking-wider">Plan</th>
              <th className="px-6 py-3 font-semibold text-slate-500 uppercase text-[10px] tracking-wider">Amount</th>
              <th className="px-6 py-3 font-semibold text-slate-500 uppercase text-[10px] tracking-wider">Date</th>
              <th className="px-6 py-3 font-semibold text-slate-500 uppercase text-[10px] tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[...Array(6)].map((_, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-mono text-xs">INV-{1000 + i}</td>
                <td className="px-6 py-4 font-medium text-text">trader{i}@example.com</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${i % 2 === 0 ? 'bg-accent/10 text-accent' : 'bg-slate-100 text-slate-600'}`}>
                    {i % 2 === 0 ? 'Pro Plan' : 'Free Plan'}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-text">₹{i % 2 === 0 ? '1,999' : '0'}</td>
                <td className="px-6 py-4 text-slate-500">Oct 14, 2023</td>
                <td className="px-6 py-4">
                  <button className="p-1.5 rounded bg-slate-100 text-slate-500 hover:text-primary transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
