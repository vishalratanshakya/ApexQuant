'use client';

import { Bell, Search, Menu, TrendingUp, ChevronDown, User, Settings as SettingsIcon, LogOut, AlertCircle, Megaphone, MessageSquare } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, where, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { signOut } from '@/lib/auth';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [personalNotifs, setPersonalNotifs] = useState<any[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('dismissedAnnouncements');
    if (stored) {
      try {
        setDismissed(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    const qAnnouncements = query(collection(db, 'announcements'), where('status', '==', 'Sent'));
    const unsubAnnouncements = onSnapshot(qAnnouncements, (snap) => {
      const fetched: any[] = [];
      snap.forEach(doc => fetched.push({ id: doc.id, ...doc.data() }));
      setAnnouncements(fetched);
    });

    if (!user.email) return () => unsubAnnouncements();

    const qPersonalEmail = query(collection(db, 'notifications'), where('userEmail', '==', user.email));
    const unsubEmail = onSnapshot(qPersonalEmail, (snap) => {
      const fetched: any[] = [];
      snap.forEach(doc => fetched.push({ id: doc.id, ...doc.data() }));
      setPersonalNotifs(prev => {
        const merged = [...prev.filter(p => p.userEmail !== user.email), ...fetched];
        // deduplicate by id
        return Array.from(new Map(merged.map(item => [item.id, item])).values());
      });
    });

    const qPersonalId = query(collection(db, 'notifications'), where('userId', '==', user.uid));
    const unsubId = onSnapshot(qPersonalId, (snap) => {
      const fetched: any[] = [];
      snap.forEach(doc => fetched.push({ id: doc.id, ...doc.data() }));
      setPersonalNotifs(prev => {
        const merged = [...prev.filter(p => p.userId !== user.uid), ...fetched];
        // deduplicate by id
        return Array.from(new Map(merged.map(item => [item.id, item])).values());
      });
    });

    return () => {
      unsubAnnouncements();
      if (unsubEmail) unsubEmail();
      if (unsubId) unsubId();
    };
  }, [user]);

  const allNotifications = [...announcements, ...personalNotifs].sort((a,b) => {
    const da = a.createdAt ? new Date(a.createdAt) : (a.sentAt?.toDate ? a.sentAt.toDate() : new Date(a.sentAt || 0));
    const dbTime = b.createdAt ? new Date(b.createdAt) : (b.sentAt?.toDate ? b.sentAt.toDate() : new Date(b.sentAt || 0));
    return dbTime.getTime() - da.getTime();
  });

  const unreadAnnouncements = allNotifications.filter(a => !dismissed.includes(a.id) && !a.read);

  const handleMarkAllRead = () => {
    const newDismissed = Array.from(new Set([...dismissed, ...allNotifications.map(a => a.id)]));
    setDismissed(newDismissed);
    localStorage.setItem('dismissedAnnouncements', JSON.stringify(newDismissed));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
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
    <header className="h-20 bg-white border-b border-border flex items-center justify-between px-6 fixed top-0 inset-x-0 z-50 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button 
          onClick={onMenuClick}
          type="button"
          className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-text rounded-lg hover:bg-slate-50 relative z-50"
        >
          <Menu className="w-5 h-5" />
        </button>
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 group hidden sm:flex">
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow-purple group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <span className="font-display font-black text-xl tracking-tight gradient-text">
            ApexQuant
          </span>
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

          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => {
                if (!notificationsOpen) {
                  // Mark all unread announcements as seen when dropdown is opened
                  unreadAnnouncements.forEach(a => {
                    if ((a.type === 'announcement' || a.status === 'Sent') && !a.id.startsWith('mock')) {
                      updateDoc(doc(db, 'announcements', a.id), { seenBy: arrayUnion(user?.uid) }).catch(console.error);
                    }
                  });
                }
                setNotificationsOpen(!notificationsOpen);
                setDropdownOpen(false);
              }}
              className="relative p-2 text-slate-400 hover:text-text rounded-full hover:bg-slate-50 transition-colors block"
            >
              <Bell className="w-5 h-5" />
              {unreadAnnouncements.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-loss animate-pulse"></span>
              )}
            </button>
            
            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <div className="fixed inset-x-4 top-16 sm:absolute sm:inset-x-auto sm:top-auto sm:right-0 mt-2 sm:w-80 bg-white rounded-xl shadow-2xl border border-border py-2 animate-in fade-in z-50 flex flex-col max-h-[calc(100vh-5rem)] sm:max-h-[80vh]">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between shrink-0">
                  <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                  {unreadAnnouncements.length > 0 && (
                    <button onClick={handleMarkAllRead} className="text-xs font-bold text-blue-600 hover:text-blue-700">Mark all read</button>
                  )}
                </div>
                <div className="overflow-y-auto flex-1 custom-scrollbar">
                  {allNotifications.length === 0 ? (
                    <div className="p-8 text-center text-sm text-slate-500">No notifications</div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {allNotifications.map(a => {
                        const isUnread = !dismissed.includes(a.id);
                        return (
                          <div key={a.id} onClick={() => {
                            if (isUnread) {
                              const newD = [...dismissed, a.id];
                              setDismissed(newD);
                              localStorage.setItem('dismissedAnnouncements', JSON.stringify(newD));
                            }
                          }} className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors ${isUnread ? 'bg-blue-50/30' : ''}`}>
                            <div className="flex gap-3">
                              <div className="shrink-0 mt-0.5">
                                {a.type === 'support' ? <MessageSquare className="w-4 h-4 text-primary" /> : 
                                 a.priority === 'Urgent' ? <AlertCircle className="w-4 h-4 text-red-500" /> : 
                                 <Megaphone className="w-4 h-4 text-blue-500" />}
                              </div>
                              <div>
                                <p className={`text-sm leading-tight ${isUnread ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>{a.title}</p>
                                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{a.message || a.content}</p>
                                <p className="text-[10px] text-slate-400 mt-2">
                                  {a.createdAt ? new Date(a.createdAt).toLocaleString() : (a.sentAt?.toDate ? a.sentAt.toDate().toLocaleString() : 'Just now')}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 pl-4 border-l border-border hover:bg-slate-50 p-1.5 rounded-xl transition-colors"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-text">{user?.displayName || user?.email?.split('@')[0] || 'Trader'}</p>
                <p className="text-[10px] text-success font-medium">Pro Plan Active</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase shadow-sm">
                {(user?.displayName?.[0] || user?.email?.[0] || 'T').toUpperCase()}
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-border py-2 animate-in fade-in z-50">
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
