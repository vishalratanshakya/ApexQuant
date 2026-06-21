'use client';

import Link from 'next/link';
import StrategyCard from '@/components/dashboard/StrategyCard';
import { Activity } from 'lucide-react';

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
  return (
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
  );
}
