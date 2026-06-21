import { Users, TrendingUp, Star } from 'lucide-react';

export default function TestimonialsStats() {
  const stats = [
    {
      icon: <Users className="w-6 h-6 text-primary" />,
      value: '15,000+',
      label: 'Active Traders',
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-success" />,
      value: '₹450+ Cr',
      label: 'Backtested Volume',
    },
    {
      icon: <Star className="w-6 h-6 text-amber-500 fill-amber-500" />,
      value: '4.9/5',
      label: 'Average Rating',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      {stats.map((stat, i) => (
        <div key={i} className="glass-card bg-white border border-border p-6 rounded-2xl flex items-center justify-center gap-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
            {stat.icon}
          </div>
          <div>
            <div className="text-3xl font-black text-text">{stat.value}</div>
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
