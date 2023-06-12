'use client';
import { useEffect, useMemo, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, UTCTimestamp } from 'lightweight-charts';
import chartData from './data/banknifty.json';

export default function Home() {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | undefined>(undefined);
  const seriesRef = useRef<ISeriesApi<"Area"> | undefined>(undefined);
  type AreaData = Array<{ time: any; value: string | number }>;

  const priceData: AreaData = useMemo(() => {
    return chartData.map(([timestamp, ltp]) => ({
      time: new Date(timestamp).getTime() / 1000 as UTCTimestamp,
      value: ltp,
    }));
  }, []);

  useEffect(() => {
    if (chartContainerRef.current && !chartRef.current) {
      chartRef.current = createChart(chartContainerRef.current, { width: 800, height: 400 });
      seriesRef.current = chartRef.current.addAreaSeries({
        topColor: '#2962FF',
        bottomColor: 'rgba(41, 98, 255, 0.28)',
        lineColor: '#4275FF',
        lineWidth: 2,
      });
    }

    const currentLocale = window.navigator.languages[0];
    const myPriceFormatter = new Intl.NumberFormat(currentLocale, {
      style: "currency",
      currency: "INR",
    }).format;

    if (chartRef.current) {
      chartRef.current.applyOptions({
        grid: {
          vertLines: {
            visible: false,
          },
          horzLines: {
            visible: false,
          },
        },
        layout: {
          textColor: '#DDD',
          background: { color: '#222' }
        },
        localization: {
          priceFormatter: myPriceFormatter,
        },
      });
    }

    if (seriesRef.current) {
      seriesRef.current.priceScale().applyOptions({
        borderColor: "#71649C"
      });

      seriesRef.current.setData(priceData);
    }

    if (chartRef.current) {
      chartRef.current.timeScale().fitContent();
    }
  }, [priceData]);
  console.log('rendered');

  return (
    <main className="flex min-h-screen w-screen flex-col items-center justify-center p-24">
      <h1 className="font-extrabold animate-text text-transparent text-2xl md:text-3xl bg-clip-text bg-gradient-to-r from-pink-600  via-blue-400 to-purple-600 m-4">
        Phase I: Lightweight Charts (Single Instrument)
      </h1>
      <div className='w-[800] h-[400] rounded-lg border-2 p-2' ref={chartContainerRef}></div>
    </main>
  )
}
