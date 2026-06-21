'use client';

import { MessageSquare, Send, Search, Bell } from 'lucide-react';

export default function CRMCommunicationsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-120px)] flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-text font-display mb-1 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-blue-500" /> Communications
        </h1>
        <p className="text-sm text-slate-500">Send announcements, alerts, and manage support tickets.</p>
      </div>

      <div className="flex-1 grid lg:grid-cols-3 gap-6 min-h-0">
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search users..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${i === 0 ? 'bg-blue-50/50' : ''}`}>
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-sm text-text">user{i}@example.com</span>
                  <span className="text-[10px] text-slate-400">10:42 AM</span>
                </div>
                <p className="text-xs text-slate-500 truncate">I need help with my strategy backtest results...</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-bold text-text">user0@example.com</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600">View Profile</button>
              <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-success/10 text-success">Mark Resolved</button>
            </div>
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 space-y-4">
            <div className="flex gap-4 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xs font-bold">U</div>
              <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-sm text-sm text-text shadow-sm">
                Hi, I am trying to run a backtest but I get an error saying &quot;Insufficient Data&quot;. What should I do?
              </div>
            </div>
            
            <div className="flex gap-4 max-w-[80%] ml-auto flex-row-reverse">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">A</div>
              <div className="bg-blue-500 text-white p-3 rounded-2xl rounded-tr-sm text-sm shadow-sm">
                Hello! That usually happens if you select a timeframe smaller than 5m for options older than 3 months. Can you try changing the timeframe to 5m?
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t border-border bg-white">
            <div className="flex items-center gap-3">
              <input type="text" placeholder="Type your message..." className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
              <button className="bg-blue-500 hover:bg-blue-600 text-white p-2.5 rounded-lg transition-colors">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
