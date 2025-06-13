import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTokenBalances, SEPOLIA_TOKENS } from '../services/tokenService';
import { BitcoinIcon, EthereumIcon, SolanaIcon } from './Icons';

interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  balance: string;
  logo?: string;
  error?: boolean;
}

interface TokenListProps {
  walletAddress: string;
  onSelectToken?: (token: Token) => void;
  refreshTrigger?: number;
}

const TokenList: React.FC<TokenListProps> = ({ 
  walletAddress, 
  onSelectToken,
  refreshTrigger = 0
}) => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch token balances
  useEffect(() => {
    const fetchTokenBalances = async () => {
      if (!walletAddress) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const tokenBalances = await getTokenBalances(walletAddress);
        setTokens(tokenBalances);
      } catch (err: any) {
        console.error("Error fetching token balances:", err);
        setError("Failed to fetch token balances");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenBalances();
  }, [walletAddress, refreshTrigger]);

  // Get icon component based on token symbol
  const getTokenIcon = (symbol: string) => {
    switch (symbol.toUpperCase()) {
      case 'BTC':
        return <BitcoinIcon size={32} />;
      case 'ETH':
        return <EthereumIcon size={32} />;
      case 'SOL':
        return <SolanaIcon size={32} />;
      default:
        return null;
    }
  };

  // Format balance for display
  const formatBalance = (balance: string) => {
    const num = parseFloat(balance);
    if (num === 0) return '0';
    if (num < 0.001) return '< 0.001';
    return num.toFixed(3);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-heading mb-4">Tokens</h2>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <motion.div
            className="w-8 h-8 border-4 border-[#FF5F00] border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      ) : error ? (
        <div className="bg-[#B20600]/20 border border-[#B20600]/30 rounded-lg p-4 text-center">
          <p className="text-[#B20600]">{error}</p>
          <button 
            className="mt-2 text-sm text-white bg-[#B20600] px-3 py-1 rounded-lg"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      ) : tokens.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No tokens found</p>
        </div>
      ) : (
        <motion.div
          className="space-y-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {tokens.map((token, index) => (
            <motion.div
              key={token.address}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => onSelectToken && onSelectToken(token)}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF5F00] to-[#B20600] flex items-center justify-center mr-3">
                  {token.logo ? (
                    <img 
                      src={token.logo} 
                      alt={token.symbol} 
                      className="w-6 h-6 rounded-full"
                    />
                  ) : getTokenIcon(token.symbol) || (
                    <span className="text-white font-bold text-sm">
                      {token.symbol.substring(0, 2)}
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-medium text-white">{token.symbol}</div>
                  <div className="text-xs text-gray-400">{token.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">
                  {token.error ? (
                    <span className="text-[#B20600]">Error</span>
                  ) : (
                    formatBalance(token.balance)
                  )}
                </div>
                <div className="text-xs text-gray-400">
                  {token.error ? 'Failed to load' : `${token.symbol}`}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default TokenList;
