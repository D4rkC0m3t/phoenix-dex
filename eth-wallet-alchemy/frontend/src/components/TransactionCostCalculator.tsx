import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import { getGasPriceData, formatGasFee } from '../services/gasService';
import { getPrice } from '../services/priceService';

interface TransactionCostCalculatorProps {
  onCalculate?: (cost: { eth: string; usd: string }) => void;
}

const TransactionCostCalculator: React.FC<TransactionCostCalculatorProps> = ({
  onCalculate
}) => {
  const [gasPrice, setGasPrice] = useState<ethers.BigNumber | null>(null);
  const [ethPrice, setEthPrice] = useState<number>(2500);
  const [gasLimit, setGasLimit] = useState<string>('21000');
  const [customGasPrice, setCustomGasPrice] = useState<string>('');
  const [useCustomGasPrice, setUseCustomGasPrice] = useState<boolean>(false);
  const [cost, setCost] = useState<{ eth: string; usd: string }>({ eth: '0', usd: '0' });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Common transaction types with their typical gas limits
  const transactionTypes = [
    { name: 'ETH Transfer', gasLimit: '21000' },
    { name: 'ERC-20 Transfer', gasLimit: '65000' },
    { name: 'Swap on DEX', gasLimit: '150000' },
    { name: 'NFT Minting', gasLimit: '200000' },
    { name: 'Contract Deployment', gasLimit: '1000000' },
    { name: 'Custom', gasLimit: '' }
  ];

  // Fetch gas price data and ETH price
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get gas price data
        const gasPriceData = await getGasPriceData();
        setGasPrice(gasPriceData.gasPrice);
        
        // Get ETH price
        const priceData = await getPrice('ethereum');
        setEthPrice(priceData.usd);
        
        setIsLoading(false);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch gas price data");
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Calculate cost whenever gas price, gas limit, or ETH price changes
  useEffect(() => {
    calculateCost();
  }, [gasPrice, gasLimit, ethPrice, customGasPrice, useCustomGasPrice]);

  // Handle transaction type selection
  const handleTransactionTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = event.target.value;
    
    if (selectedType === 'Custom') {
      // Don't change the gas limit for custom type
      return;
    }
    
    const selectedTypeObj = transactionTypes.find(type => type.name === selectedType);
    if (selectedTypeObj) {
      setGasLimit(selectedTypeObj.gasLimit);
    }
  };

  // Handle gas limit change
  const handleGasLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^0-9]/g, '');
    setGasLimit(value);
  };

  // Handle custom gas price change
  const handleCustomGasPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^0-9.]/g, '');
    setCustomGasPrice(value);
  };

  // Toggle custom gas price
  const handleToggleCustomGasPrice = () => {
    setUseCustomGasPrice(!useCustomGasPrice);
  };

  // Calculate transaction cost
  const calculateCost = () => {
    if (!gasLimit || parseInt(gasLimit) <= 0) {
      setCost({ eth: '0', usd: '0' });
      return;
    }
    
    try {
      // Use custom gas price if enabled, otherwise use network gas price
      const effectiveGasPrice = useCustomGasPrice && customGasPrice
        ? ethers.utils.parseUnits(customGasPrice, 'gwei')
        : gasPrice;
      
      if (!effectiveGasPrice) {
        setCost({ eth: '0', usd: '0' });
        return;
      }
      
      // Calculate cost
      const gasLimitBN = ethers.BigNumber.from(gasLimit);
      const totalCostWei = effectiveGasPrice.mul(gasLimitBN);
      
      // Format cost
      const formattedCost = formatGasFee(totalCostWei, ethPrice);
      setCost(formattedCost);
      
      // Call onCalculate callback if provided
      if (onCalculate) {
        onCalculate(formattedCost);
      }
    } catch (err) {
      console.error("Error calculating cost:", err);
      setCost({ eth: '0', usd: '0' });
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-heading mb-4">Transaction Cost Calculator</h2>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40 bg-white/5 rounded-lg">
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
        <div className="space-y-4">
          {/* Transaction Type */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Transaction Type</label>
            <select
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#FF5F00]"
              onChange={handleTransactionTypeChange}
            >
              {transactionTypes.map((type, index) => (
                <option key={index} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Gas Limit */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Gas Limit</label>
            <input
              type="text"
              value={gasLimit}
              onChange={handleGasLimitChange}
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#FF5F00]"
              placeholder="Enter gas limit"
            />
            <p className="text-xs text-gray-400 mt-1">
              Gas limit determines the maximum amount of computational work in your transaction
            </p>
          </div>
          
          {/* Gas Price */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm text-gray-400">Gas Price (Gwei)</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={useCustomGasPrice}
                  onChange={handleToggleCustomGasPrice}
                  className="mr-2"
                />
                <span className="text-xs text-gray-400">Use custom gas price</span>
              </div>
            </div>
            
            {useCustomGasPrice ? (
              <input
                type="text"
                value={customGasPrice}
                onChange={handleCustomGasPriceChange}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#FF5F00]"
                placeholder="Enter gas price in Gwei"
              />
            ) : (
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="text-lg font-medium">
                  {gasPrice ? ethers.utils.formatUnits(gasPrice, 'gwei') : '0'} Gwei
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Current network gas price
                </div>
              </div>
            )}
          </div>
          
          {/* Calculated Cost */}
          <div className="p-4 rounded-lg bg-[#FF5F00]/20 border border-[#FF5F00]/30">
            <div className="text-sm text-gray-400 mb-2">Estimated Transaction Cost</div>
            <div className="flex justify-between items-center">
              <div className="text-xl font-medium">{cost.eth} ETH</div>
              <div className="text-lg">${cost.usd}</div>
            </div>
          </div>
          
          {/* Tips */}
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="text-sm font-medium mb-2">💡 Tips</div>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Higher gas prices result in faster transaction confirmations</li>
              <li>• Complex transactions require higher gas limits</li>
              <li>• If your transaction runs out of gas, you still pay the gas fee but the transaction fails</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionCostCalculator;
