'use client';

import { Bell, Search, Menu, TrendingUp, ChevronDown, User, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { signOut } from '@/lib/auth';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 fixed top-0 inset-x-0 z-50 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-text rounded-lg hover:bg-slate-50">
          <Menu className="w-5 h-5" />
        </button>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 lg:w-64">
          <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-xl gradient-text hidden sm:block">ApexQuant</span>
        </Link>
      </div>

      <div className="flex items-center justify-between flex-1 pl-4 lg:pl-8">
        <div className="relative hidden md:block max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search strategies, backtests..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        
        <div className="flex items-center gap-4 ml-auto">
          {/* Market Status */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            <span className="text-xs font-semibold text-slate-600">NSE: OPEN</span>
          </div>

          <button className="relative p-2 text-slate-400 hover:text-text rounded-full hover:bg-slate-50 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-loss animate-pulse"></span>
          </button>
          
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 pl-4 border-l border-border hover:bg-slate-50 p-1.5 rounded-xl transition-colors"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-text">{user?.email?.split('@')[0] || 'Trader'}</p>
                <p className="text-[10px] text-success font-medium">Pro Plan Active</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase shadow-sm">
                {user?.email?.[0] || 'T'}
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-border py-2 animate-in fade-in slide-in-from-top-2">
                <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-text transition-colors">
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-text transition-colors">
                  <SettingsIcon className="w-4 h-4" />
                  Settings
                </Link>
                <div className="h-px bg-border my-1"></div>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-loss hover:bg-loss/5 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
