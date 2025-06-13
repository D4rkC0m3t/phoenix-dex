import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getPriceHistory } from '../services/priceService';

interface PriceHistoryPoint {
  timestamp: number;
  price: number;
}

interface PriceChartProps {
  symbol: string;
  days?: number;
  height?: number;
  showLabels?: boolean;
  color?: string;
  positiveColor?: string;
  negativeColor?: string;
}

const PriceChart: React.FC<PriceChartProps> = ({
  symbol,
  days = 30,
  height = 100,
  showLabels = true,
  color,
  positiveColor = '#FF5F00',
  negativeColor = '#B20600'
}) => {
  const [priceHistory, setPriceHistory] = useState<PriceHistoryPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [priceChange, setPriceChange] = useState<number>(0);

  // Fetch price history
  useEffect(() => {
    const fetchPriceHistory = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const history = await getPriceHistory(symbol, days);
        setPriceHistory(history);
        
        // Calculate price change percentage
        if (history.length >= 2) {
          const firstPrice = history[0].price;
          const lastPrice = history[history.length - 1].price;
          const change = ((lastPrice - firstPrice) / firstPrice) * 100;
          setPriceChange(change);
        }
      } catch (err: any) {
        console.error("Error fetching price history:", err);
        setError("Failed to fetch price history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPriceHistory();
  }, [symbol, days]);

  // Generate simplified path without arcs
  const generatePath = () => {
    if (priceHistory.length < 2) return '';
    
    const max = Math.max(...priceHistory.map(point => point.price));
    const min = Math.min(...priceHistory.map(point => point.price));
    const range = max - min || 1;
    
    return priceHistory.map((point, i) => {
      const x = (i / (priceHistory.length - 1)) * 100;
      const y = height - ((point.price - min) / range) * height;
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');
  };

  // Format date for labels
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  // Determine chart color based on price change
  const chartColor = color || (priceChange >= 0 ? positiveColor : negativeColor);

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="flex justify-center items-center" style={{ height }}>
          <motion.div
            className="w-6 h-6 border-2 border-[#FF5F00] border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      ) : error ? (
        <div className="text-center text-[#B20600]" style={{ height }}>
          {error}
        </div>
      ) : (
        <div>
          {/* Price change indicator */}
          {showLabels && (
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-400">
                {days} Day Chart
              </div>
              <div className={`text-sm font-medium ${
                priceChange >= 0 ? 'text-[#FF5F00]' : 'text-[#B20600]'
              }`}>
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
              </div>
            </div>
          )}
          
          {/* Chart */}
          <div className="relative" style={{ height }}>
            <svg
              width="100%"
              height="100%"
              viewBox={`0 0 100 ${height}`}
              preserveAspectRatio="none"
            >
              {/* Chart line */}
              <motion.path
                d={generatePath()}
                fill="none"
                stroke={chartColor}
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
              
              {/* Gradient area - simplified */}
              <motion.path
                d={`${generatePath()} L100,${height} L0,${height} Z`}
                fill={chartColor}
                fillOpacity="0.1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
            </svg>
            
            {/* Date labels */}
            {showLabels && priceHistory.length > 0 && (
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <div>{formatDate(priceHistory[0].timestamp)}</div>
                <div>{formatDate(priceHistory[priceHistory.length - 1].timestamp)}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceChart;
