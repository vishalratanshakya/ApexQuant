import React from 'react';
import { Download, FileText, Calendar, Filter, FileSpreadsheet, PieChart, TrendingUp, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function ReportsTab() {
  const handleExport = (reportName: string) => {
    toast.success(`Preparing ${reportName} export...`);
    setTimeout(() => {
      toast.success(`${reportName} downloaded successfully as CSV.`);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pt-6">
      
      {/* Top Controls */}
      <div className="glass-card rounded-2xl border border-border bg-white shadow-sm p-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4 flex-1">
          <h2 className="text-base font-bold text-text">Generate Reports</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Report Type</label>
              <select className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary font-medium text-slate-700">
                <option>Comprehensive Overview</option>
                <option>Financial & Revenue</option>
                <option>User Engagement</option>
                <option>System Performance</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Date Range</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm font-medium text-slate-700">
                  <option>Last 30 Days</option>
                  <option>This Quarter</option>
                  <option>Year to Date</option>
                  <option>Last Year</option>
                  <option>Custom Range</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Format</label>
              <select className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary font-medium text-slate-700">
                <option>CSV (Excel)</option>
                <option>PDF Document</option>
                <option>JSON Data</option>
              </select>
            </div>
          </div>
        </div>
        <div className="shrink-0">
          <button 
            onClick={() => handleExport('Custom Report')}
            className="btn-primary w-full md:w-auto px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Generate & Download
          </button>
        </div>
      </div>

      {/* Pre-configured Reports */}
      <h3 className="text-lg font-bold text-text mt-8 mb-4">Quick Exports</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Financial Reports */}
        <div className="glass-card rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-border bg-slate-50/50 flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-text">Financial Reports</h2>
          </div>
          <div className="divide-y divide-border">
            <div className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div>
                <h4 className="font-bold text-slate-800">Monthly Revenue Ledger</h4>
                <p className="text-sm text-slate-500 mt-1">Detailed breakdown of all subscription payments and refunds.</p>
              </div>
              <button 
                onClick={() => handleExport('Monthly Revenue Ledger')}
                className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors shrink-0"
              >
                <FileSpreadsheet className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div>
                <h4 className="font-bold text-slate-800">Churn & Retention Analysis</h4>
                <p className="text-sm text-slate-500 mt-1">Metrics on user retention rates and lost revenue by cohort.</p>
              </div>
              <button 
                onClick={() => handleExport('Churn Analysis')}
                className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors shrink-0"
              >
                <FileSpreadsheet className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* User Analytics Reports */}
        <div className="glass-card rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-border bg-slate-50/50 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-text">User Analytics</h2>
          </div>
          <div className="divide-y divide-border">
            <div className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div>
                <h4 className="font-bold text-slate-800">Active User Directory</h4>
                <p className="text-sm text-slate-500 mt-1">Complete list of users with contact info and plan status.</p>
              </div>
              <button 
                onClick={() => handleExport('Active User Directory')}
                className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors shrink-0"
              >
                <FileSpreadsheet className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div>
                <h4 className="font-bold text-slate-800">Strategy Deployment Matrix</h4>
                <p className="text-sm text-slate-500 mt-1">Data on which strategy templates are most popular among users.</p>
              </div>
              <button 
                onClick={() => handleExport('Strategy Deployment Matrix')}
                className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors shrink-0"
              >
                <FileSpreadsheet className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
