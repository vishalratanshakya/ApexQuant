'use client';
import { Check, X, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface Props {
  isYearly: boolean;
}

export default function PricingCards({ isYearly }: Props) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = (plan: string) => {
    setLoading(plan);
    setTimeout(() => {
      setLoading(null);
      toast.success(`Successfully subscribed to ${plan} plan!`);
    }, 1500);
  };

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {/* Free Plan */}
      <div className="glass-card rounded-3xl p-8 border border-border bg-white flex flex-col hover:shadow-xl transition-shadow">
        <h3 className="text-xl font-bold text-text mb-2">Free / Starter</h3>
        <p className="text-slate-500 text-sm mb-6">Perfect for learning and testing strategies.</p>
        <div className="mb-8">
          <span className="text-4xl font-black text-text">₹0</span>
          <span className="text-slate-500 font-medium">/month</span>
        </div>
        <ul className="space-y-4 mb-8 flex-1">
          <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
            <Check className="w-5 h-5 text-success shrink-0" /> 10 Backtests/month
          </li>
          <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
            <Check className="w-5 h-5 text-success shrink-0" /> Basic Indicators
          </li>
          <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
            <Check className="w-5 h-5 text-success shrink-0" /> Community Support
          </li>
          <li className="flex items-center gap-3 text-sm font-medium text-slate-400 opacity-75">
            <X className="w-5 h-5 text-slate-300 shrink-0" /> No Live Deployment
          </li>
        </ul>
        <button 
          onClick={() => handleSubscribe('Free')}
          disabled={loading === 'Free'}
          className="w-full btn-secondary py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          {loading === 'Free' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Get Started Free'}
        </button>
      </div>

      {/* Pro Plan */}
      <div className="glass-card rounded-3xl p-8 pricing-popular flex flex-col relative overflow-hidden transform lg:-translate-y-4 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-accent" />
        <div className="absolute top-4 right-4 bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Most Popular
        </div>
        <h3 className="text-xl font-bold text-text mb-2 mt-2">Pro</h3>
        <p className="text-slate-500 text-sm mb-6">For serious traders deploying capital.</p>
        <div className="mb-8 h-20">
          <div className="flex items-end gap-1">
            <span className="text-4xl font-black text-text">₹{isYearly ? '9,999' : '999'}</span>
            <span className="text-slate-500 font-medium mb-1">/{isYearly ? 'year' : 'month'}</span>
          </div>
          {isYearly && <p className="text-success text-xs font-bold mt-2">Save ₹1,989 per year</p>}
        </div>
        <ul className="space-y-4 mb-8 flex-1">
          <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
            <Check className="w-5 h-5 text-primary shrink-0" /> Unlimited Backtests
          </li>
          <li className="flex items-center gap-3 text-sm font-bold text-slate-700">
            <Check className="w-5 h-5 text-primary shrink-0" /> 10 Live Strategies
          </li>
          <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
            <Check className="w-5 h-5 text-primary shrink-0" /> Advanced Indicators + Risk Tools
          </li>
          <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
            <Check className="w-5 h-5 text-primary shrink-0" /> Strategy Templates Access
          </li>
          <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
            <Check className="w-5 h-5 text-primary shrink-0" /> Priority Email Support
          </li>
        </ul>
        <button 
          onClick={() => handleSubscribe('Pro')}
          disabled={loading === 'Pro'}
          className="w-full btn-primary py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2"
        >
          {loading === 'Pro' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Upgrade to Pro'}
        </button>
      </div>

      {/* Enterprise Plan */}
      <div className="glass-card rounded-3xl p-8 border border-border bg-white flex flex-col hover:shadow-xl transition-shadow">
        <h3 className="text-xl font-bold text-text mb-2">Enterprise / Elite</h3>
        <p className="text-slate-500 text-sm mb-6">Full institutional power for advanced quants.</p>
        <div className="mb-8 h-20">
          <div className="flex items-end gap-1">
            <span className="text-4xl font-black text-text">₹{isYearly ? '29,999' : '2,999'}</span>
            <span className="text-slate-500 font-medium mb-1">/{isYearly ? 'year' : 'month'}</span>
          </div>
          {isYearly && <p className="text-slate-400 text-xs font-bold mt-2">Save ₹5,989 per year</p>}
        </div>
        <ul className="space-y-4 mb-8 flex-1">
          <li className="flex items-center gap-3 text-sm font-bold text-slate-800">
            <Check className="w-5 h-5 text-slate-800 shrink-0" /> Unlimited Everything
          </li>
          <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
            <Check className="w-5 h-5 text-success shrink-0" /> Unlimited Live Strategies
          </li>
          <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
            <Check className="w-5 h-5 text-success shrink-0" /> API Access + Webhooks
          </li>
          <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
            <Check className="w-5 h-5 text-success shrink-0" /> Custom Indicator Development
          </li>
          <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
            <Check className="w-5 h-5 text-success shrink-0" /> Dedicated Account Manager
          </li>
        </ul>
        <button 
          onClick={() => handleSubscribe('Enterprise')}
          disabled={loading === 'Enterprise'}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
        >
          {loading === 'Enterprise' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Contact Sales'}
        </button>
      </div>
    </div>
  );
}
