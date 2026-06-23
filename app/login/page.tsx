'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import LoginForm from '@/components/login/LoginForm';
import BrokerLogin from '@/components/login/BrokerLogin';

function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Generate a meandering chart line
    const points: { x: number; y: number }[] = [];
    const numPoints = 80;
    let y = canvas.height * 0.6;

    for (let i = 0; i <= numPoints; i++) {
      const x = (i / numPoints) * canvas.width;
      y += (Math.random() - 0.45) * 30;
      y = Math.max(canvas.height * 0.2, Math.min(canvas.height * 0.85, y));
      points.push({ x, y });
    }

    let animFrame = 0;
    let offset = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Gradient line
      const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
      grad.addColorStop(0, 'rgba(59,130,246,0)');
      grad.addColorStop(0.3, 'rgba(59,130,246,0.2)');
      grad.addColorStop(0.7, 'rgba(124,58,237,0.15)');
      grad.addColorStop(1, 'rgba(59,130,246,0)');

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y + Math.sin(offset + 0) * 8);
      for (let i = 1; i < points.length; i++) {
        const p = points[i];
        const pPrev = points[i - 1];
        const cx = (pPrev.x + p.x) / 2;
        const cy = (pPrev.y + p.y) / 2;
        ctx.quadraticCurveTo(
          pPrev.x,
          pPrev.y + Math.sin(offset + i * 0.2) * 6,
          cx,
          cy
        );
      }
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Area under curve
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      const areaGrad = ctx.createLinearGradient(0, canvas.height * 0.3, 0, canvas.height);
      areaGrad.addColorStop(0, 'rgba(59,130,246,0.04)');
      areaGrad.addColorStop(1, 'rgba(59,130,246,0)');
      ctx.fillStyle = areaGrad;
      ctx.fill();

      // Dotted grid
      ctx.setLineDash([1, 30]);
      ctx.strokeStyle = 'rgba(226,232,240,0.8)';
      ctx.lineWidth = 1;
      for (let gx = 0; gx < canvas.width; gx += 80) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, canvas.height);
        ctx.stroke();
      }
      for (let gy = 0; gy < canvas.height; gy += 60) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(canvas.width, gy);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      offset += 0.008;
      animFrame = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-50"
    />
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen relative flex overflow-hidden bg-surface-2">
      {/* ── Background ── */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <AnimatedBackground />

      {/* Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-success/3 rounded-full blur-3xl pointer-events-none" />

      {/* ── Left Panel (visible on large screens) ── */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] p-12 relative z-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="ApexQuant" className="h-20 w-auto" />
        </Link>

        {/* Headline */}
        <div className="max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h2 className="font-display font-black text-4xl xl:text-5xl text-text leading-tight mb-5">
              Your algo trading
              <br />
              journey starts{' '}
              <span className="gradient-text">here.</span>
            </h2>
            <p className="text-text-light text-lg leading-relaxed">
              Join thousands of traders who&apos;ve automated their strategies with ApexQuant.
              No coding. No complexity. Just profits.
            </p>
          </motion.div>

          {/* Left panel stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 grid grid-cols-3 gap-4"
          >
            {[
              { val: '12K+', label: 'Active traders' },
              { val: '50K+', label: 'Strategies run' },
              { val: '₹2Cr+', label: 'Daily volume' },
            ].map((s) => (
              <div key={s.label} className="glass-card rounded-xl p-4 text-center bg-white shadow-sm border border-border">
                <div className="font-display font-black text-xl gradient-text">{s.val}</div>
                <div className="text-xs text-text-light mt-1 font-semibold">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="glass-card rounded-xl p-5 bg-white shadow-sm border border-border"
        >
          <p className="text-slate-600 text-sm italic leading-relaxed mb-3">
            &ldquo;ApexQuant&apos;s backtesting revealed a pattern I never would have found manually.
            My strategy now generates consistent 3-5% monthly returns.&rdquo;
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold shadow-sm">
              RK
            </div>
            <div>
              <p className="text-text text-xs font-bold">Rahul K.</p>
              <p className="text-text-light text-xs font-semibold">Pro subscriber · Mumbai</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Right Panel: Auth Form ── */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="ApexQuant" className="h-16 w-auto" />
            </Link>
          </div>

          {/* Glass card */}
          <div className="glass-card rounded-2xl border border-border shadow-card p-8 bg-white">
            <LoginForm />
            <BrokerLogin />
          </div>

          {/* Bottom links */}
          <div className="text-center mt-6 space-y-3">
            <p className="text-xs text-slate-500 font-semibold">
              <Link href="/" className="text-accent hover:text-primary transition-colors">
                ← Back to home
              </Link>
            </p>
            <p className="text-xs text-slate-400 font-medium">
              Protected by Firebase Authentication · 256-bit SSL
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
