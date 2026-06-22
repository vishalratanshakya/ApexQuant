'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useAuth } from '@/providers/AuthProvider';
import { AlertCircle, X, Megaphone, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GlobalAnnouncements() {
  const { user } = useAuth();
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
    
    const q = query(
      collection(db, 'announcements'),
      where('status', '==', 'Sent')
    );

    const unsub = onSnapshot(q, (snap) => {
      const fetched: any[] = [];
      snap.forEach(doc => {
        fetched.push({ id: doc.id, ...doc.data() });
      });
      // Sort in memory to avoid needing a composite index immediately
      fetched.sort((a,b) => {
        const da = a.sentAt?.toDate ? a.sentAt.toDate() : new Date(a.sentAt || 0);
        const db = b.sentAt?.toDate ? b.sentAt.toDate() : new Date(b.sentAt || 0);
        return db.getTime() - da.getTime();
      });
      setAnnouncements(fetched);
    });

    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (announcements.length > 0) {
      const current = announcements.filter(a => !dismissed.includes(a.id))[0];
      if (current) {
        const timer = setTimeout(() => {
          handleDismiss(current.id);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [announcements, dismissed]);

  const handleDismiss = (id: string) => {
    const newDismissed = [...dismissed, id];
    setDismissed(newDismissed);
    localStorage.setItem('dismissedAnnouncements', JSON.stringify(newDismissed));
  };

  const visibleAnnouncements = announcements.filter(a => !dismissed.includes(a.id));

  if (visibleAnnouncements.length === 0) return null;

  // Only show the most recent one to avoid cluttering the screen
  const current = visibleAnnouncements[0];
  const isUrgent = current.priority === 'Urgent';
  const isImportant = current.priority === 'Important';

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0 }}
        className={`w-full px-6 py-3 lg:px-8 border-b flex items-center justify-between gap-4 ${
          isUrgent ? 'bg-red-600 border-red-700' :
          isImportant ? 'bg-blue-600 border-blue-700' :
          'bg-slate-800 border-slate-900'
        }`}
      >
        <div className="flex items-center gap-3 text-white flex-1">
          {isUrgent ? <AlertCircle className="w-5 h-5 shrink-0 text-red-200" /> : 
           isImportant ? <Megaphone className="w-5 h-5 shrink-0 text-blue-200" /> :
           <Info className="w-5 h-5 shrink-0 text-slate-300" />}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 flex-1">
            <span className="font-bold text-sm tracking-wide">{current.title}</span>
            <span className="hidden sm:block text-white/40">•</span>
            <span className="text-sm text-white/90">{current.content}</span>
          </div>
        </div>
        <button 
          onClick={() => handleDismiss(current.id)}
          className="p-1 hover:bg-black/20 rounded-lg transition-colors shrink-0 text-white/80 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
