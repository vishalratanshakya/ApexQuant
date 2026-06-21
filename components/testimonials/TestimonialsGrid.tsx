'use client';
import { useState } from 'react';
import { Star, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const categories = ['All', 'Intraday', 'Options', 'Swing', 'Beginners'];

const mockTestimonials = [
  {
    id: 1,
    name: 'Rahul Sharma',
    location: 'Mumbai',
    category: 'Intraday',
    quote: 'ApexQuant completely changed how I trade BankNifty. Before this, I was losing money on emotional trades. Now my automated Straddle strategy runs perfectly every morning. The backtesting is insanely fast.',
    rating: 5,
    metrics: 'From -12% to +68% monthly return',
    avatar: 'RS'
  },
  {
    id: 2,
    name: 'Priya Desai',
    location: 'Pune',
    category: 'Options',
    quote: 'The Multi-leg Options Builder is a game changer. I set up an Iron Condor without writing a single line of Python. Deployed to live in 5 minutes.',
    rating: 5,
    metrics: 'Win rate improved by 45%',
    avatar: 'PD'
  },
  {
    id: 3,
    name: 'Amit Patel',
    location: 'Ahmedabad',
    category: 'Swing',
    quote: 'I work a 9-5 job and can\'t watch the screens all day. My daily swing breakout strategies now run on the cloud seamlessly. Zero downtime.',
    rating: 5,
    metrics: 'Saved 6 hours/day of screen time',
    avatar: 'AP'
  },
  {
    id: 4,
    name: 'Neha Gupta',
    location: 'Delhi',
    category: 'Beginners',
    quote: 'I had zero knowledge of coding. The Strategy Templates library gave me a great starting point. I just tweaked the indicators and deployed it. So simple!',
    rating: 4,
    metrics: 'First profitable month achieved',
    avatar: 'NG'
  },
  {
    id: 5,
    name: 'Siddharth V.',
    location: 'Bangalore',
    category: 'Intraday',
    quote: 'Tick-by-tick backtesting gave me the confidence I needed to deploy my momentum strategy. Best algo platform in India right now.',
    rating: 5,
    metrics: 'Scaled capital by 3x',
    avatar: 'SV'
  },
  {
    id: 6,
    name: 'Karan Malhotra',
    location: 'Hyderabad',
    category: 'Options',
    quote: 'The trailing stop-loss feature has saved me from huge drawdowns during volatile expiry days. It locks in my profits perfectly.',
    rating: 5,
    metrics: 'Reduced max drawdown to 4%',
    avatar: 'KM'
  },
  {
    id: 7,
    name: 'Anjali R.',
    location: 'Chennai',
    category: 'Beginners',
    quote: 'I love the UI. It doesn\'t look like a boring 90s terminal. It\'s sleek, fast, and the customer support is incredibly responsive.',
    rating: 5,
    metrics: 'Learned algo trading in 1 week',
    avatar: 'AR'
  },
  {
    id: 8,
    name: 'Manoj Kumar',
    location: 'Kolkata',
    category: 'Swing',
    quote: 'The VWAP and Supertrend integration is flawless. I build my conditions visually and the system executes them perfectly.',
    rating: 4,
    metrics: 'Consistent 18% quarterly ROI',
    avatar: 'MK'
  }
];

export default function TestimonialsGrid() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = mockTestimonials.filter(t => activeFilter === 'All' || t.category === activeFilter);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-text mb-6">Traders Wall of Love</h2>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                activeFilter === cat 
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry-style Grid */}
      <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        <AnimatePresence>
          {filtered.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="glass-card bg-white border border-border p-6 rounded-2xl flex flex-col hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 border border-slate-200 shrink-0">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-text text-sm leading-tight">{testimonial.name}</h4>
                  <p className="text-xs text-slate-400 font-medium">{testimonial.location} • {testimonial.category}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < testimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                ))}
              </div>

              <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">
                &quot;{testimonial.quote}&quot;
              </p>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-xs font-bold text-success">{testimonial.metrics}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
