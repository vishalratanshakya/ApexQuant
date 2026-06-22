'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, Server, Shield, Mail, Bell, Settings2, RefreshCw, AlertOctagon
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

export function SettingsTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    general: { platformName: 'ApexQuant', tagline: 'Algorithmic Trading Platform', contactEmail: 'support@apexquant.com' },
    features: { allowNewRegistrations: true, enableLiveTrading: true, enableAiScanner: false, maintenanceMode: false },
    security: { require2FA: false, sessionTimeout: 60, minPasswordLength: 8 },
    system: { maxLiveStrategiesPerUser: 5, dataRetentionDays: 90 }
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'global'));
        if (docSnap.exists()) {
          setSettings(prev => ({ ...prev, ...docSnap.data() }));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (section: string) => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'global'), settings, { merge: true });
      toast.success(`${section} settings saved`);
    } catch (e) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading settings...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6 pb-20">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Platform Settings</h2>
        <p className="text-sm text-slate-500">Configure global platform behavior and features</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* General Settings */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-4">
            <Settings2 className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-800 text-lg">General Settings</h3>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Platform Name</label>
            <input 
              type="text" value={settings.general.platformName} 
              onChange={e => setSettings({...settings, general: {...settings.general, platformName: e.target.value}})}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Support Email</label>
            <input 
              type="email" value={settings.general.contactEmail}
              onChange={e => setSettings({...settings, general: {...settings.general, contactEmail: e.target.value}})}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
          <button onClick={() => handleSave('General')} disabled={saving} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Save className="w-4 h-4" /> Save General
          </button>
        </div>

        {/* Feature Flags */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-4">
            <Server className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-lg">Feature Flags</h3>
          </div>
          
          {[
            { id: 'allowNewRegistrations', label: 'Allow New User Registrations', desc: 'Enable or disable public signups' },
            { id: 'enableLiveTrading', label: 'Enable Live Trading Engine', desc: 'Global kill switch for all live deployments' },
            { id: 'enableAiScanner', label: 'AI Market Scanner', desc: 'Enable experimental AI features' },
            { id: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Show maintenance page to all non-admin users', danger: true },
          ].map(flag => (
            <div key={flag.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50">
              <div>
                <p className={`text-sm font-bold ${flag.danger ? 'text-red-600' : 'text-slate-800'}`}>{flag.label}</p>
                <p className="text-xs text-slate-500">{flag.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={(settings.features as any)[flag.id]}
                  onChange={e => setSettings({...settings, features: {...settings.features, [flag.id]: e.target.checked}})}
                />
                <div className={`w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${flag.danger ? 'peer-checked:bg-red-500' : 'peer-checked:bg-blue-600'}`}></div>
              </label>
            </div>
          ))}

          <button onClick={() => handleSave('Features')} disabled={saving} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Flags
          </button>
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-4">
            <Shield className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-800 text-lg">Security & Privacy</h3>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Session Timeout (Minutes)</label>
            <input 
              type="number" value={settings.security.sessionTimeout}
              onChange={e => setSettings({...settings, security: {...settings.security, sessionTimeout: parseInt(e.target.value)}})}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 mt-4">
            <div>
              <p className="text-sm font-bold text-slate-800">Enforce Global 2FA</p>
              <p className="text-xs text-slate-500">Require all users to setup 2FA</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" className="sr-only peer"
                checked={settings.security.require2FA}
                onChange={e => setSettings({...settings, security: {...settings.security, require2FA: e.target.checked}})}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <button onClick={() => handleSave('Security')} disabled={saving} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Security
          </button>
        </div>

        {/* System & Limits */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-4">
            <AlertOctagon className="w-5 h-5 text-orange-600" />
            <h3 className="font-bold text-slate-800 text-lg">System Limits</h3>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Max Live Strategies Per User</label>
            <input 
              type="number" value={settings.system.maxLiveStrategiesPerUser}
              onChange={e => setSettings({...settings, system: {...settings.system, maxLiveStrategiesPerUser: parseInt(e.target.value)}})}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Log Retention Period (Days)</label>
            <input 
              type="number" value={settings.system.dataRetentionDays}
              onChange={e => setSettings({...settings, system: {...settings.system, dataRetentionDays: parseInt(e.target.value)}})}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
          <button onClick={() => handleSave('System')} disabled={saving} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Limits
          </button>
        </div>

      </div>
    </motion.div>
  );
}
