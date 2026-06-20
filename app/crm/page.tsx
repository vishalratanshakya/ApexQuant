'use client';

import { Users, CreditCard, Activity, ArrowUpRight, Target } from 'lucide-react';
import Link from 'next/link';

export default function CRMDashboard() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-text font-display mb-1">CRM Overview</h1>
        <p className="text-sm text-slate-500">High-level metrics and recent platform activity.</p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: '12,450', change: '+124 this week', icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Active Subscribers', value: '3,200', change: '+45 this week', icon: CreditCard, color: 'text-success', bg: 'bg-success/10' },
          { label: 'Monthly Revenue', value: '₹4.5L', change: '+12% vs last month', icon: Activity, color: 'text-accent', bg: 'bg-accent/10' },
          { label: 'New Leads', value: '84', change: 'Awaiting contact', icon: Target, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-border shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded-md bg-slate-100 text-slate-500 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-text">{stat.value}</p>
            <p className="text-xs text-slate-400 mt-2">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Registrations */}
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-base font-bold text-text">Recent Registrations</h2>
            <Link href="/crm/users" className="text-sm font-semibold text-primary hover:underline">View All</Link>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                      U{i}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text">user{i}@example.com</p>
                      <p className="text-xs text-slate-500">Joined {i + 1} hours ago</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-bold">Free</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Support Tickets / Comms */}
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-base font-bold text-text">Recent Communications</h2>
            <Link href="/crm/communications" className="text-sm font-semibold text-primary hover:underline">View All</Link>
          </div>
          <div className="p-4">
             <div className="flex flex-col items-center justify-center h-64 text-center">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                 <Activity className="w-8 h-8 text-slate-300" />
               </div>
               <p className="text-slate-500 font-medium text-sm">Communication metrics will appear here.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
