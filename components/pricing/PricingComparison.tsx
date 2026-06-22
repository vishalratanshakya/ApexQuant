'use client';

import { Check, X } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';

const features = [
  { name: 'Active Strategies', free: '3', pro: '20', enterprise: 'Unlimited' },
  { name: 'Live Deployments', free: false, pro: 'Up to 10', enterprise: 'Unlimited' },
  { name: 'Backtests per Month', free: '10', pro: 'Unlimited', enterprise: 'Unlimited' },
  { name: 'Backtest History', free: '1 Year', pro: '5+ Years', enterprise: 'Unlimited' },
  { name: 'Indicators Library', free: '30+ Basic', pro: '100+ Advanced', enterprise: 'All + Custom' },
  { name: 'Broker Connections', free: '1', pro: '5', enterprise: 'Unlimited' },
  { name: 'Advanced Risk Tools', free: 'Basic', pro: 'Full (Trailing SL, Re-entry, etc.)', enterprise: 'Full + Custom' },
  { name: 'Multi-Leg Options Builder', free: 'Limited', pro: 'Full', enterprise: 'Full' },
  { name: 'Strategy Marketplace & Templates', free: false, pro: 'Full Access', enterprise: 'Full Access' },
  { name: 'Real-time Alerts', free: 'Email Only', pro: 'WhatsApp + Telegram + Email', enterprise: 'All + Priority' },
  { name: 'Support', free: 'Community', pro: '24/7 Email', enterprise: 'Dedicated Manager' },
  { name: 'API Access & Webhooks', free: false, pro: 'Limited', enterprise: 'Full' },
  { name: 'Monthly Backtest Credits', free: 'Limited', pro: 'Unlimited', enterprise: 'Unlimited' },
];

export default function PricingComparison() {
  const { user } = useAuth();
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Compare Features</h2>
        <p className="text-slate-500 max-w-2xl mx-auto">Everything you need to know to choose the perfect plan for your algorithmic trading journey.</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm mb-12">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b-2 border-slate-200">
              <th className="py-6 px-6 font-bold text-slate-700 w-1/4 bg-slate-50/50">Feature</th>
              <th className="py-6 px-6 font-bold text-slate-700 text-center w-1/4">
                <div className="text-lg">Free</div>
                <div className="text-sm font-medium text-slate-400 mt-1">₹0/mo</div>
              </th>
              <th className="py-6 px-6 font-bold text-primary text-center w-1/4 bg-primary/5">
                <div className="inline-block bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md whitespace-nowrap mb-2">
                  Most Popular
                </div>
                <div className="text-lg mt-2">Pro</div>
                <div className="text-sm font-medium text-primary/70 mt-1">₹1,499/mo</div>
              </th>
              <th className="py-6 px-6 font-bold text-slate-900 text-center w-1/4">
                <div className="text-lg">Enterprise</div>
                <div className="text-sm font-medium text-slate-400 mt-1">₹4,999/mo</div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {features.map((feature, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors group">
                <td className="py-5 px-6 font-semibold text-slate-700 bg-slate-50/20 group-hover:bg-slate-50 transition-colors">{feature.name}</td>
                
                <td className="py-5 px-6 text-center text-slate-500 font-medium">
                  {typeof feature.free === 'boolean' ? (
                    feature.free ? <Check className="w-5 h-5 text-success mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />
                  ) : (
                    <span className={feature.free === 'Not Available' ? 'text-slate-400' : ''}>{feature.free}</span>
                  )}
                </td>
                
                <td className="py-5 px-6 text-center text-slate-800 font-bold bg-primary/5">
                  {typeof feature.pro === 'boolean' ? (
                    feature.pro ? <Check className="w-5 h-5 text-primary mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />
                  ) : (
                    feature.pro
                  )}
                </td>
                
                <td className="py-5 px-6 text-center text-slate-800 font-medium">
                  {typeof feature.enterprise === 'boolean' ? (
                    feature.enterprise ? <Check className="w-5 h-5 text-slate-900 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />
                  ) : (
                    feature.enterprise
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-3xl p-10 max-w-3xl mx-auto shadow-sm">
        <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Ready to scale your trading?</h3>
        <p className="text-slate-500 mb-8 max-w-lg mx-auto">Upgrade to Pro today to unlock Live Deployments, advanced risk management tools, and unlimited backtests.</p>
        <Link href={user ? '/profile' : '/register'} className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary/90 shadow-xl shadow-primary/25 transition-all">
          Upgrade to Pro Today
        </Link>
      </div>
    </div>
  );
}
