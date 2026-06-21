'use client';
import { useState } from 'react';
import { ArrowRight, ArrowLeft, Loader2, Link as LinkIcon, Building2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Props {
  onNext: (broker?: string) => void;
  onBack: () => void;
}

const brokers = [
  { id: 'zerodha', name: 'Zerodha', color: 'text-[#EB5202]', bg: 'bg-[#EB5202]/10' },
  { id: 'angelone', name: 'Angel One', color: 'text-[#1D3E90]', bg: 'bg-[#1D3E90]/10' },
  { id: 'upstox', name: 'Upstox', color: 'text-[#5627AB]', bg: 'bg-[#5627AB]/10' },
  { id: 'groww', name: 'Groww', color: 'text-[#00D09C]', bg: 'bg-[#00D09C]/10' },
  { id: 'aliceblue', name: 'Alice Blue', color: 'text-[#1A5ED8]', bg: 'bg-[#1A5ED8]/10' },
  { id: 'fyers', name: 'Fyers', color: 'text-[#1A4568]', bg: 'bg-[#1A4568]/10' },
];

export default function Step3Broker({ onNext, onBack }: Props) {
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = (id: string, name: string) => {
    setConnecting(id);
    // Mock connection delay
    setTimeout(() => {
      setConnecting(null);
      toast.success(`Successfully connected to ${name}!`);
      onNext(name);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text mb-2 tracking-tight">Connect Your Broker</h2>
        <p className="text-slate-500 font-medium text-sm">
          Link your broker to deploy strategies live. You can skip this for now.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-auto">
        {brokers.map((broker) => (
          <button
            key={broker.id}
            onClick={() => handleConnect(broker.id, broker.name)}
            disabled={connecting !== null}
            className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl border border-border bg-white hover:border-primary/30 hover:shadow-md transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${broker.bg}`}>
              <Building2 className={`w-5 h-5 ${broker.color}`} />
            </div>
            <div className="flex-1 font-semibold text-sm text-slate-700">
              {broker.name}
            </div>
            {connecting === broker.id ? (
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            ) : (
              <LinkIcon className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
        <button
          onClick={onBack}
          disabled={connecting !== null}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={() => onNext()}
          disabled={connecting !== null}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg btn-secondary text-sm font-semibold transition-all disabled:opacity-50"
        >
          Connect Later
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
