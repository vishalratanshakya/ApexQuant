'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Workflow, Layers, FlaskConical, Activity, History, BarChart2, PieChart, ScanEye, Bell, Settings, LogOut } from 'lucide-react';
import { signOut } from '@/lib/auth';
import { toast } from 'react-hot-toast';

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Strategies', href: '/strategies', icon: Layers },
  { name: 'Strategy Builder', href: '/builder', icon: Workflow },
  { name: 'Market Scanner', href: '/scanner', icon: ScanEye },
  { name: 'Backtests', href: '/backtest', icon: FlaskConical },
  { name: 'Live Deployments', href: '/live', icon: Activity },
  { name: 'Portfolio', href: '/portfolio', icon: PieChart },
  { name: 'Trade History', href: '/history', icon: History },
  { name: 'Analytics', href: '/analytics', icon: BarChart2 },
  { name: 'Templates', href: '/templates', icon: Layers },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Profile', href: '/profile', icon: Settings },
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
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          // Highlight if we are exactly on the route, or if we are inside a sub-route (like /backtest/123)
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
          return (
            <Link 
              key={item.name} 
              href={item.href} 
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border mt-auto">
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 w-full rounded-xl text-sm font-medium text-slate-600 hover:bg-loss/10 hover:text-loss transition-all">
          <LogOut className="w-4 h-4 text-slate-400" /> Logout
        </button>
      </div>
    </aside>
  );
}
