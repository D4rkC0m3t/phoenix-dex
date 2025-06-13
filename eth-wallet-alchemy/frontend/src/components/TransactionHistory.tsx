import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTransactionHistory } from '../services/wallet';

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: string;
  blockNumber: number;
  type: 'sent' | 'received';
}

interface TransactionHistoryProps {
  walletAddress: string;
  limit?: number;
  refreshTrigger?: number;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ 
  walletAddress, 
  limit = 10,
  refreshTrigger = 0
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch transaction history
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!walletAddress) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const txHistory = await getTransactionHistory(walletAddress, limit);
        setTransactions(txHistory);
      } catch (err: any) {
        console.error("Error fetching transaction history:", err);
        setError("Failed to fetch transaction history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [walletAddress, limit, refreshTrigger]);

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Format date for display
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Format ETH amount for display
  const formatAmount = (amount: string) => {
    const num = parseFloat(amount);
    if (num === 0) return '0 ETH';
    if (num < 0.001) return '< 0.001 ETH';
    return `${num.toFixed(4)} ETH`;
  };

  // Get transaction URL on Etherscan
  const getTransactionUrl = (hash: string) => {
    return `https://sepolia.etherscan.io/tx/${hash}`;
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
      <h2 className="text-heading mb-4">Transaction History</h2>
      
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
      ) : transactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No transactions found</p>
        </div>
      ) : (
        <motion.div
          className="space-y-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {transactions.map((tx) => (
            <motion.a
              key={tx.hash}
              href={getTransactionUrl(tx.hash)}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    tx.type === 'sent' ? 'bg-[#B20600]/20' : 'bg-[#00FF88]/20'
                  }`}>
                    <span className="text-lg">
                      {tx.type === 'sent' ? '↑' : '↓'}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-white">
                      {tx.type === 'sent' ? 'Sent' : 'Received'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatDate(tx.timestamp)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${
                    tx.type === 'sent' ? 'text-[#B20600]' : 'text-[#00FF88]'
                  }`}>
                    {tx.type === 'sent' ? '-' : '+'}{formatAmount(tx.value)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {tx.type === 'sent' ? `To: ${formatAddress(tx.to)}` : `From: ${formatAddress(tx.from)}`}
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default TransactionHistory;
