'use client';

export default function Heatmap() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const data = [
    { month: 'Jan', value: 4.2 },
    { month: 'Feb', value: -1.5 },
    { month: 'Mar', value: 6.8 },
    { month: 'Apr', value: 2.1 },
    { month: 'May', value: -3.4 },
    { month: 'Jun', value: 8.5 },
    { month: 'Jul', value: 1.2 },
    { month: 'Aug', value: 5.4 },
    { month: 'Sep', value: -0.5 },
    { month: 'Oct', value: 3.2 },
    { month: 'Nov', value: 7.1 },
    { month: 'Dec', value: 2.8 },
  ];

  const getColor = (val: number) => {
    if (val > 5) return 'bg-[#10b981] text-white border-[#059669]';
    if (val > 0) return 'bg-[#10b981]/20 text-[#059669] border-[#10b981]/30';
    if (val < -2) return 'bg-[#ef4444] text-white border-[#dc2626]';
    if (val < 0) return 'bg-[#ef4444]/20 text-[#dc2626] border-[#ef4444]/30';
    return 'bg-slate-100 text-slate-500 border-slate-200';
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[500px]">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(13, minmax(0, 1fr))' }} className="gap-1 text-center text-[10px] mb-1 font-semibold uppercase text-slate-400">
          <div>Yr</div>
          {months.map(m => <div key={m}>{m}</div>)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(13, minmax(0, 1fr))' }} className="gap-1 text-center text-[11px]">
          <div className="flex items-center justify-center font-bold text-slate-600 bg-slate-100 rounded-md py-2 border border-slate-200">
            2023
          </div>
          {data.map((d, i) => (
            <div 
              key={i} 
              className={`flex items-center justify-center py-2 rounded-md font-bold border transition-transform hover:scale-105 cursor-default ${getColor(d.value)}`}
              title={`${d.month} 2023: ${d.value > 0 ? '+' : ''}${d.value}%`}
            >
              {d.value > 0 ? '+' : ''}{d.value}%
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
