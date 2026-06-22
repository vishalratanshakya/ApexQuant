'use client';

import { useState } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ShieldAlert } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

// Import all tabs
import { OverviewTab } from '@/components/admin/tabs/OverviewTab';
import { UserManagementTab } from '@/components/admin/tabs/UserManagementTab';
import { StrategiesManagementTab } from '@/components/admin/tabs/StrategiesManagementTab';
import { LiveDeploymentsTab } from '@/components/admin/tabs/LiveDeploymentsTab';
import { BillingRevenueTab } from '@/components/admin/tabs/BillingRevenueTab';
import { TemplatesTab } from '@/components/admin/tabs/TemplatesTab';
import { AnnouncementsTab } from '@/components/admin/tabs/AnnouncementsTab';
import { SystemLogsTab } from '@/components/admin/tabs/SystemLogsTab';
import { SettingsTab } from '@/components/admin/tabs/SettingsTab';
import { ReportsTab } from '@/components/admin/tabs/ReportsTab';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <AdminGuard>
      <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <AdminHeader />
          
          <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative">
            <div className="max-w-7xl mx-auto">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && <OverviewTab key="overview" />}
                {activeTab === 'users' && <UserManagementTab key="users" />}
                {activeTab === 'strategies' && <StrategiesManagementTab key="strategies" />}
                {activeTab === 'deployments' && <LiveDeploymentsTab key="deployments" />}
                {activeTab === 'billing' && <BillingRevenueTab key="billing" />}
                
                {activeTab === 'templates' && <TemplatesTab key="templates" />}
                {activeTab === 'announcements' && <AnnouncementsTab key="announcements" />}
                {activeTab === 'logs' && <SystemLogsTab key="logs" />}
                {activeTab === 'settings' && <SettingsTab key="settings" />}
                {activeTab === 'reports' && <ReportsTab key="reports" />}
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}

// Placeholder for future tabs
function PlaceholderTab({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center bg-white border border-slate-200 rounded-xl shadow-sm">
      <ShieldAlert className="w-16 h-16 text-slate-200 mb-4" />
      <h2 className="text-xl font-bold text-slate-700 mb-2">{title}</h2>
      <p className="text-slate-500 max-w-sm">This module is part of the enterprise administrative suite. Functionality is restricted in the preview environment.</p>
    </div>
  );
}
