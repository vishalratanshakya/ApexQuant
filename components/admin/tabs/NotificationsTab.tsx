import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, deleteDoc, doc, addDoc } from 'firebase/firestore';
import { Megaphone, AlertCircle, CheckCircle, Bell, Trash2, Mail, MessageCircle, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

export function NotificationsTab() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [replyingTo, setReplyingTo] = useState<any | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    // Listen to sent announcements
    const qAnnouncements = query(collection(db, 'announcements'), where('status', '==', 'Sent'));
    const unsubAnnouncements = onSnapshot(qAnnouncements, (snap) => {
      const fetched: any[] = [];
      snap.forEach(document => fetched.push({ id: document.id, ...document.data() }));
      setAnnouncements(fetched);
    });

    // Listen to sales inquiries
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
      unsubAnnouncements();
      unsubInquiries();
    };
  }, []);

  const allNotifications = [...announcements, ...inquiries].sort((a,b) => {
    const da = a.sentAt?.toDate ? a.sentAt.toDate() : new Date(a.sentAt || 0);
    const db = b.sentAt?.toDate ? b.sentAt.toDate() : new Date(b.sentAt || 0);
    return db.getTime() - da.getTime();
  });

  const handleDelete = async (id: string, isSalesInquiry: boolean) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return;
    try {
      const collectionName = isSalesInquiry ? 'sales_inquiries' : 'announcements';
      await deleteDoc(doc(db, collectionName, id));
      toast.success('Notification deleted successfully');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const handleSendInAppMessage = async () => {
    if (!replyingTo || !replyMessage.trim()) return;
    try {
      await addDoc(collection(db, 'notifications'), {
        userId: replyingTo.userId || 'unknown',
        userEmail: replyingTo.email,
        title: 'Response from Support',
        message: replyMessage,
        type: 'support',
        createdAt: new Date().toISOString(),
        read: false
      });
      toast.success('In-App message sent to user');
      setReplyingTo(null);
      setReplyMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 font-display flex items-center gap-3">
            <Bell className="w-7 h-7 text-blue-600" /> All Notifications
          </h2>
          <p className="text-sm text-slate-500 mt-1">View system alerts, announcements, and incoming sales inquiries.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {allNotifications.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <CheckCircle className="w-16 h-16 text-slate-200 mb-4" />
            <h3 className="text-lg font-bold text-slate-700">You're all caught up!</h3>
            <p className="text-sm text-slate-500 mt-2">There are no new notifications or inquiries to display.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {allNotifications.map((notif) => (
              <div key={notif.id} className="p-6 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${notif.priority === 'Urgent' ? 'bg-red-50' : 'bg-blue-50'}`}>
                  {notif.priority === 'Urgent' ? (
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  ) : (
                    <Megaphone className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                    <h3 className="text-base font-bold text-slate-800">{notif.title}</h3>
                    <span className="text-xs font-bold text-slate-400">
                      {notif.sentAt?.toDate ? notif.sentAt.toDate().toLocaleString() : 'Just now'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{notif.content}</p>
                  
                  {notif.isSalesInquiry && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 grid md:grid-cols-2 gap-4 text-sm mt-3">
                      <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Contact Details</span>
                        <p className="font-semibold text-slate-700">{notif.fullName}</p>
                        <p className="text-slate-600">{notif.email}</p>
                        <p className="text-slate-600">{notif.phone}</p>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Message / Requirements</span>
                        <p className="text-slate-700 italic">"{notif.message}"</p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4 pt-4 border-t border-slate-100">
                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                      {notif.isSalesInquiry && notif.email && (
                        <>
                          <a 
                            href={`mailto:${notif.email}?subject=Re: ApexQuant Enterprise Plan for ${notif.company || notif.fullName}`}
                            className="flex items-center justify-center flex-1 sm:flex-none gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors"
                          >
                            <Mail className="w-4 h-4" /> Mail
                          </a>
                          <a 
                            href={`https://wa.me/${notif.phone?.replace(/[^0-9]/g, '')}?text=Hi ${notif.fullName}, we received your Enterprise inquiry regarding ApexQuant.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center flex-1 sm:flex-none gap-2 px-4 py-2 bg-[#25D366] text-white rounded-lg text-sm font-bold hover:bg-[#128C7E] shadow-sm transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" /> WhatsApp
                          </a>
                          <button 
                            onClick={() => setReplyingTo(notif)}
                            className="flex items-center justify-center flex-1 sm:flex-none gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm transition-colors"
                          >
                            <MessageSquare className="w-4 h-4" /> Message
                          </button>
                        </>
                      )}
                    </div>
                    <button 
                      onClick={() => handleDelete(notif.id, !!notif.isSalesInquiry)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors w-full sm:w-auto"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* In-App Reply Modal */}
      {replyingTo && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-text">Reply to {replyingTo.fullName}</h3>
              <button onClick={() => setReplyingTo(null)} className="text-slate-400 hover:text-text text-xl">&times;</button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Message Content</label>
              <textarea 
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your message here... They will see this in their dashboard."
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors min-h-[120px] resize-y mb-6"
              />
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setReplyingTo(null)}
                  className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSendInAppMessage}
                  className="px-5 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
