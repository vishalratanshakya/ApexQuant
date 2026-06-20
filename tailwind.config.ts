import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',        // Blue accent
        'primary-dark': '#2563eb',
        accent: '#7c3aed',         // Purple accent
        success: '#10b981',        // Green for profit
        surface: '#ffffff',        // Card background
        'surface-2': '#f8fafc',    // Light gray background
        border: '#e2e8f0',
        text: '#0f172a',           // Dark text
        'text-light': '#64748b',
        loss: '#ef4444',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-brand': 'linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)',
        'gradient-hero': 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(59,130,246,0.02) 0%, rgba(124,58,237,0.01) 100%)',
        'grid-pattern': 'linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Outfit', 'ui-sans-serif', 'system-ui'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delay': 'float 6s ease-in-out 2s infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out',
        'ticker': 'ticker 30s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(59,130,246,0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(59,130,246,0.2), 0 0 80px rgba(124,58,237,0.1)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      boxShadow: {
        'glow-purple': '0 0 30px rgba(124,58,237,0.15)',
        'glow-green': '0 0 30px rgba(16,185,129,0.15)',
        'card': '0 4px 20px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 10px 30px rgba(59, 130, 246, 0.08), 0 0 30px rgba(124, 58, 237, 0.04)',
        'glass': '0 8px 32px rgba(15, 23, 42, 0.03), inset 0 0 0 1px rgba(255,255,255,0.6)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
