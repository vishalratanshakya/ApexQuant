import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/providers/AuthProvider';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ApexQuant — No-Code Algo Trading for Indian Markets',
  description:
    'Build, backtest & deploy algorithmic trading strategies without coding. ApexQuant is the premium no-code algo trading platform for Indian markets — Stocks, Futures & Options.',
  keywords: [
    'algo trading',
    'algorithmic trading India',
    'no-code trading',
    'backtesting',
    'Zerodha algo',
    'NSE options strategy',
    'quantitative trading',
    'ApexQuant',
  ],
  authors: [{ name: 'ApexQuant' }],
  creator: 'ApexQuant',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://apexquant.in',
    siteName: 'ApexQuant',
    title: 'ApexQuant — No-Code Algo Trading for Indian Markets',
    description:
      'Build, backtest & deploy algorithmic trading strategies without coding.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ApexQuant — No-Code Algo Trading for Indian Markets',
    description: 'Build, backtest & deploy algorithmic trading strategies without coding.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} light`}>
      <body suppressHydrationWarning className="font-sans antialiased bg-navy min-h-screen">
        <AuthProvider>
          {children}
          <Toaster 
            position="top-right" 
            toastOptions={{
              style: {
                background: '#ffffff',
                color: '#0f172a',
                border: '1px solid #e2e8f0',
              },
            }} 
          />
        </AuthProvider>
      </body>
    </html>
  );
}


