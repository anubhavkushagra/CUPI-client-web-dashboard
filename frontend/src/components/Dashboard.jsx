import { useState, useEffect } from 'react';
import { socket } from '../socket';
import { getSupportedStocks, getStockHistory } from '../api';
import StockCard from './StockCard';
import TradeModal from './TradeModal';
import { toast } from 'react-toastify';

export default function Dashboard({ user, onLogout }) {
    const [prices, setPrices] = useState({});
    const [portfolio, setPortfolio] = useState(user.portfolio || {});
    const [balance, setBalance] = useState(user.balance);
    const [subscriptions, setSubscriptions] = useState(user.subscriptions || []);
    const [history, setHistory] = useState(user.transactions || []);
    const [supported, setSupported] = useState([]);
    const [histories, setHistories] = useState({});

    const [tradeModalOpen, setTradeModalOpen] = useState(false);
    const [selectedStock, setSelectedStock] = useState(null);

    // Initialize Data
    useEffect(() => {
        getSupportedStocks().then(res => setSupported(res.data));

        // Load initial histories
        subscriptions.forEach(ticker => {
            getStockHistory(ticker).then(res => {
                setHistories(prev => ({ ...prev, [ticker]: res.data }));
            });
        });

        // Socket Listeners
        socket.on('price-update', (data) => {
            // data = { 'GOOG': { price: 100, trend: 'Up' } }
            setPrices(data);

            // Update local histories for charts
            setHistories(prev => {
                const next = { ...prev };
                Object.keys(data).forEach(ticker => {
                    if (!next[ticker]) next[ticker] = [];
                    next[ticker] = [...next[ticker].slice(-19), data[ticker].price];
                });
                return next;
            });
        });

        socket.on('portfolio-update', (p) => setPortfolio(p));
        socket.on('balance-update', (b) => setBalance(b));
        socket.on('subscriptions-update', (s) => setSubscriptions(s));

        socket.on('history-update', (h) => setHistory(h)); // Update history

        socket.on('trade-success', (msg) => toast.success(msg));
        socket.on('error', (msg) => toast.error(msg));

        return () => {
            socket.off('price-update');
            socket.off('portfolio-update');
            socket.off('balance-update');
            socket.off('subscriptions-update');
            socket.off('history-update');
            socket.off('trade-success');
            socket.off('error');
        };
    }, []);

    const handleToggleSubscribe = (ticker) => {
        if (subscriptions.includes(ticker)) {
            socket.emit('unsubscribe', { userId: user.id, ticker });
        } else {
            socket.emit('subscribe', { userId: user.id, ticker });
        }
    };

    const openTrade = (ticker, price) => {
        setSelectedStock({ ticker, price });
        setTradeModalOpen(true);
    };

    const handleTrade = (action, quantity) => {
        socket.emit('trade', {
            userId: user.id,
            action,
            ticker: selectedStock.ticker,
            quantity,
            price: selectedStock.price
        });
    };

    return (
        <div className="min-h-screen bg-cupi-dark text-white p-6">
            {/* Header */}
            <header className="flex justify-between items-center mb-10 max-w-7xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cupi-accent to-purple-500">
                        CUPI Dashboard
                    </h1>
                    <p className="text-gray-400 text-sm">Stock Broker Client Web Dashboard</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <div className="text-xs text-gray-400">Balance</div>
                        <div className="text-2xl font-mono font-bold text-cupi-green">${balance.toFixed(2)}</div>
                    </div>
                    <button
                        onClick={onLogout}
                        className="px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 transition"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto space-y-10">

                {/* Watchlist Section */}
                <section>
                    <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
                        <span className="text-cupi-accent">★</span> Your Watchlist
                    </h2>
                    {subscriptions.length === 0 ? (
                        <div className="p-10 text-center border border-dashed border-gray-700 rounded-2xl text-gray-500">
                            You haven't subscribed to any stocks yet. Check the market below.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {subscriptions.map(ticker => (
                                <StockCard
                                    key={ticker}
                                    ticker={ticker}
                                    price={prices[ticker]?.price || 0}
                                    trend={prices[ticker]?.trend || 'Stable'}
                                    history={histories[ticker] || []}
                                    isSubscribed={true}
                                    onToggleSubscribe={handleToggleSubscribe}
                                    onTrade={openTrade}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* Portfolio Section */}
                <section>
                    <h2 className="text-xl font-bold mb-5">Your Portfolio</h2>
                    <div className="glass rounded-xl p-6 overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-gray-400 border-b border-gray-700">
                                    <th className="pb-3 pl-2">Asset</th>
                                    <th className="pb-3">Quantity</th>
                                    <th className="pb-3">Current Price</th>
                                    <th className="pb-3">Total Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {Object.entries(portfolio).map(([ticker, qty]) => {
                                    const price = prices[ticker]?.price || 0;
                                    return (
                                        <tr key={ticker} className="hover:bg-white/5 transition">
                                            <td className="py-4 pl-2 font-bold">{ticker}</td>
                                            <td className="py-4">{qty}</td>
                                            <td className="py-4">${price.toFixed(2)}</td>
                                            <td className="py-4 font-mono text-cupi-accent">${(price * qty).toFixed(2)}</td>
                                        </tr>
                                    );
                                })}
                                {Object.keys(portfolio).length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="py-8 text-center text-gray-500">No assets held. Start trading!</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Market Section */}
                <section>
                    <h2 className="text-xl font-bold mb-5">Market Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {supported.map(ticker => (
                            <div key={ticker} className={`p-4 rounded-lg border border-gray-800 bg-gray-900/40 flex justify-between items-center ${subscriptions.includes(ticker) ? 'opacity-50' : 'opacity-100'}`}>
                                <span className="font-bold">{ticker}</span>
                                <button
                                    onClick={() => handleToggleSubscribe(ticker)}
                                    className="text-sm text-cupi-accent hover:underline"
                                >
                                    {subscriptions.includes(ticker) ? 'Subscribed' : '+ Subscribe'}
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* History Section */}
                <section>
                    <h2 className="text-xl font-bold mb-5">Transaction History</h2>
                    <div className="glass rounded-xl p-6 overflow-hidden">
                        <div className="max-h-96 overflow-y-auto">
                            <table className="w-full text-left text-sm">
                                <sticky className="sticky top-0 bg-cupi-card z-10">
                                    <thead>
                                        <tr className="text-gray-400 border-b border-gray-700">
                                            <th className="pb-3 pl-2">Time</th>
                                            <th className="pb-3">Action</th>
                                            <th className="pb-3">Asset</th>
                                            <th className="pb-3">Quantity</th>
                                            <th className="pb-3">Price</th>
                                        </tr>
                                    </thead>
                                </sticky>
                                <tbody className="divide-y divide-gray-800">
                                    {history.slice().reverse().map((tx, i) => (
                                        <tr key={i} className="hover:bg-white/5 transition">
                                            <td className="py-3 pl-2 text-gray-400">{new Date(tx.date).toLocaleTimeString()}</td>
                                            <td className={`py-3 font-bold ${tx.action === 'BUY' ? 'text-cupi-green' : 'text-cupi-red'}`}>{tx.action}</td>
                                            <td className="py-3 font-medium">{tx.ticker}</td>
                                            <td className="py-3">{tx.quantity}</td>
                                            <td className="py-3">${tx.price.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    {history.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="py-8 text-center text-gray-500">No transactions yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

            </main>

            {/* Modals */}
            {selectedStock && (
                <TradeModal
                    isOpen={tradeModalOpen}
                    onClose={() => setTradeModalOpen(false)}
                    stock={selectedStock}
                    onTrade={handleTrade}
                />
            )}
        </div>
    );
}
