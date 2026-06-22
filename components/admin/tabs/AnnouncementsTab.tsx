'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Calendar, Clock, Edit, Trash2, Copy, AlertCircle, Info, Megaphone, Users
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

export function AnnouncementsTab() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [audience, setAudience] = useState('All Users');
  const [priority, setPriority] = useState('Info');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'announcements'), (snap) => {
      const fetched: any[] = [];
      snap.forEach(doc => {
        fetched.push({ id: doc.id, ...doc.data() });
      });
      // Mock data if empty
      if (fetched.length === 0) {
        fetched.push(
          { id: 'mock1', title: 'New Broker Integration: Upstox', content: 'We are thrilled to announce that Upstox is now fully supported...', audience: 'All Users', priority: 'Important', status: 'Sent', sentAt: new Date(Date.now() - 86400000), reach: 3402 },
          { id: 'mock2', title: 'Scheduled Maintenance', content: 'Platform will be down for 30 minutes this Saturday at 2 AM IST.', audience: 'All Users', priority: 'Urgent', status: 'Scheduled', sentAt: new Date(Date.now() + 86400000), reach: 0 }
        );
      }
      setAnnouncements(fetched.sort((a,b) => {
        const da = a.sentAt?.toDate ? a.sentAt.toDate() : new Date(a.sentAt);
        const db = b.sentAt?.toDate ? b.sentAt.toDate() : new Date(b.sentAt);
        return db.getTime() - da.getTime();
      }));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return toast.error('Please fill in title and content');
    
    try {
      await addDoc(collection(db, 'announcements'), {
        title,
        content,
        audience,
        priority,
        status: 'Sent',
        sentAt: serverTimestamp(),
        reach: 0
      });
      toast.success('Announcement sent successfully!');
      setTitle('');
      setContent('');
    } catch (e) {
      toast.error('Failed to send announcement');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this announcement?')) return;
    if (id.startsWith('mock')) {
      setAnnouncements(prev => prev.filter(a => a.id !== id));
      return toast.success('Announcement deleted');
    }
    try {
      await deleteDoc(doc(db, 'announcements', id));
      toast.success('Deleted');
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Announcements</h2>
          <p className="text-sm text-slate-500">Broadcast important updates and notifications to users</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sticky top-6">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-blue-600" /> New Broadcast
            </h3>
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Title</label>
                <input 
                  type="text" value={title} onChange={e => setTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                  placeholder="e.g. Platform Update v2.0"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Message</label>
                <textarea 
                  rows={4} value={content} onChange={e => setContent(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
                  placeholder="Write your announcement here..."
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Audience</label>
                  <select 
                    value={audience} onChange={e => setAudience(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                  >
                    <option>All Users</option>
                    <option>Pro Users</option>
                    <option>Enterprise</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Priority</label>
                  <select 
                    value={priority} onChange={e => setPriority(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                  >
                    <option>Info</option>
                    <option>Important</option>
                    <option>Urgent</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Send Now
                </button>
                <button type="button" className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* History List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-800">Broadcast History</h3>
              <div className="flex gap-2">
                <button className="text-xs font-bold text-slate-500 hover:text-blue-600 px-2">All</button>
                <button className="text-xs font-bold text-slate-500 hover:text-blue-600 px-2">Sent</button>
                <button className="text-xs font-bold text-slate-500 hover:text-blue-600 px-2">Scheduled</button>
              </div>
            </div>

            <div className="divide-y divide-slate-100 flex-1 overflow-y-auto">
              <AnimatePresence>
                {announcements.map((a) => {
                  const dateStr = a.sentAt ? (a.sentAt.toDate?.() || new Date(a.sentAt)).toLocaleString() : 'Just now';
                  
                  return (
                    <motion.div key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-5 hover:bg-slate-50 transition-colors group">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {a.priority === 'Urgent' ? <AlertCircle className="w-4 h-4 text-red-500" /> : <Info className="w-4 h-4 text-blue-500" />}
                          <h4 className="font-bold text-slate-800 text-lg">{a.title}</h4>
                        </div>
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                          a.status === 'Sent' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                        }`}>{a.status}</span>
                      </div>
                      <p className="text-sm text-slate-600 mb-4">{a.content}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {dateStr}</span>
                          <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Audience: {a.audience}</span>
                          {a.status === 'Sent' && <span className="flex items-center gap-1.5 text-blue-600"><Eye className="w-3.5 h-3.5" /> {a.reach} seen</span>}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg" title="Duplicate"><Copy className="w-4 h-4" /></button>
                          <button className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg" title="Edit"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(a.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg" title="Delete"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
              
              {announcements.length === 0 && !loading && (
                <div className="p-8 text-center text-slate-500">No announcements found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
