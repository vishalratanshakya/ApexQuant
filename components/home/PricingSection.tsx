'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check, Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useState } from 'react';
import ContactSalesModal from '@/components/pricing/ContactSalesModal';

const plans = [
  {
    name: 'Starter',
    price: '0',
    period: 'Forever free',
    description: 'Perfect for learning algo trading concepts and paper trading.',
    color: 'border-border',
    badge: null,
    features: [
      '3 active strategies',
      'Paper trading only',
      '1-year backtest window',
      'Community support',
      'Basic indicators (20+)',
      '1 broker connection',
    ],
    cta: 'Get Started Free',
    ctaClass: 'btn-secondary',
    featured: false,
  },
  {
    name: 'Pro',
    price: '1,499',
    period: '/month',
    description: 'For active traders who want full automation and live deployment.',
    color: 'border-primary/50',
    badge: 'Most Popular',
    features: [
      '20 active strategies',
      'Live trading enabled',
      '5-year backtest window',
      'Priority support (24/7)',
      'Advanced indicators (100+)',
      '5 broker connections',
      'WhatsApp + Telegram alerts',
      'Strategy marketplace access',
    ],
    cta: 'Start Pro Trial',
    ctaClass: 'btn-primary text-white',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: '4,999',
    period: '/month',
    description: 'For professional traders, prop firms, and HNIs with custom needs.',
    color: 'border-border',
    badge: null,
    features: [
      'Unlimited strategies',
      'Live trading enabled',
      'Full historical backtest',
      'Dedicated account manager',
      'Custom indicators (Python)',
      'Unlimited broker connections',
      'API access (REST + WebSocket)',
      'White-label option',
    ],
    cta: 'Contact Sales',
    ctaClass: 'btn-secondary',
    featured: false,
  },
];

export default function PricingSection() {
  const { user } = useAuth();
  const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);
  
  return (
    <section id="pricing" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-white" />
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-semibold text-accent bg-accent/10 border border-accent/20 px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
            Simple Pricing
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-text mb-5">
            Start Free,{' '}
            <span className="gradient-text">Scale as You Grow</span>
          </h2>
          <p className="text-text-light text-lg max-w-xl mx-auto">
            No hidden charges. No per-trade fees. Flat monthly pricing for serious traders.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className={`relative rounded-2xl p-8 border ${plan.color} ${
                plan.featured
                  ? 'pricing-popular shadow-card'
                  : 'glass-card'
              } transition-all duration-300 hover:border-primary/40`}
            >
              {/* Popular badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-primary to-accent px-4 py-1.5 rounded-full shadow-sm">
                    <Zap className="w-3 h-3" />
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-display font-bold text-xl text-text mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  {plan.price === '0' ? (
                    <span className="font-display font-black text-4xl gradient-text">Free</span>
                  ) : (
                    <>
                      <span className="text-slate-500 text-lg">₹</span>
                      <span className="font-display font-black text-4xl text-text">{plan.price}</span>
                      <span className="text-text-light text-sm">{plan.period}</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-text-light">{plan.period === 'Forever free' ? 'Forever free · No credit card needed' : 'Billed monthly · Cancel anytime'}</p>
                <p className="text-slate-650 text-sm mt-3">{plan.description}</p>
              </div>

              {plan.name === 'Enterprise' ? (
                <button
                  onClick={() => setIsSalesModalOpen(true)}
                  id={`pricing-${plan.name.toLowerCase()}-btn`}
                  className={`flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl font-semibold text-sm mb-8 ${plan.ctaClass}`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <Link
                  href={plan.name === 'Pro' ? '/upgrade' : (user ? '/dashboard' : '/get-started')}
                  id={`pricing-${plan.name.toLowerCase()}-btn`}
                  className={`flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl font-semibold text-sm mb-8 ${plan.ctaClass}`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}

              <div className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-slate-500 text-sm mt-10"
        >
          All plans include a 14-day free trial · No credit card required · Cancel anytime
        </motion.p>
      </div>

      <ContactSalesModal 
        isOpen={isSalesModalOpen} 
        onClose={() => setIsSalesModalOpen(false)} 
      />
    </section>
  );
}
