import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Mock gas history data
interface GasHistoryPoint {
  timestamp: number;
  baseFee: number;
  gasPrice: number;
}

const GasHistoryChart: React.FC = () => {
  const [gasHistory, setGasHistory] = useState<GasHistoryPoint[]>([]);
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Generate mock gas history data
  useEffect(() => {
    const generateMockGasHistory = () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const now = Date.now();
        const history: GasHistoryPoint[] = [];
        
        // Determine number of data points and interval based on time range
        let dataPoints = 24;
        let interval = 60 * 60 * 1000; // 1 hour in milliseconds
        
        switch (timeRange) {
          case '1h':
            dataPoints = 60;
            interval = 60 * 1000; // 1 minute
            break;
          case '24h':
            dataPoints = 24;
            interval = 60 * 60 * 1000; // 1 hour
            break;
          case '7d':
            dataPoints = 7 * 24;
            interval = 60 * 60 * 1000; // 1 hour
            break;
          case '30d':
            dataPoints = 30;
            interval = 24 * 60 * 60 * 1000; // 1 day
            break;
        }
        
        // Base values
        const baseGasPrice = 20; // 20 Gwei
        const baseBaseFee = 15; // 15 Gwei
        
        // Generate data points
        for (let i = dataPoints - 1; i >= 0; i--) {
          const timestamp = now - (i * interval);
          
          // Add some random variation
          const randomFactor = Math.sin(i * 0.5) * 0.5 + Math.random() * 0.5;
          const gasPrice = baseGasPrice + randomFactor * 15;
          const baseFee = baseBaseFee + randomFactor * 10;
          
          history.push({
            timestamp,
            baseFee,
            gasPrice
          });
        }
        
        setGasHistory(history);
        setIsLoading(false);
      } catch (err) {
        console.error("Error generating gas history:", err);
        setError("Failed to generate gas history");
        setIsLoading(false);
      }
    };
    
    generateMockGasHistory();
  }, [timeRange]);
  
  // Find max value for scaling
  const maxValue = Math.max(
    ...gasHistory.map(point => Math.max(point.baseFee, point.gasPrice))
  );
  
  // Chart dimensions
  const chartWidth = 100; // percentage
  const chartHeight = 200; // pixels
  
  // Format timestamp
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    
    switch (timeRange) {
      case '1h':
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case '24h':
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case '7d':
        return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit' });
      case '30d':
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      default:
        return date.toLocaleString();
    }
  };
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-heading">Gas Price History</h3>
        
        <div className="flex space-x-2">
          {(['1h', '24h', '7d', '30d'] as const).map((range) => (
            <motion.button
              key={range}
              className={`px-3 py-1 rounded-lg text-xs ${
                timeRange === range 
                  ? 'bg-[#FF5F00] text-white' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
              onClick={() => setTimeRange(range)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {range}
            </motion.button>
          ))}
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-60 bg-white/5 rounded-lg">
          <motion.div
            className="w-6 h-6 border-2 border-[#FF5F00] border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      ) : error ? (
        <div className="p-4 bg-[#B20600]/20 border border-[#B20600]/30 rounded-lg">
          <p className="text-sm text-[#B20600]">{error}</p>
        </div>
      ) : (
        <div className="relative h-60 bg-white/5 rounded-lg p-4">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 py-2">
            <div>{Math.ceil(maxValue)} Gwei</div>
            <div>{Math.ceil(maxValue / 2)} Gwei</div>
            <div>0 Gwei</div>
          </div>
          
          {/* Chart area */}
          <div className="absolute left-10 right-0 top-0 bottom-0">
            {/* Grid lines */}
            <div className="absolute left-0 right-0 top-0 h-px bg-white/10"></div>
            <div className="absolute left-0 right-0 top-1/2 h-px bg-white/10"></div>
            <div className="absolute left-0 right-0 bottom-0 h-px bg-white/10"></div>
            
            {/* Gas price line */}
            <svg
              className="absolute inset-0"
              viewBox={`0 0 ${gasHistory.length - 1} ${maxValue}`}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="gasPriceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF5F00" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#FF5F00" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Gas price area */}
              <path
                d={`
                  M0,${maxValue - gasHistory[0]?.gasPrice || 0}
                  ${gasHistory.map((point, i) => `L${i},${maxValue - point.gasPrice}`).join(' ')}
                  L${gasHistory.length - 1},${maxValue}
                  L0,${maxValue}
                  Z
                `}
                fill="url(#gasPriceGradient)"
                opacity="0.5"
              />
              
              {/* Gas price line */}
              <path
                d={`
                  M0,${maxValue - gasHistory[0]?.gasPrice || 0}
                  ${gasHistory.map((point, i) => `L${i},${maxValue - point.gasPrice}`).join(' ')}
                `}
                stroke="#FF5F00"
                strokeWidth="2"
                fill="none"
              />
              
              {/* Base fee line */}
              <path
                d={`
                  M0,${maxValue - gasHistory[0]?.baseFee || 0}
                  ${gasHistory.map((point, i) => `L${i},${maxValue - point.baseFee}`).join(' ')}
                `}
                stroke="#B20600"
                strokeWidth="2"
                fill="none"
                strokeDasharray="4 2"
              />
            </svg>
            
            {/* X-axis labels */}
            <div className="absolute left-0 right-0 bottom-0 flex justify-between text-xs text-gray-400 transform translate-y-6">
              {gasHistory.filter((_, i) => i % Math.ceil(gasHistory.length / 5) === 0).map((point, i) => (
                <div key={i} className="text-center">
                  {formatTimestamp(point.timestamp)}
                </div>
              ))}
            </div>
          </div>
          
          {/* Legend */}
          <div className="absolute right-4 top-2 flex items-center space-x-4 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-1 bg-[#FF5F00] mr-1"></div>
              <span className="text-gray-400">Gas Price</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-1 bg-[#B20600] mr-1 border-b border-dashed"></div>
              <span className="text-gray-400">Base Fee</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-400">
        <p>
          This chart shows historical gas prices and base fees over time. Gas prices tend to be higher during periods of network congestion.
        </p>
      </div>
    </div>
  );
};

export default GasHistoryChart;
