'use client';

import { Save, Play, Rocket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useBuilder } from '@/contexts/BuilderContext';
import { saveStrategy, createBacktest } from '@/lib/db';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export default function BottomBar() {
  const router = useRouter();
  const { user } = useAuth();
  const { 
    strategyId, setStrategyId, name, instrument, timeframe, 
    period, positionType, stopLoss, targetProfit, trailingSL, 
    reEntry, conditions, status, setStatus, setShowErrors 
  } = useBuilder();

  const [isSaving, setIsSaving] = useState(false);
  const [isBacktesting, setIsBacktesting] = useState(false);

  const validateSettings = () => {
    if (!stopLoss || stopLoss <= 0 || !targetProfit || targetProfit <= 0) {
      setShowErrors(true);
      toast.error('Please enter valid positive numbers for Stop Loss and Target Profit.');
      return false;
    }
    setShowErrors(false);
    return true;
  };

  const handleSave = async () => {
    if (!user) {
      toast.error('You must be logged in to save strategies.');
      return null;
    }
    if (!validateSettings()) return null;

    setIsSaving(true);
    try {
      const id = await saveStrategy(user.uid, {
        id: strategyId || undefined,
        name, instrument, timeframe, period, positionType, 
        stopLoss, targetProfit, trailingSL, reEntry, conditions,
        status: 'Draft'
      });
      setStrategyId(id);
      setStatus('Saved');
      toast.success('Strategy saved successfully!');
      return id;
    } catch (e: any) {
      console.error('Save Strategy Error:', e);
      toast.error(`Failed to save strategy: ${e.message}`);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const handleBacktest = async () => {
    if (!user) return toast.error('You must be logged in to run backtests.');
    if (!validateSettings()) return;
    
    let currentStrategyId = strategyId;
    if (!currentStrategyId) {
      const loadingToast = toast.loading('Saving your strategy before backtesting...');
      currentStrategyId = await handleSave();
      toast.dismiss(loadingToast);
      if (!currentStrategyId) return; // Save failed
    }
    
    setIsBacktesting(true);
    try {
      const btId = await createBacktest(user.uid, currentStrategyId, name);
      toast.success('Initiating backtest...');
      router.push(`/backtest/${btId}`);
    } catch (e: any) {
      console.error('Backtest Error:', e);
      toast.error(`Failed to start backtest: ${e.message}`);
    } finally {
      setIsBacktesting(false);
    }
  };

  const handleDeploy = async () => {
    if (!user) return toast.error('You must be logged in to deploy.');
    if (!validateSettings()) return;

    let currentStrategyId = strategyId;
    if (!currentStrategyId) {
      const loadingToast = toast.loading('Saving your strategy before deploying...');
      currentStrategyId = await handleSave();
      toast.dismiss(loadingToast);
      if (!currentStrategyId) return; // Save failed
    }

    toast.loading('Deploying to Live Engine...', { id: 'deploy' });
    try {
      const { collection, addDoc, doc, updateDoc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      
      // Create a deployment record
      await addDoc(collection(db, 'deployments'), {
        userId: user.uid,
        strategyId: currentStrategyId,
        strategyName: name || 'Unnamed Strategy',
        broker: { instrument: instrument || 'NIFTY 50' },
        status: 'Running',
        createdAt: new Date()
      });
      
      // Update strategy status
      await updateDoc(doc(db, 'strategies', currentStrategyId), { status: 'Live' });
      setStatus('Live');
      
      toast.success('Successfully Deployed to Live Trading Engine!', { id: 'deploy' });
    } catch (e: any) {
      console.error('Deploy Error:', e);
      toast.error(`Deployment failed: ${e.message}`, { id: 'deploy' });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-border z-40 px-4 sm:px-6 flex items-center justify-between shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Status</p>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${status === 'Draft' ? 'bg-slate-300' : 'bg-success'}`}></span>
          <span className="text-sm font-bold text-slate-600">{status} {status === 'Draft' ? '(Unsaved)' : ''}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={handleSave} disabled={isSaving} className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors flex items-center gap-2 disabled:opacity-50">
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Draft'}
        </button>
        
        <button onClick={handleBacktest} disabled={isBacktesting} className="px-8 py-2.5 rounded-xl text-sm font-bold text-white btn-primary flex items-center gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all disabled:opacity-50">
          <Play className="w-4 h-4 fill-current" />
          {isBacktesting ? 'Starting...' : 'Backtest Strategy'}
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
