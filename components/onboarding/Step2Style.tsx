'use client';
import { useState } from 'react';
import { ArrowRight, ArrowLeft, Clock, Activity, BarChart2, TrendingUp, Check } from 'lucide-react';

interface Props {
  onNext: (styles: string[]) => void;
  onBack: () => void;
}

const styles = [
  { id: 'intraday', title: 'Intraday Trading', desc: 'Quick trades closed before end of day', icon: Clock },
  { id: 'options', title: 'Options Strategies', desc: 'Complex multi-leg options trading', icon: Activity },
  { id: 'swing', title: 'Swing Trading', desc: 'Hold positions for days or weeks', icon: TrendingUp },
  { id: 'index', title: 'Index Based', desc: 'Trade primarily NIFTY and BANKNIFTY', icon: BarChart2 },
];

export default function Step2Style({ onNext, onBack }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleStyle = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text mb-2 tracking-tight">Choose Your Trading Style</h2>
        <p className="text-slate-500 font-medium text-sm">
          Select all that apply to help us personalize your experience.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-auto">
        {styles.map((style) => {
          const isSelected = selected.includes(style.id);
          const Icon = style.icon;
          return (
            <button
              key={style.id}
              onClick={() => toggleStyle(style.id)}
              className={`relative flex items-start gap-4 p-4 rounded-xl border text-left transition-all duration-200 ${
                isSelected 
                  ? 'border-primary bg-primary/5 shadow-md scale-[1.02]' 
                  : 'border-border bg-white hover:border-primary/40 hover:bg-slate-50'
              }`}
            >
              <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`font-semibold text-sm ${isSelected ? 'text-primary' : 'text-slate-800'}`}>
                  {style.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{style.desc}</p>
              </div>
              
              {isSelected && (
                <div className="absolute top-4 right-4 text-primary">
                  <Check className="w-4 h-4" strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
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
          onClick={() => onNext(selected)}
          disabled={selected.length === 0}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg btn-primary text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
