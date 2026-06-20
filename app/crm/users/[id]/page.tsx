'use client';

import { ArrowLeft, User, Mail, CreditCard, Activity, Shield } from 'lucide-react';
import Link from 'next/link';

export default function CRMUserProfilePage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/crm/users" className="p-2 border border-border rounded-lg bg-white hover:bg-slate-50 text-slate-400 hover:text-text transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-text font-display flex items-center gap-2">
              trader{params.id}@example.com
              <span className="px-2 py-0.5 rounded bg-success/10 text-success text-[10px] font-bold uppercase tracking-wider">Active</span>
            </h1>
            <p className="text-xs text-slate-500">User ID: usr_{params.id}8f9a2b</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary px-4 py-2 rounded-lg text-sm font-semibold">Reset Password</button>
          <button className="btn-primary px-4 py-2 rounded-lg text-sm font-semibold text-white">Edit Profile</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="space-y-6 lg:col-span-1">
          {/* Info Card */}
          <div className="bg-white rounded-xl border border-border shadow-sm p-5">
            <h3 className="font-bold text-text mb-4">Account Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <User className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Full Name</p>
                  <p className="font-medium text-text">Apex Trader {params.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Email Address</p>
                  <p className="font-medium text-text">trader{params.id}@example.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Role</p>
                  <p className="font-medium text-text">Standard User</p>
                </div>
              </div>
            </div>
          </div>

          {/* Billing Card */}
          <div className="bg-white rounded-xl border border-border shadow-sm p-5">
            <h3 className="font-bold text-text mb-4">Subscription</h3>
            <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-accent">Pro Plan</span>
                <span className="text-xs font-bold text-slate-500">₹1,999/mo</span>
              </div>
              <p className="text-xs text-slate-500">Renews on Nov 12, 2023</p>
            </div>
            <button className="w-full py-2 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
              Manage Billing
            </button>
          </div>
        </div>

        {/* Right Column: Activity */}
        <div className="space-y-6 lg:col-span-2">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white border border-border rounded-xl p-4 shadow-sm">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Strategies</p>
              <p className="text-2xl font-bold text-text">14</p>
            </div>
            <div className="bg-white border border-border rounded-xl p-4 shadow-sm">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Live Deployments</p>
              <p className="text-2xl font-bold text-success">3</p>
            </div>
            <div className="bg-white border border-border rounded-xl p-4 shadow-sm">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Total P&L</p>
              <p className="text-2xl font-bold text-success">+₹2.4L</p>
            </div>
          </div>

          {/* Connected Brokers */}
          <div className="bg-white rounded-xl border border-border shadow-sm p-5">
            <h3 className="font-bold text-text mb-4">Connected Brokers</h3>
            <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-xs">Z</div>
                <span className="font-bold text-sm">Zerodha Kite</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-success/10 text-success text-[10px] font-bold uppercase">Connected</span>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-bold text-text">Recent Activity</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-4 flex gap-4">
                  <div className="mt-1">
                    <Activity className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text">Strategy <span className="font-bold">NIFTY Scalper</span> deployed live.</p>
                    <p className="text-xs text-slate-500">{i + 1} days ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
