import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import { getGasPriceData, formatGasFee } from '../services/gasService';
import type { GasFeeEstimate } from '../services/gasService';
import { getPrice } from '../services/priceService';

interface GasSettingsProps {
  initialFee: GasFeeEstimate;
  onUpdateFee: (fee: GasFeeEstimate) => void;
  onClose: () => void;
}

const GasSettings: React.FC<GasSettingsProps> = ({
  initialFee,
  onUpdateFee,
  onClose
}) => {
  const [maxFeePerGas, setMaxFeePerGas] = useState<string>(
    ethers.utils.formatUnits(initialFee.maxFeePerGas, "gwei")
  );
  const [maxPriorityFeePerGas, setMaxPriorityFeePerGas] = useState<string>(
    ethers.utils.formatUnits(initialFee.maxPriorityFeePerGas, "gwei")
  );
  const [gasLimit, setGasLimit] = useState<string>(
    initialFee.gasLimit.toString()
  );
  const [baseFeePerGas, setBaseFeePerGas] = useState<ethers.BigNumber>(
    ethers.BigNumber.from(0)
  );
  const [ethPrice, setEthPrice] = useState<number>(2500);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate estimated cost
  const estimatedCost = React.useMemo(() => {
    try {
      const maxFeeGwei = ethers.utils.parseUnits(maxFeePerGas || "0", "gwei");
      const gasLimitBN = ethers.BigNumber.from(gasLimit || "0");
      return maxFeeGwei.mul(gasLimitBN);
    } catch (err) {
      return ethers.BigNumber.from(0);
    }
  }, [maxFeePerGas, gasLimit]);

  // Format estimated cost
  const formattedCost = formatGasFee(estimatedCost, ethPrice);

  // Fetch base fee and ETH price
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch gas price data
        const gasPriceData = await getGasPriceData();
        setBaseFeePerGas(gasPriceData.baseFeePerGas);
        
        // Fetch ETH price
        const priceData = await getPrice('ethereum');
        setEthPrice(priceData.usd);
      } catch (err: any) {
        console.error("Error fetching gas data:", err);
        setError("Failed to fetch gas data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Parse values
      const maxFeeGwei = ethers.utils.parseUnits(maxFeePerGas, "gwei");
      const maxPriorityFeeGwei = ethers.utils.parseUnits(maxPriorityFeePerGas, "gwei");
      const gasLimitBN = ethers.BigNumber.from(gasLimit);
      
      // Create updated fee estimate
      const updatedFee: GasFeeEstimate = {
        ...initialFee,
        maxFeePerGas: maxFeeGwei,
        maxPriorityFeePerGas: maxPriorityFeeGwei,
        gasLimit: gasLimitBN,
        estimatedCost: maxFeeGwei.mul(gasLimitBN),
        type: 'medium' // Default to medium for custom settings
      };
      
      // Call onUpdateFee with the updated fee
      onUpdateFee(updatedFee);
      
      // Close the settings
      onClose();
    } catch (err: any) {
      console.error("Error updating gas fee:", err);
      setError("Invalid gas settings");
    }
  };

  // Format base fee for display
  const formattedBaseFee = ethers.utils.formatUnits(baseFeePerGas, "gwei");

  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-heading">Advanced Gas Settings</h2>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <motion.div
            className="w-8 h-8 border-4 border-[#FF5F00] border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      ) : error ? (
        <div className="p-3 bg-[#B20600]/20 border border-[#B20600]/30 rounded-lg mb-4">
          <p className="text-sm text-[#B20600]">{error}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Current Base Fee */}
          <div className="mb-4 p-3 bg-white/5 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Current Base Fee</div>
            <div className="text-lg font-medium">{parseFloat(formattedBaseFee).toFixed(2)} Gwei</div>
            <div className="text-xs text-gray-400 mt-1">
              This is the minimum fee required by the network
            </div>
          </div>
          
          {/* Max Fee Per Gas */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">
              Max Fee (Gwei)
            </label>
            <input
              type="text"
              value={maxFeePerGas}
              onChange={(e) => setMaxFeePerGas(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-[#FF5F00]"
            />
            <div className="text-xs text-gray-400 mt-1">
              The maximum fee you're willing to pay per unit of gas
            </div>
          </div>
          
          {/* Max Priority Fee Per Gas */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">
              Priority Fee (Gwei)
            </label>
            <input
              type="text"
              value={maxPriorityFeePerGas}
              onChange={(e) => setMaxPriorityFeePerGas(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-[#FF5F00]"
            />
            <div className="text-xs text-gray-400 mt-1">
              The tip you're paying to miners for including your transaction
            </div>
          </div>
          
          {/* Gas Limit */}
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">
              Gas Limit
            </label>
            <input
              type="text"
              value={gasLimit}
              onChange={(e) => setGasLimit(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-[#FF5F00]"
            />
            <div className="text-xs text-gray-400 mt-1">
              The maximum amount of gas you're willing to use
            </div>
          </div>
          
          {/* Estimated Cost */}
          <div className="mb-6 p-3 bg-white/5 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Estimated Cost</div>
            <div className="text-lg font-medium">{formattedCost.eth} ETH (${formattedCost.usd})</div>
          </div>
          
          {/* Submit Button */}
          <div className="flex space-x-3">
            <motion.button
              type="button"
              className="flex-1 py-3 px-4 rounded-xl font-medium bg-white/10 text-white"
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl font-medium bg-gradient-to-r from-[#FF5F00] to-[#B20600] text-white"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Save
            </motion.button>
          </div>
        </form>
      )}
    </motion.div>
  );
};

export default GasSettings;
