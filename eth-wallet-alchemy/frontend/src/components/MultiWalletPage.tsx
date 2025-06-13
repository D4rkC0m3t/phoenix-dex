import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import WalletSelector from './WalletSelector';
import AddWallet from './AddWallet';
import WalletBalance from './WalletBalance';
import EnhancedSendETH from './EnhancedSendETH';
import TokenList from './TokenList';
import TransactionHistory from './TransactionHistory';
import { type ManagedWallet, getActiveWallet, getWallets } from '../services/walletManager';
import { getNetworkName, getWeb3Provider } from '../services/provider';

const MultiWalletPage: React.FC = () => {
  const [activeWallet, setActiveWallet] = useState<ManagedWallet | null>(null);
  const [showAddWallet, setShowAddWallet] = useState<boolean>(false);
  const [network, setNetwork] = useState<string>('Unknown');
  const [activeTab, setActiveTab] = useState<'balance' | 'tokens' | 'history'>('balance');
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load active wallet
  useEffect(() => {
    const loadActiveWallet = async () => {
      setIsLoading(true);

      try {
        // Get active wallet
        const wallet = getActiveWallet();
        setActiveWallet(wallet);

        // Get network
        if (wallet) {
          try {
            const web3Provider = getWeb3Provider();
            const networkName = await getNetworkName(web3Provider);
            setNetwork(networkName);
          } catch (error) {
            console.error("Error getting network:", error);
            setNetwork('Unknown');
          }
        }
      } catch (error) {
        console.error("Error loading active wallet:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadActiveWallet();
  }, [refreshTrigger]);

  // Handle wallet selection
  const handleWalletSelect = (wallet: ManagedWallet) => {
    setActiveWallet(wallet);
    setRefreshTrigger(prev => prev + 1);
  };

  // Handle wallet addition
  const handleWalletAdded = (wallet: ManagedWallet) => {
    setActiveWallet(wallet);
    setShowAddWallet(false);
    setRefreshTrigger(prev => prev + 1);
  };

  // Handle transaction success
  const handleTransactionSuccess = (txHash: string) => {
    console.log("Transaction successful:", txHash);
    // Refresh wallet data
    setRefreshTrigger(prev => prev + 1);
  };

  // Check if there are any wallets
  const hasWallets = getWallets().length > 0;

  return (
    <div className="w-full max-w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-display">Multi-Wallet</h1>
        <WalletSelector
          onWalletSelect={handleWalletSelect}
          onAddWallet={() => setShowAddWallet(true)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-60">
          <motion.div
            className="w-10 h-10 border-4 border-[#FF5F00] border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      ) : showAddWallet ? (
        <AddWallet
          onWalletAdded={handleWalletAdded}
          onCancel={() => setShowAddWallet(false)}
        />
      ) : !hasWallets ? (
        <motion.div
          className="glass-card p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-heading mb-4">Welcome to Multi-Wallet</h2>
          <p className="text-gray-400 mb-6">
            Get started by adding your first wallet.
          </p>

          <motion.button
            className="py-3 px-6 rounded-xl font-medium bg-gradient-to-r from-[#FF5F00] to-[#B20600] text-white"
            onClick={() => setShowAddWallet(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Add Wallet
          </motion.button>
        </motion.div>
      ) : !activeWallet ? (
        <motion.div
          className="glass-card p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-heading mb-4">No Active Wallet</h2>
          <p className="text-gray-400 mb-6">
            Please select a wallet from the dropdown above.
          </p>
        </motion.div>
      ) : (
        <div>
          {/* Wallet Tabs */}
          <div className="flex space-x-2 mb-6">
            <motion.button
              className={`px-4 py-2 rounded-full text-sm ${
                activeTab === 'balance'
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:bg-white/5'
              }`}
              onClick={() => setActiveTab('balance')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Balance
            </motion.button>
            <motion.button
              className={`px-4 py-2 rounded-full text-sm ${
                activeTab === 'tokens'
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:bg-white/5'
              }`}
              onClick={() => setActiveTab('tokens')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Tokens
            </motion.button>
            <motion.button
              className={`px-4 py-2 rounded-full text-sm ${
                activeTab === 'history'
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:bg-white/5'
              }`}
              onClick={() => setActiveTab('history')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              History
            </motion.button>
          </div>

          {/* Tab Content */}
          {activeTab === 'balance' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Wallet Balance */}
              <WalletBalance
                address={activeWallet.address}
                network={network}
                refreshTrigger={refreshTrigger}
              />

              {/* Send ETH Form */}
              {activeWallet.type !== 'watch' && (
                <EnhancedSendETH onSuccess={handleTransactionSuccess} />
              )}
            </div>
          )}

          {activeTab === 'tokens' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Token List */}
              <TokenList
                walletAddress={activeWallet.address}
                refreshTrigger={refreshTrigger}
              />

              {/* Wallet Info */}
              <motion.div
                className="glass-card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-heading mb-4">Wallet Info</h2>

                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Name</div>
                    <div className="font-medium">{activeWallet.name}</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400 mb-1">Address</div>
                    <div className="font-mono text-sm break-all bg-white/5 p-2 rounded">
                      {activeWallet.address}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400 mb-1">Type</div>
                    <div className="font-medium">
                      {activeWallet.type === 'imported' ? 'Imported Wallet' :
                       activeWallet.type === 'connected' ? 'Connected Wallet' :
                       activeWallet.type === 'hardware' ? 'Hardware Wallet' :
                       'Watch-only Wallet'}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400 mb-1">Network</div>
                    <div className="font-medium">{network}</div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {activeTab === 'history' && (
            <TransactionHistory
              walletAddress={activeWallet.address}
              limit={20}
              refreshTrigger={refreshTrigger}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MultiWalletPage;
