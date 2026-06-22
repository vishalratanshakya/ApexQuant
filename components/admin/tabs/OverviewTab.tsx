import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Users, CreditCard, Activity, Globe } from 'lucide-react';

const TradingViewChart = dynamic(() => import('@/components/dashboard/TradingViewChart'), { ssr: false });

function generateChartData(startValue: number, trend: number, variance: number, days: number = 30) {
  const data = [];
  let currentValue = startValue;
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    currentValue = currentValue + trend + (Math.random() - 0.5) * variance;
    data.push({
      time: time.toISOString().split('T')[0],
      value: Number(Math.max(0, currentValue).toFixed(2)),
    });
  }
  return data;
}

export function OverviewTab() {
  const userGrowthData = useMemo(() => generateChartData(3500, 25, 50, 30), []);
  const revenueData = useMemo(() => generateChartData(1000000, 15000, 50000, 30), []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pt-6">
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* User Growth Chart */}
        <div className="glass-card rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-base font-bold text-text flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" /> User Growth
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Total registered users over the last 30 days</p>
            </div>
            <span className="text-sm font-bold text-success">+14.2%</span>
          </div>
          <div className="h-[300px] w-full p-6">
            <TradingViewChart data={userGrowthData} />
          </div>
        </div>

        {/* Revenue Trend Chart */}
        <div className="glass-card rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-base font-bold text-text flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-500" /> Revenue Trend
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Platform revenue in ₹ over the last 30 days</p>
            </div>
            <span className="text-sm font-bold text-success">+22.5%</span>
          </div>
          <div className="h-[300px] w-full p-6">
            <TradingViewChart data={revenueData} />
          </div>
        </div>

      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Users Map/Widget */}
        <div className="glass-card rounded-2xl border border-border bg-white shadow-sm overflow-hidden lg:col-span-2 p-6 flex flex-col justify-center min-h-[300px]">
          <div className="flex items-center gap-2 mb-6">
            <Globe className="w-5 h-5 text-slate-400" />
            <h2 className="text-base font-bold text-text">Global Active Sessions</h2>
          </div>
          
          <div className="flex-1 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 overflow-hidden">
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
              <div className="text-center relative z-10">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-500/10 mb-4 animate-pulse">
                  <Activity className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-4xl font-bold text-slate-800 tracking-tight">1,248</h3>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mt-1">Users Online Now</p>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Distribution */}
        <div className="glass-card rounded-2xl border border-border bg-white shadow-sm overflow-hidden p-6">
          <h2 className="text-base font-bold text-text mb-6">Subscription Tiers</h2>
          <div className="space-y-6">
            {[
              { label: 'Elite Plan', value: '45%', count: '1,930', color: 'bg-indigo-500' },
              { label: 'Pro Plan', value: '35%', count: '1,501', color: 'bg-blue-500' },
              { label: 'Free Plan', value: '20%', count: '858', color: 'bg-slate-300' },
            ].map((tier, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-slate-700">{tier.label}</span>
                  <span className="text-slate-500">{tier.count} users</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className={`${tier.color} h-2.5 rounded-full`} style={{ width: tier.value }}></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100">
            <button className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-bold rounded-xl transition-colors">
              View Detailed Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
