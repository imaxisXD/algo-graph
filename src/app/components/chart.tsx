'use client';
import React, { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, UTCTimestamp } from 'lightweight-charts';

type ChartData = Array<[string, number, number]>;

interface ChartProps {
    data: any;
    fitContent: boolean;
    theme?: {
        topColor: string;
        bottomColor: string;
        lineColor: string;
    };
    feature?: 'live' | 'plain';
}

const Chart: React.FC<ChartProps> = ({ data, fitContent, theme, feature }) => {
    const chartContainerRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<IChartApi | undefined>(undefined);
    const seriesRef = useRef<ISeriesApi<'Area'> | undefined>(undefined);
    const priceData = useRef<Array<{ time: UTCTimestamp; value: string | number }>>([]);
    const [rerenderCount, setRerenderCount] = useState(0);
    const [chartData, setChartData] = useState<ChartData>(data);

    useEffect(() => {
        if (chartContainerRef.current && !chartRef.current) {
            chartRef.current = createChart(chartContainerRef.current, { width: 800, height: 400 });
            seriesRef.current = chartRef.current.addAreaSeries({
                topColor: theme?.topColor || '#00DFA2',
                bottomColor: theme?.bottomColor || 'transparent',
                lineColor: theme?.lineColor || '#1B9C85',
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
            seriesRef.current.setData(priceData.current);
        }
        if (chartRef.current) {
            chartRef.current.timeScale().fitContent();
        }
    }, []);

    // Mock WebSocket Behavior
    useEffect(() => {
        if (feature === 'live') {
            const interval = setInterval(() => {
                const lastDataPoint = chartData[chartData.length - 1];
                const currentDate = new Date();
                const newTimestamp = currentDate.toISOString();
                const newValue = lastDataPoint[1] + Math.random() * 1000 - 500;
                const newPoint: [string, number, number] = [newTimestamp, newValue, 0];
                setChartData(prevData => [...prevData, newPoint]);
            }, 1000);

            return () => {
                clearInterval(interval);
            };
        }
    }, [chartData, feature]);

    useEffect(() => {
        if (chartRef.current && seriesRef.current) {
            const updatedPriceData = chartData.map(([timestamp, value, _]) => ({
                time: new Date(timestamp).getTime() / 1000 as UTCTimestamp,
                value,
            }));

            // Update the priceData ref outside the component rendering process
            priceData.current = updatedPriceData;

            seriesRef.current.setData(priceData.current);
            if (fitContent) {
                chartRef.current.timeScale().fitContent();
            }
        }
    }, [chartData, fitContent]);

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

export default Chart;
