'use client';

import { useEffect, useRef } from 'react';

// Generate a realistic-looking equity curve
function generateEquityCurve(points = 120) {
  const data = [];
  let value = 100000;
  const now = Math.floor(Date.now() / 1000);
  const ONE_DAY = 86400;

  for (let i = points; i >= 0; i--) {
    const date = now - i * ONE_DAY;
    const change = (Math.random() - 0.38) * 0.025 * value;
    value = Math.max(value + change, 60000);
    data.push({
      time: date as unknown as import('lightweight-charts').UTCTimestamp,
      value: parseFloat(value.toFixed(2)),
    });
  }
  return data;
}

interface MiniChartProps {
  height?: number;
  className?: string;
}

export default function MiniChart({ height = 220, className = '' }: MiniChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    
    let chartInstance: ReturnType<typeof import('lightweight-charts').createChart> | null = null;
    let isMounted = true;
    let resizeObserver: ResizeObserver | null = null;

    const init = async () => {
      const { createChart, ColorType, LineStyle } = await import('lightweight-charts');
      if (!isMounted) return;

      container.innerHTML = '';

      const w = container.clientWidth || 600;

      chartInstance = createChart(container, {
        width: w,
        height,
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: 'rgba(100, 116, 139, 0.7)',
          fontFamily: 'Inter, sans-serif',
          fontSize: 10,
        },
        grid: {
          vertLines: { color: 'rgba(226, 232, 240, 0.8)', style: LineStyle.Dotted },
          horzLines: { color: 'rgba(226, 232, 240, 0.8)', style: LineStyle.Dotted },
        },
        rightPriceScale: {
          borderColor: 'rgba(226, 232, 240, 1)',
          scaleMargins: { top: 0.1, bottom: 0.1 },
        },
        timeScale: {
          borderColor: 'rgba(226, 232, 240, 1)',
          timeVisible: false,
          secondsVisible: false,
        },
        crosshair: {
          vertLine: { color: 'rgba(59, 130, 246, 0.3)', width: 1 },
          horzLine: { color: 'rgba(59, 130, 246, 0.3)', width: 1 },
        },
        handleScroll: false,
        handleScale: false,
      });

      const areaSeries = chartInstance.addAreaSeries({
        lineColor: '#3b82f6',
        topColor: 'rgba(59, 130, 246, 0.25)',
        bottomColor: 'rgba(59, 130, 246, 0.01)',
        lineWidth: 2,
        crosshairMarkerRadius: 5,
        crosshairMarkerBackgroundColor: '#3b82f6',
        lastValueVisible: true,
        priceLineVisible: false,
      });

      const data = generateEquityCurve(120);
      areaSeries.setData(data);
      chartInstance.timeScale().fitContent();

      resizeObserver = new ResizeObserver((entries) => {
        if (!chartInstance) return;
        for (const entry of entries) {
          chartInstance.applyOptions({ width: entry.contentRect.width });
        }
      });
      resizeObserver.observe(container);
    };

    init();

    return () => {
      isMounted = false;
      if (resizeObserver) resizeObserver.disconnect();
      if (chartInstance) {
        chartInstance.remove();
      } else {
        container.innerHTML = '';
      }
    };
  }, [height]);

  return (
    <div className={`chart-container relative rounded-xl overflow-hidden ${className}`}>
      {/* Top labels */}
      <div className="absolute top-3 left-4 z-10 flex items-center gap-3">
        <span className="text-xs font-medium text-slate-500">Portfolio Equity Curve</span>
        <span className="text-xs font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full">
          +128.4%
        </span>
      </div>
      <div ref={containerRef} style={{ height }} />
      {/* Bottom axis label */}
      <div className="absolute bottom-2 right-4 z-10">
        <span className="text-[10px] text-slate-400">120-day backtest · NIFTY50 strategy</span>
      </div>
    </div>
  );
}
