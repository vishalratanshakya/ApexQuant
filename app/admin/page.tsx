'use client';

import { useState } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { 
  Users, Activity, DollarSign, Server, PlayCircle, Library, 
  ShieldAlert, MoreVertical, Edit, Trash2, StopCircle 
} from 'lucide-react';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';

const TradingViewChart = dynamic(() => import('@/components/dashboard/TradingViewChart'), { ssr: false });

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <AdminGuard>
      <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <AdminHeader />
          
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === 'overview' && <OverviewTab />}
              {activeTab === 'users' && <UserManagementTab />}
              {activeTab === 'strategies' && <StrategiesTab />}
              {activeTab === 'deployments' && <PlaceholderTab title="Live Deployments" />}
              {activeTab === 'billing' && <PlaceholderTab title="Billing & Revenue" />}
              {activeTab === 'templates' && <PlaceholderTab title="Templates Management" />}
              {activeTab === 'announcements' && <PlaceholderTab title="Announcements" />}
              {activeTab === 'logs' && <PlaceholderTab title="System Logs" />}
              {activeTab === 'settings' && <PlaceholderTab title="Platform Settings" />}
            </div>
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}

// ----------------------------------------------------------------------
// OVERVIEW TAB
// ----------------------------------------------------------------------
function OverviewTab() {
  const metrics = [
    { label: 'Total Users', value: '4,285', change: '+12.5%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Active (30d)', value: '1,842', change: '+5.2%', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'MRR (₹)', value: '₹12.5L', change: '+18.4%', icon: DollarSign, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'Live Strategies', value: '845', change: '+4.1%', icon: PlayCircle, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Total Built', value: '12,405', change: '+22.1%', icon: Library, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'System Health', value: '99.9%', change: 'Optimal', icon: Server, color: 'text-success', bg: 'bg-success/20' },
  ];

  const mockRevenueData = [
    { time: '2023-01-01', value: 850000 },
    { time: '2023-02-01', value: 920000 },
    { time: '2023-03-01', value: 980000 },
    { time: '2023-04-01', value: 1050000 },
    { time: '2023-05-01', value: 1120000 },
    { time: '2023-06-01', value: 1250000 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Platform Overview</h2>
        <div className="text-sm font-medium text-slate-500">Last updated: Just now</div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${m.bg}`}>
                <m.icon className={`w-5 h-5 ${m.color}`} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${i === 5 ? 'bg-success/10 text-success' : 'bg-success/10 text-success'}`}>
                {m.change}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{m.label}</p>
            <p className="text-2xl font-bold text-slate-800">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
           <h3 className="text-lg font-bold text-slate-800 mb-4">Revenue Trend (₹)</h3>
           <div className="h-[300px] w-full">
             <TradingViewChart data={mockRevenueData} />
           </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { text: "New Pro subscription: ravi@...", time: "2m ago" },
              { text: "Alert: NSE API Latency spike", time: "15m ago", type: 'alert' },
              { text: "User anjali... deployed NIFTY ORB", time: "1h ago" },
              { text: "Database backup completed", time: "4h ago" },
            ].map((log, i) => (
              <div key={i} className="flex gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${log.type === 'alert' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                <div>
                  <p className="text-sm text-slate-700 font-medium">{log.text}</p>
                  <p className="text-xs text-slate-400">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// USER MANAGEMENT TAB
// ----------------------------------------------------------------------
function UserManagementTab() {
  const users = [
    { id: '1', name: 'Rahul Sharma', email: 'rahul@example.com', plan: 'Pro', strategies: 12, status: 'Active', joined: 'Oct 12, 2023' },
    { id: '2', name: 'Priya Patel', email: 'priya@example.com', plan: 'Free', strategies: 2, status: 'Active', joined: 'Nov 05, 2023' },
    { id: '3', name: 'Amit Singh', email: 'amit@example.com', plan: 'Enterprise', strategies: 45, status: 'Active', joined: 'Jan 22, 2023' },
    { id: '4', name: 'Neha Gupta', email: 'neha@example.com', plan: 'Pro', strategies: 8, status: 'Suspended', joined: 'Aug 14, 2023' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-colors">
          Export Users
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Plan</th>
              <th className="px-6 py-4">Strategies</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800">{u.name}</div>
                  <div className="text-sm text-slate-500">{u.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                    u.plan === 'Pro' ? 'bg-indigo-100 text-indigo-700' : 
                    u.plan === 'Enterprise' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                  }`}>{u.plan}</span>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-slate-600">{u.strategies}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${u.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{u.joined}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Suspend/Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// STRATEGIES MANAGEMENT TAB
// ----------------------------------------------------------------------
function StrategiesTab() {
  const strategies = [
    { id: 's1', user: 'rahul@example.com', name: 'NIFTY Breakout Pro', status: 'Live', type: 'Intraday', pnl: '+₹45,200' },
    { id: 's2', user: 'amit@example.com', name: 'BankNifty Scalper', status: 'Paused', type: 'Scalp', pnl: '-₹1,200' },
    { id: 's3', user: 'priya@example.com', name: 'Reliance Swing', status: 'Live', type: 'Swing', pnl: '+₹12,400' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Global Strategies</h2>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Strategy</th>
              <th className="px-6 py-4">Owner</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Current P&L</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {strategies.map(s => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800">{s.name}</div>
                  <div className="text-xs text-slate-400">{s.type}</div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{s.user}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${s.status === 'Live' ? 'bg-success/10 text-success' : 'bg-slate-100 text-slate-600'}`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-success">{s.pnl}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ml-auto"
                    onClick={() => toast.success(`Force stopped ${s.name}`)}
                  >
                    <StopCircle className="w-3 h-3" /> Force Stop
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

// ----------------------------------------------------------------------
// PLACEHOLDER TAB
// ----------------------------------------------------------------------
function PlaceholderTab({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center bg-white border border-slate-200 rounded-xl shadow-sm">
      <ShieldAlert className="w-16 h-16 text-slate-200 mb-4" />
      <h2 className="text-xl font-bold text-slate-700 mb-2">{title}</h2>
      <p className="text-slate-500 max-w-sm">This module is part of the enterprise administrative suite. Functionality is restricted in the preview environment.</p>
    </div>
  );
}
