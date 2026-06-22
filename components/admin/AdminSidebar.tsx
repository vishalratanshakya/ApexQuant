import { useState } from 'react';
import { 
  LayoutDashboard, Users, Activity, PlayCircle, 
  CreditCard, Library, MessageSquare, ShieldAlert, Settings, LogOut, ChevronRight,
  Briefcase, Megaphone, Terminal, BarChart, Bell
} from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/admin/login');
      toast.success('Logged out from Admin portal');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'strategies', label: 'Strategies', icon: Briefcase },
    { id: 'deployments', label: 'Live Deployments', icon: PlayCircle },
    { id: 'billing', label: 'Billing & Revenue', icon: CreditCard },
    { id: 'templates', label: 'Templates', icon: Library },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'logs', label: 'System Logs', icon: Terminal },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 text-slate-600 flex flex-col h-screen overflow-y-auto z-10">
      {/* Brand */}
      <div className="p-6 border-b border-slate-200 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
          <ShieldAlert className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-800 font-display leading-tight">ApexQuant</h1>
          <p className="text-[10px] uppercase tracking-widest text-blue-600 font-bold">Admin Portal</p>
        </div>
      </div>

      {/* Nav */}
      <div className="p-4 flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors group ${
                isActive 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span className="text-sm font-bold">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4 text-blue-600" />}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-bold">Secure Logout</span>
        </button>
      </div>
    </aside>
  );
}
