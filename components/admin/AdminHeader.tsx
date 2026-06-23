import { Bell, Search, UserCircle, AlertCircle, Megaphone, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useState, useRef, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

export function AdminHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
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
    
    // Listener for notifications dropdown
    const q = query(collection(db, 'announcements'), where('status', '==', 'Sent'));
    const unsub = onSnapshot(q, (snap) => {
      const fetched: any[] = [];
      snap.forEach(document => fetched.push({ id: document.id, ...document.data() }));
      fetched.sort((a,b) => {
        const da = a.sentAt?.toDate ? a.sentAt.toDate() : new Date(a.sentAt || 0);
        const db = b.sentAt?.toDate ? b.sentAt.toDate() : new Date(b.sentAt || 0);
        return db.getTime() - da.getTime();
      });
      setAnnouncements(fetched);
    });

    // Auto-Sender for Scheduled Announcements
    const interval = setInterval(async () => {
      try {
        const schedQ = query(collection(db, 'announcements'), where('status', '==', 'Scheduled'));
        const snapshot = await getDocs(schedQ);
        const now = new Date();
        
        snapshot.forEach(async (document) => {
          const data = document.data();
          const sentAt = data.sentAt?.toDate ? data.sentAt.toDate() : new Date(data.sentAt);
          if (sentAt <= now) {
            await updateDoc(doc(db, 'announcements', document.id), {
              status: 'Sent'
            });
          }
        });
      } catch (err) {
        console.error("Auto-sender error:", err);
      }
    }, 10000); // Checks every 10 seconds while admin is online

    // Listener for sales inquiries
    const qInquiries = query(collection(db, 'sales_inquiries'), where('status', '==', 'pending'));
    const unsubInquiries = onSnapshot(qInquiries, (snap) => {
      const fetched: any[] = [];
      snap.forEach(document => {
        const data = document.data();
        fetched.push({ 
          id: document.id, 
          isSalesInquiry: true,
          title: `New Sales Inquiry: ${data.company || 'Unknown'}`,
          content: `${data.fullName} is requesting Enterprise access. Volume: ${data.volume}`,
          priority: 'Urgent',
          sentAt: data.createdAt,
          ...data
        });
      });
      setInquiries(fetched);
    });

    return () => {
      unsub();
      unsubInquiries();
      clearInterval(interval);
    };
  }, [user]);

  const allNotifications = [...announcements, ...inquiries].sort((a,b) => {
    const da = a.sentAt?.toDate ? a.sentAt.toDate() : new Date(a.sentAt || 0);
    const db = b.sentAt?.toDate ? b.sentAt.toDate() : new Date(b.sentAt || 0);
    return db.getTime() - da.getTime();
  });

  const unreadAnnouncements = allNotifications.filter(a => !dismissed.includes(a.id));

  const handleMarkAllRead = () => {
    const newDismissed = [...new Set([...dismissed, ...allNotifications.map(a => a.id)])];
    setDismissed(newDismissed);
    localStorage.setItem('dismissedAnnouncements', JSON.stringify(newDismissed));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-2 lg:gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex bg-red-500/10 text-red-600 border border-red-200 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          Admin Mode Active
        </div>
        <div className="sm:hidden bg-red-500/10 text-red-600 border border-red-200 px-2 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
          Admin
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

        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors block"
          >
            <Bell className="w-5 h-5" />
            {unreadAnnouncements.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 border-2 border-white"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 py-2 animate-in fade-in slide-in-from-top-2 z-50 flex flex-col max-h-[80vh]">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
                <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                {unreadAnnouncements.length > 0 && (
                  <button onClick={handleMarkAllRead} className="text-xs font-bold text-blue-600 hover:text-blue-700">Mark all read</button>
                )}
              </div>
              <div className="overflow-y-auto flex-1 custom-scrollbar">
                {announcements.length === 0 ? (
                  <div className="p-8 text-center text-sm text-slate-500">No notifications</div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {allNotifications.map(a => {
                      const isUnread = !dismissed.includes(a.id);
                      return (
                        <div key={a.id} onClick={() => {
                          if (isUnread) {
                            const newD = [...dismissed, a.id];
                            setDismissed(newD);
                            localStorage.setItem('dismissedAnnouncements', JSON.stringify(newD));
                          }
                        }} className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors ${isUnread ? 'bg-blue-50/50' : ''}`}>
                          <div className="flex gap-3">
                            <div className="shrink-0 mt-0.5">
                              {a.priority === 'Urgent' ? <AlertCircle className="w-4 h-4 text-red-500" /> : <Megaphone className="w-4 h-4 text-blue-500" />}
                            </div>
                            <div>
                              <p className={`text-sm leading-tight ${isUnread ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>{a.title}</p>
                              <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{a.content}</p>
                              <p className="text-[10px] text-slate-400 mt-2">
                                {a.sentAt?.toDate ? a.sentAt.toDate().toLocaleString() : 'Just now'}
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
