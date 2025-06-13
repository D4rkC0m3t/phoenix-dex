import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { TokenBalance } from '../services/tokenService';
import { getPrice } from '../services/priceService';

interface PortfolioChartProps {
  walletAddress: string;
  ethBalance: string;
  tokens: TokenBalance[];
  refreshTrigger?: number;
}

interface AssetAllocation {
  symbol: string;
  name: string;
  value: number;
  percentage: number;
  color: string;
}

const PortfolioChart: React.FC<PortfolioChartProps> = ({
  walletAddress,
  ethBalance,
  tokens,
  refreshTrigger = 0
}) => {
  const [assetAllocations, setAssetAllocations] = useState<AssetAllocation[]>([]);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'pie' | 'donut' | 'bar'>('donut');
  const [hoveredAsset, setHoveredAsset] = useState<string | null>(null);

  // Predefined colors for assets
  const assetColors = [
    '#FF5F00', // Orange (Primary)
    '#B20600', // Maroon (Secondary)
    '#42A6E3', // Blue
    '#9F2FFF', // Purple
    '#00FF88', // Green
    '#00C9FF', // Teal
    '#FF56F6', // Pink
    '#B936EE', // Violet
    '#FFB800', // Yellow
    '#FF3A5E', // Red
    '#00B8D9', // Cyan
    '#36B37E', // Emerald
    '#6554C0', // Indigo
    '#FF8B00', // Amber
    '#00875A'  // Forest
  ];

  // Fetch price data and calculate asset allocations
  useEffect(() => {
    const fetchAssetAllocations = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get ETH price
        const ethPriceData = await getPrice('ethereum');
        const ethPrice = ethPriceData.usd;
        
        // Calculate ETH value
        const ethBalanceNum = parseFloat(ethBalance);
        const ethValueUsd = ethBalanceNum * ethPrice;
        
        // Initialize allocations with ETH
        const allocations: AssetAllocation[] = [{
          symbol: 'ETH',
          name: 'Ethereum',
          value: ethValueUsd,
          percentage: 0, // Will be calculated after all assets are processed
          color: assetColors[0]
        }];
        
        // Process token balances
        let totalPortfolioValue = ethValueUsd;
        let colorIndex = 1;
        
        // Fetch price data for each token
        for (const token of tokens) {
          if (parseFloat(token.balance) > 0) {
            try {
              // Get token price (using a simple mapping for demo purposes)
              const tokenId = getTokenId(token.symbol.toLowerCase());
              if (tokenId) {
                const tokenPriceData = await getPrice(tokenId);
                const tokenPrice = tokenPriceData.usd || 0;
                
                // Calculate token value
                const tokenBalanceNum = parseFloat(token.balance);
                const tokenValueUsd = tokenBalanceNum * tokenPrice;
                
                // Add to total value
                totalPortfolioValue += tokenValueUsd;
                
                // Add to allocations
                allocations.push({
                  symbol: token.symbol,
                  name: token.name,
                  value: tokenValueUsd,
                  percentage: 0, // Will be calculated after all assets are processed
                  color: assetColors[colorIndex % assetColors.length]
                });
                
                colorIndex++;
              }
            } catch (err) {
              console.error(`Error fetching price for ${token.symbol}:`, err);
              // Continue with other tokens
            }
          }
        }
        
        // Calculate percentage allocations
        const allocationsWithPercentages = allocations.map(allocation => ({
          ...allocation,
          percentage: (allocation.value / totalPortfolioValue) * 100
        }));
        
        // Sort by value (highest first)
        allocationsWithPercentages.sort((a, b) => b.value - a.value);
        
        // Group small allocations into "Other" if there are many assets
        if (allocationsWithPercentages.length > 7) {
          const mainAllocations = allocationsWithPercentages.slice(0, 6);
          const otherAllocations = allocationsWithPercentages.slice(6);
          
          const otherValue = otherAllocations.reduce((sum, asset) => sum + asset.value, 0);
          const otherPercentage = otherAllocations.reduce((sum, asset) => sum + asset.percentage, 0);
          
          mainAllocations.push({
            symbol: 'OTHER',
            name: 'Other Assets',
            value: otherValue,
            percentage: otherPercentage,
            color: assetColors[7 % assetColors.length]
          });
          
          setAssetAllocations(mainAllocations);
        } else {
          setAssetAllocations(allocationsWithPercentages);
        }
        
        setTotalValue(totalPortfolioValue);
        setIsLoading(false);
      } catch (err: any) {
        console.error("Error fetching asset allocations:", err);
        setError("Failed to load asset allocations");
        setIsLoading(false);
      }
    };
    
    fetchAssetAllocations();
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
    return `${value.toFixed(2)}%`;
  };

  // Render pie/donut chart
  const renderPieChart = () => {
    const size = 200;
    const radius = size / 2;
    const innerRadius = chartType === 'donut' ? radius * 0.6 : 0;
    
    // Calculate segments
    let startAngle = 0;
    const segments = assetAllocations.map((asset, index) => {
      const angle = (asset.percentage / 100) * 360;
      const endAngle = startAngle + angle;
      
      // Calculate SVG arc path
      const startRad = (startAngle - 90) * (Math.PI / 180);
      const endRad = (endAngle - 90) * (Math.PI / 180);
      
      const x1 = radius + radius * Math.cos(startRad);
      const y1 = radius + radius * Math.sin(startRad);
      const x2 = radius + radius * Math.cos(endRad);
      const y2 = radius + radius * Math.sin(endRad);
      
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      // For donut chart, calculate inner points
      let path;
      
      if (chartType === 'donut') {
        const innerX1 = radius + innerRadius * Math.cos(startRad);
        const innerY1 = radius + innerRadius * Math.sin(startRad);
        const innerX2 = radius + innerRadius * Math.cos(endRad);
        const innerY2 = radius + innerRadius * Math.sin(endRad);
        
        path = `
          M ${x1} ${y1}
          A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
          L ${innerX2} ${innerY2}
          A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerX1} ${innerY1}
          Z
        `;
      } else {
        path = `
          M ${radius} ${radius}
          L ${x1} ${y1}
          A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
          Z
        `;
      }
      
      const segment = {
        path,
        color: asset.color,
        startAngle,
        endAngle,
        asset
      };
      
      startAngle = endAngle;
      return segment;
    });
    
    return (
      <div className="flex justify-center">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {segments.map((segment, index) => (
              <path
                key={index}
                d={segment.path}
                fill={segment.color}
                stroke="#000620"
                strokeWidth="1"
                opacity={hoveredAsset === segment.asset.symbol || hoveredAsset === null ? 1 : 0.5}
                onMouseEnter={() => setHoveredAsset(segment.asset.symbol)}
                onMouseLeave={() => setHoveredAsset(null)}
              />
            ))}
          </svg>
          
          {chartType === 'donut' && (
            <div 
              className="absolute inset-0 flex items-center justify-center text-center"
              style={{ 
                width: innerRadius * 2, 
                height: innerRadius * 2,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div>
                <div className="text-xs text-gray-400">Total</div>
                <div className="text-sm font-medium">{formatCurrency(totalValue)}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render bar chart
  const renderBarChart = () => {
    return (
      <div className="space-y-3">
        {assetAllocations.map((asset, index) => (
          <div 
            key={index}
            className="space-y-1"
            onMouseEnter={() => setHoveredAsset(asset.symbol)}
            onMouseLeave={() => setHoveredAsset(null)}
          >
            <div className="flex justify-between text-xs">
              <div className="font-medium">{asset.symbol}</div>
              <div className="text-gray-400">{formatPercentage(asset.percentage)}</div>
            </div>
            
            <div className="h-4 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full"
                style={{ 
                  width: `${asset.percentage}%`,
                  backgroundColor: asset.color,
                  opacity: hoveredAsset === asset.symbol || hoveredAsset === null ? 1 : 0.5
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-heading">Asset Allocation</h2>
        
        <div className="flex space-x-2">
          {(['pie', 'donut', 'bar'] as const).map((type) => (
            <motion.button
              key={type}
              className={`px-3 py-1 rounded-lg text-xs ${
                chartType === type 
                  ? 'bg-[#FF5F00] text-white' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
              onClick={() => setChartType(type)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
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
      ) : assetAllocations.length === 0 ? (
        <div className="p-4 bg-white/5 rounded-lg text-center">
          <p className="text-gray-400">No assets found in this wallet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Chart */}
          <div className="p-4 bg-white/5 rounded-lg">
            {chartType === 'bar' ? renderBarChart() : renderPieChart()}
          </div>
          
          {/* Legend */}
          <div className="grid grid-cols-2 gap-2">
            {assetAllocations.map((asset, index) => (
              <div 
                key={index}
                className="flex items-center p-2 rounded-lg hover:bg-white/5"
                onMouseEnter={() => setHoveredAsset(asset.symbol)}
                onMouseLeave={() => setHoveredAsset(null)}
              >
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: asset.color }}
                ></div>
                <div className="flex-1 text-sm truncate">{asset.name}</div>
                <div className="text-xs text-gray-400">{formatPercentage(asset.percentage)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioChart;
