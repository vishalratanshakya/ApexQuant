'use client';

import { Target, Search, Phone, Mail, UserPlus } from 'lucide-react';

export default function CRMLeadsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text font-display mb-1 flex items-center gap-2">
            <Target className="w-6 h-6 text-orange-500" /> Lead Management
          </h1>
          <p className="text-sm text-slate-500">Track and convert potential users into active subscribers.</p>
        </div>
        <button className="btn-primary px-4 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> Add Lead
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex gap-2">
              {['All', 'New', 'Contacted', 'Converted'].map((tab, i) => (
                <button key={tab} className={`px-4 py-1.5 rounded-lg text-sm font-semibold ${i === 0 ? 'bg-orange-500/10 text-orange-600' : 'text-slate-500 hover:bg-slate-50'}`}>
                  {tab}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search leads..." className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-orange-500" />
            </div>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-border">
              <tr>
                <th className="px-6 py-3 font-semibold text-slate-500 uppercase text-[10px] tracking-wider">Lead Info</th>
                <th className="px-6 py-3 font-semibold text-slate-500 uppercase text-[10px] tracking-wider">Source</th>
                <th className="px-6 py-3 font-semibold text-slate-500 uppercase text-[10px] tracking-wider">Status</th>
                <th className="px-6 py-3 font-semibold text-slate-500 uppercase text-[10px] tracking-wider">Added On</th>
                <th className="px-6 py-3 font-semibold text-slate-500 uppercase text-[10px] tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[...Array(6)].map((_, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <p className="font-bold text-text">Potential Client {i}</p>
                    <p className="text-xs text-slate-500">client{i}@business.com</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600">Organic Search</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${i % 3 === 0 ? 'bg-orange-500/10 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                      {i % 3 === 0 ? 'New' : 'Contacted'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">Oct 16, 2023</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button className="p-1.5 rounded bg-slate-100 text-slate-500 hover:text-primary"><Mail className="w-4 h-4" /></button>
                    <button className="p-1.5 rounded bg-slate-100 text-slate-500 hover:text-success"><Phone className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-border shadow-sm p-5">
            <h3 className="font-bold text-text mb-4">Pipeline Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">New Leads</span>
                <span className="font-bold text-text">42</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Contacted</span>
                <span className="font-bold text-text">18</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Converted</span>
                <span className="font-bold text-success">12</span>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between text-sm">
                <span className="text-slate-500">Conversion Rate</span>
                <span className="font-bold text-primary">16.6%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
