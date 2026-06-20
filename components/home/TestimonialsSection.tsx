'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Rajesh Mehta',
    role: 'Retail Options Trader, Mumbai',
    avatar: 'RM',
    color: 'from-primary to-accent',
    rating: 5,
    quote:
      'ApexQuant transformed my trading. I went from manually monitoring 10 positions to running 3 automated strategies simultaneously. My win rate improved from 42% to 68% after optimizing via backtesting.',
    profit: '+₹2.1L',
    period: 'Last 3 months',
  },
  {
    name: 'Priya Sharma',
    role: 'Full-time Trader, Bangalore',
    avatar: 'PS',
    color: 'from-success to-success/70',
    rating: 5,
    quote:
      'The no-code builder is incredibly powerful. I built a complex iron condor adjustment strategy in 20 minutes — something that would have taken a developer weeks to code. Backtesting is blazing fast.',
    profit: '+₹4.7L',
    period: 'Last 6 months',
  },
  {
    name: 'Amit Verma',
    role: 'Quant Analyst, Delhi NCR',
    avatar: 'AV',
    color: 'from-sky-500 to-blue-500',
    rating: 5,
    quote:
      'Coming from a programming background, I expected a "dumbed down" tool. ApexQuant proved me wrong — the conditions and filters are sophisticated enough for my requirements, and the API access is a huge plus.',
    profit: '+₹8.3L',
    period: 'Last year',
  },
  {
    name: 'Kavitha Nair',
    role: 'Swing Trader, Chennai',
    avatar: 'KN',
    color: 'from-pink-500 to-rose-500',
    rating: 5,
    quote:
      "The multi-broker support is a game-changer. I run different strategies on different brokers for margin optimization. ApexQuant's unified dashboard makes it feel like one account. Absolutely love it.",
    profit: '+₹1.9L',
    period: 'Last 2 months',
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  };

  const next = () => {
    setDirection(1);
    setCurrent((c) => (c + 1) % testimonials.length);
  };

  const t = testimonials[current];

  return (
    <section id="testimonials" className="relative py-24 lg:py-32 overflow-hidden bg-surface-2">
      <div className="absolute inset-0 bg-surface-2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-semibold text-accent bg-accent/10 border border-accent/20 px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
            Trader Stories
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-text mb-4">
            Trusted by{' '}
            <span className="gradient-text">12,000+ Traders</span>
          </h2>
          <p className="text-text-light text-lg max-w-xl mx-auto">
            Real results from real traders. No cherry-picked data, no fake profits.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -60 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="glass-card rounded-2xl p-8 md:p-10 border border-border shadow-card bg-white"
            >
              {/* Quote icon */}
              <div className="flex items-start justify-between mb-6">
                <Quote className="w-10 h-10 text-primary/30" />
                <div className="text-right">
                  <div className={`font-display font-black text-2xl gradient-text-green`}>{t.profit}</div>
                  <div className="text-xs text-text-light">{t.period}</div>
                </div>
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array(t.rating).fill(0).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              {/* Quote text */}
              <blockquote className="text-slate-600 text-lg leading-relaxed mb-8 italic font-medium">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm shadow-md`}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-text font-bold">{t.name}</div>
                  <div className="text-text-light text-sm font-medium">{t.role}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Nav Arrows */}
          <button
            id="testimonials-prev"
            onClick={prev}
            className="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-border rounded-full flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary/50 transition-all duration-200 hidden sm:flex shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            id="testimonials-next"
            onClick={next}
            className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-border rounded-full flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary/50 transition-all duration-200 hidden sm:flex shadow-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? 'w-8 bg-primary' : 'w-2 bg-border hover:bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
