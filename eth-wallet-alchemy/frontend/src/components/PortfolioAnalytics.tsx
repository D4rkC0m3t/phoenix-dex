import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { TokenBalance } from '../services/tokenService';
import { getPrice } from '../services/priceService';

interface PortfolioAnalyticsProps {
  walletAddress: string;
  ethBalance: string;
  tokens: TokenBalance[];
  refreshTrigger?: number;
}

interface PortfolioAsset {
  symbol: string;
  name: string;
  balance: string;
  balanceUsd: number;
  price: number;
  priceChange24h: number;
  allocation: number;
  icon?: string;
}

const PortfolioAnalytics: React.FC<PortfolioAnalyticsProps> = ({
  walletAddress,
  ethBalance,
  tokens,
  refreshTrigger = 0
}) => {
  const [assets, setAssets] = useState<PortfolioAsset[]>([]);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'all'>('7d');
  const [portfolioChange, setPortfolioChange] = useState<{
    value: number;
    percentage: number;
  }>({ value: 0, percentage: 0 });

  // Fetch price data and calculate portfolio value
  useEffect(() => {
    const fetchPriceData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get ETH price
        const ethPriceData = await getPrice('ethereum');
        const ethPrice = ethPriceData.usd;
        const ethPriceChange = ethPriceData.usd_24h_change || 0;
        
        // Calculate ETH value
        const ethBalanceNum = parseFloat(ethBalance);
        const ethValueUsd = ethBalanceNum * ethPrice;
        
        // Initialize portfolio assets with ETH
        const portfolioAssets: PortfolioAsset[] = [{
          symbol: 'ETH',
          name: 'Ethereum',
          balance: ethBalance,
          balanceUsd: ethValueUsd,
          price: ethPrice,
          priceChange24h: ethPriceChange,
          allocation: 0, // Will be calculated after all assets are processed
          icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
        }];
        
        // Process token balances
        let totalPortfolioValue = ethValueUsd;
        
        // Fetch price data for each token
        for (const token of tokens) {
          if (parseFloat(token.balance) > 0) {
            try {
              // Get token price (using a simple mapping for demo purposes)
              // In a real app, you would use a price API with the token's contract address
              const tokenId = getTokenId(token.symbol.toLowerCase());
              if (tokenId) {
                const tokenPriceData = await getPrice(tokenId);
                const tokenPrice = tokenPriceData.usd || 0;
                const tokenPriceChange = tokenPriceData.usd_24h_change || 0;
                
                // Calculate token value
                const tokenBalanceNum = parseFloat(token.balance);
                const tokenValueUsd = tokenBalanceNum * tokenPrice;
                
                // Add to total value
                totalPortfolioValue += tokenValueUsd;
                
                // Add to portfolio assets
                portfolioAssets.push({
                  symbol: token.symbol,
                  name: token.name,
                  balance: token.balance,
                  balanceUsd: tokenValueUsd,
                  price: tokenPrice,
                  priceChange24h: tokenPriceChange,
                  allocation: 0, // Will be calculated after all assets are processed
                  icon: `https://cryptologos.cc/logos/${tokenId}-${token.symbol.toLowerCase()}-logo.png`
                });
              }
            } catch (err) {
              console.error(`Error fetching price for ${token.symbol}:`, err);
              // Continue with other tokens
            }
          }
        }
        
        // Calculate allocation percentages
        const assetsWithAllocation = portfolioAssets.map(asset => ({
          ...asset,
          allocation: (asset.balanceUsd / totalPortfolioValue) * 100
        }));
        
        // Sort by value (highest first)
        assetsWithAllocation.sort((a, b) => b.balanceUsd - a.balanceUsd);
        
        setAssets(assetsWithAllocation);
        setTotalValue(totalPortfolioValue);
        
        // Calculate portfolio change (simplified for demo)
        // In a real app, you would track historical values
        const weightedChange = assetsWithAllocation.reduce(
          (acc, asset) => acc + (asset.priceChange24h * asset.allocation / 100),
          0
        );
        
        setPortfolioChange({
          value: totalPortfolioValue * (weightedChange / 100),
          percentage: weightedChange
        });
        
        setIsLoading(false);
      } catch (err: any) {
        console.error("Error fetching portfolio data:", err);
        setError("Failed to load portfolio data");
        setIsLoading(false);
      }
    };
    
    fetchPriceData();
  }, [walletAddress, ethBalance, tokens, refreshTrigger]);

  // Helper function to map token symbols to CoinGecko IDs
  const getTokenId = (symbol: string): string | null => {
    const tokenMap: Record<string, string> = {
      'eth': 'ethereum',
      'weth': 'weth',
      'usdt': 'tether',
      'usdc': 'usd-coin',
      'dai': 'dai',
      'link': 'chainlink',
      'uni': 'uniswap',
      'aave': 'aave',
      'comp': 'compound-governance-token',
      'snx': 'synthetix-network-token',
      'mkr': 'maker',
      'yfi': 'yearn-finance',
      'crv': 'curve-dao-token',
      'bal': 'balancer',
      'sushi': 'sushi'
    };
    
    return tokenMap[symbol] || null;
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
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div className="w-full">
      <h2 className="text-heading mb-4">Portfolio Analytics</h2>
      
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
        <div className="space-y-6">
          {/* Portfolio Summary */}
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-400">Total Value</div>
              <div className="flex space-x-2">
                {(['24h', '7d', '30d', 'all'] as const).map((range) => (
                  <button
                    key={range}
                    className={`px-2 py-1 rounded text-xs ${
                      timeRange === range 
                        ? 'bg-[#FF5F00] text-white' 
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                    onClick={() => setTimeRange(range)}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="text-2xl font-medium mb-1">{formatCurrency(totalValue)}</div>
            
            <div className={`text-sm ${portfolioChange.percentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatPercentage(portfolioChange.percentage)}
              <span className="text-gray-400 ml-2">
                ({formatCurrency(portfolioChange.value)})
              </span>
            </div>
          </div>
          
          {/* Asset Allocation */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm text-gray-400">Asset Allocation</h3>
              <div className="text-xs text-gray-400">
                {assets.length} assets
              </div>
            </div>
            
            <div className="space-y-3">
              {assets.map((asset, index) => (
                <div 
                  key={index}
                  className="p-3 bg-white/5 rounded-lg flex items-center"
                >
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-3 overflow-hidden">
                    {asset.icon ? (
                      <img src={asset.icon} alt={asset.symbol} className="w-6 h-6" />
                    ) : (
                      <div className="text-xs font-bold">{asset.symbol.substring(0, 2)}</div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div className="font-medium">{asset.name}</div>
                      <div className="font-medium">{formatCurrency(asset.balanceUsd)}</div>
                    </div>
                    
                    <div className="flex justify-between text-xs">
                      <div className="text-gray-400">
                        {parseFloat(asset.balance).toFixed(4)} {asset.symbol}
                      </div>
                      <div className={`${asset.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {formatPercentage(asset.priceChange24h)}
                      </div>
                    </div>
                    
                    {/* Allocation bar */}
                    <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#FF5F00]"
                        style={{ width: `${asset.allocation}%` }}
                      ></div>
                    </div>
                    
                    <div className="text-xs text-gray-400 mt-1">
                      {asset.allocation.toFixed(2)}% of portfolio
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Portfolio Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Assets</div>
              <div className="text-lg font-medium">{assets.length}</div>
            </div>
            
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Top Asset</div>
              <div className="text-lg font-medium">
                {assets.length > 0 ? assets[0].symbol : '-'}
              </div>
            </div>
            
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Best Performer</div>
              <div className="text-lg font-medium">
                {assets.length > 0 ? 
                  assets.reduce((best, asset) => 
                    asset.priceChange24h > best.priceChange24h ? asset : best
                  ).symbol : '-'
                }
              </div>
            </div>
            
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Worst Performer</div>
              <div className="text-lg font-medium">
                {assets.length > 0 ? 
                  assets.reduce((worst, asset) => 
                    asset.priceChange24h < worst.priceChange24h ? asset : worst
                  ).symbol : '-'
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioAnalytics;
