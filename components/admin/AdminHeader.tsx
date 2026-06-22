import { Bell, Search, UserCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function AdminHeader() {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <div className="bg-red-500/10 text-red-600 border border-red-200 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          Admin Mode Active
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search users, strategies..."
            className="w-64 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
          />
        </div>

        <button className="relative p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-700">{user?.email?.split('@')[0] || 'Admin'}</p>
            <p className="text-xs text-slate-500 font-medium">Super Administrator</p>
          </div>
          <UserCircle className="w-9 h-9 text-slate-300" />
        </div>
      </div>
    </header>
  );
}
