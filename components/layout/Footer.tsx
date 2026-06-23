import Link from 'next/link';
import { TrendingUp, Twitter, Linkedin, Github, Youtube, Mail } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Backtesting', href: '#' },
    { label: 'Deployment', href: '#' },
    { label: 'API Docs', href: '#' },
  ],
  Company: [
    { label: 'About Us', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Press Kit', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  Support: [
    { label: 'Help Center', href: '#' },
    { label: 'Community', href: '#' },
    { label: 'Tutorials', href: '#' },
    { label: 'Webinars', href: '#' },
    { label: 'Status', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Disclaimer', href: '#' },
    { label: 'Refund Policy', href: '#' },
  ],
};

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Mail, href: '#', label: 'Email' },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-border bg-surface-2 pt-16 pb-8 overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top: Logo + Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 pb-12 border-b border-border">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="ApexQuant" className="h-20 lg:h-24 w-auto" />
            </Link>
            <p className="text-text-light text-sm leading-relaxed mb-6 max-w-xs">
              India&apos;s most powerful no-code algorithmic trading platform. Build, backtest, and deploy strategies in minutes.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-slate-400 hover:text-accent hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-text font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-text-light hover:text-primary text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} ApexQuant Technologies Pvt. Ltd. All rights reserved.
          </p>
          <p className="text-slate-500 text-xs flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-success animate-pulse" />
            All systems operational
          </p>
          <p className="text-slate-550 text-xs">
            SEBI Registered: INZ000XXXXXX · NSE · BSE · MCX
          </p>
        </div>
      </div>
    </footer>
  );
}
