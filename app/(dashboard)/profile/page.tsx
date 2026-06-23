'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { getUserProfile, updateUserProfile, UserProfileData } from '@/lib/db';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  User, Shield, CreditCard, Link as LinkIcon, Camera, MapPin, 
  Phone, BookOpen, Crown, History, Settings, RefreshCw 
} from 'lucide-react';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useSubscription } from '@/hooks/useSubscription';
import UpgradePrompt from '@/components/auth/UpgradePrompt';
import BrokerConnectModal from '@/components/brokers/BrokerConnectModal';

const BROKERS = [
  { id: 'zerodha', name: 'Zerodha Kite', initial: 'Z', color: 'bg-orange-100 text-orange-600' },
  { id: 'angelone', name: 'Angel One', initial: 'A', color: 'bg-blue-100 text-blue-600' },
  { id: 'upstox', name: 'Upstox', initial: 'U', color: 'bg-purple-100 text-purple-600' },
  { id: 'groww', name: 'Groww', initial: 'G', color: 'bg-emerald-100 text-emerald-600' },
  { id: 'aliceblue', name: 'Alice Blue', initial: 'AB', color: 'bg-indigo-100 text-indigo-600' },
  { id: '5paisa', name: '5Paisa', initial: '5P', color: 'bg-rose-100 text-rose-600' },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'personal' | 'brokers' | 'billing' | 'security'>('personal');
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [upgradeFeatureName, setUpgradeFeatureName] = useState('');
  
  const [selectedBroker, setSelectedBroker] = useState<any | null>(null);
  const [isBrokerModalOpen, setIsBrokerModalOpen] = useState(false);
  
  const { 
    plan, 
    canConnectBroker, 
    brokerLimit, 
    backtestCreditsUsed, 
    backtestCreditsLimit,
    maxActiveStrategies
  } = useSubscription();

  // Form States
  const [formData, setFormData] = useState<Partial<UserProfileData>>({});

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getUserProfile(user!.uid);
        if (data) {
          setProfile(data);
          setFormData(data);
        } else {
          const initialData = { email: user?.email || '' };
          setProfile(initialData);
          setFormData(initialData);
        }
      } catch (error) {
        console.error('Failed to load profile', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadProfile();
    }
  }, [user]);

  // Handle URL tab parameter
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tabParam = new URLSearchParams(window.location.search).get('tab');
      if (tabParam && ['personal', 'brokers', 'billing', 'security'].includes(tabParam)) {
        setActiveTab(tabParam as any);
      }
    }
  }, []);

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await updateUserProfile(user.uid, formData);
      setProfile({ ...profile, ...formData });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConnectBrokerInit = (broker: any) => {
    if (!user) return;
    const currentBrokers = profile?.brokers || [];
    if (currentBrokers.find(b => b.id === broker.id)) {
      toast.error('Broker is already connected');
      return;
    }

    if (!canConnectBroker) {
      setUpgradeFeatureName(`Connecting more than ${brokerLimit} broker${brokerLimit > 1 ? 's' : ''}`);
      setShowUpgradePrompt(true);
      return;
    }

    setSelectedBroker(broker);
    setIsBrokerModalOpen(true);
  };

  const handleConnectBrokerFinish = async (brokerId: string, brokerName: string, apiKey: string, apiSecret: string) => {
    if (!user) throw new Error("No user");
    const currentBrokers = profile?.brokers || [];
    const newBrokers = [...currentBrokers, { id: brokerId, name: brokerName, apiKey, apiSecret, connectedAt: new Date().toISOString() }];
    
    await updateUserProfile(user.uid, { brokers: newBrokers });
    setProfile(prev => ({ ...prev, brokers: newBrokers } as any));
  };

  const handleDisconnectBroker = async (brokerId: string) => {
    if (!user) return;
    const currentBrokers = profile?.brokers || [];
    const newBrokers = currentBrokers.filter(b => b.id !== brokerId);
    
    try {
      await updateUserProfile(user.uid, { brokers: newBrokers });
      setProfile(prev => ({ ...prev, brokers: newBrokers } as any));
      toast.success('Broker disconnected');
    } catch (error) {
      toast.error('Failed to disconnect broker');
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast.success('Password reset email sent. Check your inbox.');
    } catch (error) {
      toast.error('Failed to send reset email');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'brokers', label: 'Broker Connections', icon: LinkIcon },
    { id: 'billing', label: 'Subscription & Billing', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
  ] as const;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl">
      {/* Header Profile Section */}
      <div className="bg-white rounded-2xl p-6 border border-border shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="relative group cursor-pointer">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-3xl font-bold uppercase shadow-lg">
            {profile?.displayName?.[0] || user?.email?.[0] || 'U'}
          </div>
          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold text-text font-display flex items-center justify-center md:justify-start gap-2">
            {profile?.displayName || 'Apex Trader'}
            {profile?.subscription?.plan === 'Pro' && <Crown className="w-5 h-5 text-yellow-500" />}
          </h1>
          <p className="text-slate-500">{user?.email}</p>
          <div className="flex items-center justify-center md:justify-start gap-4 mt-3">
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md flex items-center gap-1.5">
              <MapPin className="w-3 h-3" /> {profile?.location || 'India'}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-600 rounded-md flex items-center gap-1.5">
              <BookOpen className="w-3 h-3" /> {profile?.experience || 'Intermediate'}
            </span>
          </div>
        </div>
        <div>
          <button onClick={() => setActiveTab('personal')} className="btn-primary px-4 py-2 rounded-xl text-sm font-semibold text-white w-full md:w-auto">
            Edit Profile
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all relative ${
                activeTab === tab.id 
                  ? 'text-primary bg-primary/10' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-primary' : 'text-slate-400'}`} />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="activeProfileTab" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-primary rounded-r-full" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 bg-white rounded-2xl border border-border shadow-sm overflow-hidden min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {/* PERSONAL INFO TAB */}
            {activeTab === 'personal' && (
              <motion.div key="personal" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="p-6 md:p-8 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-text mb-1">Personal Information</h2>
                  <p className="text-sm text-slate-500">Update your basic profile details and trading experience.</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Full Name</label>
                    <input 
                      type="text" 
                      value={formData.displayName || ''} 
                      onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                      placeholder="e.g. Rahul Kumar"
                      className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Phone Number</label>
                    <input 
                      type="tel" 
                      value={formData.phone || ''} 
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+91 9876543210"
                      className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Location (City)</label>
                    <input 
                      type="text" 
                      value={formData.location || ''} 
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="e.g. Mumbai, India"
                      className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Trading Experience</label>
                    <select 
                      value={formData.experience || ''} 
                      onChange={(e) => setFormData({...formData, experience: e.target.value as any})}
                      className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors appearance-none"
                    >
                      <option value="">Select Experience...</option>
                      <option value="Beginner">Beginner (&lt; 1 yr)</option>
                      <option value="Intermediate">Intermediate (1-3 yrs)</option>
                      <option value="Advanced">Advanced (3+ yrs)</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Bio / About Me</label>
                    <textarea 
                      value={formData.bio || ''} 
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      placeholder="Tell us a bit about your trading style..."
                      className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors min-h-[100px] resize-y" 
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border flex justify-end">
                  <button onClick={handleSaveProfile} disabled={isSaving} className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2">
                    {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* BROKERS TAB */}
            {activeTab === 'brokers' && (
              <motion.div key="brokers" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="p-6 md:p-8 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-text mb-1">Broker API Connections</h2>
                  <p className="text-sm text-slate-500">Connect your demat accounts to deploy live algorithmic strategies.</p>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {BROKERS.map(broker => {
                    const isConnected = profile?.brokers?.find(b => b.id === broker.id);
                    return (
                      <div key={broker.id} className={`p-4 rounded-xl border ${isConnected ? 'border-primary/50 bg-primary/5' : 'border-border bg-surface'} flex items-center justify-between transition-all`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${broker.color}`}>
                            {broker.initial}
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-text">{broker.name}</h3>
                            <p className={`text-xs font-semibold ${isConnected ? 'text-primary' : 'text-slate-400'}`}>
                              {isConnected ? 'Connected' : 'Not Connected'}
                            </p>
                          </div>
                        </div>
                        {isConnected ? (
                          <button onClick={() => handleDisconnectBroker(broker.id)} className="text-xs font-bold text-loss bg-loss/10 hover:bg-loss/20 px-3 py-1.5 rounded-lg transition-colors">
                            Disconnect
                          </button>
                        ) : (
                          <button onClick={() => handleConnectBrokerInit(broker)} className="text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors">
                            Connect
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* BILLING TAB */}
            {activeTab === 'billing' && (
              <motion.div key="billing" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="p-6 md:p-8 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-text mb-1">Subscription & Billing</h2>
                  <p className="text-sm text-slate-500">Manage your ApexQuant subscription plan and usage limits.</p>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                    <Crown className="w-32 h-32 transform rotate-12" />
                  </div>
                  <div className="relative z-10">
                    <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                      Current Plan
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                    profile?.subscription?.plan === 'Pro' ? 'bg-indigo-100 text-indigo-700' :
                    profile?.subscription?.plan === 'Enterprise' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                      {profile?.subscription?.plan || 'Free'} Tier
                    </span>
                    <p className="text-slate-300 text-sm mb-6 mt-4">
                      {profile?.subscription?.plan === 'Free' ? 'Upgrade to scale your trading.' : 'Your plan automatically renews on Nov 15, 2026.'}
                    </p>
                    
                    {profile?.subscription?.plan === 'Free' && (
                      <Link href="/pricing" className="px-5 py-2 bg-white text-slate-900 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm inline-block">
                        Upgrade to Pro
                      </Link>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div className="p-4 rounded-xl border border-border bg-surface">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Active Strategies</h4>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-black text-text">?</span>
                      <span className="text-sm text-slate-400 font-medium mb-1">/ {maxActiveStrategies} limit</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-surface">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Backtests Used</h4>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-black text-text">{backtestCreditsUsed}</span>
                      <span className="text-sm text-slate-400 font-medium mb-1">/ {backtestCreditsLimit === Infinity ? 'Unlimited' : backtestCreditsLimit}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <motion.div key="security" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="p-6 md:p-8 space-y-8">
                <div>
                  <h2 className="text-lg font-bold text-text mb-1">Security Settings</h2>
                  <p className="text-sm text-slate-500">Protect your account with advanced security measures.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface">
                    <div>
                      <h3 className="font-bold text-sm text-text">Password</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Change your account password via email link.</p>
                    </div>
                    <button onClick={handlePasswordReset} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                      Reset Password
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface">
                    <div>
                      <h3 className="font-bold text-sm text-text">Two-Factor Authentication (2FA)</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Add an extra layer of security to your account.</p>
                    </div>
                    <button className="px-4 py-2 bg-success/10 text-success rounded-lg text-sm font-bold hover:bg-success/20 transition-colors">
                      Enable 2FA
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <h3 className="font-bold text-sm text-text mb-4 flex items-center gap-2">
                    <History className="w-4 h-4 text-slate-400" /> Recent Login Activity
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm py-2 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-success"></div>
                        <span className="font-medium text-text">Windows PC • Chrome</span>
                      </div>
                      <span className="text-slate-400">Current Session</span>
                    </div>
                    <div className="flex items-center justify-between text-sm py-2 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                        <span className="font-medium text-slate-600">iPhone 14 Pro • Safari</span>
                      </div>
                      <span className="text-slate-400">Yesterday, 14:30 PM</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
      <UpgradePrompt 
        isOpen={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        title="Pro Feature"
        description={`${upgradeFeatureName} requires a Pro plan. Upgrade today to unlock your trading potential.`}
      />
      <BrokerConnectModal 
        isOpen={isBrokerModalOpen}
        onClose={() => setIsBrokerModalOpen(false)}
        broker={selectedBroker}
        onConnect={handleConnectBrokerFinish}
      />
    </div>
  );
}
