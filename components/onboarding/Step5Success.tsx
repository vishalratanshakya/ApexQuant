'use client';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function Step5Success() {
  const router = useRouter();

  const handleFinish = () => {
    router.push('/strategy-builder');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full text-center py-8">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-success/20 blur-xl rounded-full" />
        <CheckCircle2 className="w-20 h-20 text-success relative z-10" />
      </div>
      
      <h2 className="text-3xl font-black font-display text-text mb-3 tracking-tight">
        You&apos;re All Set!
      </h2>
      <p className="text-slate-500 font-medium text-sm max-w-sm mb-10 mx-auto">
        Your account is ready. It&apos;s time to build, backtest, and deploy your first algorithmic trading strategy without writing a single line of code.
      </p>

      <button
        onClick={handleFinish}
        className="w-full max-w-xs mx-auto flex items-center justify-center gap-2 py-4 rounded-xl btn-primary text-white font-bold text-base shadow-glow-purple transition-transform hover:scale-[1.02]"
      >
        Go to Strategy Builder
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
