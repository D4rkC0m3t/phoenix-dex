import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Asset {
  symbol: string;
  name: string;
  balance: string;
  value: number;
  percentage: number;
  color: string;
}

interface PortfolioBreakdownProps {
  assets: Asset[];
}

const PortfolioBreakdown: React.FC<PortfolioBreakdownProps> = ({
  assets
}) => {
  const [sortedAssets, setSortedAssets] = useState<Asset[]>([]);
  
  // Sort assets by value (descending)
  useEffect(() => {
    const sorted = [...assets].sort((a, b) => b.value - a.value);
    
    // Calculate percentages
    const totalValue = sorted.reduce((sum, asset) => sum + asset.value, 0);
    
    const assetsWithPercentages = sorted.map((asset, index) => {
      // Assign colors based on index
      const colors = [
        '#FF5F00', // Orange
        '#B20600', // Maroon
        '#00092C', // Dark Blue
        '#EEEEEE', // Light Grey
        '#FF7F33', // Light Orange
        '#D10700', // Light Maroon
        '#000C45', // Light Dark Blue
        '#DDDDDD', // Dark Grey
      ];
      
      return {
        ...asset,
        percentage: totalValue > 0 ? (asset.value / totalValue) * 100 : 0,
        color: colors[index % colors.length]
      };
    });
    
    setSortedAssets(assetsWithPercentages);
  }, [assets]);

  // Format currency for display
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Generate SVG for pie chart
  const generatePieChart = () => {
    const size = 200;
    const radius = size / 2;
    const center = size / 2;
    
    let currentAngle = 0;
    const paths = [];
    
    for (const asset of sortedAssets) {
      if (asset.percentage <= 0) continue;
      
      const angle = (asset.percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      
      // Convert angles to radians
      const startRad = (startAngle - 90) * (Math.PI / 180);
      const endRad = (endAngle - 90) * (Math.PI / 180);
      
      // Calculate points
      const x1 = center + radius * Math.cos(startRad);
      const y1 = center + radius * Math.sin(startRad);
      const x2 = center + radius * Math.cos(endRad);
      const y2 = center + radius * Math.sin(endRad);
      
      // Create SVG arc
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      const pathData = [
        `M ${center},${center}`,
        `L ${x1},${y1}`,
        `A ${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2}`,
        'Z'
      ].join(' ');
      
      paths.push(
        <motion.path
          key={asset.symbol}
          d={pathData}
          fill={asset.color}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: startAngle / 360 }}
        />
      );
      
      currentAngle = endAngle;
    }
    
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {paths}
        {/* Center circle for donut chart effect */}
        <circle cx={center} cy={center} r={radius * 0.6} fill="#00092C" />
      </svg>
    );
  };

  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-heading mb-4">Portfolio Breakdown</h2>
      
      {sortedAssets.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No assets found</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-center">
          {/* Pie Chart */}
          <div className="mb-6 md:mb-0 md:mr-6 flex-shrink-0">
            {generatePieChart()}
          </div>
          
          {/* Legend */}
          <div className="w-full">
            <div className="space-y-3">
              {sortedAssets.map((asset) => (
                <div 
                  key={asset.symbol}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: asset.color }}
                    />
                    <div>
                      <div className="font-medium text-white">{asset.symbol}</div>
                      <div className="text-xs text-gray-400">{asset.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(asset.value)}</div>
                    <div className="text-xs text-gray-400">{asset.percentage.toFixed(1)}%</div>
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

export default PortfolioBreakdown;
