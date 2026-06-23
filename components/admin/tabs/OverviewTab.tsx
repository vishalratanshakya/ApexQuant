'use client';

import { Users, Activity, DollarSign, Server, PlayCircle, Library } from 'lucide-react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const TradingViewChart = dynamic(() => import('@/components/dashboard/TradingViewChart'), { ssr: false });

export function OverviewTab() {
  const metrics = [
    { label: 'Total Users', value: '4,285', change: '+12.5%', icon: Users, bg: 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-500/20', iconBg: 'bg-white/20 text-white', trendClass: 'bg-white/20 text-white border border-white/10' },
    { label: 'Active (30d)', value: '1,842', change: '+5.2%', icon: Activity, bg: 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-emerald-500/20', iconBg: 'bg-white/20 text-white', trendClass: 'bg-white/20 text-white border border-white/10' },
    { label: 'MRR (₹)', value: '₹12.5L', change: '+18.4%', icon: DollarSign, bg: 'bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white shadow-purple-500/20', iconBg: 'bg-white/20 text-white', trendClass: 'bg-white/20 text-white border border-white/10' },
    { label: 'Live Strategies', value: '845', change: '+4.1%', icon: PlayCircle, bg: 'bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-orange-500/20', iconBg: 'bg-white/20 text-white', trendClass: 'bg-white/20 text-white border border-white/10' },
    { label: 'Total Built', value: '12,405', change: '+22.1%', icon: Library, bg: 'bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-rose-500/20', iconBg: 'bg-white/20 text-white', trendClass: 'bg-white/20 text-white border border-white/10' },
    { label: 'System Health', value: '99.9%', change: 'Optimal', icon: Server, bg: 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-cyan-500/20', iconBg: 'bg-white/20 text-white', trendClass: 'bg-white/20 text-white border border-white/10' },
  ];

  const mockRevenueData = [
    { time: '2023-01-01', value: 850000 },
    { time: '2023-02-01', value: 920000 },
    { time: '2023-03-01', value: 980000 },
    { time: '2023-04-01', value: 1050000 },
    { time: '2023-05-01', value: 1120000 },
    { time: '2023-06-01', value: 1250000 },
  ];
  
  const mockUserGrowthData = [
    { time: '2023-01-01', value: 1200 },
    { time: '2023-02-01', value: 1500 },
    { time: '2023-03-01', value: 1850 },
    { time: '2023-04-01', value: 2400 },
    { time: '2023-05-01', value: 3100 },
    { time: '2023-06-01', value: 4285 },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Platform Overview</h2>
        <div className="text-sm font-medium text-slate-500">Last updated: Just now</div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="flex overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-3 xl:grid-cols-6 gap-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {metrics.map((m, i) => (
          <motion.div key={i} variants={item} className={`min-w-[240px] lg:min-w-0 snap-center shrink-0 lg:shrink rounded-xl p-5 shadow-lg hover:shadow-xl transition-all group relative overflow-hidden ${m.bg}`}>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${m.iconBg} group-hover:scale-110 transition-transform`}>
                <m.icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm shadow-sm ${m.trendClass}`}>
                {m.change}
              </span>
            </div>
            <p className="text-xs font-bold text-white/80 uppercase tracking-wider mb-1 relative z-10">{m.label}</p>
            <p className="text-2xl font-bold text-white relative z-10">{m.value}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
        >
           <h3 className="text-lg font-bold text-slate-800 mb-4">User Growth</h3>
           <div className="h-[300px] w-full">
             <TradingViewChart data={mockUserGrowthData} />
           </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
        >
           <h3 className="text-lg font-bold text-slate-800 mb-4">Revenue Trend (₹)</h3>
           <div className="h-[300px] w-full">
             <TradingViewChart data={mockRevenueData} />
           </div>
        </motion.div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
      >
        <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { text: "New Enterprise subscription: rahul@example.com", time: "2m ago", type: 'success' },
            { text: "Alert: NSE API Latency spike detected", time: "15m ago", type: 'alert' },
            { text: "User anjali_t deployed NIFTY ORB strategy", time: "1h ago", type: 'info' },
            { text: "Database automated backup completed successfully", time: "4h ago", type: 'info' },
            { text: "Suspicious login attempt from IP 192.168.1.5", time: "5h ago", type: 'alert' },
          ].map((log, i) => (
            <div key={i} className="flex gap-3 items-start p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-default">
              <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${log.type === 'alert' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : log.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
              <div>
                <p className="text-sm text-slate-700 font-medium">{log.text}</p>
                <p className="text-xs text-slate-400 mt-1">{log.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
