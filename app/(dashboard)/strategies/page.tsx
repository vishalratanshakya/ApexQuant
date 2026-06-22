'use client';

import { useStrategies } from '@/hooks/useStrategies';
import { useSubscription } from '@/hooks/useSubscription';
import Link from 'next/link';
import { Plus, Layers, Play, Settings, Clock, Activity, Loader2, Lock } from 'lucide-react';
import PlanGuard from '@/components/auth/PlanGuard';

export default function StrategiesPage() {
  const { strategies, loading: strategiesLoading } = useStrategies();
  const { maxSavedStrategies, loading: subLoading } = useSubscription();

  const loading = strategiesLoading || subLoading;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Live': return 'bg-success/10 text-success border-success/20';
      case 'Backtesting': return 'bg-primary/10 text-primary border-primary/20';
      case 'Draft': return 'bg-slate-100 text-slate-500 border-slate-200';
      case 'Paused': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Layers className="w-8 h-8 text-primary" />
            My Strategies
          </h1>
          <p className="text-slate-500 mt-2">Manage, backtest, and deploy your algorithmic trading strategies.</p>
        </div>
        {strategies.length >= maxSavedStrategies ? (
          <PlanGuard requiresPro={true} featureName="Unlimited Strategies" actionType="intercept">
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-slate-400 cursor-not-allowed shadow-none w-full sm:w-auto">
              <Lock className="w-4 h-4" />
              Limit Reached ({maxSavedStrategies}/{maxSavedStrategies})
            </button>
          </PlanGuard>
        ) : (
          <Link 
            href="/builder"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white btn-primary shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all w-full sm:w-auto"
          >
            <Plus className="w-5 h-5" />
            Create New Strategy
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-border shadow-sm">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Loading your strategies...</p>
        </div>
      ) : strategies.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-border shadow-sm text-center px-4">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
            <Layers className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No strategies yet</h3>
          <p className="text-slate-500 mb-6 max-w-md">You haven't created any trading strategies yet. Head over to the Strategy Builder to create your first algorithmic strategy without writing a single line of code.</p>
          <Link 
            href="/builder"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Go to Builder
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-border">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Strategy Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Instrument</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Updated</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {strategies.map((strategy) => (
                  <tr key={strategy.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                          <Activity className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{strategy.name || 'Untitled Strategy'}</div>
                          <div className="text-xs font-medium text-slate-500 mt-0.5">{strategy.conditions?.length || 0} Conditions</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                          {strategy.instrument}
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                          {strategy.timeframe}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(strategy.status)}`}>
                        {strategy.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
                        <Clock className="w-4 h-4" />
                        {strategy.updatedAt?.seconds 
                          ? new Date(strategy.updatedAt.seconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          : 'Just now'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 transition-opacity">
                        <Link 
                          href={`/builder`}
                          className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Open in Builder"
                        >
                          <Settings className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
