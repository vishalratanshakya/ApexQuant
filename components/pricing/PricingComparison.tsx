import { Check, X } from 'lucide-react';

const features = [
  { name: 'Backtesting', free: '10 / month', pro: 'Unlimited', enterprise: 'Unlimited' },
  { name: 'Live Deployment', free: '-', pro: '10 Strategies', enterprise: 'Unlimited' },
  { name: 'Indicators', free: 'Basic (15+)', pro: 'Advanced (80+)', enterprise: 'Custom coded' },
  { name: 'Timeframes', free: '15m, 1H, 1D', pro: '1m, 5m, 15m, 1H, 1D', enterprise: 'Tick-by-tick' },
  { name: 'Options Builder', free: false, pro: true, enterprise: true },
  { name: 'Trailing Stop Loss', free: false, pro: true, enterprise: true },
  { name: 'API Access', free: false, pro: false, enterprise: true },
  { name: 'Support', free: 'Community', pro: 'Priority Email', enterprise: 'Dedicated Manager' },
];

export default function PricingComparison() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-text mb-4">Compare Features</h2>
        <p className="text-slate-500">Every plan includes Broker Integration, TradingView Charts, and Cloud Execution.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-200">
              <th className="py-4 px-6 font-bold text-slate-700 w-1/3">Feature</th>
              <th className="py-4 px-6 font-bold text-slate-700 text-center w-2/9">Free</th>
              <th className="py-4 px-6 font-bold text-primary text-center w-2/9 bg-primary/5 rounded-t-xl">Pro</th>
              <th className="py-4 px-6 font-bold text-slate-900 text-center w-2/9">Enterprise</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {features.map((feature, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 font-medium text-slate-600">{feature.name}</td>
                
                <td className="py-4 px-6 text-center text-slate-500 font-medium">
                  {typeof feature.free === 'boolean' ? (
                    feature.free ? <Check className="w-5 h-5 text-success mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />
                  ) : (
                    feature.free
                  )}
                </td>
                
                <td className="py-4 px-6 text-center text-slate-700 font-bold bg-primary/5">
                  {typeof feature.pro === 'boolean' ? (
                    feature.pro ? <Check className="w-5 h-5 text-primary mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />
                  ) : (
                    feature.pro
                  )}
                </td>
                
                <td className="py-4 px-6 text-center text-slate-800 font-medium">
                  {typeof feature.enterprise === 'boolean' ? (
                    feature.enterprise ? <Check className="w-5 h-5 text-slate-800 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />
                  ) : (
                    feature.enterprise
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
