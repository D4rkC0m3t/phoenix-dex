import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getPrice } from '../services/priceService';
import PriceChart from './PriceChart';

interface Asset {
  symbol: string;
  name: string;
  balance: string;
  price?: number;
  value?: number;
  change24h?: number;
}

interface PortfolioSummaryProps {
  ethBalance: string;
  tokens: Array<{
    symbol: string;
    name: string;
    balance: string;
  }>;
}

const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({
  ethBalance,
  tokens
}) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [totalChange, setTotalChange] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch price data and calculate portfolio value
  useEffect(() => {
    const fetchPriceData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Create initial assets array with ETH
        const initialAssets: Asset[] = [
          {
            symbol: 'ETH',
            name: 'Ethereum',
            balance: ethBalance
          }
        ];
        
        // Add tokens
        tokens.forEach(token => {
          initialAssets.push({
            symbol: token.symbol,
            name: token.name,
            balance: token.balance
          });
        });
        
        // Fetch price data for each asset
        const assetsWithPrices = await Promise.all(
          initialAssets.map(async (asset) => {
            try {
              const priceData = await getPrice(asset.symbol);
              const balance = parseFloat(asset.balance);
              const price = priceData.usd;
              const value = balance * price;
              
              return {
                ...asset,
                price,
                value,
                change24h: priceData.usd_24h_change
              };
            } catch (err) {
              console.error(`Error fetching price for ${asset.symbol}:`, err);
              return {
                ...asset,
                price: 0,
                value: 0,
                change24h: 0
              };
            }
          })
        );
        
        // Calculate total portfolio value and change
        let portfolioValue = 0;
        let weightedChange = 0;
        
        assetsWithPrices.forEach(asset => {
          if (asset.value) {
            portfolioValue += asset.value;
            if (asset.change24h) {
              weightedChange += (asset.value / portfolioValue) * asset.change24h;
            }
          }
        });
        
        setAssets(assetsWithPrices);
        setTotalValue(portfolioValue);
        setTotalChange(weightedChange);
      } catch (err: any) {
        console.error("Error calculating portfolio value:", err);
        setError("Failed to calculate portfolio value");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPriceData();
  }, [ethBalance, tokens]);

  // Format currency for display
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-heading mb-4">Portfolio Summary</h2>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <motion.div
            className="w-8 h-8 border-4 border-[#FF5F00] border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      ) : error ? (
        <div className="bg-[#B20600]/20 border border-[#B20600]/30 rounded-lg p-4 text-center">
          <p className="text-[#B20600]">{error}</p>
          <button 
            className="mt-2 text-sm text-white bg-[#B20600] px-3 py-1 rounded-lg"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      ) : (
        <div>
          {/* Total Value */}
          <div className="mb-6">
            <div className="text-sm text-gray-400 mb-1">Total Value</div>
            <div className="flex items-end">
              <div className="text-3xl font-semibold">{formatCurrency(totalValue)}</div>
              <div className={`ml-2 text-sm font-medium ${
                totalChange >= 0 ? 'text-[#FF5F00]' : 'text-[#B20600]'
              }`}>
                {totalChange >= 0 ? '+' : ''}{totalChange.toFixed(2)}%
              </div>
            </div>
          </div>
          
          {/* Portfolio Chart */}
          <div className="mb-6">
            <PriceChart symbol="ethereum" height={120} />
          </div>
          
          {/* Asset Breakdown */}
          <div>
            <div className="text-sm text-gray-400 mb-2">Assets</div>
            <div className="space-y-3">
              {assets.map((asset) => (
                <div 
                  key={asset.symbol}
                  className="flex justify-between items-center p-3 bg-white/5 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF5F00] to-[#B20600] flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-xs">
                        {asset.symbol.substring(0, 2)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-white">{asset.symbol}</div>
                      <div className="text-xs text-gray-400">{asset.balance} {asset.symbol}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {asset.value ? formatCurrency(asset.value) : '$0.00'}
                    </div>
                    {asset.change24h !== undefined && (
                      <div className={`text-xs ${
                        asset.change24h >= 0 ? 'text-[#FF5F00]' : 'text-[#B20600]'
                      }`}>
                        {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PortfolioSummary;
