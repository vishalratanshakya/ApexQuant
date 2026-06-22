import React from 'react';
import { Activity, Server, Database, Globe, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const BROKERS = [
  { name: 'Zerodha Kite', status: 'Operational', latency: '42ms', uptime: '99.99%' },
  { name: 'Upstox', status: 'Operational', latency: '58ms', uptime: '99.95%' },
  { name: 'Angel One', status: 'Degraded', latency: '215ms', uptime: '98.40%' },
  { name: 'Dhan', status: 'Operational', latency: '35ms', uptime: '100%' },
  { name: 'Fyers', status: 'Operational', latency: '48ms', uptime: '99.90%' },
];

const LOGS = [
  { time: '10:42:15 AM', level: 'INFO', service: 'execution-engine', message: 'Order #8921 placed successfully via Zerodha API' },
  { time: '10:41:03 AM', level: 'WARN', service: 'market-data', message: 'High latency detected on NSE options feed (150ms)' },
  { time: '10:35:22 AM', level: 'ERROR', service: 'broker-gateway', message: 'Connection timeout connecting to Angel One API' },
  { time: '10:30:00 AM', level: 'INFO', service: 'cron-scheduler', message: 'Daily cleanup job completed in 2.4s' },
  { time: '10:15:45 AM', level: 'INFO', service: 'auth-service', message: 'Admin user login successful from IP 192.168.1.1' },
  { time: '09:55:12 AM', level: 'INFO', service: 'execution-engine', message: 'Strategy #str-001 hit take profit target' },
  { time: '09:15:00 AM', level: 'INFO', service: 'market-data', message: 'Market open sequence initialized' },
];

export function SystemTab() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pt-6">
      
      {/* System Health Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card rounded-2xl border border-border bg-white shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
            <Globe className="w-6 h-6 text-success" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Web Servers</p>
            <h3 className="text-xl font-bold text-slate-800">Operational</h3>
          </div>
        </div>
        
        <div className="glass-card rounded-2xl border border-border bg-white shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
            <Server className="w-6 h-6 text-success" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Execution Engine</p>
            <h3 className="text-xl font-bold text-slate-800">Operational</h3>
          </div>
        </div>
        
        <div className="glass-card rounded-2xl border border-border bg-white shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
            <Database className="w-6 h-6 text-success" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Main Database</p>
            <h3 className="text-xl font-bold text-slate-800">Operational</h3>
          </div>
        </div>
        
        <div className="glass-card rounded-2xl border border-border bg-white shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Broker APIs</p>
            <h3 className="text-xl font-bold text-slate-800">Degraded</h3>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Broker Connections */}
        <div className="glass-card rounded-2xl border border-border bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-border bg-slate-50/50">
            <h2 className="text-base font-bold text-text">Broker Connections</h2>
          </div>
          <div className="p-6 space-y-6 flex-1">
            {BROKERS.map((broker, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-700">{broker.name}</h3>
                    {broker.status === 'Operational' ? (
                      <CheckCircle className="w-3.5 h-3.5 text-success" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-orange-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {broker.latency} latency</span>
                    <span>•</span>
                    <span>{broker.uptime} uptime</span>
                  </div>
                </div>
                <button className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                  Test
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* System Logs */}
        <div className="lg:col-span-2 glass-card rounded-2xl border border-border bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-border bg-slate-50/50 flex items-center justify-between">
            <h2 className="text-base font-bold text-text">System Logs (Live)</h2>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-border">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                Streaming
              </span>
            </div>
          </div>
          <div className="p-0 flex-1 bg-slate-900 overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <tbody className="divide-y divide-slate-800/50">
                {LOGS.map((log, i) => (
                  <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{log.time}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        log.level === 'INFO' ? 'bg-blue-500/20 text-blue-400' :
                        log.level === 'WARN' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {log.level}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-indigo-400 whitespace-nowrap">[{log.service}]</td>
                    <td className="px-4 py-3 text-slate-300 w-full">{log.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
