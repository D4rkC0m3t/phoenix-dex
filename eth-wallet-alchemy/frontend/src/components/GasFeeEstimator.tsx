import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import { estimateGasFee, formatGasFee } from '../services/gasService';
import type { GasFeeEstimate } from '../services/gasService';
import { getPrice } from '../services/priceService';

interface GasFeeEstimatorProps {
  txParams: {
    from?: string;
    to: string;
    value?: string | ethers.BigNumber;
    data?: string;
  };
  onSelectFee?: (fee: GasFeeEstimate) => void;
  defaultFeeType?: 'low' | 'medium' | 'high';
  showDetails?: boolean;
}

const GasFeeEstimator: React.FC<GasFeeEstimatorProps> = ({
  txParams,
  onSelectFee,
  defaultFeeType = 'medium',
  showDetails = true
}) => {
  const [feeEstimates, setFeeEstimates] = useState<{
    low: GasFeeEstimate | null;
    medium: GasFeeEstimate | null;
    high: GasFeeEstimate | null;
  }>({
    low: null,
    medium: null,
    high: null
  });
  const [selectedFeeType, setSelectedFeeType] = useState<'low' | 'medium' | 'high'>(defaultFeeType);
  const [ethPrice, setEthPrice] = useState<number>(2500); // Default ETH price
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch gas fee estimates
  useEffect(() => {
    const fetchGasFeeEstimates = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch ETH price
        const priceData = await getPrice('ethereum');
        setEthPrice(priceData.usd);
        
        // Fetch gas fee estimates for all types
        const [lowFee, mediumFee, highFee] = await Promise.all([
          estimateGasFee(txParams, 'low'),
          estimateGasFee(txParams, 'medium'),
          estimateGasFee(txParams, 'high')
        ]);
        
        setFeeEstimates({
          low: lowFee,
          medium: mediumFee,
          high: highFee
        });
        
        // Call onSelectFee with the default fee type
        if (onSelectFee) {
          onSelectFee(defaultFeeType === 'low' ? lowFee : 
                     defaultFeeType === 'medium' ? mediumFee : highFee);
        }
      } catch (err: any) {
        console.error("Error estimating gas fees:", err);
        setError("Failed to estimate gas fees");
      } finally {
        setIsLoading(false);
      }
    };

    if (txParams.to) {
      fetchGasFeeEstimates();
    }
  }, [txParams, defaultFeeType, onSelectFee]);

  // Handle fee type selection
  const handleSelectFeeType = (feeType: 'low' | 'medium' | 'high') => {
    setSelectedFeeType(feeType);
    
    // Call onSelectFee with the selected fee
    if (onSelectFee && feeEstimates[feeType]) {
      onSelectFee(feeEstimates[feeType]!);
    }
  };

  // Format gas fee for display
  const getFormattedFee = (fee: GasFeeEstimate | null): { eth: string; usd: string } => {
    if (!fee) {
      return { eth: '0.000000', usd: '0.00' };
    }
    
    return formatGasFee(fee.estimatedCost, ethPrice);
  };

  return (
    <div className="w-full">
      <div className="text-sm text-gray-400 mb-2">Gas Fee</div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-20 bg-white/5 rounded-lg">
          <motion.div
            className="w-6 h-6 border-2 border-[#FF5F00] border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      ) : error ? (
        <div className="p-3 bg-[#B20600]/20 border border-[#B20600]/30 rounded-lg">
          <p className="text-sm text-[#B20600]">{error}</p>
        </div>
      ) : (
        <div>
          {/* Fee Type Selection */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {['low', 'medium', 'high'].map((feeType) => {
              const fee = feeEstimates[feeType as keyof typeof feeEstimates];
              const formattedFee = getFormattedFee(fee);
              
              return (
                <motion.div
                  key={feeType}
                  className={`p-3 rounded-lg cursor-pointer ${
                    selectedFeeType === feeType 
                      ? 'bg-[#FF5F00]/20 border border-[#FF5F00]/30' 
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                  onClick={() => handleSelectFeeType(feeType as 'low' | 'medium' | 'high')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center">
                    <div className="text-xs font-medium mb-1">
                      {feeType === 'low' ? 'Low' : 
                       feeType === 'medium' ? 'Medium' : 'High'}
                    </div>
                    <div className="text-sm font-semibold">
                      ${formattedFee.usd}
                    </div>
                    <div className="text-xs text-gray-400">
                      {fee?.estimatedTime}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {/* Fee Details */}
          {showDetails && feeEstimates[selectedFeeType] && (
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Max Fee</div>
                  <div className="text-sm">
                    {ethers.utils.formatUnits(
                      feeEstimates[selectedFeeType]!.maxFeePerGas, 
                      "gwei"
                    )} Gwei
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Priority Fee</div>
                  <div className="text-sm">
                    {ethers.utils.formatUnits(
                      feeEstimates[selectedFeeType]!.maxPriorityFeePerGas, 
                      "gwei"
                    )} Gwei
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Gas Limit</div>
                  <div className="text-sm">
                    {feeEstimates[selectedFeeType]!.gasLimit.toString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Total</div>
                  <div className="text-sm">
                    {getFormattedFee(feeEstimates[selectedFeeType]).eth} ETH
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GasFeeEstimator;
