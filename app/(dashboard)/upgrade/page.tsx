'use client';

import { useState } from 'react';
import PremiumPricingCards from '@/components/pricing/PremiumPricingCards';
import PricingComparison from '@/components/pricing/PricingComparison';
import PricingFAQ from '@/components/pricing/PricingFAQ';

export default function UpgradePage() {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto pt-8">
        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-full mb-4">
          Upgrade Your Account
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 font-display mb-6 tracking-tight">
          Unlock Full Power with <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Pro</span>
        </h1>
        <p className="text-lg text-slate-500 mb-10 font-medium">
          For serious traders who want full automation, unlimited backtests, and live deployment capabilities.
        </p>

        {/* Pricing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <span className={`text-sm font-bold ${!isYearly ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
          <button 
            onClick={() => setIsYearly(!isYearly)}
            className="relative w-16 h-8 rounded-full bg-slate-200 p-1 transition-colors hover:bg-slate-300"
          >
            <div 
              className={`w-6 h-6 rounded-full bg-primary shadow-sm transition-transform duration-300 ${isYearly ? 'translate-x-8' : 'translate-x-0'}`} 
            />
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${isYearly ? 'text-slate-900' : 'text-slate-400'}`}>Yearly</span>
            <span className="text-[10px] font-bold px-2 py-1 bg-success/10 text-success rounded-full uppercase tracking-wider">Save 17%</span>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <PremiumPricingCards isYearly={isYearly} />

      {/* Comparison Section */}
      <div className="pt-24">
        <PricingComparison />
      </div>

      {/* FAQ Section */}
      <div className="pt-16">
        <PricingFAQ />
      </div>

    </div>
  );
}
