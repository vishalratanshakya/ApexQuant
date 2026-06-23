'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Play, ArrowRight, Zap, Shield, BarChart2 } from 'lucide-react';
import dynamic from 'next/dynamic';

const MiniChart = dynamic(() => import('./MiniChart'), { ssr: false });

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

const floatingStats = [
  { icon: Zap, label: 'Daily Volume Backtested', value: '₹450 Cr+', color: 'text-primary' },
  { icon: BarChart2, label: 'Strategies Deployed', value: '50,000+', color: 'text-success' },
  { icon: Shield, label: 'Uptime SLA', value: '99.9%', color: 'text-accent' },
];
const initialTickerItems = [
  { symbol: 'NIFTY 50', price: 24127.40, change: 1.23, up: true },
  { symbol: 'BANK NIFTY', price: 51841.30, change: 0.87, up: true },
  { symbol: 'SENSEX', price: 79402.70, change: 1.15, up: true },
  { symbol: 'RELIANCE', price: 2944.55, change: -0.41, up: false },
  { symbol: 'INFY', price: 1621.80, change: 2.13, up: true },
  { symbol: 'TCS', price: 3880.20, change: 0.64, up: true },
  { symbol: 'HDFC BANK', price: 1712.45, change: -0.22, up: false },
  { symbol: 'ICICIBANK', price: 1224.30, change: 1.45, up: true },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

function TickerTape() {
  const [tickerItems, setTickerItems] = useState(initialTickerItems);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerItems(prev => prev.map(item => {
        const volatility = item.price * 0.0005; // 0.05% max change per tick
        const changeAmt = (Math.random() - 0.5) * volatility;
        const newPrice = item.price + changeAmt;
        const up = changeAmt >= 0;
        const newChange = item.change + (changeAmt / item.price) * 100;
        return { ...item, price: newPrice, change: newChange, up };
      }));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ticker-wrap pt-20 border-b border-border bg-white/80 backdrop-blur-md py-2">
      <div className="ticker-inner">
        {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2 px-4 sm:px-6 text-xs w-fit whitespace-nowrap shrink-0">
            <span className="font-semibold text-slate-500 min-w-[85px]">{item.symbol}</span>
            <span className="text-text font-medium min-w-[75px] tabular-nums text-right">
              {item.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={`px-2 py-0.5 rounded-sm min-w-[70px] text-center tabular-nums ${item.up ? 'bg-success/10 text-success' : 'bg-loss/10 text-loss'}`}>
              {item.up ? '+' : ''}{item.change.toFixed(2)}%
            </span>
            <span className="text-slate-350 ml-2">|</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function HeroSection() {
  const { user } = useAuth();

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-surface-2">
      {/* ── Layered background ── */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 grid-bg opacity-60" />
      {/* Radial glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-success/5 rounded-full blur-3xl pointer-events-none" />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            width: `${20 + i * 15}px`,
            height: `${20 + i * 15}px`,
            top: `${10 + i * 14}%`,
            left: `${5 + i * 17}%`,
            animationDelay: `${i * 1.2}s`,
            animationDuration: `${6 + i * 2}s`,
          }}
        />
      ))}

      <TickerTape />

      {/* ── Main hero content ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl w-full mx-auto grid lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-16 items-center"
        >
          {/* Left: Text */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-6">
              <span className="flex items-center gap-2 text-xs font-semibold text-accent bg-accent/10 border border-accent/20 px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Now live for Indian markets · NSE + BSE + MCX
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="font-display font-black text-4xl sm:text-5xl lg:text-5xl xl:text-7xl leading-[1.08] tracking-tight text-text mb-6"
            >
              Build, Backtest{' '}
              <span className="gradient-text">&amp; Deploy</span>
              <br />
              Algo Trading{' '}
              <span className="relative">
                Strategies
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 9C50 3 100 1 150 3C200 5 250 9 298 6"
                    stroke="url(#underline-grad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="underline-grad" x1="0" y1="0" x2="300" y2="0">
                      <stop stopColor="#3b82f6" />
                      <stop offset="1" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              <br className="hidden sm:block" />
              <span className="text-text-light text-3xl sm:text-4xl lg:text-5xl font-bold"> Without Coding</span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              variants={itemVariants}
              className="text-text-light text-lg sm:text-xl leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0"
            >
              No-code algorithmic trading platform for Indian markets.
              Trade <span className="text-text font-semibold">Stocks, Futures &amp; Options</span> with
              institutional-grade automation.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                href={user ? "/dashboard" : "/get-started"}
                id="hero-start-btn"
                className="flex items-center justify-center gap-2 btn-primary text-white font-semibold px-8 py-4 rounded-xl text-base"
              >
                {user ? "Go to Dashboard" : "Start Building Free"}
                <ArrowRight className="w-5 h-5" />
              </Link>

            </motion.div>

            {/* Trust badges */}
            <motion.div variants={itemVariants} className="mt-10 flex flex-wrap gap-4 justify-center lg:justify-start">
              {[
                '🔒 256-bit SSL',
                '✅ SEBI Compliant',
                '🏆 #1 in India',
                '⚡ 2ms Execution',
              ].map((badge) => (
                <span
                  key={badge}
                  className="text-xs text-slate-500 border border-border px-3 py-1.5 rounded-full"
                >
                  {badge}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right: Chart + Stats */}
          <motion.div variants={itemVariants} className="relative">
            {/* Main chart card */}
            <div className="glass-card rounded-2xl p-1 shadow-card border border-border w-full max-w-xl mx-auto lg:mr-0 lg:ml-auto">
              <div className="rounded-xl overflow-hidden bg-white p-3 pb-0 w-full">
                {/* Chart header */}
                <div className="flex items-center justify-between px-2 pb-3">
                  <div>
                    <p className="text-xs text-slate-400 font-medium">NIFTY MOMENTUM STRATEGY</p>
                    <p className="text-xl font-bold text-text font-display">₹1,28,430</p>
                    <p className="text-xs text-success font-semibold mt-0.5">▲ +₹28,430 (+28.4%) · 120 days</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-xs bg-success/15 text-success border border-success/20 px-2 py-1 rounded-lg font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                      LIVE
                    </span>
                  </div>
                </div>
                <MiniChart height={300} />
              </div>
            </div>

            {/* Floating stat cards */}
            {floatingStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.2, duration: 0.5 }}
                className="absolute glass border border-border rounded-xl px-4 py-3 shadow-card hidden lg:flex"
                style={{
                  ...(i === 0 && { top: '-40px', left: '10%' }),
                  ...(i === 1 && { bottom: '20px', left: '-125px' }),
                  ...(i === 2 && { top: '30px', right: '-20px' }),
                }}
              >
                <div className="flex items-center gap-2">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium">{stat.label}</p>
                    <p className={`text-sm font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
}
