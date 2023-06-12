
import chartData from './data/banknifty.json';
import Chart from './components/chart';
import OHLC from './components/ohlc';

export default function Home() {


  const plainTheme = {
    topColor: '#E1AEFF',
    bottomColor: 'transparent',
    lineColor: '#9376E0',
  };
  const liveTheme = {
    topColor: '#FEA1A1',
    bottomColor: 'transparent',
    lineColor: '#FF6969',
  };




  return (
    <main className="flex min-h-screen w-screen flex-col items-center justify-center p-24 bg-gradient-radial">
      <h1 className="font-extrabold animate-text text-transparent text-2xl md:text-3xl bg-clip-text bg-gradient-to-r from-rose-400 via-pink-200 to-purple-600 m-4">
        Phase I : Lightweight Charts (Single Instrument)
      </h1>
      <Chart data={chartData} fitContent={true} theme={plainTheme} feature='plain' />
      <h1 className="font-extrabold animate-text text-transparent text-2xl md:text-3xl bg-clip-text bg-gradient-to-r from-rose-200 to-red-400 m-4">
        Phase II : Live Price Chart
      </h1>
      <Chart data={chartData} fitContent={false} theme={liveTheme} feature='live' />
      <OHLC data={chartData} fitContent={false} />
    </main>
  )
}
