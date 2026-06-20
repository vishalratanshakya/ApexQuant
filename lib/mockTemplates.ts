export type TemplateCategory = 'Momentum' | 'Mean Reversion' | 'Options' | 'Intraday' | 'Swing' | 'Trend Following';
export type TemplateDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type InstrumentType = 'NIFTY' | 'BANKNIFTY' | 'FINNIFTY' | 'Stocks' | 'Commodities';

export interface StrategyTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  difficulty: TemplateDifficulty;
  instrument: InstrumentType;
  winRate: number;
  avgReturn: string; // e.g., "+4.5%"
  maxDrawdown: string;
  tradesPerMonth: number;
  trending?: boolean;
  equityCurve: { time: string; value: number }[];
}

// Helper to generate a somewhat realistic random walk curve
const generateCurve = (start: number, trend: number, volatility: number) => {
  let val = start;
  return Array.from({ length: 30 }).map((_, i) => {
    val += (Math.random() - 0.5) * volatility + trend;
    return {
      time: `2023-09-${(i + 1).toString().padStart(2, '0')}`,
      value: val
    };
  });
};

export const mockTemplates: StrategyTemplate[] = [
  {
    id: 'tmpl-1',
    name: 'NIFTY ORB (Open Range Breakout)',
    description: 'A classic intraday strategy. Goes long/short when NIFTY breaks the 15-minute opening range with volume confirmation.',
    category: 'Intraday',
    difficulty: 'Beginner',
    instrument: 'NIFTY',
    winRate: 58.5,
    avgReturn: '+3.2%',
    maxDrawdown: '-4.1%',
    tradesPerMonth: 22,
    trending: true,
    equityCurve: generateCurve(100000, 200, 1500)
  },
  {
    id: 'tmpl-2',
    name: 'BankNifty Short Straddle',
    description: 'Sells ATM Call and Put options on BankNifty at 9:20 AM and exits at 3:15 PM with strict stop losses.',
    category: 'Options',
    difficulty: 'Intermediate',
    instrument: 'BANKNIFTY',
    winRate: 64.2,
    avgReturn: '+4.8%',
    maxDrawdown: '-6.5%',
    tradesPerMonth: 20,
    trending: true,
    equityCurve: generateCurve(100000, 300, 2000)
  },
  {
    id: 'tmpl-3',
    name: 'Reliance Swing Master',
    description: 'Swing trading strategy on Reliance using EMA crossovers (20/50) and MACD confirmation.',
    category: 'Swing',
    difficulty: 'Beginner',
    instrument: 'Stocks',
    winRate: 48.0,
    avgReturn: '+12.5%',
    maxDrawdown: '-8.2%',
    tradesPerMonth: 4,
    equityCurve: generateCurve(100000, 500, 4000)
  },
  {
    id: 'tmpl-4',
    name: 'FinNifty Expiry Day Scalper',
    description: 'Exploits gamma bursts on FinNifty expiry days using high-frequency momentum indicators.',
    category: 'Options',
    difficulty: 'Advanced',
    instrument: 'FINNIFTY',
    winRate: 52.1,
    avgReturn: '+6.1%',
    maxDrawdown: '-12.0%',
    tradesPerMonth: 4,
    equityCurve: generateCurve(100000, 100, 3500)
  },
  {
    id: 'tmpl-5',
    name: 'Mean Reversion RSI',
    description: 'Buys heavily oversold stocks (RSI < 20) and sells on quick bounces. Highly selective.',
    category: 'Mean Reversion',
    difficulty: 'Intermediate',
    instrument: 'Stocks',
    winRate: 72.4,
    avgReturn: '+1.5%',
    maxDrawdown: '-2.5%',
    tradesPerMonth: 8,
    equityCurve: generateCurve(100000, 150, 1000)
  },
  {
    id: 'tmpl-6',
    name: 'Supertrend Trend Follower',
    description: 'Rides long-term trends on NIFTY using Supertrend (10,3) on 1-hour timeframe.',
    category: 'Trend Following',
    difficulty: 'Beginner',
    instrument: 'NIFTY',
    winRate: 42.0,
    avgReturn: '+18.4%',
    maxDrawdown: '-11.5%',
    tradesPerMonth: 3,
    trending: true,
    equityCurve: generateCurve(100000, 600, 5000)
  },
  {
    id: 'tmpl-7',
    name: 'BankNifty Iron Condor',
    description: 'Non-directional options selling strategy deployed on Thursdays for the next week expiry.',
    category: 'Options',
    difficulty: 'Advanced',
    instrument: 'BANKNIFTY',
    winRate: 68.0,
    avgReturn: '+3.5%',
    maxDrawdown: '-4.8%',
    tradesPerMonth: 4,
    equityCurve: generateCurve(100000, 250, 800)
  },
  {
    id: 'tmpl-8',
    name: 'VWAP Bounce Intraday',
    description: 'Goes long when price bounces off the daily VWAP with high relative volume.',
    category: 'Intraday',
    difficulty: 'Intermediate',
    instrument: 'Stocks',
    winRate: 55.5,
    avgReturn: '+2.1%',
    maxDrawdown: '-3.8%',
    tradesPerMonth: 15,
    equityCurve: generateCurve(100000, 180, 1200)
  },
  {
    id: 'tmpl-9',
    name: 'Commodity Golden Cross',
    description: 'Long-term trend following strategy for Gold and Crude Oil using 50/200 SMA.',
    category: 'Trend Following',
    difficulty: 'Beginner',
    instrument: 'Commodities',
    winRate: 38.5,
    avgReturn: '+22.0%',
    maxDrawdown: '-15.4%',
    tradesPerMonth: 1,
    equityCurve: generateCurve(100000, 800, 6000)
  },
  {
    id: 'tmpl-10',
    name: 'Bollinger Band Squeeze',
    description: 'Captures explosive breakouts after periods of low volatility using Bollinger Bands.',
    category: 'Momentum',
    difficulty: 'Intermediate',
    instrument: 'NIFTY',
    winRate: 45.2,
    avgReturn: '+8.5%',
    maxDrawdown: '-7.2%',
    tradesPerMonth: 6,
    equityCurve: generateCurve(100000, 400, 3000)
  },
  {
    id: 'tmpl-11',
    name: 'Gap and Go',
    description: 'Buys stocks that gap up > 2% at the open if they break the first 5-minute high.',
    category: 'Momentum',
    difficulty: 'Advanced',
    instrument: 'Stocks',
    winRate: 49.0,
    avgReturn: '+4.2%',
    maxDrawdown: '-9.0%',
    tradesPerMonth: 12,
    equityCurve: generateCurve(100000, 220, 2500)
  },
  {
    id: 'tmpl-12',
    name: 'BankNifty Calendar Spread',
    description: 'Sells current week ATM options and buys next week ATM options to capture theta decay.',
    category: 'Options',
    difficulty: 'Advanced',
    instrument: 'BANKNIFTY',
    winRate: 62.5,
    avgReturn: '+5.5%',
    maxDrawdown: '-5.1%',
    tradesPerMonth: 4,
    equityCurve: generateCurve(100000, 280, 1100)
  }
];
