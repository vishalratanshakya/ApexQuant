'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, Users, Workflow, CreditCard, LayoutTemplate, 
  Activity, FileText, Download, TrendingUp, AlertTriangle, Play 
} from 'lucide-react';

import { OverviewTab } from '@/components/admin/tabs/OverviewTab';
import { UsersTab } from '@/components/admin/tabs/UsersTab';
import { StrategiesTab } from '@/components/admin/tabs/StrategiesTab';
import { BillingTab } from '@/components/admin/tabs/BillingTab';
import { ContentTab } from '@/components/admin/tabs/ContentTab';
import { SystemTab } from '@/components/admin/tabs/SystemTab';
import { ReportsTab } from '@/components/admin/tabs/ReportsTab';

const TABS = [
  { id: 'overview', label: 'Overview', icon: TrendingUp },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'strategies', label: 'Strategies', icon: Workflow },
  { id: 'billing', label: 'Billing & Revenue', icon: CreditCard },
  { id: 'content', label: 'Content', icon: LayoutTemplate },
  { id: 'system', label: 'System & Brokers', icon: Activity },
  { id: 'reports', label: 'Reports', icon: FileText },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 max-w-7xl mx-auto">
      {/* Admin Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md uppercase tracking-wider">
              Admin Mode Active
            </span>
          </div>
          <h1 className="text-3xl font-bold text-text font-display mb-1">
            Admin Dashboard
          </h1>
          <p className="text-sm text-text-light">Platform Overview & Management Center</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select className="text-sm bg-white border border-border rounded-xl px-4 py-2 focus:outline-none focus:border-primary font-medium text-slate-600 shadow-sm">
            <option>Today</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>All Time</option>
          </select>
          <button className="btn-primary px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
            <Download className="w-4 h-4" /> Export Data
          </button>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Users', value: '4,289', change: '+12%', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Strategies', value: '1,842', change: '+5%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Total Revenue', value: '₹14.2M', change: '+22%', color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Live Deployed', value: '890', change: '+2%', color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'System Uptime', value: '99.99%', change: 'All Good', color: 'text-success', bg: 'bg-success/10' },
        ].map((stat, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 border border-border bg-white shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
              <span className={`text-xs font-bold px-2 py-1 rounded-md ${stat.bg} ${stat.color}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Tabs Navigation */}
      <div className="border-b border-border">
        <nav className="flex space-x-1 overflow-x-auto custom-scrollbar pb-px">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content Area */}
      <div className="min-h-[500px]">
        {activeTab === 'overview' && (
          <OverviewTab />
        )}
        {activeTab === 'users' && (
          <UsersTab />
        )}
        {activeTab === 'strategies' && (
          <StrategiesTab />
        )}
        {activeTab === 'billing' && (
          <BillingTab />
        )}
        {activeTab === 'content' && (
          <ContentTab />
        )}
        {activeTab === 'system' && (
          <SystemTab />
        )}
        {activeTab === 'reports' && (
          <ReportsTab />
        )}
      </div>
    </div>
  );
}
