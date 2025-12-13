import { useState } from 'react';

export default function TradeModal({ isOpen, onClose, stock, onTrade }) {
    const [quantity, setQuantity] = useState(1);
    const [mode, setMode] = useState('BUY');

    if (!isOpen) return null;

    const total = (stock.price * quantity).toFixed(2);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-cupi-card border border-white/10 rounded-2xl p-6 w-96 shadow-2xl transform transition-all scale-100">
                <h3 className="text-xl font-bold text-white mb-4 flex justify-between">
                    Trade {stock.ticker}
                    <span className="text-sm font-normal text-gray-400">@ ${stock.price}</span>
                </h3>

                <div className="flex bg-gray-900 rounded-lg p-1 mb-6">
                    <button
                        onClick={() => setMode('BUY')}
                        className={`flex-1 py-1 rounded-md text-sm font-medium transition-all ${mode === 'BUY' ? 'bg-cupi-green text-white shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                        Buy
                    </button>
                    <button
                        onClick={() => setMode('SELL')}
                        className={`flex-1 py-1 rounded-md text-sm font-medium transition-all ${mode === 'SELL' ? 'bg-cupi-red text-white shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                        Sell
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-gray-500 uppercase">Quantity</label>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-cupi-accent outline-none"
                        />
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium">
                        <span className="text-gray-400">Total</span>
                        <span className="text-xl text-white">${total}</span>
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition">Cancel</button>
                    <button
                        onClick={() => { onTrade(mode, quantity); onClose(); }}
                        className={`flex-1 py-2 rounded-lg font-bold text-white transition ${mode === 'BUY' ? 'bg-cupi-green hover:bg-green-600' : 'bg-cupi-red hover:bg-red-600'}`}
                    >
                        Confirm {mode}
                    </button>
                </div>
            </div>
        </div>
    );
}
