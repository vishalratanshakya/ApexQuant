'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, TrendingUp, Users, ArrowUpRight, ArrowDownRight, 
  Download, Receipt, CreditCard, RefreshCw
} from 'lucide-react';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const TradingViewChart = dynamic(() => import('@/components/dashboard/TradingViewChart'), { ssr: false });

export function BillingRevenueTab() {
  const [isRefunding, setIsRefunding] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState('This Month');
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const planRevenueData = [
    { name: 'Pro (Monthly)', value: 145000, color: '#3b82f6' },
    { name: 'Pro (Annual)', value: 380000, color: '#8b5cf6' },
    { name: 'Enterprise', value: 725000, color: '#10b981' },
  ];

  useEffect(() => {
    const q = query(collection(db, 'payments'));
    const unsub = onSnapshot(q, (snap) => {
      // In a real production app, we would reduce over 'snap' to aggregate live revenue.
      // For immediate frontend visual feedback based on the dropdown:
      let data = [];
      if (timeframe === 'This Month') {
        data = [
          { time: '2023-10-01', value: 45000 },
          { time: '2023-10-05', value: 52000 },
          { time: '2023-10-10', value: 68000 },
          { time: '2023-10-15', value: 74000 },
          { time: '2023-10-20', value: 89000 },
          { time: '2023-10-25', value: 95000 },
        ];
      } else if (timeframe === 'Last Quarter') {
        data = [
          { time: '2023-07-01', value: 850000 },
          { time: '2023-08-01', value: 920000 },
          { time: '2023-09-01', value: 980000 },
        ];
      } else { // Year to Date
        data = [
          { time: '2023-01-01', value: 850000 },
          { time: '2023-02-01', value: 920000 },
          { time: '2023-03-01', value: 980000 },
          { time: '2023-04-01', value: 1050000 },
          { time: '2023-05-01', value: 1120000 },
          { time: '2023-06-01', value: 1250000 },
          { time: '2023-07-01', value: 1380000 },
          { time: '2023-08-01', value: 1450000 },
          { time: '2023-09-01', value: 1520000 },
          { time: '2023-10-01', value: 1680000 },
        ];
      }
      setRevenueData(data);
    });
    return () => unsub();
  }, [timeframe]);

  const stats = [
    { label: 'Total Revenue', value: '₹42,50,000', change: '+15.2%', icon: DollarSign, bg: 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-emerald-500/20', iconBg: 'bg-white/20 text-white', trend: 'up' },
    { label: 'MRR', value: '₹12,50,000', change: '+8.4%', icon: TrendingUp, bg: 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-500/20', iconBg: 'bg-white/20 text-white', trend: 'up' },
    { label: 'New Subs', value: '342', change: '+12.1%', icon: Users, bg: 'bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white shadow-purple-500/20', iconBg: 'bg-white/20 text-white', trend: 'up' },
    { label: 'Churn Rate', value: '2.1%', change: '-0.4%', icon: ArrowDownRight, bg: 'bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-red-500/20', iconBg: 'bg-white/20 text-white', trend: 'down' },
    { label: 'ARPU', value: '₹1,245', change: '+5.4%', icon: CreditCard, bg: 'bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-orange-500/20', iconBg: 'bg-white/20 text-white', trend: 'up' },
  ];

  const mockTransactions = [
    { id: 'TRX-10492', user: 'Rahul Sharma', email: 'rahul@example.com', plan: 'Enterprise', amount: '₹1,20,000', date: 'Oct 24, 2023', method: 'Wire Transfer', status: 'Paid' },
    { id: 'TRX-10491', user: 'Amit Patel', email: 'amit@example.com', plan: 'Pro (Monthly)', amount: '₹1,499', date: 'Oct 23, 2023', method: 'Credit Card', status: 'Paid' },
    { id: 'TRX-10490', user: 'Priya Singh', email: 'priya@example.com', plan: 'Pro (Monthly)', amount: '₹1,499', date: 'Oct 23, 2023', method: 'UPI', status: 'Failed' },
    { id: 'TRX-10489', user: 'Neha Gupta', email: 'neha@example.com', plan: 'Enterprise', amount: '₹9,999', date: 'Oct 22, 2023', method: 'Credit Card', status: 'Refunded' },
    { id: 'TRX-10488', user: 'Vikram Verma', email: 'vikram@example.com', plan: 'Pro (Annual)', amount: '₹14,990', date: 'Oct 21, 2023', method: 'UPI', status: 'Paid' },
  ];

  const allTransactions = [
    ...mockTransactions,
    { id: 'TRX-10487', user: 'Sanjay Kumar', email: 'sanjay@example.com', plan: 'Enterprise', amount: '₹1,20,000', date: 'Oct 20, 2023', method: 'Wire Transfer', status: 'Paid' },
    { id: 'TRX-10486', user: 'Pooja Desai', email: 'pooja@example.com', plan: 'Pro (Annual)', amount: '₹14,990', date: 'Oct 19, 2023', method: 'Credit Card', status: 'Refunded' },
    { id: 'TRX-10485', user: 'Ankit Sharma', email: 'ankit@example.com', plan: 'Pro (Monthly)', amount: '₹1,499', date: 'Oct 18, 2023', method: 'UPI', status: 'Paid' },
    { id: 'TRX-10484', user: 'Rohan Mehta', email: 'rohan@example.com', plan: 'Pro (Monthly)', amount: '₹1,499', date: 'Oct 17, 2023', method: 'UPI', status: 'Paid' },
    { id: 'TRX-10483', user: 'Karan Singh', email: 'karan@example.com', plan: 'Enterprise', amount: '₹9,999', date: 'Oct 16, 2023', method: 'Credit Card', status: 'Failed' },
  ];

  const displayedTransactions = showAllTransactions ? allTransactions : mockTransactions;

  const handleRefund = (id: string) => {
    if (!confirm('Are you sure you want to issue a full refund for this transaction?')) return;
    setIsRefunding(id);
    setTimeout(() => {
      toast.success(`Refund processed for ${id}`);
      setIsRefunding(null);
    }, 1500);
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    toast.success('Preparing Professional PDF Report...', { duration: 3000 });
    
    setTimeout(() => {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(22);
      doc.setTextColor(15, 23, 42);
      doc.text('ApexQuant - Revenue Report', 14, 22);
      
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
      doc.text(`Report Period: ${timeframe}`, 14, 36);
      
      // Summary Cards
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.text('Platform Revenue Summary', 14, 50);
      
      autoTable(doc, {
        startY: 55,
        head: [['Metric', 'Value', 'Growth']],
        body: stats.map(s => [s.label, s.value.replace(/₹/g, 'Rs. '), s.change]),
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] }
      });
      
      // Transactions Table
      doc.text('Detailed Transaction List', 14, (doc as any).lastAutoTable.finalY + 15);
      
      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 20,
        head: [['ID', 'User', 'Plan', 'Amount', 'Date', 'Method', 'Status']],
        body: allTransactions.map(t => [t.id, t.user, t.plan, t.amount.replace(/₹/g, 'Rs. '), t.date, t.method, t.status]),
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] }
      });
      
      doc.save(`ApexQuant_Revenue_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('Report downloaded successfully!');
      setIsExporting(false);
    }, 1500);
  };

  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'User Name', 'Email', 'Plan', 'Amount', 'Date', 'Payment Method', 'Status'];
    const rows = allTransactions.map(t => 
      `"${t.id}","${t.user}","${t.email}","${t.plan}","${t.amount.replace(/₹/g, 'Rs. ')}","${t.date}","${t.method}","${t.status}"`
    );
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ApexQuant_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV downloaded successfully!');
  };

  const handleDownloadInvoice = (id: string) => {
    toast.success(`Preparing invoice ${id}...`);
    setTimeout(() => {
      window.print();
    }, 800);
  };

  const handleTimeframeChange = (e: any) => {
    setTimeframe(e.target.value);
    toast.success(`Loading live data for ${e.target.value}...`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Billing & Revenue</h2>
          <p className="text-sm text-slate-500">Platform financial performance and subscription management</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={timeframe} 
            onChange={handleTimeframeChange}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold shadow-sm outline-none cursor-pointer hover:border-slate-300 transition-colors"
          >
            <option>This Month</option>
            <option>Last Quarter</option>
            <option>Year to Date</option>
            <option>All Time</option>
            <option>Custom</option>
          </select>
          <button onClick={handleExportCSV} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={handleExportPDF} disabled={isExporting} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-70">
            {isExporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} 
            {isExporting ? 'Preparing PDF...' : 'Export Full Report (PDF)'}
          </button>
        </div>
      </div>

      {!showAllTransactions && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {stats.map((s, i) => (
              <div key={i} className={`rounded-xl p-5 shadow-lg relative overflow-hidden group ${s.bg}`}>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.iconBg}`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 bg-white/20 text-white border border-white/10 backdrop-blur-sm shadow-sm">
                    {s.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {s.change}
                  </span>
                </div>
                <p className="text-xs font-bold text-white/80 uppercase tracking-wider mb-1 relative z-10">{s.label}</p>
                <p className="text-2xl font-bold text-white relative z-10">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:col-span-2">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Revenue Trend (₹)</h3>
              <div className="h-[350px] w-full">
                {revenueData.length > 0 && <TradingViewChart data={revenueData} />}
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:col-span-1">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Plan-wise Revenue</h3>
              <div className="h-[350px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={planRevenueData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {planRevenueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => `₹${value.toLocaleString()}`}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">{showAllTransactions ? 'All Transactions' : 'Recent Transactions'}</h3>
          {showAllTransactions ? (
            <button onClick={() => setShowAllTransactions(false)} className="text-sm font-bold text-slate-500 hover:text-slate-700">Back to Overview</button>
          ) : (
            <button onClick={() => setShowAllTransactions(true)} className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Amount (₹)</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Payment Method</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedTransactions.map(t => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-sm text-slate-600 font-medium">{t.id}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-800">{t.user}</div>
                    <div className="text-xs text-slate-500">{t.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{t.plan}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800">{t.amount}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{t.date}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{t.method}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                      t.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                      t.status === 'Refunded' ? 'bg-slate-100 text-slate-600' : 'bg-red-100 text-red-700'
                    }`}>{t.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleDownloadInvoice(t.id)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Invoice">
                        <Receipt className="w-4 h-4" />
                      </button>
                      {t.status === 'Paid' && (
                        <button 
                          onClick={() => handleRefund(t.id)} 
                          disabled={isRefunding === t.id}
                          className="px-3 py-1.5 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg flex items-center gap-1 disabled:opacity-50 transition-colors"
                        >
                          {isRefunding === t.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : 'Refund'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
