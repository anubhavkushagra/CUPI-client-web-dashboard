import { memo } from 'react';
import SparklineChart from './SparklineChart';

const StockCard = memo(({ ticker, price, trend, history, isSubscribed, onToggleSubscribe, onTrade }) => {
    const isUp = trend === 'Up';

    return (
        <div className={`p-5 rounded-xl border transition-all hover:scale-[1.02] shadow-lg flex flex-col justify-between h-48 group
      ${isSubscribed ? 'bg-cupi-card border-cupi-accent/30' : 'bg-gray-900/50 border-gray-800 opacity-70 hover:opacity-100'}`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-white">{ticker}</h3>
                    <div className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block mt-1 ${isUp ? 'bg-cupi-green/20 text-cupi-green' : 'bg-cupi-red/20 text-cupi-red'}`}>
                        {trend}
                    </div>
                </div>
                <button
                    onClick={() => onToggleSubscribe(ticker)}
                    className={`text-2xl transition-colors ${isSubscribed ? 'text-cupi-accent' : 'text-gray-600 hover:text-gray-400'}`}
                >
                    {isSubscribed ? '★' : '☆'}
                </button>
            </div>

            <div className="flex justify-between items-end mt-4">
                <div>
                    <div className="text-3xl font-bold tracking-tight text-white">${price.toFixed(2)}</div>
                </div>
                {history && <SparklineChart history={history} color={isUp ? '#10b981' : '#ef4444'} />}
            </div>

            <button
                onClick={() => onTrade(ticker, price)}
                className="mt-4 w-full py-2 rounded-lg bg-gray-800 text-sm font-medium text-gray-300 hover:bg-cupi-accent hover:text-white transition-all opacity-0 group-hover:opacity-100"
            >
                Trade
            </button>
        </div>
    );
});

export default StockCard;
