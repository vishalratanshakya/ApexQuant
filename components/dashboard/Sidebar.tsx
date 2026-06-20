'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Layers,
  Workflow, 
  FlaskConical,
  Activity,
  History, 
  BarChart2,
  Users,
  CreditCard,
  Settings,
  LogOut
} from 'lucide-react';
import { signOut } from '@/lib/auth';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Strategy Builder', href: '/dashboard/builder', icon: Workflow },
  { name: 'Templates', href: '/dashboard/templates', icon: Layers },
  { name: 'Backtest', href: '/dashboard/backtest', icon: FlaskConical },
  { name: 'Live Strategies', href: '/dashboard/live', icon: Activity },
  { name: 'Trade History', href: '/dashboard/history', icon: History },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart2 },
  { name: 'CRM', href: '/crm', icon: Users },
  { name: 'Pricing', href: '/dashboard/pricing', icon: CreditCard },
  { name: 'Settings', href: '/dashboard/profile', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
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
    <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-border flex flex-col z-40 mt-16 pb-16 hidden lg:flex">
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">
          Navigation
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-border mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-xl text-sm font-medium text-slate-600 hover:bg-loss/10 hover:text-loss transition-all"
        >
          <LogOut className="w-4 h-4 text-slate-400" />
          Logout
        </button>
      </div>
    </aside>
  );
}
