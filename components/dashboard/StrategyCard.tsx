import { Play, Square, Settings, MoreVertical, Activity } from 'lucide-react';
import Link from 'next/link';

interface StrategyCardProps {
  id: string;
  name: string;
  status: 'live' | 'stopped' | 'backtesting';
  pnl: string;
  pnlPercent: string;
  winRate: string;
  isPositive: boolean;
  instrument: string;
  timeframe: string;
}

export default function StrategyCard({
  id,
  name,
  status,
  pnl,
  pnlPercent,
  winRate,
  isPositive,
  instrument,
  timeframe,
}: StrategyCardProps) {
  return (
    <div className="glass-card rounded-xl p-5 border border-border hover:shadow-card-hover transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-text">{name}</h3>
            {status === 'live' && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-success/10 border border-success/20 text-[10px] font-bold text-success uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Live
              </span>
            )}
            {status === 'stopped' && (
              <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Stopped
              </span>
            )}
            {status === 'backtesting' && (
              <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-wider">
                Backtesting
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">{instrument}</span>
            <span>•</span>
            <span>{timeframe}</span>
          </div>
        </div>
        <button className="text-slate-400 hover:text-text transition-colors p-1">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <p className="text-[11px] font-semibold text-slate-400 mb-0.5 uppercase tracking-wider">Total P&L</p>
          <p className={`text-lg font-bold ${isPositive ? 'text-success' : 'text-loss'}`}>
            {isPositive ? '+' : '-'}{pnl}
            <span className="text-xs ml-1 opacity-80">({isPositive ? '+' : ''}{pnlPercent})</span>
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-400 mb-0.5 uppercase tracking-wider">Win Rate</p>
          <p className="text-lg font-bold text-text">{winRate}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
        {status === 'live' ? (
          <button className="flex-1 flex items-center justify-center gap-2 bg-loss/10 text-loss hover:bg-loss/20 py-2 rounded-lg text-xs font-semibold transition-colors">
            <Square className="w-3.5 h-3.5 fill-current" /> Stop
          </button>
        ) : (
          <button className="flex-1 flex items-center justify-center gap-2 bg-success/10 text-success hover:bg-success/20 py-2 rounded-lg text-xs font-semibold transition-colors">
            <Play className="w-3.5 h-3.5 fill-current" /> Start
          </button>
        )}
        <Link 
          href={`/backtest/${id}`}
          className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-600 hover:bg-slate-200 py-2 rounded-lg text-xs font-semibold transition-colors"
        >
          <Activity className="w-3.5 h-3.5" /> Report
        </Link>
      </div>
    </div>
  );
}
