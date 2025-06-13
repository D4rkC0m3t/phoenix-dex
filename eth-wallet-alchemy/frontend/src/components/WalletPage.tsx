import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import WalletBalance from './WalletBalance';
import EnhancedSendETH from './EnhancedSendETH';
import SendToken from './SendToken';
import TokenList from './TokenList';
import TransactionHistory from './TransactionHistory';
import SepoliaNetworkSwitcher from './SepoliaNetworkSwitcher';
import { connectWallet } from '../services/wallet';
import { getNetworkName, getWeb3Provider } from '../services/provider';

const WalletPage: React.FC = () => {
  const [address, setAddress] = useState<string>('');
  const [network, setNetwork] = useState<string>('Unknown');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'eth' | 'tokens' | 'history'>('eth');
  const [selectedToken, setSelectedToken] = useState<any>(null);

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Check if we have access to the ethereum object
        if (window.ethereum && window.ethereum.selectedAddress) {
          const web3Provider = getWeb3Provider();
          const signer = web3Provider.getSigner();
          const connectedAddress = await signer.getAddress();
          setAddress(connectedAddress);

          // Get the current network
          const networkName = await getNetworkName(web3Provider);
          setNetwork(networkName);
        }
      } catch (err) {
        console.error("Error checking connection:", err);
      }
    };

    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected
        setAddress('');
      } else {
        // User switched accounts
        setAddress(accounts[0]);
        setRefreshTrigger(prev => prev + 1);
      }
    };

    const handleChainChanged = () => {
      // When chain changes, update the network and refresh
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, []);

  // Handle wallet connection
  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const connectedAddress = await connectWallet();
      setAddress(connectedAddress);

      // Get the current network
      const web3Provider = getWeb3Provider();
      const networkName = await getNetworkName(web3Provider);
      setNetwork(networkName);
    } catch (err: any) {
      console.error("Error connecting wallet:", err);
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle transaction success
  const handleTransactionSuccess = (txHash: string) => {
    console.log("Transaction successful:", txHash);
    // Trigger a balance refresh
    setRefreshTrigger(prev => prev + 1);
  };

  // Handle token selection
  const handleTokenSelect = (token: any) => {
    setSelectedToken(token);
    setActiveTab('tokens');
  };

  // Handle back from token send
  const handleBackFromTokenSend = () => {
    setSelectedToken(null);
    setActiveTab('tokens');
  };

  return (
    <div className="w-full max-w-full">
      <h1 className="text-display mb-6">Sepolia Wallet</h1>

      {!address ? (
        <motion.div
          className="glass-card p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-heading mb-4">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-6">
            Connect your Ethereum wallet to view your balance and send transactions on Sepolia testnet.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-[#B20600]/20 border border-[#B20600]/30 rounded-lg">
              <p className="text-sm text-[#B20600]">{error}</p>
            </div>
          )}

          <motion.button
            className="py-3 px-6 rounded-xl font-medium bg-gradient-to-r from-[#FF5F00] to-[#B20600] text-white"
            onClick={handleConnect}
            disabled={isConnecting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isConnecting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting...
              </div>
            ) : (
              'Connect Wallet'
            )}
          </motion.button>
        </motion.div>
      ) : (
        <>
          {/* Network Switcher */}
          <SepoliaNetworkSwitcher
            currentNetwork={network}
            onNetworkChange={(networkName) => setNetwork(networkName)}
          />

          {/* Wallet Tabs */}
          <div className="flex space-x-2 mb-6">
            <motion.button
              className={`px-4 py-2 rounded-full text-sm ${
                activeTab === 'eth'
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:bg-white/5'
              }`}
              onClick={() => setActiveTab('eth')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ETH Balance
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
          {activeTab === 'eth' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Wallet Balance */}
              <WalletBalance
                address={address}
                network={network}
                refreshTrigger={refreshTrigger}
              />

              {/* Send ETH Form */}
              <EnhancedSendETH onSuccess={handleTransactionSuccess} />
            </div>
          )}

          {activeTab === 'tokens' && !selectedToken && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Token List */}
              <TokenList
                walletAddress={address}
                onSelectToken={handleTokenSelect}
                refreshTrigger={refreshTrigger}
              />

              {/* Transaction History */}
              <TransactionHistory
                walletAddress={address}
                refreshTrigger={refreshTrigger}
              />
            </div>
          )}

          {activeTab === 'tokens' && selectedToken && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Send Token Form */}
              <SendToken
                walletAddress={address}
                selectedToken={selectedToken}
                onSuccess={handleTransactionSuccess}
                onBack={handleBackFromTokenSend}
              />

              {/* Wallet Balance */}
              <WalletBalance
                address={address}
                network={network}
                refreshTrigger={refreshTrigger}
              />
            </div>
          )}

          {activeTab === 'history' && (
            <TransactionHistory
              walletAddress={address}
              limit={20}
              refreshTrigger={refreshTrigger}
            />
          )}
        </>
      )}
    </div>
  );
};

export default WalletPage;
