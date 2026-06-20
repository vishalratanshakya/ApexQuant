'use client';

import { useAuth } from '@/providers/AuthProvider';
import { Settings, Shield, CreditCard, Link as LinkIcon } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-text font-display mb-1 flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-500" /> Profile & Settings
        </h1>
        <p className="text-sm text-text-light">Manage your account, billing, and broker connections.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-2">
          {['General', 'Security', 'Billing', 'Broker APIs'].map((tab, i) => (
            <button key={tab} className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${i === 0 ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-50'}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="glass-card rounded-xl border border-border p-6 bg-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl uppercase">
                {user?.email?.[0] || 'U'}
              </div>
              <div>
                <h2 className="text-base font-bold text-text">{user?.email}</h2>
                <p className="text-xs text-success font-semibold">Pro Plan Active</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Email Address</label>
                <input type="email" disabled value={user?.email || ''} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Display Name</label>
                <input type="text" defaultValue="Apex Trader" className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
              </div>
              <button className="btn-primary px-4 py-2 rounded-xl text-sm font-semibold text-white">
                Save Changes
              </button>
            </div>
          </div>

          <div className="glass-card rounded-xl border border-border p-6 bg-white">
            <h3 className="font-bold text-text flex items-center gap-2 mb-4">
              <LinkIcon className="w-4 h-4 text-slate-400" /> Connected Brokers
            </h3>
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-xs">
                  Z
                </div>
                <div>
                  <p className="text-sm font-bold text-text">Zerodha Kite</p>
                  <p className="text-xs text-slate-500">Connected on Oct 10, 2023</p>
                </div>
              </div>
              <button className="text-xs font-bold text-loss bg-loss/10 hover:bg-loss/20 px-3 py-1.5 rounded-lg transition-colors">
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
