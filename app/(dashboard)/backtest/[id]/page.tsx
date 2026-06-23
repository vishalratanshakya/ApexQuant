'use client';

import { Activity, Download, Play, ShieldAlert, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Link from 'next/link';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getBacktestById, BacktestData } from '@/lib/db';
import dynamic from 'next/dynamic';

import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const TradingViewChart = dynamic(() => import('@/components/dashboard/TradingViewChart'), { ssr: false });

export default function BacktestReportPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [backtest, setBacktest] = useState<BacktestData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (user) {
      getBacktestById(user.uid, params.id)
        .then(data => setBacktest(data))
        .catch(err => console.error("Error fetching backtest:", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user, authLoading, params.id]);

  // Mock data for charts
  const equityData = Array.from({ length: 60 }, (_, i) => ({
    time: new Date(Date.now() - (60 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    value: 100000 + i * 500 + (Math.random() - 0.5) * 2000
  }));

  const drawdownData = Array.from({ length: 60 }, (_, i) => ({
    time: new Date(Date.now() - (60 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    value: - (Math.random() * 5 + 1)
  }));

  const handleDeployLive = () => {
    toast.success('Strategy successfully deployed to live trading!');
    router.push('/live');
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Equity,Drawdown\n"
      + equityData.map((e, i) => `${e.time},${e.value},${drawdownData[i].value}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `backtest_${params.id}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('CSV Export downloaded successfully');
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-500">Loading Report...</div>;
  }
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/dashboard" className="text-sm font-semibold text-slate-400 hover:text-primary transition-colors">Dashboard</Link>
            <span className="text-slate-300">/</span>
            <span className="text-sm font-semibold text-text">Report #{params.id}</span>
          </div>
          <h1 className="text-2xl font-bold text-text font-display flex items-center gap-3">
            {backtest?.strategyName || 'Unknown Strategy'}
            <span className="px-2.5 py-1 rounded-md bg-success/10 text-success text-[10px] font-bold uppercase tracking-wider">High Profitability</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExportCSV} className="btn-secondary px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-slate-100 transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={handleDeployLive} className="btn-primary px-4 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-2 shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all">
            <Play className="w-4 h-4 fill-current" /> Deploy Live
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Net Profit', value: '₹42,500', sub: '+12.4%', up: true },
          { label: 'Total Trades', value: '142', sub: '68% Win Rate', up: true },
          { label: 'Max Drawdown', value: '₹5,200', sub: '-1.8%', up: false },
          { label: 'Profit Factor', value: '1.85', sub: 'Excellent', up: true },
          { label: 'Expectancy', value: '₹299', sub: 'Per trade', up: true },
        ].map((stat, i) => (
          <div key={i} className="glass-card rounded-xl p-4 border border-border bg-white">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-xl font-bold text-text mb-1">{stat.value}</p>
            <p className={`text-xs font-semibold flex items-center gap-1 ${stat.up ? 'text-success' : 'text-loss'}`}>
              {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {stat.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Charts area */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-xl border border-border p-6 bg-white min-h-[400px] flex flex-col">
          <h2 className="text-base font-bold text-text mb-6">Equity Curve</h2>
          <div className="flex-1 w-full h-full relative">
            <TradingViewChart data={equityData} lineColor="#3b82f6" topColor="rgba(59, 130, 246, 0.2)" />
          </div>
        </div>
        <div className="glass-card rounded-xl border border-border p-6 bg-white min-h-[400px] flex flex-col">
          <h2 className="text-base font-bold text-text mb-6">Drawdown Profile (%)</h2>
          <div className="flex-1 w-full h-full relative">
            <TradingViewChart data={drawdownData} lineColor="#ef4444" topColor="rgba(239, 68, 68, 0.2)" />
          </div>
        </div>
      </div>
    </div>
  );
}
