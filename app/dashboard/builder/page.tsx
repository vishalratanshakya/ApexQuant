'use client';

import { useState } from 'react';
import SettingsPanel from '@/components/builder/SettingsPanel';
import ConditionCanvas from '@/components/builder/ConditionCanvas';
import IndicatorsSidebar from '@/components/builder/IndicatorsSidebar';
import BottomBar from '@/components/builder/BottomBar';
import { Pencil } from 'lucide-react';

export default function StrategyBuilderPage() {
  const [strategyName, setStrategyName] = useState('My Awesome Strategy');
  const [isEditingName, setIsEditingName] = useState(false);

  return (
    <div className="pb-24 animate-in fade-in duration-500 min-h-screen flex flex-col">
      {/* Top Header & Preview Chart */}
      <div className="grid lg:grid-cols-12 gap-8 mb-8">
        <div className="lg:col-span-12 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2 group">
            {isEditingName ? (
              <input 
                type="text" 
                value={strategyName}
                onChange={(e) => setStrategyName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                autoFocus
                className="text-3xl font-black text-text font-display bg-transparent border-b-2 border-primary focus:outline-none px-1 py-0.5"
              />
            ) : (
              <>
                <h1 className="text-3xl font-black text-text font-display cursor-pointer hover:text-primary transition-colors" onClick={() => setIsEditingName(true)}>
                  {strategyName}
                </h1>
                <button onClick={() => setIsEditingName(true)} className="p-1.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary">
                  <Pencil className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
          <p className="text-sm text-slate-500 font-medium">Design and backtest logic without writing a single line of code.</p>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="grid lg:grid-cols-12 gap-6 flex-1">
        {/* Left Column: Settings Panel */}
        <div className="lg:col-span-3">
          <SettingsPanel />
        </div>

        {/* Middle Column: Condition Canvas */}
        <div className="lg:col-span-6">
          <ConditionCanvas />
        </div>

        {/* Right Column: Indicators Sidebar */}
        <div className="lg:col-span-3">
          <IndicatorsSidebar />
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <BottomBar />
    </div>
  );
}
