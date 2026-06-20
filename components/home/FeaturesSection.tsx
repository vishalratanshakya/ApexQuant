'use client';

import { motion } from 'framer-motion';
import {
  Blocks,
  Zap,
  Cloud,
  LayoutDashboard,
  Link2,
  ShieldCheck,
} from 'lucide-react';

const features = [
  {
    icon: Blocks,
    title: 'No-Code Strategy Builder',
    description:
      'Drag-and-drop interface to build complex multi-leg options strategies, scanners, and triggers — zero programming required.',
    accent: 'from-primary to-accent',
    glow: 'group-hover:shadow-[0_10px_30px_rgba(59,130,246,0.05)]',
    tag: 'Most Popular',
  },
  {
    icon: Zap,
    title: 'Lightning Backtesting',
    description:
      'Simulate years of market data in under 2 seconds. Tick-by-tick precision on NSE data with full options chain support.',
    accent: 'from-yellow-500 to-orange-400',
    glow: 'group-hover:shadow-[0_10px_30px_rgba(234,179,8,0.05)]',
    tag: '< 2s per run',
  },
  {
    icon: Cloud,
    title: 'Cloud Deployment',
    description:
      'One-click deploy your strategy to our cloud infrastructure. Runs 24/7 with automatic reconnect on market open.',
    accent: 'from-sky-500 to-blue-500',
    glow: 'group-hover:shadow-[0_10px_30px_rgba(14,165,233,0.05)]',
    tag: '99.9% Uptime',
  },
  {
    icon: LayoutDashboard,
    title: 'Real-time Dashboard',
    description:
      'Monitor all running strategies, P&L, positions, and orders in one unified dashboard with live WebSocket feeds.',
    accent: 'from-success to-success/70',
    glow: 'group-hover:shadow-[0_10px_30px_rgba(16,185,129,0.05)]',
    tag: 'Live Data',
  },
  {
    icon: Link2,
    title: 'Multi-Broker Integration',
    description:
      'Connect Zerodha, Angel One, Upstox, Groww, Alice Blue, 5paisa & more. Switch brokers without changing your strategy.',
    accent: 'from-pink-500 to-rose-500',
    glow: 'group-hover:shadow-[0_10px_30px_rgba(236,72,153,0.05)]',
    tag: '10+ Brokers',
  },
  {
    icon: ShieldCheck,
    title: 'Advanced Risk Management',
    description:
      'Set strategy-level max loss, daily drawdown, position sizing, and auto-square-off rules. Sleep while the algo works.',
    accent: 'from-cyan-500 to-teal-400',
    glow: 'group-hover:shadow-[0_10px_30px_rgba(6,182,212,0.05)]',
    tag: 'Built-in Controls',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 lg:py-32 overflow-hidden bg-surface-2">
      {/* Background */}
      <div className="absolute inset-0 bg-surface-2" />
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold text-accent bg-accent/10 border border-accent/20 px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
            Platform Features
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-text mb-5">
            Everything You Need to{' '}
            <span className="gradient-text">Trade Algorithmically</span>
          </h2>
          <p className="text-text-light text-lg max-w-2xl mx-auto leading-relaxed">
            ApexQuant brings institutional-grade trading tools to retail traders — with a beautiful,
            intuitive interface that anyone can master.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className={`group feature-card rounded-2xl p-6 cursor-default ${feat.glow} transition-all duration-300`}
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.accent} flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform duration-300`}
              >
                <feat.icon className="w-6 h-6 text-white" strokeWidth={2} />
              </div>

              {/* Tag */}
              <div className="mb-3">
                <span
                  className={`text-[10px] font-semibold uppercase tracking-widest bg-gradient-to-r ${feat.accent} bg-clip-text text-transparent`}
                >
                  {feat.tag}
                </span>
              </div>

              {/* Content */}
              <h3 className="font-display font-bold text-lg text-text mb-2 group-hover:text-primary transition-colors duration-200">
                {feat.title}
              </h3>
              <p className="text-text-light text-sm leading-relaxed">{feat.description}</p>

              {/* Bottom border accent */}
              <div
                className={`mt-5 h-px w-0 group-hover:w-full bg-gradient-to-r ${feat.accent} transition-all duration-500`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
