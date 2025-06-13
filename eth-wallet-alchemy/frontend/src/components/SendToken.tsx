import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sendToken, SEPOLIA_TOKENS } from '../services/tokenService';

interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  balance?: string;
  logo?: string;
}

interface SendTokenProps {
  walletAddress: string;
  selectedToken?: Token;
  onSuccess?: (txHash: string) => void;
  onError?: (error: string) => void;
  onBack?: () => void;
}

const SendToken: React.FC<SendTokenProps> = ({ 
  walletAddress, 
  selectedToken,
  onSuccess, 
  onError,
  onBack
}) => {
  const [tokens, setTokens] = useState<Token[]>(SEPOLIA_TOKENS);
  const [token, setToken] = useState<Token | null>(selectedToken || null);
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showTokenSelect, setShowTokenSelect] = useState<boolean>(false);

  // Set the selected token when it changes
  useEffect(() => {
    if (selectedToken) {
      setToken(selectedToken);
    }
  }, [selectedToken]);

  // Validate recipient address
  const isValidAddress = recipient ? ethers.utils.isAddress(recipient) : true;
  
  // Validate amount
  const isValidAmount = amount ? !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 : true;

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setError(null);
    setSuccess(null);
    
    // Validate inputs
    if (!token) {
      setError("Please select a token");
      return;
    }
    
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
      const result = await sendToken(token.address, recipient, amount);
      
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

  // Handle token selection
  const handleTokenSelect = (selectedToken: Token) => {
    setToken(selectedToken);
    setShowTokenSelect(false);
  };

  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-heading">Send Token</h2>
        {onBack && (
          <button 
            onClick={onBack}
            className="text-sm text-gray-400 hover:text-white"
          >
            Back
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Token Selection */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">Token</label>
          <div 
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white cursor-pointer"
            onClick={() => setShowTokenSelect(!showTokenSelect)}
          >
            {token ? (
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF5F00] to-[#B20600] flex items-center justify-center mr-2">
                  {token.logo ? (
                    <img 
                      src={token.logo} 
                      alt={token.symbol} 
                      className="w-5 h-5 rounded-full"
                    />
                  ) : (
                    <span className="text-white font-bold text-xs">
                      {token.symbol.substring(0, 2)}
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-medium">{token.symbol}</div>
                  <div className="text-xs text-gray-400">{token.name}</div>
                </div>
              </div>
            ) : (
              <div className="text-gray-400">Select a token</div>
            )}
          </div>
          
          {/* Token Selection Dropdown */}
          {showTokenSelect && (
            <div className="mt-2 bg-white/5 border border-white/10 rounded-lg overflow-hidden">
              {tokens.map((t) => (
                <div
                  key={t.address}
                  className="p-3 hover:bg-white/10 cursor-pointer flex items-center"
                  onClick={() => handleTokenSelect(t)}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF5F00] to-[#B20600] flex items-center justify-center mr-2">
                    {t.logo ? (
                      <img 
                        src={t.logo} 
                        alt={t.symbol} 
                        className="w-5 h-5 rounded-full"
                      />
                    ) : (
                      <span className="text-white font-bold text-xs">
                        {t.symbol.substring(0, 2)}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-white">{t.symbol}</div>
                    <div className="text-xs text-gray-400">{t.name}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
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
          <label className="block text-sm text-gray-400 mb-2">Amount</label>
          <div className="relative">
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              className={`w-full bg-white/5 border ${
                amount && !isValidAmount ? 'border-[#B20600]' : 'border-white/10'
              } rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-[#FF5F00]`}
            />
            {token && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {token.symbol}
              </div>
            )}
          </div>
          {amount && !isValidAmount && (
            <p className="text-xs text-[#B20600] mt-1">Please enter a valid amount</p>
          )}
        </div>
        
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
            isLoading || !token || !isValidAddress || !isValidAmount
              ? 'bg-white/10 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#FF5F00] to-[#B20600] text-white'
          }`}
          disabled={isLoading || !token || !isValidAddress || !isValidAmount}
          whileHover={
            isLoading || !token || !isValidAddress || !isValidAmount
              ? {}
              : { scale: 1.02 }
          }
          whileTap={
            isLoading || !token || !isValidAddress || !isValidAmount
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
            'Send Token'
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default SendToken;
