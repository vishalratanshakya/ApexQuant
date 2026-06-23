'use client';

import { 
  Users, 
  CreditCard, 
  MessageSquare, 
  Target, 
  BarChart, 
  LogOut,
  TrendingUp,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { signOut } from '@/lib/auth';
import { toast } from 'react-hot-toast';

const crmNavItems = [
  { name: 'Dashboard', href: '/crm', icon: BarChart },
  { name: 'Users', href: '/crm/users', icon: Users },
  { name: 'Billing & Plans', href: '/crm/billing', icon: CreditCard },
  { name: 'Leads', href: '/crm/leads', icon: Target },
  { name: 'Communications', href: '/crm/communications', icon: MessageSquare },
];

export default function CRMSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-[#0f172a] text-slate-300 flex flex-col z-40">
      {/* Logo */}
      <div className="h-24 flex items-center px-6 border-b border-slate-800">
        <Link href="/crm" className="flex items-center gap-2 group px-2 mb-8">
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <span className="font-display font-black text-2xl tracking-tight text-white">
            Apex<span className="text-indigo-500">CRM</span>
          </span>
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">
          Management
        </div>
        {crmNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary/20 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Admin Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xs uppercase">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">Admin User</p>
            <p className="text-[10px] text-slate-400 font-medium">Superadmin</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-xl text-sm font-medium text-slate-400 hover:bg-loss/10 hover:text-loss transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
