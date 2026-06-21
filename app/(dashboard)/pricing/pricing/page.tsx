'use client';

import { Check, ArrowRight, Zap } from 'lucide-react';

export default function DashboardPricingPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div className="text-center max-w-3xl mx-auto mb-16 mt-8">
        <h1 className="text-3xl md:text-4xl font-black text-text font-display mb-4">
          Upgrade your trading arsenal
        </h1>
        <p className="text-sm text-slate-500">
          Start building strategies for free, upgrade when you need live deployments and advanced analytics.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {/* Starter Plan */}
        <div className="bg-white rounded-3xl p-8 border border-border shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <h3 className="text-xl font-extrabold text-text mb-4">Starter</h3>
          <div className="mb-2">
            <span className="text-5xl font-black text-primary">Free</span>
          </div>
          <p className="text-xs font-semibold text-slate-400 mb-6">Forever free · No credit card needed</p>
          <p className="text-sm font-medium text-slate-600 mb-8 h-10">
            Perfect for learning algo trading concepts and paper trading.
          </p>
          
          <button className="w-full bg-white border border-primary text-primary hover:bg-primary/5 py-3 rounded-xl font-bold transition-colors mb-8 flex items-center justify-center gap-2">
            Get Started Free <ArrowRight className="w-4 h-4" />
          </button>
          
          <ul className="space-y-4 flex-1">
            {[
              '3 active strategies',
              'Paper trading only',
              '1-year backtest window',
              'Community support',
              'Basic indicators (20+)',
              '1 broker connection'
            ].map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-600">
                <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pro Plan */}
        <div className="bg-[#eff2fc] rounded-3xl p-8 border border-[#e2e8f0] shadow-lg flex flex-col relative transform lg:-translate-y-4">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
            <Zap className="w-3 h-3 fill-current" /> Most Popular
          </div>
          
          <h3 className="text-xl font-extrabold text-text mb-4 mt-2">Pro</h3>
          <div className="mb-2 flex items-baseline">
            <span className="text-2xl font-bold text-slate-500 mr-1">₹</span>
            <span className="text-5xl font-black text-text">1,499</span>
            <span className="text-sm font-semibold text-slate-500 ml-1">/month</span>
          </div>
          <p className="text-xs font-semibold text-slate-400 mb-6">Billed monthly · Cancel anytime</p>
          <p className="text-sm font-medium text-slate-700 mb-8 h-10">
            For active traders who want full automation and live deployment.
          </p>
          
          <button className="w-full bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white hover:opacity-90 py-3 rounded-xl font-bold transition-opacity shadow-md mb-8 flex items-center justify-center gap-2">
            Start Pro Trial <ArrowRight className="w-4 h-4" />
          </button>
          
          <ul className="space-y-4 flex-1">
            {[
              '20 active strategies',
              'Live trading enabled',
              '5-year backtest window',
              'Priority support (24/7)',
              'Advanced indicators (100+)',
              '5 broker connections',
              'WhatsApp + Telegram alerts',
              'Strategy marketplace access'
            ].map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-white rounded-3xl p-8 border border-border shadow-sm flex flex-col hover:shadow-md transition-shadow">
          <h3 className="text-xl font-extrabold text-text mb-4">Enterprise</h3>
          <div className="mb-2 flex items-baseline">
            <span className="text-2xl font-bold text-slate-500 mr-1">₹</span>
            <span className="text-5xl font-black text-text">4,999</span>
            <span className="text-sm font-semibold text-slate-500 ml-1">/month</span>
          </div>
          <p className="text-xs font-semibold text-slate-400 mb-6">Billed monthly · Cancel anytime</p>
          <p className="text-sm font-medium text-slate-600 mb-8 h-10">
            For professional traders, prop firms, and HNIs with custom needs.
          </p>
          
          <button className="w-full bg-white border border-primary text-primary hover:bg-primary/5 py-3 rounded-xl font-bold transition-colors mb-8 flex items-center justify-center gap-2">
            Contact Sales <ArrowRight className="w-4 h-4" />
          </button>
          
          <ul className="space-y-4 flex-1">
            {[
              'Unlimited strategies',
              'Live trading enabled',
              'Full historical backtest',
              'Dedicated account manager',
              'Custom indicators (Python)',
              'Unlimited broker connections',
              'API access (REST + WebSocket)',
              'White-label option'
            ].map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-600">
                <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
