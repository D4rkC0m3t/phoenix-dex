import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type ManagedWallet, WalletType, getWallets, setActiveWallet as setActiveWalletAction, removeWallet } from '../services/walletManager.js';
import { HotWalletIcon, ColdWalletIcon } from './Icons';

interface WalletSelectorProps {
  onWalletSelect?: (wallet: ManagedWallet) => void;
  onAddWallet?: () => void;
}

const WalletSelector: React.FC<WalletSelectorProps> = ({
  onWalletSelect,
  onAddWallet
}) => {
  const [wallets, setWallets] = useState<ManagedWallet[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeWallet, setActiveWallet] = useState<ManagedWallet | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);

  // Load wallets
  useEffect(() => {
    const loadedWallets = getWallets();
    setWallets(loadedWallets);
    
    // Set active wallet
    const active = loadedWallets.find(wallet => wallet.isActive);
    if (active) {
      setActiveWallet(active);
    } else if (loadedWallets.length > 0) {
      // If no active wallet but wallets exist, set the first one as active
      handleSelectWallet(loadedWallets[0].id);
    }
  }, []);

  // Handle wallet selection
  const handleSelectWallet = (walletId: string) => {
    const selectedWallet = setActiveWallet(walletId);
    if (selectedWallet) {
      setActiveWallet(selectedWallet);
      setWallets(getWallets());
      
      if (onWalletSelect) {
        onWalletSelect(selectedWallet);
      }
    }
    
    setIsOpen(false);
  };

  // Handle wallet deletion
  const handleDeleteWallet = (walletId: string) => {
    if (removeWallet(walletId)) {
      // Refresh wallets
      const updatedWallets = getWallets();
      setWallets(updatedWallets);
      
      // Update active wallet
      const active = updatedWallets.find(wallet => wallet.isActive);
      setActiveWallet(active || null);
      
      if (active && onWalletSelect) {
        onWalletSelect(active);
      }
    }
    
    setShowConfirmDelete(null);
  };

  // Get wallet icon based on type
  const getWalletIcon = (wallet: ManagedWallet) => {
    switch (wallet.type) {
      case WalletType.IMPORTED:
        return <HotWalletIcon size={20} />;
      case WalletType.HARDWARE:
        return <ColdWalletIcon size={20} />;
      case WalletType.CONNECTED:
        return (
          <div className="w-5 h-5 rounded-full bg-[#FF5F00] flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4L3 9.31V11.77L12 14.31L21 11.77V9.31L20 4Z" fill="white"/>
              <path d="M3 9.31V14.31L12 21L21 14.31V9.31L12 14.31L3 9.31Z" fill="white" fillOpacity="0.65"/>
            </svg>
          </div>
        );
      case WalletType.WATCH:
        return (
          <div className="w-5 h-5 rounded-full bg-[#00092C] flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4C7 4 2.73 7.11 1 12C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12C21.27 7.11 17 4 12 4ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="white"/>
            </svg>
          </div>
        );
      default:
        return <HotWalletIcon size={20} />;
    }
  };

  // Format address for display
  const formatAddress = (address: string): string => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="relative">
      {/* Selected Wallet Button */}
      <motion.button
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {activeWallet ? (
          <>
            <div className="flex items-center">
              {getWalletIcon(activeWallet)}
              <span className="ml-2 font-medium">{activeWallet.name}</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d={isOpen ? "M7 15L12 10L17 15" : "M7 10L12 15L17 10"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </>
        ) : (
          <span>Select Wallet</span>
        )}
      </motion.button>
      
      {/* Wallet Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute z-50 mt-2 w-64 rounded-lg bg-[#000620] border border-white/10 shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="max-h-80 overflow-y-auto">
              {wallets.length === 0 ? (
                <div className="p-4 text-center text-gray-400">
                  No wallets found
                </div>
              ) : (
                <div className="p-2">
                  {wallets.map((wallet) => (
                    <div key={wallet.id} className="relative">
                      {showConfirmDelete === wallet.id ? (
                        <div className="p-3 bg-[#B20600]/10 rounded-lg mb-1">
                          <p className="text-sm text-white mb-2">Delete this wallet?</p>
                          <div className="flex space-x-2">
                            <button
                              className="flex-1 px-2 py-1 text-xs rounded bg-[#B20600] text-white"
                              onClick={() => handleDeleteWallet(wallet.id)}
                            >
                              Delete
                            </button>
                            <button
                              className="flex-1 px-2 py-1 text-xs rounded bg-white/10 text-white"
                              onClick={() => setShowConfirmDelete(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <motion.div
                          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                            wallet.isActive ? 'bg-white/10' : 'hover:bg-white/5'
                          }`}
                          onClick={() => handleSelectWallet(wallet.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center">
                            {getWalletIcon(wallet)}
                            <div className="ml-2">
                              <div className="font-medium text-sm">{wallet.name}</div>
                              <div className="text-xs text-gray-400">{formatAddress(wallet.address)}</div>
                            </div>
                          </div>
                          
                          {/* Delete button */}
                          <button
                            className="p-1 text-gray-400 hover:text-white rounded-full hover:bg-white/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowConfirmDelete(wallet.id);
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="currentColor"/>
                            </svg>
                          </button>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Add Wallet Button */}
            <div className="p-2 border-t border-white/10">
              <motion.button
                className="w-full p-2 rounded-lg bg-gradient-to-r from-[#FF5F00] to-[#B20600] text-white font-medium text-sm"
                onClick={() => {
                  setIsOpen(false);
                  if (onAddWallet) onAddWallet();
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Add Wallet
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WalletSelector;
