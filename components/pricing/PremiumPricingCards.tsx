'use client';

import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { updateUserProfile } from '@/lib/db';
import { useRouter } from 'next/navigation';
import ContactSalesModal from './ContactSalesModal';

interface Props {
  isYearly: boolean;
}

export default function PremiumPricingCards({ isYearly }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleUpgradePro = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    setLoading('Pro');
    try {
      // Mock payment delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update Firestore subscription plan to 'Pro'
      await updateUserProfile(user.uid, {
        subscription: {
          plan: 'Pro',
          status: 'active',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() as any, // Mock 1 month
          backtestCreditsUsed: 0,
          backtestCreditsLimit: 999999
        }
      });
      
      toast.success('Successfully upgraded to Pro! Welcome to ApexQuant Pro.', { duration: 4000 });
      router.push('/profile?tab=billing');
    } catch (error) {
      toast.error('Failed to process upgrade. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
        {/* Pro Plan - Exact Match to Screenshot */}
        <div className="bg-[#eff2fc] rounded-[2rem] p-8 relative flex flex-col shadow-lg border border-[#e2e8f0]">
          <div className="absolute top-6 right-6 bg-primary/15 text-primary text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
            MOST POPULAR
          </div>
          
          <h3 className="text-2xl font-black text-slate-900 mb-2 mt-2">Pro</h3>
          <p className="text-slate-500 text-[15px] font-medium mb-8 pr-12">
            For serious traders deploying capital.
          </p>
          
          <div className="mb-10">
            <div className="flex items-end gap-1 mb-1">
              <span className="text-[3.5rem] leading-none font-black text-slate-900 tracking-tight">₹{isYearly ? '9,999' : '1,499'}</span>
              <span className="text-slate-500 text-lg font-medium mb-2">/{isYearly ? 'year' : 'month'}</span>
            </div>
            {isYearly ? (
              <p className="text-success text-sm font-bold">Save ₹1,989 per year</p>
            ) : (
              <p className="text-slate-400 text-xs font-bold">Billed monthly · Cancel anytime</p>
            )}
          </div>
          
          <ul className="space-y-4 mb-10 flex-1">
            {[
              'Unlimited Backtests',
              '10 Live Strategies',
              'Advanced Indicators + Risk Tools',
              'Strategy Templates Access',
              'Priority Email Support',
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-[15px] font-bold text-slate-700">
                <Check className="w-5 h-5 text-primary shrink-0" strokeWidth={3} />
                {feature}
              </li>
            ))}
          </ul>
          
          <button 
            onClick={handleUpgradePro}
            disabled={loading === 'Pro'}
            className="w-full bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] hover:from-[#4338ca] hover:to-[#6d28d9] text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 text-lg"
          >
            {loading === 'Pro' ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Upgrade to Pro'}
          </button>
        </div>

        {/* Enterprise Plan - Exact Match to Screenshot */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-md flex flex-col hover:shadow-xl transition-shadow">
          <h3 className="text-2xl font-black text-slate-900 mb-2 mt-2">Enterprise / Elite</h3>
          <p className="text-slate-500 text-[15px] font-medium mb-8">
            Full institutional power for advanced quants.
          </p>
          
          <div className="mb-10">
            <div className="flex items-end gap-1 mb-1">
              <span className="text-[3.5rem] leading-none font-black text-slate-900 tracking-tight">₹{isYearly ? '29,999' : '4,999'}</span>
              <span className="text-slate-500 text-lg font-medium mb-2">/{isYearly ? 'year' : 'month'}</span>
            </div>
            {isYearly ? (
              <p className="text-slate-400 text-sm font-bold">Save ₹5,989 per year</p>
            ) : (
              <p className="text-slate-400 text-xs font-bold">Billed monthly · Cancel anytime</p>
            )}
          </div>
          
          <ul className="space-y-4 mb-10 flex-1">
            {[
              'Unlimited Everything',
              'Unlimited Live Strategies',
              'API Access + Webhooks',
              'Custom Indicator Development',
              'Dedicated Account Manager',
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-[15px] font-bold text-slate-600">
                <Check className="w-5 h-5 text-success shrink-0" strokeWidth={3} />
                {feature}
              </li>
            ))}
          </ul>
          
          <button 
            onClick={() => setIsSalesModalOpen(true)}
            className="w-full bg-[#0f172a] hover:bg-[#1e293b] text-white py-4 rounded-xl font-bold shadow-md transition-colors flex items-center justify-center gap-2 text-lg"
          >
            Contact Sales
          </button>
        </div>
      </div>

      <ContactSalesModal 
        isOpen={isSalesModalOpen} 
        onClose={() => setIsSalesModalOpen(false)} 
      />
    </>
  );
}
