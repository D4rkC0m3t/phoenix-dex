import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTransactionHistory } from '../services/walletService';
import { getPrice } from '../services/priceService';

interface PerformanceMetricsProps {
  walletAddress: string;
  refreshTrigger?: number;
}

interface PerformanceData {
  totalValue: number;
  totalCost: number;
  profitLoss: number;
  roi: number;
  averageCost: number;
  holdingPeriod: number;
  volatility: number;
  sharpeRatio: number;
}

interface HistoricalValue {
  timestamp: number;
  value: number;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  walletAddress,
  refreshTrigger = 0
}) => {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [historicalValues, setHistoricalValues] = useState<HistoricalValue[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'1m' | '3m' | '6m' | '1y' | 'all'>('3m');

  // Fetch performance data
  useEffect(() => {
    const fetchPerformanceData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get transaction history
        const transactions = await getTransactionHistory(walletAddress);
        
        // Get current ETH price
        const ethPriceData = await getPrice('ethereum');
        const currentEthPrice = ethPriceData.usd;
        
        // Calculate performance metrics (simplified for demo)
        // In a real app, you would use more sophisticated calculations
        
        // Mock total value (current)
        const totalValue = 5000 + Math.random() * 2000;
        
        // Mock total cost (based on transactions)
        const totalCost = 4000 + Math.random() * 1000;
        
        // Calculate profit/loss
        const profitLoss = totalValue - totalCost;
        
        // Calculate ROI
        const roi = (profitLoss / totalCost) * 100;
        
        // Mock average cost
        const averageCost = totalCost / (transactions.length || 1);
        
        // Mock holding period (days)
        const holdingPeriod = 90 + Math.floor(Math.random() * 180);
        
        // Mock volatility (%)
        const volatility = 5 + Math.random() * 15;
        
        // Mock Sharpe ratio
        const sharpeRatio = (roi - 1.5) / volatility;
        
        // Set performance data
        setPerformanceData({
          totalValue,
          totalCost,
          profitLoss,
          roi,
          averageCost,
          holdingPeriod,
          volatility,
          sharpeRatio
        });
        
        // Generate historical values
        generateHistoricalValues(timeRange, totalValue, volatility);
        
        setIsLoading(false);
      } catch (err: any) {
        console.error("Error fetching performance data:", err);
        setError("Failed to load performance data");
        setIsLoading(false);
      }
    };
    
    fetchPerformanceData();
  }, [walletAddress, refreshTrigger, timeRange]);

  // Generate mock historical values
  const generateHistoricalValues = (
    range: '1m' | '3m' | '6m' | '1y' | 'all',
    currentValue: number,
    volatility: number
  ) => {
    const now = Date.now();
    const values: HistoricalValue[] = [];
    
    // Determine number of data points and interval based on time range
    let days = 30;
    let interval = 24 * 60 * 60 * 1000; // 1 day in milliseconds
    
    switch (range) {
      case '1m':
        days = 30;
        interval = 24 * 60 * 60 * 1000; // 1 day
        break;
      case '3m':
        days = 90;
        interval = 3 * 24 * 60 * 60 * 1000; // 3 days
        break;
      case '6m':
        days = 180;
        interval = 6 * 24 * 60 * 60 * 1000; // 6 days
        break;
      case '1y':
        days = 365;
        interval = 12 * 24 * 60 * 60 * 1000; // 12 days
        break;
      case 'all':
        days = 730; // 2 years
        interval = 24 * 24 * 60 * 60 * 1000; // 24 days
        break;
    }
    
    // Start with current value and work backwards
    let value = currentValue;
    
    // Add current value
    values.push({
      timestamp: now,
      value
    });
    
    // Generate historical values with some randomness
    for (let i = 1; i <= days; i++) {
      // Random daily change based on volatility
      const dailyChange = (Math.random() - 0.5) * 2 * (volatility / 100) * value;
      
      // Apply trend (slight upward bias)
      const trend = value * 0.0005;
      
      // Update value
      value = value - dailyChange - trend;
      
      // Ensure value doesn't go negative
      value = Math.max(value, 100);
      
      // Add to values
      values.push({
        timestamp: now - (i * interval),
        value
      });
    }
    
    // Reverse to get chronological order
    setHistoricalValues(values.reverse());
  };

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Format percentage
  const formatPercentage = (value: number): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  // Format number
  const formatNumber = (value: number, decimals: number = 2): string => {
    return value.toFixed(decimals);
  };

  // Render performance chart
  const renderPerformanceChart = () => {
    if (historicalValues.length === 0) return null;
    
    const chartHeight = 120;
    const chartWidth = 100; // percentage
    
    // Find min and max values for scaling
    const values = historicalValues.map(point => point.value);
    const minValue = Math.min(...values) * 0.95;
    const maxValue = Math.max(...values) * 1.05;
    const valueRange = maxValue - minValue;
    
    // Scale value to chart height
    const scaleY = (value: number): number => {
      return chartHeight - ((value - minValue) / valueRange) * chartHeight;
    };
    
    // Generate path for the chart line
    const points = historicalValues.map((point, index) => {
      const x = (index / (historicalValues.length - 1)) * 100;
      const y = scaleY(point.value);
      return `${x},${y}`;
    });
    
    const linePath = `M${points.join(' L')}`;
    
    // Generate path for the area under the line
    const areaPath = `${linePath} L100,${chartHeight} L0,${chartHeight} Z`;
    
    // Determine if the trend is positive
    const isPositive = historicalValues[0].value <= historicalValues[historicalValues.length - 1].value;
    
    // Format date for tooltip
    const formatDate = (timestamp: number): string => {
      return new Date(timestamp).toLocaleDateString();
    };
    
    return (
      <div className="relative h-32 mt-4">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 py-1">
          <div>{formatCurrency(maxValue)}</div>
          <div>{formatCurrency(minValue)}</div>
        </div>
        
        {/* Chart */}
        <div className="absolute left-12 right-0 top-0 h-full">
          <svg
            width="100%"
            height={chartHeight}
            viewBox={`0 0 100 ${chartHeight}`}
            preserveAspectRatio="none"
          >
            {/* Area under the line */}
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isPositive ? "#FF5F00" : "#B20600"} stopOpacity="0.3" />
                <stop offset="100%" stopColor={isPositive ? "#FF5F00" : "#B20600"} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={areaPath}
              fill="url(#areaGradient)"
            />
            
            {/* Line */}
            <path
              d={linePath}
              stroke={isPositive ? "#FF5F00" : "#B20600"}
              strokeWidth="2"
              fill="none"
            />
            
            {/* Current value dot */}
            <circle
              cx="100"
              cy={scaleY(historicalValues[historicalValues.length - 1].value)}
              r="3"
              fill={isPositive ? "#FF5F00" : "#B20600"}
            />
          </svg>
          
          {/* X-axis labels */}
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <div>{formatDate(historicalValues[0].timestamp)}</div>
            <div>{formatDate(historicalValues[historicalValues.length - 1].timestamp)}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-heading">Performance Metrics</h2>
        
        <div className="flex space-x-2">
          {(['1m', '3m', '6m', '1y', 'all'] as const).map((range) => (
            <motion.button
              key={range}
              className={`px-2 py-1 rounded text-xs ${
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
      ) : performanceData ? (
        <div className="space-y-6">
          {/* Performance Summary */}
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-400">Portfolio Performance</div>
              <div className={`text-sm ${performanceData.roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatPercentage(performanceData.roi)}
              </div>
            </div>
            
            {renderPerformanceChart()}
          </div>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Total Value</div>
              <div className="text-lg font-medium">{formatCurrency(performanceData.totalValue)}</div>
            </div>
            
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Total Cost</div>
              <div className="text-lg font-medium">{formatCurrency(performanceData.totalCost)}</div>
            </div>
            
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Profit/Loss</div>
              <div className={`text-lg font-medium ${performanceData.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatCurrency(performanceData.profitLoss)}
              </div>
            </div>
            
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">ROI</div>
              <div className={`text-lg font-medium ${performanceData.roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatPercentage(performanceData.roi)}
              </div>
            </div>
            
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Holding Period</div>
              <div className="text-lg font-medium">{performanceData.holdingPeriod} days</div>
            </div>
            
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Volatility</div>
              <div className="text-lg font-medium">{formatPercentage(performanceData.volatility)}</div>
            </div>
          </div>
          
          {/* Risk Metrics */}
          <div className="p-4 bg-white/5 rounded-lg">
            <h3 className="text-sm font-medium mb-3">Risk Metrics</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-gray-400 mb-1">Sharpe Ratio</div>
                <div className="text-lg font-medium">{formatNumber(performanceData.sharpeRatio)}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {performanceData.sharpeRatio > 1 ? 'Good risk-adjusted return' : 'Poor risk-adjusted return'}
                </div>
              </div>
              
              <div>
                <div className="text-xs text-gray-400 mb-1">Max Drawdown</div>
                <div className="text-lg font-medium">-{formatPercentage(performanceData.volatility * 1.5)}</div>
                <div className="text-xs text-gray-400 mt-1">
                  Maximum observed loss from peak to trough
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PerformanceMetrics;
