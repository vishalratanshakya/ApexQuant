'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, TrendingUp, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const navLinks = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/testimonials', label: 'Testimonials' },
  { href: '/why-apexquant', label: 'Why ApexQuant' },
];

export default function Navbar() {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass border-b border-border shadow-sm bg-white/90 backdrop-blur-md'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24 lg:h-28">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <img src="/logo.png" alt="ApexQuant" className="h-20 lg:h-24 w-auto" />
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-slate-600 hover:text-primary transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </nav>

            {/* Desktop CTA Buttons */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-3">
              {!user ? (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium px-4 py-2 rounded-lg btn-secondary"
                  >
                    Login
                  </Link>
                  <Link
                    href="/get-started"
                    className="flex items-center gap-1.5 text-sm font-semibold text-white px-5 py-2.5 rounded-lg btn-primary"
                  >
                    Get Started
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </>
              ) : (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 text-sm font-semibold text-white px-5 py-2.5 rounded-lg btn-primary"
                >
                  Dashboard
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-text hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-16 left-0 right-0 z-40 bg-white/95 border-b border-border shadow-lg lg:hidden"
            >
            <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-slate-700 hover:text-primary font-medium py-2 border-b border-slate-100 last:border-0 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-2">
                {!user ? (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="text-center text-sm font-medium py-3 rounded-lg btn-secondary"
                    >
                      Login
                    </Link>
                    <Link
                      href="/get-started"
                      onClick={() => setMobileOpen(false)}
                      className="text-center text-sm font-semibold text-white py-3 rounded-lg btn-primary"
                    >
                      Get Started Free
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="text-center text-sm font-semibold text-white py-3 rounded-lg btn-primary"
                  >
                    Dashboard
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </>
        )}
      </AnimatePresence>
    </>
  );
}
