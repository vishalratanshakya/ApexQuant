'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle2, Building2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/providers/AuthProvider';

interface ContactSalesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactSalesModal({ isOpen, onClose }: ContactSalesModalProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    email: user?.email || '',
    phone: '',
    volume: '0-1Cr',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, 'sales_inquiries'), {
        ...formData,
        userId: user ? user.uid : null,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      
      // Trigger automatic WhatsApp message in the background
      fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formData.phone,
          fullName: formData.fullName,
          company: formData.company
        }),
      }).catch(err => console.error('Failed to trigger WhatsApp API:', err));
      
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setFormData({
          fullName: '',
          company: '',
          email: user?.email || '',
          phone: '',
          volume: '0-1Cr',
          message: ''
        });
      }, 3000);
    } catch (error) {
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg my-8 overflow-hidden relative"
          >
            {isSuccess ? (
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-success" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Request Received!</h3>
                <p className="text-slate-500 font-medium">Our sales team will contact you within 24 hours.</p>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 leading-tight">Contact Enterprise Sales</h3>
                      <p className="text-xs text-slate-500">We'll tailor a plan to your institutional needs.</p>
                    </div>
                  </div>
                  <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                      <input 
                        type="text" required
                        value={formData.fullName}
                        onChange={e => setFormData({...formData, fullName: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-primary focus:bg-white outline-none transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Company Name</label>
                      <input 
                        type="text" required
                        value={formData.company}
                        onChange={e => setFormData({...formData, company: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-primary focus:bg-white outline-none transition-colors"
                        placeholder="Apex Capital"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                      <input 
                        type="email" required
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-primary focus:bg-white outline-none transition-colors"
                        placeholder="john@company.com"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                      <input 
                        type="tel" required
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-primary focus:bg-white outline-none transition-colors"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monthly Trading Volume</label>
                    <select 
                      value={formData.volume}
                      onChange={e => setFormData({...formData, volume: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-primary focus:bg-white outline-none transition-colors"
                    >
                      <option value="0-1Cr">₹0 - ₹1 Crore</option>
                      <option value="1-10Cr">₹1 Crore - ₹10 Crores</option>
                      <option value="10-100Cr">₹10 Crores - ₹100 Crores</option>
                      <option value="100Cr+">₹100 Crores+</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Requirements</label>
                    <textarea 
                      required rows={3}
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-primary focus:bg-white outline-none transition-colors resize-none"
                      placeholder="Tell us about your custom API needs, broker integrations, or white-labeling..."
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full btn-primary py-4 rounded-xl font-bold text-white shadow-lg shadow-primary/25 mt-6 flex items-center justify-center gap-2 hover:shadow-primary/40 transition-all"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Request'}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
