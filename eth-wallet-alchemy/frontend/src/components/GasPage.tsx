import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import GasTracker from './GasTracker';
import GasFeeEstimator from './GasFeeEstimator';
import TransactionCostCalculator from './TransactionCostCalculator';
import GasHistoryChart from './GasHistoryChart';
import { getGasPriceData, formatGasFee } from '../services/gasService';
import { getPrice } from '../services/priceService';

const GasPage: React.FC = () => {
  const [baseFee, setBaseFee] = useState<string>('0');
  const [gasPrice, setGasPrice] = useState<string>('0');
  const [ethPrice, setEthPrice] = useState<number>(2500);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'calculator' | 'history'>('overview');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Sample transaction parameters for gas estimation
  const sampleTxParams = {
    to: '0x3df3B0E2931A4e2E5F12026011C360b1B7Cc82Ec',
    value: '0.01'
  };

  // Fetch gas data
  useEffect(() => {
    const fetchGasData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Get gas price data
        const gasPriceData = await getGasPriceData();
        const baseFeeGwei = ethers.utils.formatUnits(gasPriceData.baseFeePerGas, "gwei");
        const gasPriceGwei = ethers.utils.formatUnits(gasPriceData.gasPrice, "gwei");

        setBaseFee(parseFloat(baseFeeGwei).toFixed(2));
        setGasPrice(parseFloat(gasPriceGwei).toFixed(2));

        // Get ETH price
        const priceData = await getPrice('ethereum');
        setEthPrice(priceData.usd);

        // Update last updated timestamp
        setLastUpdated(new Date());
      } catch (err: any) {
        console.error("Error fetching gas data:", err);
        setError("Failed to fetch gas data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGasData();
  }, [refreshTrigger]);

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true);
    setRefreshTrigger(prev => prev + 1);

    // Add a small delay to show the refresh animation
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // Calculate gas cost for different transaction types
  const calculateGasCost = (gasLimit: number, gasPriceGwei: number): { eth: string; usd: string } => {
    const gasPriceWei = ethers.utils.parseUnits(gasPriceGwei.toString(), "gwei");
    const gasCostWei = gasPriceWei.mul(gasLimit);

    return formatGasFee(gasCostWei, ethPrice);
  };

  // Transaction types with their gas limits
  const transactionTypes = [
    { name: 'ETH Transfer', gasLimit: 21000 },
    { name: 'ERC-20 Transfer', gasLimit: 65000 },
    { name: 'Swap on DEX', gasLimit: 150000 },
    { name: 'NFT Minting', gasLimit: 200000 },
    { name: 'Contract Deployment', gasLimit: 1000000 }
  ];

  return (
    <div className="w-full max-w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-display">Gas Tracker</h1>

        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">
            <span>Base Fee: </span>
            <span className="text-white font-medium">{baseFee} Gwei</span>
          </div>

          <motion.button
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
            onClick={handleRefresh}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={isLoading ? { rotate: 360 } : {}}
            transition={isLoading ? { duration: 1, ease: "linear" } : {}}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4.01 7.58 4.01 12C4.01 16.42 7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z" fill="currentColor"/>
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6">
        <motion.button
          className={`px-4 py-2 rounded-full text-sm ${
            activeTab === 'overview'
              ? 'bg-white/10 text-white'
              : 'text-gray-400 hover:bg-white/5'
          }`}
          onClick={() => setActiveTab('overview')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Overview
        </motion.button>
        <motion.button
          className={`px-4 py-2 rounded-full text-sm ${
            activeTab === 'calculator'
              ? 'bg-white/10 text-white'
              : 'text-gray-400 hover:bg-white/5'
          }`}
          onClick={() => setActiveTab('calculator')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Cost Calculator
        </motion.button>
        <motion.button
          className={`px-4 py-2 rounded-full text-sm ${
            activeTab === 'history'
              ? 'bg-white/10 text-white'
              : 'text-gray-400 hover:bg-white/5'
          }`}
          onClick={() => setActiveTab('history')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Price History
        </motion.button>
      </div>

      {/* Last updated */}
      <div className="text-xs text-gray-400 mb-4">
        Last updated: {lastUpdated.toLocaleTimeString()}
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
              {/* Current Gas Prices */}
              <motion.div
                className="glass-card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-heading mb-4">Current Gas Prices</h2>

                <div className="mb-6">
                  <GasTracker refreshInterval={10000} showDetails={true} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Base Fee</div>
                    <div className="text-xl font-medium">{baseFee} Gwei</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Minimum fee required by the network
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Gas Price</div>
                    <div className="text-xl font-medium">{gasPrice} Gwei</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Current average gas price
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Gas Fee Estimator */}
              <motion.div
                className="glass-card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <h2 className="text-heading mb-4">Gas Fee Estimator</h2>
                <p className="text-gray-400 mb-4">
                  Estimate gas fees for a sample ETH transfer transaction
                </p>

                <GasFeeEstimator
                  txParams={sampleTxParams}
                  showDetails={true}
                />
              </motion.div>

              {/* Transaction Cost Table */}
              <motion.div
                className="glass-card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <h2 className="text-heading mb-4">Transaction Cost Table</h2>
                <p className="text-gray-400 mb-4">
                  Estimated costs for different transaction types at current gas prices
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-2 px-4">Transaction Type</th>
                        <th className="text-left py-2 px-4">Gas Limit</th>
                        <th className="text-left py-2 px-4">Cost (ETH)</th>
                        <th className="text-left py-2 px-4">Cost (USD)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactionTypes.map((type, index) => {
                        const cost = calculateGasCost(type.gasLimit, parseFloat(gasPrice));

                        return (
                          <tr
                            key={index}
                            className="border-b border-white/5 hover:bg-white/5"
                          >
                            <td className="py-3 px-4">{type.name}</td>
                            <td className="py-3 px-4">{type.gasLimit.toLocaleString()}</td>
                            <td className="py-3 px-4">{cost.eth}</td>
                            <td className="py-3 px-4">${cost.usd}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 text-xs text-gray-400">
                  * Costs are estimates and may vary based on contract complexity and network conditions
                </div>
              </motion.div>
            </>
          )}

          {/* Calculator Tab */}
          {activeTab === 'calculator' && (
            <motion.div
              className="glass-card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <TransactionCostCalculator />
            </motion.div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <motion.div
              className="glass-card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <GasHistoryChart />
            </motion.div>
          )}

          {/* Gas Saving Tips */}
          <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <h2 className="text-heading mb-4">Gas Saving Tips</h2>

            <div className="space-y-4">
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="font-medium mb-1">Transact during low congestion periods</div>
                <div className="text-sm text-gray-400">
                  Gas prices are typically lower during weekends and off-peak hours
                </div>
              </div>

              <div className="p-3 bg-white/5 rounded-lg">
                <div className="font-medium mb-1">Use Layer 2 solutions</div>
                <div className="text-sm text-gray-400">
                  Networks like Optimism, Arbitrum, and Polygon offer lower gas fees
                </div>
              </div>

              <div className="p-3 bg-white/5 rounded-lg">
                <div className="font-medium mb-1">Batch transactions</div>
                <div className="text-sm text-gray-400">
                  Combine multiple operations into a single transaction when possible
                </div>
              </div>

              <div className="p-3 bg-white/5 rounded-lg">
                <div className="font-medium mb-1">Optimize contract interactions</div>
                <div className="text-sm text-gray-400">
                  Use calldata efficiently and minimize storage operations
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default GasPage;
