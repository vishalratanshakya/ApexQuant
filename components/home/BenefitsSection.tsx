'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

const stats = [
  { value: 50000, suffix: '+', label: 'Strategies Deployed', color: 'gradient-text' },
  { value: 2, suffix: 'Cr+', prefix: '₹', label: 'Daily Volume Backtested', color: 'gradient-text-green' },
  { value: 12000, suffix: '+', label: 'Active Traders', color: 'gradient-text' },
  { value: 99.9, suffix: '%', label: 'Platform Uptime', color: 'gradient-text-green' },
];

const benefits = [
  'No programming skills required — ever',
  'Deploy to paper trade first, then go live',
  'Strategy marketplace with 200+ templates',
  'Real-time P&L and position tracking',
  'WhatsApp & Telegram alert integration',
  'Priority support with dedicated account manager',
];

function Counter({ target, suffix, prefix }: { target: number; suffix: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const steps = 60;
    const stepValue = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += stepValue;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix && prefix}
      {target % 1 !== 0 ? count.toFixed(1) : count.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
}

export default function BenefitsSection() {
  return (
    <section id="benefits" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-white" />
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center p-6 glass-card rounded-2xl border border-border"
            >
              <div className={`font-display font-black text-3xl sm:text-4xl mb-2 ${stat.color}`}>
                <Counter target={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              </div>
              <p className="text-text-light text-sm font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Benefits Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Why ApexQuant */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-xs font-semibold text-success bg-success/10 border border-success/20 px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
              Why ApexQuant
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-text mb-6 leading-tight">
              The Unfair Advantage for{' '}
              <span className="gradient-text">Retail Traders</span>
            </h2>
            <p className="text-text-light text-lg leading-relaxed mb-8">
              Hedge funds have armies of quants and engineers. Now you have ApexQuant.
              We level the playing field by giving every retail trader access to the same
              tools that power institutional desks.
            </p>
            <ul className="space-y-4">
              {benefits.map((b, i) => (
                <motion.li
                  key={b}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600 text-sm">{b}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right: Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Main card */}
            <div className="glass-card rounded-2xl p-6 border border-border shadow-card bg-white w-full max-w-[calc(100vw-32px)]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-slate-400 font-medium mb-1">IRON CONDOR STRATEGY</p>
                  <p className="font-display text-2xl font-bold text-text">+₹18,240</p>
                  <p className="text-xs text-success font-semibold mt-1">▲ +12.3% this month</p>
                </div>
                <span className="text-xs bg-success/15 text-success border border-success/25 px-3 py-1.5 rounded-lg font-semibold">
                  RUNNING
                </span>
              </div>

              {/* Strategy flow visualization */}
              <div className="space-y-3">
                {[
                  { label: 'Buy NIFTY 24000 CE', type: 'BUY', color: 'text-success', bg: 'bg-success/10' },
                  { label: 'Sell NIFTY 24200 CE', type: 'SELL', color: 'text-loss', bg: 'bg-loss/10' },
                  { label: 'Sell NIFTY 23800 PE', type: 'SELL', color: 'text-loss', bg: 'bg-loss/10' },
                  { label: 'Buy NIFTY 23600 PE', type: 'BUY', color: 'text-success', bg: 'bg-success/10' },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-border"
                  >
                    <span className="text-sm text-slate-700">{row.label}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${row.color} ${row.bg}`}>
                      {row.type}
                    </span>
                  </div>
                ))}
              </div>

              {/* Risk bars */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Max Loss</span>
                  <span className="text-loss font-semibold">₹5,000</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-1/4 bg-gradient-to-r from-loss to-orange-500 rounded-full" />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Max Profit</span>
                  <span className="text-success font-semibold">₹18,500</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-success to-success/80 rounded-full" />
                </div>
              </div>
            </div>

            {/* Notification cards */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-6 -right-4 glass border border-border rounded-xl px-4 py-3 shadow-card bg-white hidden lg:block"
            >
              <p className="text-[11px] text-slate-400">📱 WhatsApp Alert</p>
              <p className="text-xs font-semibold text-text">Strategy entered at ₹24,127</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-6 -left-4 glass border border-success/20 rounded-xl px-4 py-3 shadow-card bg-white hidden lg:block"
            >
              <p className="text-[11px] text-slate-400">🎯 Target Hit</p>
              <p className="text-xs font-semibold text-success font-semibold">Booked +₹4,200 profit</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
