'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PricingCards from '@/components/pricing/PricingCards';
import PricingComparison from '@/components/pricing/PricingComparison';
import PricingFAQ from '@/components/pricing/PricingFAQ';

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <div className="min-h-screen bg-navy text-text selection-blue font-sans relative overflow-hidden">
      <Navbar />

      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <main className="pt-32 pb-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-6xl font-black text-text font-display mb-6 tracking-tight">
              Simple Pricing for <span className="text-primary">Serious Traders</span>
            </h1>
            <p className="text-lg text-slate-500 mb-10 font-medium">
              Start free. Scale as you grow. No hidden fees.
            </p>
            
            {/* Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm font-bold ${!isYearly ? 'text-text' : 'text-slate-400'}`}>Monthly</span>
              <button 
                onClick={() => setIsYearly(!isYearly)}
                className="relative w-16 h-8 rounded-full bg-slate-200 p-1 transition-colors hover:bg-slate-300"
              >
                <div 
                  className={`w-6 h-6 rounded-full bg-primary shadow-sm transition-transform duration-300 ${isYearly ? 'translate-x-8' : 'translate-x-0'}`} 
                />
              </button>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${isYearly ? 'text-text' : 'text-slate-400'}`}>Yearly</span>
                <span className="text-[10px] font-bold px-2 py-1 bg-success/10 text-success rounded-full uppercase tracking-wider">Save 17%</span>
              </div>
            </div>
          </div>

          <PricingCards isYearly={isYearly} />
          
          <div className="mt-32">
            <PricingComparison />
          </div>

          <div className="mt-32">
            <PricingFAQ />
          </div>

          {/* Trust Signals */}
          <div className="mt-20 pt-10 border-t border-slate-200 flex flex-wrap items-center justify-center gap-8 text-slate-400 text-sm font-semibold uppercase tracking-wider">
            <span>Cancel Anytime</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span>30-Day Money Back</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span>SEBI Compliant Execution</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
