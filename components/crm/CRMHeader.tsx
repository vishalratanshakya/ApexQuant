'use client';

import { Bell, Search, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function CRMHeader() {
  const pathname = usePathname();

  // Simple breadcrumbs logic
  const getPageTitle = () => {
    if (pathname.includes('/users')) return 'Users Management';
    if (pathname.includes('/billing')) return 'Billing & Subscriptions';
    if (pathname.includes('/leads')) return 'Lead Management';
    if (pathname.includes('/communications')) return 'Communications';
    return 'CRM Dashboard';
  };

  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-text rounded-lg hover:bg-slate-50">
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-text font-display">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search users, emails, IDs..."
            className="pl-9 pr-4 py-2 bg-slate-50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors w-72"
          />
        </div>
        
        <button className="relative p-2 text-slate-400 hover:text-primary rounded-full hover:bg-primary/5 transition-colors">
          <Bell className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
