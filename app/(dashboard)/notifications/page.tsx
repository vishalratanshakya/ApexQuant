'use client';

import { useState, useEffect } from 'react';
import { Bell, AlertTriangle, CheckCircle, Info, Settings, Trash2, MessageSquare, Megaphone } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [personalNotifs, setPersonalNotifs] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
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
        return Array.from(new Map(merged.map(item => [item.id, item])).values());
      });
    });

    const qPersonalId = query(collection(db, 'notifications'), where('userId', '==', user.uid));
    const unsubId = onSnapshot(qPersonalId, (snap) => {
      const fetched: any[] = [];
      snap.forEach(doc => fetched.push({ id: doc.id, ...doc.data() }));
      setPersonalNotifs(prev => {
        const merged = [...prev.filter(p => p.userId !== user.uid), ...fetched];
        return Array.from(new Map(merged.map(item => [item.id, item])).values());
      });
    });

    return () => {
      unsubAnnouncements();
      if (unsubEmail) unsubEmail();
      if (unsubId) unsubId();
    };
  }, [user]);

  const allNotifications = [...announcements, ...personalNotifs]
    .filter(a => !dismissed.includes(a.id))
    .sort((a,b) => {
      const da = a.createdAt ? new Date(a.createdAt) : (a.sentAt?.toDate ? a.sentAt.toDate() : new Date(a.sentAt || 0));
      const dbTime = b.createdAt ? new Date(b.createdAt) : (b.sentAt?.toDate ? b.sentAt.toDate() : new Date(b.sentAt || 0));
      return dbTime.getTime() - da.getTime();
    });

  const handleDelete = async (notification: any) => {
    try {
      if (notification.type === 'announcement' || notification.status === 'Sent') {
        // It's a global announcement, just dismiss locally
        const newDismissed = [...dismissed, notification.id];
        setDismissed(newDismissed);
        localStorage.setItem('dismissedAnnouncements', JSON.stringify(newDismissed));
        toast.success('Notification dismissed');
      } else {
        // It's a personal notification, delete from Firestore
        await deleteDoc(doc(db, 'notifications', notification.id));
        toast.success('Notification deleted');
      }
    } catch (error: any) {
      console.error('Delete Error:', error);
      toast.error('Failed to delete notification: ' + error.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text font-display mb-1 flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary" /> Notifications
          </h1>
          <p className="text-sm text-text-light">Stay updated with your strategy alerts and account activity.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
            <Settings className="w-4 h-4" /> Preferences
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="glass-card rounded-xl border border-border bg-white overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-slate-50/50">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Recent Alerts</h2>
          <button className="text-xs font-semibold text-primary hover:underline">Mark all as read</button>
        </div>
        <div className="divide-y divide-slate-100">
          {allNotifications.length === 0 && (
            <div className="p-12 text-center text-slate-500 font-medium">You have no new notifications.</div>
          )}
          {allNotifications.map((notification) => {
            let Icon = Info;
            let color = 'text-primary';
            let bg = 'bg-primary/10';

            if (notification.type === 'support') {
              Icon = MessageSquare;
              color = 'text-blue-600';
              bg = 'bg-blue-600/10';
            } else if (notification.priority === 'Urgent') {
              Icon = AlertTriangle;
              color = 'text-red-500';
              bg = 'bg-red-500/10';
            } else if (notification.type === 'announcement' || notification.status === 'Sent') {
              Icon = Megaphone;
            }

            return (
              <div 
                key={notification.id} 
                className={`p-5 flex gap-4 transition-colors hover:bg-slate-50/80 group ${!notification.read ? 'bg-primary/[0.02]' : ''}`}
              >
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className={`text-sm font-bold truncate ${!notification.read ? 'text-text' : 'text-slate-700'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
                      {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : (notification.sentAt?.toDate ? notification.sentAt.toDate().toLocaleString() : 'Just now')}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed ${!notification.read ? 'text-slate-600 font-medium' : 'text-slate-500'}`}>
                    {notification.message || notification.content}
                  </p>
                </div>
                <div className="flex items-center shrink-0 ml-4">
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(notification);
                    }}
                    className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors shadow-sm bg-white border border-slate-100 hover:border-red-100"
                    title="Delete Notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
