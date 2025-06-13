import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getGasPriceData, getNetworkCongestion } from '../services/gasService';

interface GasTrackerProps {
  refreshInterval?: number; // in milliseconds
  showDetails?: boolean;
  className?: string;
}

const GasTracker: React.FC<GasTrackerProps> = ({
  refreshInterval = 30000, // 30 seconds
  showDetails = true,
  className = ''
}) => {
  const [baseFee, setBaseFee] = useState<string>('0');
  const [congestion, setCongestion] = useState<'low' | 'medium' | 'high'>('medium');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Fetch gas data
  const fetchGasData = async () => {
    try {
      // Get gas price data
      const gasPriceData = await getGasPriceData();
      const baseFeeGwei = ethers.utils.formatUnits(gasPriceData.baseFeePerGas, "gwei");
      setBaseFee(parseFloat(baseFeeGwei).toFixed(2));
      
      // Get network congestion
      const networkCongestion = await getNetworkCongestion();
      setCongestion(networkCongestion);
      
      // Update last updated time
      setLastUpdated(new Date());
      
      setError(null);
    } catch (err: any) {
      console.error("Error fetching gas data:", err);
      setError("Failed to fetch gas data");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch gas data on mount and at regular intervals
  useEffect(() => {
    fetchGasData();
    
    // Set up interval for refreshing gas data
    const interval = setInterval(fetchGasData, refreshInterval);
    
    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [refreshInterval]);

  // Get congestion color
  const getCongestionColor = () => {
    switch (congestion) {
      case 'low':
        return '#00FF88'; // Green
      case 'medium':
        return '#FF5F00'; // Orange
      case 'high':
        return '#B20600'; // Red
      default:
        return '#FF5F00'; // Orange
    }
  };

  // Get congestion label
  const getCongestionLabel = () => {
    switch (congestion) {
      case 'low':
        return 'Low';
      case 'medium':
        return 'Medium';
      case 'high':
        return 'High';
      default:
        return 'Medium';
    }
  };

  // Format last updated time
  const formatLastUpdated = () => {
    return lastUpdated.toLocaleTimeString();
  };

  return (
    <motion.div
      className={`rounded-lg p-3 ${className}`}
      style={{ backgroundColor: `${getCongestionColor()}20` }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-10">
          <motion.div
            className="w-4 h-4 border-2 border-[#FF5F00] border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      ) : error ? (
        <div className="text-center text-sm text-[#B20600]">
          {error}
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: getCongestionColor() }}
              />
              <div className="text-sm font-medium">
                Gas: {baseFee} Gwei
              </div>
            </div>
            <div 
              className="text-xs"
              style={{ color: getCongestionColor() }}
            >
              {getCongestionLabel()} Congestion
            </div>
          </div>
          
          {showDetails && (
            <div className="mt-2 text-xs text-gray-400 flex justify-between">
              <div>Network: Ethereum</div>
              <div>Updated: {formatLastUpdated()}</div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default GasTracker;
