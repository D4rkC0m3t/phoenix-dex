import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PortfolioSummary from './PortfolioSummary';
import PortfolioBreakdown from './PortfolioBreakdown';
import PriceChart from './PriceChart';
import PortfolioAnalytics from './PortfolioAnalytics';
import PortfolioChart from './PortfolioChart';
import PerformanceMetrics from './PerformanceMetrics';
import PriceAlerts from './PriceAlerts';
import { getPrice } from '../services/priceService';
import { getWalletBalance } from '../services/wallet';
import { getTokenBalances, SEPOLIA_TOKENS } from '../services/tokenService';

interface Asset {
  symbol: string;
  name: string;
  balance: string;
  value: number;
  percentage: number;
  color: string;
}

interface PortfolioPageProps {
  walletAddress?: string;
}

const PortfolioPage: React.FC<PortfolioPageProps> = ({
  walletAddress = '0x3df3B0E2931A4e2E5F12026011C360b1B7Cc82Ec' // Default address if none provided
}) => {
  const [ethBalance, setEthBalance] = useState<string>('0');
  const [tokens, setTokens] = useState<any[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<number>(30); // Days
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'performance' | 'alerts'>('overview');
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Fetch wallet data
  useEffect(() => {
    const fetchWalletData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch ETH balance
        const balance = await getWalletBalance(walletAddress);
        setEthBalance(balance);

        // Fetch token balances
        const tokenBalances = await getTokenBalances(walletAddress);
        setTokens(tokenBalances);
      } catch (err: any) {
        console.error("Error fetching wallet data:", err);
        setError("Failed to fetch wallet data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWalletData();
  }, [walletAddress]);

  // Calculate asset values and percentages
  useEffect(() => {
    const calculateAssetValues = async () => {
      try {
        const assetsData: Asset[] = [];
        let totalValue = 0;

        // Add ETH
        const ethPrice = await getPrice('ethereum');
        const ethValue = parseFloat(ethBalance) * ethPrice.usd;
        totalValue += ethValue;

        assetsData.push({
          symbol: 'ETH',
          name: 'Ethereum',
          balance: ethBalance,
          value: ethValue,
          percentage: 0, // Will calculate after getting total
          color: '#FF5F00' // Will be set in PortfolioBreakdown
        });

        // Add tokens
        for (const token of tokens) {
          if (parseFloat(token.balance) > 0) {
            try {
              const tokenPrice = await getPrice(token.symbol);
              const tokenValue = parseFloat(token.balance) * tokenPrice.usd;
              totalValue += tokenValue;

              assetsData.push({
                symbol: token.symbol,
                name: token.name,
                balance: token.balance,
                value: tokenValue,
                percentage: 0, // Will calculate after getting total
                color: '#B20600' // Will be set in PortfolioBreakdown
              });
            } catch (error) {
              console.error(`Error calculating value for ${token.symbol}:`, error);
            }
          }
        }

        // Calculate percentages
        assetsData.forEach(asset => {
          asset.percentage = totalValue > 0 ? (asset.value / totalValue) * 100 : 0;
        });

        setAssets(assetsData);
      } catch (err: any) {
        console.error("Error calculating asset values:", err);
      }
    };

    if (ethBalance !== '0' || tokens.length > 0) {
      calculateAssetValues();
    }
  }, [ethBalance, tokens]);

  // Timeframe options
  const timeframes = [
    { days: 7, label: '1W' },
    { days: 30, label: '1M' },
    { days: 90, label: '3M' },
    { days: 365, label: '1Y' }
  ];

  // Handle refresh
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="w-full max-w-full">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-display">Portfolio</h1>

        <motion.button
          className="py-1 sm:py-2 px-2 sm:px-4 rounded-lg bg-white/10 text-white flex items-center text-xs sm:text-sm"
          onClick={handleRefresh}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 sm:space-x-2 mb-4 sm:mb-6 overflow-x-auto pb-1">
        <motion.button
          className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm flex items-center whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-white/10 text-white font-medium'
              : 'text-gray-400 hover:bg-white/5'
          }`}
          onClick={() => setActiveTab('overview')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="mr-2">📊</span>
          <span>Overview</span>
        </motion.button>

        <motion.button
          className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm flex items-center whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-white/10 text-white font-medium'
              : 'text-gray-400 hover:bg-white/5'
          }`}
          onClick={() => setActiveTab('analytics')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="mr-2">📈</span>
          <span>Analytics</span>
        </motion.button>

        <motion.button
          className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm flex items-center whitespace-nowrap ${
            activeTab === 'performance'
              ? 'bg-white/10 text-white font-medium'
              : 'text-gray-400 hover:bg-white/5'
          }`}
          onClick={() => setActiveTab('performance')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="mr-2">🔍</span>
          <span>Performance</span>
        </motion.button>

        <motion.button
          className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm flex items-center whitespace-nowrap ${
            activeTab === 'alerts'
              ? 'bg-white/10 text-white font-medium'
              : 'text-gray-400 hover:bg-white/5'
          }`}
          onClick={() => setActiveTab('alerts')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="mr-2">🔔</span>
          <span>Alerts</span>
        </motion.button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-60">
          <motion.div
            className="w-10 h-10 border-4 border-[#FF5F00] border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      ) : error ? (
        <div className="glass-card p-6 text-center">
          <p className="text-[#B20600] mb-4">{error}</p>
          <button
            className="py-2 px-4 bg-[#FF5F00] text-white rounded-lg"
            onClick={handleRefresh}
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Portfolio Summary */}
              <PortfolioSummary
                ethBalance={ethBalance}
                tokens={tokens}
              />

              {/* Price Chart Section */}
              <motion.div
                className="glass-card p-3 sm:p-4 md:p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div className="flex justify-between items-center mb-2 sm:mb-4">
                  <h2 className="text-heading text-sm sm:text-base">Price Chart</h2>

                  {/* Timeframe Selector */}
                  <div className="flex space-x-1 sm:space-x-2">
                    {timeframes.map(timeframe => (
                      <button
                        key={timeframe.days}
                        className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full ${
                          selectedTimeframe === timeframe.days
                            ? 'bg-[#FF5F00] text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                        onClick={() => setSelectedTimeframe(timeframe.days)}
                      >
                        {timeframe.label}
                      </button>
                    ))}
                  </div>
                </div>

                <PriceChart
                  symbol="ethereum"
                  days={selectedTimeframe}
                  height={200}
                />
              </motion.div>

              {/* Portfolio Breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <PortfolioBreakdown assets={assets} />
              </motion.div>
            </>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <motion.div
                className="glass-card p-3 sm:p-4 md:p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <PortfolioAnalytics
                  walletAddress={walletAddress}
                  ethBalance={ethBalance}
                  tokens={tokens}
                  refreshTrigger={refreshTrigger}
                />
              </motion.div>

              <motion.div
                className="glass-card p-3 sm:p-4 md:p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <PortfolioChart
                  walletAddress={walletAddress}
                  ethBalance={ethBalance}
                  tokens={tokens}
                  refreshTrigger={refreshTrigger}
                />
              </motion.div>
            </div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <motion.div
              className="glass-card p-3 sm:p-4 md:p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <PerformanceMetrics
                walletAddress={walletAddress}
                refreshTrigger={refreshTrigger}
              />
            </motion.div>
          )}

          {/* Alerts Tab */}
          {activeTab === 'alerts' && (
            <motion.div
              className="glass-card p-3 sm:p-4 md:p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <PriceAlerts />
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;
