import React from 'react';
import { motion } from 'framer-motion';
import type { TokenMetadata, SwapQuote } from '../services/swapService';

interface SwapConfirmationProps {
  fromToken: TokenMetadata;
  toToken: TokenMetadata;
  fromAmount: string;
  toAmount: string;
  quote: SwapQuote;
  slippageTolerance: number;
  transactionDeadline: number;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

const SwapConfirmation: React.FC<SwapConfirmationProps> = ({
  fromToken,
  toToken,
  fromAmount,
  toAmount,
  quote,
  slippageTolerance,
  transactionDeadline,
  onConfirm,
  onCancel,
  isLoading
}) => {
  // Calculate minimum received with slippage
  const minimumReceived = parseFloat(toAmount) * (1 - slippageTolerance / 100);
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-heading">Confirm Swap</h2>
        
        <button 
          onClick={onCancel}
          className="text-gray-400 hover:text-white"
          disabled={isLoading}
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-6">
        {/* Swap Summary */}
        <div className="p-4 bg-white/5 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-2 overflow-hidden">
                {fromToken.logoURI ? (
                  <img src={fromToken.logoURI} alt={fromToken.symbol} className="w-6 h-6" />
                ) : (
                  <div className="text-xs font-bold">{fromToken.symbol.substring(0, 2)}</div>
                )}
              </div>
              <div>
                <div className="text-lg font-medium">{fromAmount}</div>
                <div className="text-sm text-gray-400">{fromToken.symbol}</div>
              </div>
            </div>
            
            <div className="text-gray-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-2 overflow-hidden">
                {toToken.logoURI ? (
                  <img src={toToken.logoURI} alt={toToken.symbol} className="w-6 h-6" />
                ) : (
                  <div className="text-xs font-bold">{toToken.symbol.substring(0, 2)}</div>
                )}
              </div>
              <div>
                <div className="text-lg font-medium">{toAmount}</div>
                <div className="text-sm text-gray-400">{toToken.symbol}</div>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-center text-gray-400">
            Output is estimated. You will receive at least {minimumReceived.toFixed(6)} {toToken.symbol} or the transaction will revert.
          </div>
        </div>
        
        {/* Transaction Details */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">Rate</div>
            <div className="text-sm">
              1 {fromToken.symbol} = {quote.executionPrice} {toToken.symbol}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">Price Impact</div>
            <div className={`text-sm ${parseFloat(quote.priceImpact) > 5 ? 'text-red-500' : 'text-green-500'}`}>
              {quote.priceImpact}%
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">Minimum Received</div>
            <div className="text-sm">
              {minimumReceived.toFixed(6)} {toToken.symbol}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">Slippage Tolerance</div>
            <div className="text-sm">{slippageTolerance}%</div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">Transaction Deadline</div>
            <div className="text-sm">{transactionDeadline} minutes</div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">Fee</div>
            <div className="text-sm">${quote.fee}</div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">Route</div>
            <div className="text-sm">
              {quote.route.map((token, index) => {
                const isLast = index === quote.route.length - 1;
                return (
                  <span key={index}>
                    {token === 'ETH' ? 'ETH' : token.substring(0, 6)}
                    {!isLast && ' → '}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Warning for high price impact */}
        {parseFloat(quote.priceImpact) > 5 && (
          <div className="p-3 bg-[#B20600]/20 border border-[#B20600]/30 rounded-lg">
            <p className="text-sm text-[#B20600]">
              Price impact is high. You may receive significantly less than expected.
            </p>
          </div>
        )}
        
        {/* Buttons */}
        <div className="flex space-x-3">
          <motion.button
            className="flex-1 py-3 px-4 rounded-xl font-medium bg-white/10 text-white"
            onClick={onCancel}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            Cancel
          </motion.button>
          
          <motion.button
            className="flex-1 py-3 px-4 rounded-xl font-medium bg-gradient-to-r from-[#FF5F00] to-[#B20600] text-white"
            onClick={onConfirm}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Swapping...
              </div>
            ) : (
              'Confirm Swap'
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default SwapConfirmation;
