const STOCKS = ['GOOG', 'TSLA', 'AMZN', 'META', 'NVDA'];

// Initial dummy prices
let prices = {
    GOOG: 150.00,
    TSLA: 240.00,
    AMZN: 130.00,
    META: 300.00,
    NVDA: 450.00
};

// Store history for charts (maintain last 20 points)
let history = {};
STOCKS.forEach(s => history[s] = Array(20).fill(prices[s]));

const generatePrice = (currentPrice) => {
    const volatility = 0.002; // 0.2% fluctuation
    const change = currentPrice * volatility * (Math.random() - 0.5);
    return parseFloat((currentPrice + change).toFixed(2));
};

const calculateTrend = (history) => {
    // Simple SMA (Simple Moving Average) crossover logic for "ML" Trend
    if (history.length < 5) return 'Stable';
    const recent = history.slice(-5);
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const current = recent[recent.length - 1];
    return current > avg ? 'Up' : 'Down';
};

const startPriceGeneration = (io) => {
    setInterval(() => {
        const updates = {};

        STOCKS.forEach(ticker => {
            const newPrice = generatePrice(prices[ticker]);
            prices[ticker] = newPrice;

            // Update history
            history[ticker].shift();
            history[ticker].push(newPrice);

            updates[ticker] = {
                price: newPrice,
                trend: calculateTrend(history[ticker])
            };
        });

        // Broadcast to everyone
        io.emit('price-update', updates);

    }, 1000); // 1 second update
};

const getSupportedStocks = () => STOCKS;
const getStockHistory = (ticker) => history[ticker] || [];
const getCurrentPrices = () => prices;

module.exports = { startPriceGeneration, getSupportedStocks, getStockHistory, getCurrentPrices };
