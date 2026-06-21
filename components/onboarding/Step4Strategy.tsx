'use client';
import { ArrowRight, ArrowLeft, Zap, Layers, MousePointer2 } from 'lucide-react';

interface Props {
  onNext: (strategy?: string) => void;
  onBack: () => void;
}

const templates = [
  { id: 'nifty-mom', name: 'Nifty Momentum', category: 'Options', icon: Zap, pnl: '+12.4%', color: 'text-primary' },
  { id: 'banknifty-mr', name: 'BankNifty Mean Reversion', category: 'Intraday', icon: Layers, pnl: '+8.1%', color: 'text-accent' },
];

export default function Step4Strategy({ onNext, onBack }: Props) {
  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text mb-2 tracking-tight">Quick Start Strategy</h2>
        <p className="text-slate-500 font-medium text-sm">
          Select a template to customize, or start entirely from scratch.
        </p>
      </div>

      <div className="space-y-4 mb-auto">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Recommended Templates</p>
        
        {templates.map((template) => {
          const Icon = template.icon;
          return (
            <button
              key={template.id}
              onClick={() => onNext(template.name)}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-border bg-white hover:border-primary/30 hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-lg bg-slate-50 ${template.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-800 group-hover:text-primary transition-colors">{template.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {template.category}
                    </span>
                    <span className="text-xs font-bold text-success">{template.pnl} return</span>
                  </div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-transform group-hover:translate-x-1" />
            </button>
          );
        })}

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs text-slate-400 font-medium">OR</span>
          </div>
        </div>

        <button
          onClick={() => onNext('Blank')}
          className="w-full flex items-center justify-between p-4 rounded-xl border border-border bg-surface-2 hover:bg-slate-50 hover:border-slate-300 transition-all text-left group"
        >
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-600">
              <MousePointer2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800">Blank Strategy</h3>
              <p className="text-xs text-slate-500 mt-1">Start from scratch using the visual builder</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-slate-600 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={() => onNext('Browse')}
          className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          Browse All Templates
        </button>
      </div>
    </div>
  );
}
