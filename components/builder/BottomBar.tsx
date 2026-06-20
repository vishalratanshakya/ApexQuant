'use client';

import { Save, Play, Rocket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function BottomBar() {
  const router = useRouter();

  const handleSave = () => {
    toast.success('Strategy draft saved successfully!');
  };

  const handleBacktest = () => {
    toast.success('Initiating backtest...');
    setTimeout(() => {
      router.push('/dashboard/backtest');
    }, 1000);
  };

  const handleDeploy = () => {
    toast.error('Deploy Live requires an active broker connection and Pro tier.');
  };

  return (
    <div className="fixed bottom-0 left-0 lg:left-64 right-0 h-20 bg-white border-t border-border z-40 px-6 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Status</p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-300"></span>
          <span className="text-sm font-bold text-slate-600">Draft (Unsaved)</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={handleSave} className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Draft
        </button>
        
        <button onClick={handleBacktest} className="px-8 py-2.5 rounded-xl text-sm font-bold text-white btn-primary flex items-center gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
          <Play className="w-4 h-4 fill-current" />
          Backtest Strategy
        </button>

        <div className="w-px h-8 bg-border mx-2"></div>

        <button 
          onClick={handleDeploy}
          className="px-6 py-2.5 rounded-xl text-sm font-bold text-primary bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors flex items-center gap-2"
        >
          <Rocket className="w-4 h-4" />
          Deploy Live
        </button>
      </div>
    </div>
  );
}
