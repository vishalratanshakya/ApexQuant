'use client';

import { Users, Activity, DollarSign, Server, PlayCircle, Library } from 'lucide-react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const TradingViewChart = dynamic(() => import('@/components/dashboard/TradingViewChart'), { ssr: false });

export function OverviewTab() {
  const metrics = [
    { label: 'Total Users', value: '4,285', change: '+12.5%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Active (30d)', value: '1,842', change: '+5.2%', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'MRR (₹)', value: '₹12.5L', change: '+18.4%', icon: DollarSign, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'Live Strategies', value: '845', change: '+4.1%', icon: PlayCircle, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Total Built', value: '12,405', change: '+22.1%', icon: Library, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'System Health', value: '99.9%', change: 'Optimal', icon: Server, color: 'text-success', bg: 'bg-success/20' },
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

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map((m, i) => (
          <motion.div key={i} variants={item} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${m.bg} group-hover:scale-110 transition-transform`}>
                <m.icon className={`w-5 h-5 ${m.color}`} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${i === 5 ? 'bg-success/10 text-success' : 'bg-success/10 text-success'}`}>
                {m.change}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{m.label}</p>
            <p className="text-2xl font-bold text-slate-800">{m.value}</p>
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
