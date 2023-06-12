'use client';
import React, { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, UTCTimestamp } from 'lightweight-charts';
import { ohlcDataFormatter } from '../utils/helper';

type ChartData = Array<[string, number, number]>;

interface ChartProps {
    data: any;
    fitContent: boolean;
    theme?: {
        upColor: string;
        downColor: string;
        borderUpColor: string;
        borderDownColor: string;
    };
    feature?: 'live' | 'plain';
}

const OHLC: React.FC<ChartProps> = ({ data, fitContent, theme, feature }) => {
    const chartContainerRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<IChartApi | undefined>(undefined);
    const seriesRef = useRef<ISeriesApi<'Candlestick'> | undefined>(undefined);
    const ohlcData = useRef<Array<{ time: UTCTimestamp; open: number; high: number; low: number; close: number }>>([]);

    const [rerenderCount, setRerenderCount] = useState(0);
    const [chartData, setChartData] = useState<ChartData>(data);

    const newOHLC = ohlcDataFormatter(data, 15);

    useEffect(() => {
        if (chartContainerRef.current && !chartRef.current) {
            chartRef.current = createChart(chartContainerRef.current, { width: 800, height: 400 });
            seriesRef.current = chartRef.current.addCandlestickSeries({
                upColor: theme?.upColor || '#26a69a',
                downColor: theme?.downColor || '#ef5350',
                wickUpColor: '#26a69a',
                wickDownColor: '#ef5350',
                wickVisible: true,
                borderVisible: false
            });
        }
        const currentLocale = window.navigator.languages[0];
        const myPriceFormatter = new Intl.NumberFormat(currentLocale, {
            style: "currency",
            currency: "INR",
        }).format;
        if (chartRef.current) {
            chartRef.current.applyOptions({
                timeScale: {
                    timeVisible: true,
                },
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
                    background: { color: '#222' },
                },
                localization: {
                    priceFormatter: myPriceFormatter,
                },
            });
        }

        if (seriesRef.current) {
            seriesRef.current.setData(newOHLC);
        }
        if (chartRef.current) {
            chartRef.current.timeScale().fitContent();
        }
    }, []);


    useEffect(() => {
        setRerenderCount(prevCount => prevCount + 1);
    }, []);

    return (
        <>
            <div className="w-[800] h-[400] rounded-lg border-2 p-2" ref={chartContainerRef}></div>
            <p className="p-4">Component Re-rendered: {rerenderCount} times</p>
        </>
    );
};

export default OHLC;
