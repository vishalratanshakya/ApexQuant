'use client';

import React, { useEffect, useRef } from 'react';
import { StrategyTemplate } from '@/lib/mockTemplates';

const generateFallbackCurve = (isPositive: boolean) => {
  let val = 100000;
  const trend = isPositive ? 200 : -200;
  return Array.from({ length: 30 }).map((_, i) => {
    val += (Math.random() - 0.5) * 1500 + trend;
    return {
      time: `2023-09-${(i + 1).toString().padStart(2, '0')}`,
      value: val
    };
  });
};
import { createChart, ColorType } from 'lightweight-charts';
import { TrendingUp, Activity, BarChart2, Star, Eye } from 'lucide-react';

interface TemplateCardProps {
  template: StrategyTemplate;
  onPreview: (template: StrategyTemplate) => void;
  onUseTemplate: (template: StrategyTemplate) => void;
}

export function TemplateCard({ template, onPreview, onUseTemplate }: TemplateCardProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Render mini chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: 'transparent',
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      width: chartContainerRef.current.clientWidth,
      height: 60,
      rightPriceScale: { visible: false },
      timeScale: { visible: false },
      crosshair: {
        vertLine: { visible: false },
        horzLine: { visible: false }
      },
      handleScroll: false,
      handleScale: false,
    });

    const isPositive = template.avgReturn.includes('+');
    const color = isPositive ? '#10b981' : '#f43f5e';

    const areaSeries = chart.addAreaSeries({
      lineColor: color,
      topColor: isPositive ? 'rgba(16, 185, 129, 0.4)' : 'rgba(244, 63, 94, 0.4)',
      bottomColor: isPositive ? 'rgba(16, 185, 129, 0.0)' : 'rgba(244, 63, 94, 0.0)',
      lineWidth: 2,
    });

    const data = (template.equityCurve && template.equityCurve.length > 0) 
      ? template.equityCurve 
      : generateFallbackCurve(isPositive);
    
    try {
      areaSeries.setData(data);
    } catch (e) {
      console.error("Error setting chart data:", e);
    }
    
    chart.timeScale().fitContent();

    const resizeObserver = new ResizeObserver(entries => {
      if (entries.length === 0 || entries[0].target !== chartContainerRef.current) return;
      chart.applyOptions({ width: entries[0].contentRect.width });
    });
    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [template]);

  return (
    <div className="glass-card rounded-2xl border border-border bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group overflow-hidden relative">
      {template.trending && (
        <div className="absolute top-4 right-4 bg-orange-100 text-orange-600 px-2 py-1 rounded-md text-[10px] font-bold uppercase flex items-center gap-1 z-10 shadow-sm">
          <Star className="w-3 h-3 fill-current" /> Trending
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex flex-wrap gap-2 mb-3 pr-16">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary uppercase">{template.category}</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 uppercase">{template.difficulty}</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600 uppercase">{template.instrument}</span>
        </div>

        <h3 className="text-lg font-bold text-text mb-1 group-hover:text-primary transition-colors">{template.name}</h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-4">{template.description}</p>
        
        {/* Mini Chart */}
        <div className="mt-auto pt-4 border-t border-slate-100 relative">
          <div className="absolute -top-3 left-4 bg-white px-2 text-[10px] font-bold text-slate-400 uppercase">Equity Curve</div>
          <div ref={chartContainerRef} className="w-full" />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 bg-slate-50 p-3 rounded-xl">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Win Rate</p>
            <p className="text-sm font-bold text-text flex items-center gap-1"><Activity className="w-3 h-3 text-primary" /> {template.winRate}%</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Avg Return</p>
            <p className={`text-sm font-bold flex items-center gap-1 ${template.avgReturn.includes('+') ? 'text-success' : 'text-loss'}`}>
              <TrendingUp className="w-3 h-3" /> {template.avgReturn}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 border-t border-border mt-auto">
        <button 
          onClick={() => onPreview(template)}
          className="py-3.5 text-sm font-bold text-slate-500 hover:text-text hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 border-r border-border"
        >
          <Eye className="w-4 h-4" /> Preview
        </button>
        <button 
          onClick={() => onUseTemplate(template)}
          className="py-3.5 text-sm font-bold text-primary hover:text-white hover:bg-primary transition-colors flex items-center justify-center gap-2"
        >
          Use Template
        </button>
      </div>
    </div>
  );
}
