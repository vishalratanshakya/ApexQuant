'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, TrendingDown, Activity, Settings, Zap, ShieldAlert, BarChart2 } from 'lucide-react';
import TradingViewChart from '@/components/dashboard/TradingViewChart';

// Generate some realistic looking mock chart data
function generateMockData() {
  const data = [];
  let currentValue = 1000;
  const now = new Date();
  
  for (let i = 100; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    currentValue = currentValue + (Math.random() - 0.45) * 50;
    data.push({
      time: time.toISOString().split('T')[0],
      value: Number(currentValue.toFixed(2)),
    });
  }
  return data;
}

export default function SymbolAnalysisPage({ params }: { params: { symbol: string } }) {
  const symbol = decodeURIComponent(params.symbol);
  const [chartData, setChartData] = useState<{ time: string; value: number }[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setChartData(generateMockData());
  }, []);

  if (!isClient) return null; // Prevent hydration mismatch on charts

  const mockScore = 92;
  const isBuy = true;

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Link href="/scanner" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary mb-3 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Scanner
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            {symbol} Analysis
            <span className="px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-600 rounded-md border border-slate-200">EQ</span>
          </h1>
        </div>
        
        <div className="flex gap-3">
          <Link href={`/builder?symbol=${symbol}`} className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm">
            <Settings className="w-4 h-4" /> Build Strategy
          </Link>
          <button className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white btn-primary shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
            <Zap className="w-4 h-4" /> Trade Now
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Chart Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-primary" /> Price History
              </h2>
              <div className="flex bg-slate-100 rounded-lg p-1">
                {['1D', '1W', '1M', '3M', '1Y'].map(tf => (
                  <button key={tf} className={`px-3 py-1 text-xs font-bold rounded-md ${tf === '1M' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
                    {tf}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[400px] w-full">
              {chartData.length > 0 && <TradingViewChart data={chartData} />}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> AI Pattern Analysis
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              ApexQuant AI has detected a high-probability breakout pattern forming on the 15m timeframe. 
              The current price action is consolidating near a major resistance level, with increasing 
              volume indicating strong institutional interest.
            </p>
            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Recommended Action</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Consider placing a buy stop order slightly above the resistance level. 
                    Ensure stop-loss is placed below the recent swing low to manage risk effectively.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Stats Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">Scanner Insights</h3>
            
            <div className="space-y-5">
              <div className="flex justify-between items-center pb-5 border-b border-slate-100">
                <span className="text-sm text-slate-500 font-medium">Signal</span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${
                  isBuy ? 'bg-success/10 text-success border-success/20' : 'bg-loss/10 text-loss border-loss/20'
                }`}>
                  {isBuy ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {isBuy ? 'STRONG BUY' : 'STRONG SELL'}
                </span>
              </div>

              <div className="flex justify-between items-center pb-5 border-b border-slate-100">
                <span className="text-sm text-slate-500 font-medium">AI Confidence Score</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-success rounded-full" style={{ width: `${mockScore}%` }}></div>
                  </div>
                  <span className="text-sm font-black text-slate-900">{mockScore}/100</span>
                </div>
              </div>

              <div className="flex justify-between items-center pb-5 border-b border-slate-100">
                <span className="text-sm text-slate-500 font-medium">Setup Type</span>
                <span className="text-sm font-bold text-slate-900">Breakout Pullback</span>
              </div>

              <div className="flex justify-between items-center pb-5 border-b border-slate-100">
                <span className="text-sm text-slate-500 font-medium">Timeframe</span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">15m</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 font-medium">Volume Surge</span>
                <span className="text-sm font-bold text-success">+342%</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold mb-2">Automate this Setup</h3>
              <p className="text-slate-300 text-xs leading-relaxed mb-6">
                Turn this exact market condition into a fully automated trading bot using our visual strategy builder. No coding required.
              </p>
              <Link href={`/builder?symbol=${symbol}`} className="block w-full py-2.5 bg-white text-slate-900 text-center rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm">
                Open Strategy Builder
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
