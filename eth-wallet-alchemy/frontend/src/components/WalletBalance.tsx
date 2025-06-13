import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getWalletBalance, setupBalanceListener } from '../services/wallet';
import { EthereumIcon } from './Icons';

interface WalletBalanceProps {
  address: string;
  network: string;
  refreshTrigger?: number; // Optional prop to trigger a refresh
}

const WalletBalance: React.FC<WalletBalanceProps> = ({ 
  address, 
  network,
  refreshTrigger = 0
}) => {
  const [balance, setBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Fetch initial balance
  useEffect(() => {
    const fetchBalance = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const balanceValue = await getWalletBalance(address);
        setBalance(balanceValue);
      } catch (err: any) {
        console.error("Error fetching balance:", err);
        setError("Failed to fetch balance");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, [address, network, refreshTrigger]);

  // Set up real-time balance updates
  useEffect(() => {
    // Only set up listener if we have a valid address
    if (!address) return;

    const handleBalanceUpdate = (newBalance: string) => {
      // Show updating indicator
      setIsUpdating(true);
      
      // Update balance
      setBalance(newBalance);
      
      // Hide updating indicator after a short delay
      setTimeout(() => {
        setIsUpdating(false);
      }, 2000);
    };

    // Set up the listener
    const removeListener = setupBalanceListener(address, handleBalanceUpdate);
    
    // Clean up the listener when component unmounts or address changes
    return () => {
      removeListener();
    };
  }, [address]);

  // Format balance for display
  const formattedBalance = parseFloat(balance).toFixed(4);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };
  
  const updateVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      className="glass-card p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-heading">Wallet Balance</h2>
        <div className="text-xs text-gray-400 bg-black/20 px-2 py-1 rounded-full">
          {network}
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-20">
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
      ) : (
        <div className="relative">
          <div className="flex items-center">
            <div className="mr-3">
              <EthereumIcon size={36} />
            </div>
            <div>
              <div className="text-3xl font-semibold">
                {formattedBalance} <span className="text-lg text-gray-400">ETH</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Address: {address.substring(0, 6)}...{address.substring(address.length - 4)}
              </div>
            </div>
          </div>
          
          {/* Balance update indicator */}
          {isUpdating && (
            <motion.div 
              className="absolute top-0 right-0 bg-[#FF5F00]/20 text-[#FF5F00] px-3 py-1 rounded-full text-xs"
              variants={updateVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              Balance updated
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default WalletBalance;
