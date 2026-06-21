'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: 'Can I cancel my subscription anytime?',
    a: 'Yes, you can cancel your subscription at any time from your billing dashboard. You will continue to have access to the features until the end of your billing cycle.',
  },
  {
    q: 'Do you charge any commission on my trades?',
    a: 'No! We charge 0% commission on your trades. You only pay for the ApexQuant software subscription. Standard brokerage fees from your connected broker (e.g. Zerodha) will apply normally.',
  },
  {
    q: 'How do live deployments work?',
    a: 'Once you backtest a strategy and are satisfied, you can deploy it live. Our cloud servers will run the strategy continuously and fire buy/sell signals directly to your connected broker via their secure API.',
  },
  {
    q: 'Can I change my broker later?',
    a: 'Absolutely. You can connect and disconnect supported brokers at any time without affecting your strategies or backtesting data.',
  },
];

export default function PricingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-text mb-4">Frequently Asked Questions</h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="glass-card border border-border rounded-xl overflow-hidden bg-white">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-slate-50"
            >
              <span className="font-semibold text-slate-800">{faq.q}</span>
              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-5 pb-5 text-slate-500 text-sm leading-relaxed"
                >
                  {faq.a}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
