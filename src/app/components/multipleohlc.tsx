'use client';
import { useEffect, useState } from 'react';
import { addPricesAtSameTimestamp } from '../utils/helper';
import OHLC from './ohlc';

type ChartData = [string, number, number][];

export default function MultipleData({ data }: any) {
    const [selectedData, setSelectedData] = useState<string[]>([]);
    const [mergedData, setMergedData] = useState<ChartData>([]);
    const [feature, setFeature] = useState<'live' | 'plain'>('plain');

    const theme = {
        upColor: '#E966A0',
        downColor: "#6554AF",
        wickUpColor: "#FFDEDE",
        wickDownColor: "#FAF0E4",
    }

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const isChecked = event.target.checked;

        if (isChecked) {
            setSelectedData((prevSelectedData) => [...prevSelectedData, value]);
        } else {
            setSelectedData((prevSelectedData) =>
                prevSelectedData.filter((item) => item !== value)
            );
        }
        addPricesAtSameTimestamp(
            ...selectedData.map((item: string) => data[item])
        );
    };

    const handleFeatureToggle = () => {
        setFeature((prevFeature) => (prevFeature === 'live' ? 'plain' : 'live'));
    };

    useEffect(() => {
        setMergedData(addPricesAtSameTimestamp(
            ...selectedData.map((item: string) => data[item])
        ));
    }, [selectedData]);

    return (
        <div className='flex flex-col items-center justify-center'>
            <div className="flex items-center h-5 p-1 m-3">
                <input
                    id="data1"
                    type="checkbox"
                    value="0"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                    onChange={handleCheckboxChange}
                />
                <label htmlFor="data1" className="ml-2 mr-4 text-sm font-medium">
                    Data 1 📁
                </label>
                <input
                    id="data2"
                    type="checkbox"
                    value="1"
                    className="w-4 ml-2 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                    onChange={handleCheckboxChange}
                />
                <label htmlFor="data2" className="ml-2 mr-4 text-sm font-medium">
                    Data 2 📁
                </label>
                <input
                    id="data3"
                    type="checkbox"
                    value="2"
                    className="w-4 ml-2 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                    onChange={handleCheckboxChange}
                />
                <label htmlFor="data3" className="ml-2 mr-4 text-sm font-medium">
                    Data 3 📁
                </label>
            </div>
            <div>
                <label className="relative inline-flex items-center mr-5 cursor-pointer">
                    <input type="checkbox" value={feature} className="sr-only peer" onChange={handleFeatureToggle} />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600 focus:outline-none"></div>
                    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Current  Behaviour : <span className='capitalize font-bold text-cyan-200'>{feature}</span></span>
                </label>
            </div>
            {mergedData.length > 0 && (
                <OHLC data={mergedData} fitContent={false} feature={feature} theme={theme} />
            )}
        </div>
    );
}
