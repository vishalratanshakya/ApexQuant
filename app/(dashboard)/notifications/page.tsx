import { Bell, AlertTriangle, CheckCircle, Info, Settings, Trash2 } from 'lucide-react';

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: 'alert',
      title: 'Strategy Drawdown Alert',
      message: 'NIFTY Breakout Pro has hit its maximum daily drawdown limit (-2.0%). Trading has been paused for this strategy.',
      time: '10 minutes ago',
      read: false,
      icon: AlertTriangle,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10'
    },
    {
      id: 2,
      type: 'success',
      title: 'Take Profit Hit',
      message: 'BankNifty Reversion bot successfully hit its take profit target at ₹45,200. +₹4,500 booked.',
      time: '2 hours ago',
      read: false,
      icon: CheckCircle,
      color: 'text-success',
      bg: 'bg-success/10'
    },
    {
      id: 3,
      type: 'info',
      title: 'System Update',
      message: 'We have updated our backend execution servers to reduce slippage by 12% on NSE orders.',
      time: 'Yesterday, 4:00 PM',
      read: true,
      icon: Info,
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
    {
      id: 4,
      type: 'success',
      title: 'Backtest Completed',
      message: 'Your backtest for "Options Seller V2" on NIFTY50 has finished running. Check the analytics page for results.',
      time: 'Yesterday, 11:30 AM',
      read: true,
      icon: CheckCircle,
      color: 'text-success',
      bg: 'bg-success/10'
    },
    {
      id: 5,
      type: 'alert',
      title: 'Margin Warning',
      message: 'Your account margin utilization is currently at 85%. Consider adding more funds to avoid square-offs.',
      time: '2 days ago',
      read: true,
      icon: AlertTriangle,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text font-display mb-1 flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary" /> Notifications
          </h1>
          <p className="text-sm text-text-light">Stay updated with your strategy alerts and account activity.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
            <Settings className="w-4 h-4" /> Preferences
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="glass-card rounded-xl border border-border bg-white overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-slate-50/50">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Recent Alerts</h2>
          <button className="text-xs font-semibold text-primary hover:underline">Mark all as read</button>
        </div>
        <div className="divide-y divide-slate-100">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-5 flex gap-4 transition-colors hover:bg-slate-50/80 group ${!notification.read ? 'bg-primary/[0.02]' : ''}`}
            >
              <div className={`w-10 h-10 rounded-xl ${notification.bg} flex items-center justify-center shrink-0`}>
                <notification.icon className={`w-5 h-5 ${notification.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className={`text-sm font-bold truncate ${!notification.read ? 'text-text' : 'text-slate-700'}`}>
                    {notification.title}
                  </h3>
                  <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
                    {notification.time}
                  </span>
                </div>
                <p className={`text-sm leading-relaxed ${!notification.read ? 'text-slate-600 font-medium' : 'text-slate-500'}`}>
                  {notification.message}
                </p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center shrink-0">
                <button className="p-2 text-slate-400 hover:text-loss rounded-lg hover:bg-loss/10 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
