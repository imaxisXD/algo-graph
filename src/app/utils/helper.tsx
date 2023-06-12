import { Time } from "lightweight-charts";

export function ohlcDataFormatter(data: any, intervalInMins: number) {
    const ohlcData = [];
    let currentTimestamp = new Date(data[0][0]).getTime();
    let currentOpen = data[0][1];
    let currentHigh = data[0][1];
    let currentLow = data[0][1];
    let currentClose = data[0][1];
    for (let i = 1; i < data.length; i++) {
        const timestamp = new Date(data[i][0]).getTime();
        const price = data[i][1];
        if (timestamp - currentTimestamp >= intervalInMins * 60 * 1000) {
            ohlcData.push({ "time": currentTimestamp / 1000 as Time, "open": currentOpen, "high": currentHigh, "low": currentLow, "close": currentClose });
            currentTimestamp = timestamp;
            currentOpen = price;
            currentHigh = price;
            currentLow = price;
            currentClose = price;
        } else {
            currentHigh = Math.max(currentHigh, price);
            currentLow = Math.min(currentLow, price);
            currentClose = price;
        }
    }
    ohlcData.push({ "time": currentTimestamp / 1000 as Time, "open": currentOpen, "high": currentHigh, "low": currentLow, "close": currentClose });
    return (ohlcData);
};