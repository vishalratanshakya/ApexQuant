'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Rocket } from 'lucide-react';
import Link from 'next/link';

interface UpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export default function UpgradePrompt({ 
  isOpen, 
  onClose, 
  title = "Upgrade to Pro", 
  description = "Unlock this feature and scale your trading with our Pro plan." 
}: UpgradePromptProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-2xl shadow-2xl z-[60] overflow-hidden border border-border"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-primary/10 to-accent/10 p-6 pt-8 pb-10 text-center">
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-white hover:text-slate-600 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-primary/30 mb-4">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
              <p className="text-slate-600 mt-2 font-medium">{description}</p>
            </div>
            
            {/* Body */}
            <div className="p-6 bg-white -mt-4 rounded-t-2xl relative">
              <div className="space-y-4 mb-8">
                {[
                  'Deploy up to 10 Live Strategies',
                  'Unlimited Backtests & Data',
                  '100+ Advanced Indicators',
                  'Advanced Risk Management Tools'
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                    <span className="text-sm font-semibold text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <Link 
                href="/upgrade"
                className="flex items-center justify-center w-full py-3.5 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all"
                onClick={onClose}
              >
                Upgrade to Pro
              </Link>
              
              <button 
                onClick={onClose}
                className="w-full mt-3 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors"
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
