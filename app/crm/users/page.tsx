'use client';

import { Search, Filter, MoreVertical, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function CRMUsersPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text font-display mb-1">Users Management</h1>
          <p className="text-sm text-slate-500">Manage all registered accounts, their plans, and statuses.</p>
        </div>
        <button className="btn-primary px-4 py-2 rounded-xl text-sm font-semibold text-white">
          + Add User
        </button>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search by email, ID, or name..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary" />
          </div>
          <button className="btn-secondary px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-500 uppercase text-[10px] tracking-wider">User</th>
                <th className="px-6 py-4 font-semibold text-slate-500 uppercase text-[10px] tracking-wider">Plan</th>
                <th className="px-6 py-4 font-semibold text-slate-500 uppercase text-[10px] tracking-wider">Status</th>
                <th className="px-6 py-4 font-semibold text-slate-500 uppercase text-[10px] tracking-wider">Joined Date</th>
                <th className="px-6 py-4 font-semibold text-slate-500 uppercase text-[10px] tracking-wider">Live Strategies</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {[...Array(8)].map((_, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                      U{i}
                    </div>
                    <div>
                      <Link href={`/crm/users/${i}`} className="font-bold text-text hover:text-primary transition-colors">
                        trader{i}@example.com
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${i % 2 === 0 ? 'bg-accent/10 text-accent' : 'bg-slate-100 text-slate-600'}`}>
                      {i % 2 === 0 ? 'Pro' : 'Free'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-success/10 text-success text-[10px] font-bold uppercase w-fit">
                      <span className="w-1.5 h-1.5 rounded-full bg-success" /> Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">Oct 12, 2023</td>
                  <td className="px-6 py-4 font-bold text-slate-600">{i % 3 + 1}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-text p-1">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-slate-500">
          <span>Showing 1 to 8 of 12,450 results</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50">Prev</button>
            <button className="px-3 py-1 border border-slate-200 rounded-lg bg-slate-100 font-bold">1</button>
            <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50">2</button>
            <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
