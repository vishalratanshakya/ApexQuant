'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Check } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-navy text-text selection-blue font-sans">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-text font-display mb-6">
              Simple, transparent pricing
            </h1>
            <p className="text-lg text-slate-500">
              Start building strategies for free, upgrade when you need live deployments and advanced analytics.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="glass-card rounded-3xl p-8 border border-border bg-white flex flex-col">
              <h3 className="text-xl font-bold text-text mb-2">Basic</h3>
              <p className="text-slate-500 text-sm mb-6">Perfect for learning and testing strategies.</p>
              <div className="mb-8">
                <span className="text-4xl font-black text-text">₹0</span>
                <span className="text-slate-500">/forever</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {['Basic Strategy Builder', '10 Backtests / day', 'End-of-day Data', 'Community Support'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <Check className="w-5 h-5 text-success" /> {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full btn-secondary py-3 rounded-xl font-semibold">Get Started</button>
            </div>

            {/* Pro Plan */}
            <div className="glass-card rounded-3xl p-8 pricing-popular flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-accent text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                Most Popular
              </div>
              <h3 className="text-xl font-bold text-text mb-2">Pro</h3>
              <p className="text-slate-500 text-sm mb-6">For serious traders deploying capital.</p>
              <div className="mb-8">
                <span className="text-4xl font-black text-text">₹1,999</span>
                <span className="text-slate-500">/month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {['Advanced Multi-leg Options Builder', 'Unlimited Fast Backtests', 'Tick-by-tick Live Data', 'Deploy up to 5 Live Strategies', 'Priority Email & Chat Support'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                    <Check className="w-5 h-5 text-primary" /> {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full btn-primary py-3 rounded-xl font-semibold text-white">Upgrade to Pro</button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
