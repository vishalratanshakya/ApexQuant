'use client';

import Link from 'next/link';
import StrategyCard from '@/components/dashboard/StrategyCard';
import { Activity, Lock } from 'lucide-react';
import PlanGuard from '@/components/auth/PlanGuard';

const liveStrategies = [
  {
    id: '1',
    name: 'NIFTY Breakout Pro',
    status: 'live' as const,
    pnl: '₹42,500',
    pnlPercent: '12.4%',
    winRate: '68%',
    isPositive: true,
    instrument: 'NIFTY 50',
    timeframe: '5m',
  },
];

export default function LiveStrategiesPage() {
  const freeFallback = (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 relative">
        <Activity className="w-10 h-10 text-primary" />
        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center border-2 border-white">
          <Lock className="w-4 h-4 text-white" />
        </div>
      </div>
      <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Live Trading is a Pro Feature</h2>
      <p className="text-lg text-slate-500 mb-8 max-w-md mx-auto">
        Upgrade to our Pro plan to deploy up to 10 algorithmic strategies directly to your broker account for automated execution.
      </p>
      <Link href="/pricing" className="btn-primary px-8 py-3.5 rounded-xl font-bold text-white shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all">
        View Pricing Plans
      </Link>
    </div>
  );

  return (
    <PlanGuard requiresPro={true} actionType="hide" fallback={freeFallback}>
      <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-text font-display mb-1 flex items-center gap-2">
          <Activity className="w-6 h-6 text-success" /> Live Deployments
        </h1>
        <p className="text-sm text-text-light">Manage your currently running algorithmic strategies.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {liveStrategies.map((strategy) => (
          <StrategyCard key={strategy.id} {...strategy} />
        ))}
        {/* Placeholder for no strategies */}
        <div className="glass-card rounded-xl p-8 border border-dashed border-border flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4">
            <Activity className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="font-bold text-text mb-2">Deploy a new strategy</h3>
          <p className="text-sm text-slate-500 mb-6">You have capacity for 4 more live strategies on your Pro plan.</p>
          <Link href="/builder" className="btn-primary px-4 py-2 rounded-xl text-sm font-semibold text-white">
            Go to Builder
          </Link>
        </div>
      </div>
        </div>
      </div>
    </PlanGuard>
  );
}
