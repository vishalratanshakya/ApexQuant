'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BuilderContextType {
  strategyId: string | null;
  setStrategyId: (id: string | null) => void;
  name: string;
  setName: (name: string) => void;
  instrument: string;
  setInstrument: (inst: string) => void;
  timeframe: string;
  setTimeframe: (tf: string) => void;
  period: string;
  setPeriod: (p: string) => void;
  positionType: string;
  setPositionType: (pt: string) => void;
  stopLoss: number;
  setStopLoss: (sl: number) => void;
  targetProfit: number;
  setTargetProfit: (tp: number) => void;
  trailingSL: boolean;
  setTrailingSL: (tsl: boolean) => void;
  reEntry: string;
  setReEntry: (re: string) => void;
  conditions: any[];
  setConditions: (conds: any[]) => void;
  status: 'Draft' | 'Saved' | 'Backtesting' | 'Live';
  setStatus: (s: 'Draft' | 'Saved' | 'Backtesting' | 'Live') => void;
  showErrors: boolean;
  setShowErrors: (s: boolean) => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [strategyId, setStrategyId] = useState<string | null>(null);
  const [name, setName] = useState('My Awesome Strategy');
  const [instrument, setInstrument] = useState('NIFTY 50');
  const [timeframe, setTimeframe] = useState('5m');
  const [period, setPeriod] = useState('1Y');
  const [positionType, setPositionType] = useState('Long');
  const [stopLoss, setStopLoss] = useState(1.5);
  const [targetProfit, setTargetProfit] = useState(3.0);
  const [trailingSL, setTrailingSL] = useState(false);
  const [reEntry, setReEntry] = useState('No Re-entry');
  const [conditions, setConditions] = useState<any[]>([]);
  const [status, setStatus] = useState<'Draft' | 'Saved' | 'Backtesting' | 'Live'>('Draft');
  const [showErrors, setShowErrors] = useState(false);

  return (
    <BuilderContext.Provider value={{
      strategyId, setStrategyId,
      name, setName,
      instrument, setInstrument,
      timeframe, setTimeframe,
      period, setPeriod,
      positionType, setPositionType,
      stopLoss, setStopLoss,
      targetProfit, setTargetProfit,
      trailingSL, setTrailingSL,
      reEntry, setReEntry,
      conditions, setConditions,
      status, setStatus,
      showErrors, setShowErrors
    }}>
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const context = useContext(BuilderContext);
  if (context === undefined) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }
  return context;
}
