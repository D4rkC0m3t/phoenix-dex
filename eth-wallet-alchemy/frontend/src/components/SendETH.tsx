import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sendETH, estimateGas } from '../services/sendETH';
import { ethers } from 'ethers';

interface SendETHProps {
  onSuccess?: (txHash: string) => void;
  onError?: (error: string) => void;
}

const SendETH: React.FC<SendETHProps> = ({ onSuccess, onError }) => {
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [gasEstimate, setGasEstimate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Validate recipient address
  const isValidAddress = recipient ? ethers.utils.isAddress(recipient) : true;
  
  // Validate amount
  const isValidAmount = amount ? !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 : true;

  // Update gas estimate when inputs change
  useEffect(() => {
    const updateGasEstimate = async () => {
      if (isValidAddress && isValidAmount && recipient && amount) {
        try {
          const gas = await estimateGas(recipient, amount);
          setGasEstimate(gas);
          setError(null);
        } catch (err: any) {
          setGasEstimate(null);
          // Don't show the error in the UI yet, just log it
          console.error("Gas estimation error:", err.message);
        }
      } else {
        setGasEstimate(null);
      }
    };

    updateGasEstimate();
  }, [recipient, amount, isValidAddress, isValidAmount]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setError(null);
    setSuccess(null);
    
    // Validate inputs
    if (!recipient || !amount) {
      setError("Recipient address and amount are required");
      return;
    }
    
    if (!isValidAddress) {
      setError("Invalid recipient address");
      return;
    }
    
    if (!isValidAmount) {
      setError("Invalid amount");
      return;
    }
    
    // Send the transaction
    setIsLoading(true);
    try {
      const result = await sendETH(recipient, amount);
      
      if (result.success && result.hash) {
        setSuccess(`Transaction sent! Hash: ${result.hash}`);
        if (onSuccess) onSuccess(result.hash);
        
        // Reset form
        setRecipient('');
        setAmount('');
      } else {
        setError(result.error || "Transaction failed");
        if (onError) onError(result.error || "Transaction failed");
      }
    } catch (err: any) {
      setError(err.message);
      if (onError) onError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-heading mb-4">Send ETH</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Recipient Address */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">Recipient Address</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className={`w-full bg-white/5 border ${
              recipient && !isValidAddress ? 'border-[#B20600]' : 'border-white/10'
            } rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-[#FF5F00]`}
          />
          {recipient && !isValidAddress && (
            <p className="text-xs text-[#B20600] mt-1">Invalid Ethereum address</p>
          )}
        </div>
        
        {/* Amount */}
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-2">Amount (ETH)</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.01"
            className={`w-full bg-white/5 border ${
              amount && !isValidAmount ? 'border-[#B20600]' : 'border-white/10'
            } rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-[#FF5F00]`}
          />
          {amount && !isValidAmount && (
            <p className="text-xs text-[#B20600] mt-1">Please enter a valid amount</p>
          )}
        </div>
        
        {/* Gas Estimate */}
        {gasEstimate && (
          <div className="mb-6 p-3 bg-white/5 rounded-lg">
            <p className="text-sm text-gray-400">Estimated Gas Fee</p>
            <p className="text-white">{gasEstimate} ETH</p>
            <p className="text-xs text-gray-400 mt-1">
              Total: {parseFloat(amount) + parseFloat(gasEstimate)} ETH
            </p>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-[#B20600]/20 border border-[#B20600]/30 rounded-lg">
            <p className="text-sm text-[#B20600]">{error}</p>
          </div>
        )}
        
        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-[#00FF88]/10 border border-[#00FF88]/30 rounded-lg">
            <p className="text-sm text-[#00FF88]">{success}</p>
          </div>
        )}
        
        {/* Submit Button */}
        <motion.button
          type="submit"
          className={`w-full py-3 px-4 rounded-xl font-medium ${
            isLoading || !isValidAddress || !isValidAmount
              ? 'bg-white/10 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#FF5F00] to-[#B20600] text-white'
          }`}
          disabled={isLoading || !isValidAddress || !isValidAmount}
          whileHover={
            isLoading || !isValidAddress || !isValidAmount
              ? {}
              : { scale: 1.02 }
          }
          whileTap={
            isLoading || !isValidAddress || !isValidAmount
              ? {}
              : { scale: 0.98 }
          }
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </div>
          ) : (
            'Send ETH'
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default SendETH;
