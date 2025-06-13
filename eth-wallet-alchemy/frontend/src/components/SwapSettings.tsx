import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface SwapSettingsProps {
  slippageTolerance: number;
  transactionDeadline: number;
  onSlippageChange: (slippage: number) => void;
  onDeadlineChange: (deadline: number) => void;
  onClose: () => void;
}

const SwapSettings: React.FC<SwapSettingsProps> = ({
  slippageTolerance,
  transactionDeadline,
  onSlippageChange,
  onDeadlineChange,
  onClose
}) => {
  const [customSlippage, setCustomSlippage] = useState<string>(slippageTolerance.toString());
  const [customDeadline, setCustomDeadline] = useState<string>(transactionDeadline.toString());
  const [showCustomSlippage, setShowCustomSlippage] = useState<boolean>(
    ![0.1, 0.5, 1.0].includes(slippageTolerance)
  );
  
  // Predefined slippage options
  const slippageOptions = [
    { value: 0.1, label: '0.1%' },
    { value: 0.5, label: '0.5%' },
    { value: 1.0, label: '1.0%' }
  ];
  
  // Handle slippage option selection
  const handleSlippageOptionClick = (value: number) => {
    onSlippageChange(value);
    setCustomSlippage(value.toString());
    setShowCustomSlippage(false);
  };
  
  // Handle custom slippage input
  const handleCustomSlippageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setCustomSlippage(value);
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      onSlippageChange(numValue);
    }
  };
  
  // Handle custom deadline input
  const handleCustomDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCustomDeadline(value);
    
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      onDeadlineChange(numValue);
    }
  };
  
  // Check if slippage is too low
  const isSlippageTooLow = slippageTolerance < 0.1;
  
  // Check if slippage is too high
  const isSlippageTooHigh = slippageTolerance > 5;
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-heading">Swap Settings</h2>
        
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-6">
        {/* Slippage Tolerance */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Slippage Tolerance</h3>
            
            <button
              className="text-xs text-gray-400 hover:text-white"
              onClick={() => setShowCustomSlippage(!showCustomSlippage)}
            >
              {showCustomSlippage ? 'Hide Custom' : 'Custom'}
            </button>
          </div>
          
          {/* Slippage Options */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {slippageOptions.map((option) => (
              <motion.button
                key={option.value}
                className={`py-2 rounded-lg text-center ${
                  slippageTolerance === option.value && !showCustomSlippage
                    ? 'bg-[#FF5F00]/20 border border-[#FF5F00]/30 text-white'
                    : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                }`}
                onClick={() => handleSlippageOptionClick(option.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {option.label}
              </motion.button>
            ))}
          </div>
          
          {/* Custom Slippage Input */}
          {showCustomSlippage && (
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={customSlippage}
                onChange={handleCustomSlippageChange}
                className="flex-1 p-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#FF5F00]"
                placeholder="Custom slippage"
              />
              <div className="text-gray-400">%</div>
            </div>
          )}
          
          {/* Slippage Warnings */}
          {isSlippageTooLow && (
            <div className="text-xs text-yellow-500 mb-2">
              Your transaction may fail due to low slippage tolerance
            </div>
          )}
          
          {isSlippageTooHigh && (
            <div className="text-xs text-red-500 mb-2">
              Your transaction may be frontrun due to high slippage tolerance
            </div>
          )}
          
          <div className="text-xs text-gray-400">
            Your transaction will revert if the price changes unfavorably by more than this percentage
          </div>
        </div>
        
        {/* Transaction Deadline */}
        <div>
          <h3 className="text-sm font-medium mb-2">Transaction Deadline</h3>
          
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={customDeadline}
              onChange={handleCustomDeadlineChange}
              className="w-20 p-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#FF5F00]"
              placeholder="20"
            />
            <div className="text-gray-400">minutes</div>
          </div>
          
          <div className="text-xs text-gray-400">
            Your transaction will revert if it is pending for more than this long
          </div>
        </div>
        
        {/* Expert Mode (Disabled for now) */}
        <div className="opacity-50 cursor-not-allowed">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium">Expert Mode</h3>
              <div className="text-xs text-gray-400">
                Allow high price impact trades and skip confirmation screen
              </div>
            </div>
            
            <div className="relative inline-flex items-center">
              <input
                type="checkbox"
                disabled
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5F00]"></div>
            </div>
          </div>
        </div>
        
        {/* Reset Button */}
        <motion.button
          className="w-full py-3 px-4 rounded-xl font-medium bg-white/10 text-white"
          onClick={() => {
            onSlippageChange(0.5);
            onDeadlineChange(20);
            setCustomSlippage('0.5');
            setCustomDeadline('20');
            setShowCustomSlippage(false);
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Reset to Default
        </motion.button>
      </div>
    </div>
  );
};

export default SwapSettings;
