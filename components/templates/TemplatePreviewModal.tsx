'use client';

import React, { useEffect, useRef } from 'react';
import { StrategyTemplate } from '@/lib/mockTemplates';
import { createChart, ColorType } from 'lightweight-charts';
import { X, TrendingUp, Activity, Copy, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TemplatePreviewModalProps {
  template: StrategyTemplate | null;
  onClose: () => void;
  onUseTemplate: (template: StrategyTemplate) => void;
}

export function TemplatePreviewModal({ template, onClose, onUseTemplate }: TemplatePreviewModalProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!template || !chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#64748b',
      },
      grid: {
        vertLines: { color: 'rgba(226, 232, 240, 0.5)' },
        horzLines: { color: 'rgba(226, 232, 240, 0.5)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 250,
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false, fixLeftEdge: true, fixRightEdge: true },
    });

    const isPositive = template.avgReturn.includes('+');
    const color = isPositive ? '#10b981' : '#f43f5e';

    const areaSeries = chart.addAreaSeries({
      lineColor: color,
      topColor: isPositive ? 'rgba(16, 185, 129, 0.4)' : 'rgba(244, 63, 94, 0.4)',
      bottomColor: isPositive ? 'rgba(16, 185, 129, 0.0)' : 'rgba(244, 63, 94, 0.0)',
      lineWidth: 2,
    });

    areaSeries.setData(template.equityCurve);
    chart.timeScale().fitContent();

    const resizeObserver = new ResizeObserver(entries => {
      if (entries.length === 0 || entries[0].target !== chartContainerRef.current) return;
      chart.applyOptions({ 
        width: entries[0].contentRect.width,
        height: entries[0].contentRect.height 
      });
      chart.timeScale().fitContent();
    });
    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [template]);

  if (!template) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-border flex items-start justify-between bg-slate-50">
            <div>
              <div className="flex gap-2 mb-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary uppercase">{template.category}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600 uppercase">{template.instrument}</span>
              </div>
              <h2 className="text-2xl font-black text-text font-display mb-1">{template.name}</h2>
              <p className="text-sm text-slate-500">{template.description}</p>
            </div>
            <button onClick={onClose} className="p-2 bg-white border border-border rounded-xl text-slate-400 hover:text-loss hover:border-loss/30 transition-colors shadow-sm">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Chart */}
            <div className="glass-card rounded-2xl border border-border overflow-hidden bg-white shadow-sm p-5">
              <div className="mb-4 flex items-center justify-between">
                 <h3 className="text-base font-bold text-text">Historical Performance Preview</h3>
                 <span className="text-[10px] font-bold uppercase px-2 py-1 bg-slate-100 text-slate-500 rounded">1 Year Backtest</span>
              </div>
              <div ref={chartContainerRef} className="w-full h-[250px] bg-slate-50/50 rounded-xl border border-slate-100" />
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1"><Activity className="w-3 h-3" /> Win Rate</p>
                <p className="text-xl font-bold text-text">{template.winRate}%</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Avg Return</p>
                <p className={`text-xl font-bold ${template.avgReturn.includes('+') ? 'text-success' : 'text-loss'}`}>{template.avgReturn}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Max Drawdown</p>
                <p className="text-xl font-bold text-orange-500">{template.maxDrawdown}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Trades / Mo</p>
                <p className="text-xl font-bold text-text">~{template.tradesPerMonth}</p>
              </div>
            </div>

            {/* Logic Overview */}
            <div>
              <h3 className="text-base font-bold text-text mb-4">Strategy Logic Overview</h3>
              <div className="grid md:grid-cols-2 gap-4">
                 <div className="border border-success/20 bg-success/5 p-4 rounded-xl">
                    <h4 className="text-sm font-bold text-success mb-2 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Entry Criteria</h4>
                    <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                      <li>Matches {template.category} profile</li>
                      <li>Volume confirmation threshold</li>
                      <li>Time-based execution (9:15 AM - 3:00 PM)</li>
                    </ul>
                 </div>
                 <div className="border border-loss/20 bg-loss/5 p-4 rounded-xl">
                    <h4 className="text-sm font-bold text-loss mb-2 flex items-center gap-2"><X className="w-4 h-4" /> Exit Criteria</h4>
                    <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
                      <li>Strict 1.5% Stop Loss</li>
                      <li>Trailing SL activated after 1% profit</li>
                      <li>Intraday square-off at 3:15 PM (if applicable)</li>
                    </ul>
                 </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-border bg-slate-50 flex gap-4 justify-end">
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors">
              Cancel
            </button>
            <button 
              onClick={() => onUseTemplate(template)}
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-primary text-white hover:bg-primary-dark transition-colors shadow-sm flex items-center gap-2"
            >
              <Copy className="w-4 h-4" /> Clone & Customize
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
