import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import NetworkSwitcher from './components/NetworkSwitcher';
import WalletSection from './components/WalletSection';
import ActivityFeed from './components/ActivityFeed';
import Modal from './components/Modal';
import SendForm from './components/SendForm';
import ReceiveForm from './components/ReceiveForm';
import TransactionDetails from './components/TransactionDetails';
import FloatingActionMenu from './components/FloatingActionMenu';
import NavButton from './components/NavButton';
import LogoGif from './components/LogoGif';
import ThemeToggle from './components/ThemeToggle';
import type { Transaction } from './types';

// Local type definitions since we can't import them from types.d.ts
interface Network {
  name: string;
  chainId: number;
  rpcUrl: string;
  id: string;
}

interface Action {
  label: string;
  icon: string;
  onClick: () => void;
  primary?: boolean;
}

interface Token {
  address: string;
  name: string;
  symbol: string;
  balance: string;
  logo?: string;
}

interface WalletState {
  address: string;
  balance: string;
  tokens: Token[];
  transactions: Transaction[];
  altCoins?: any[];
  coldWalletAddress?: string;
  coldWalletBalance?: string;
  coldWalletTokens?: Token[];
}

// Mock data for demo purposes
const demoWallet: WalletState = {
  address: "0x3df3B0E2931A4e2E5F12026011C360b1B7Cc82Ec",
  balance: '0',
  tokens: [],
  transactions: [],
  altCoins: []
};

// Mock API functions
const getBalance = async (address: string, network: Network): Promise<string> => {
  // In a real app, this would call your backend or Alchemy/Infura
  return '1.23';
};

const getAllTokenBalances = async (address: string, network: Network): Promise<Token[]> => {
  return [
    {
      address: '0x...',
      name: 'Ethereum',
      symbol: 'ETH',
      balance: '1.23'
    },
    {
      address: '0x...',
      name: 'USD Coin',
      symbol: 'USDC',
      balance: '100.00'
    }
  ];
};

const getTransactionHistory = async (address: string, network: Network): Promise<Transaction[]> => {
  return [
    {
      hash: '0x...',
      from: address,
      to: '0x...',
      timestamp: Date.now() / 1000,
      status: 'confirmed',
      type: 'send',
      amount: '0.1'
    }
  ];
};

const networks = [
  { id: 'ethereum', name: 'Ethereum Main', chainId: 1, rpcUrl: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161' },
  { id: 'sepolia', name: 'Sepolia Testnet', chainId: 11155111, rpcUrl: 'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161' },
];

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('wallet');
  const [network, setNetwork] = useState<Network>(networks[0]);
  const [wallet, setWallet] = useState<WalletState | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isTxDetailsModalOpen, setIsTxDetailsModalOpen] = useState(false);
  const [currentTxHash, setCurrentTxHash] = useState('');

  const demoAddress = "0x3df3B0E2931A4e2E5F12026011C360b1B7Cc82Ec";

  const handleNetworkChange = (newNetworkId: string) => {
    const newNetwork = networks.find(network => network.id === newNetworkId);
    if (newNetwork) {
      setNetwork(newNetwork);
      // Refresh data
    }
  };

  const handleTransactionSuccess = (txHash: string) => {
    setCurrentTxHash(txHash);
    setIsTxDetailsModalOpen(true);
    // Refresh data
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch balance
      const balance = await getBalance(wallet?.address || demoAddress, network);
      
      // Fetch token balances
      const tokens = await getAllTokenBalances(wallet?.address || demoAddress, network);
      
      // Fetch transaction history
      const transactions = await getTransactionHistory(wallet?.address || demoAddress, network);
      
      // Update wallet state
      setWallet(prev => ({
        ...prev,
        address: prev?.address || '',
        balance,
        tokens,
        transactions
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [network, wallet?.address]);

  const actions: Action[] = useMemo(() => [
    {
      label: 'Send',
      icon: '📤',
      onClick: () => setIsSendModalOpen(true)
    },
    {
      label: 'Receive',
      icon: '📥',
      onClick: () => setIsReceiveModalOpen(true)
    },
    {
      label: 'Create Wallet',
      icon: '🔐',
      onClick: () => alert('Create wallet functionality would open here'),
      primary: false
    }
  ], []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-inter">
      {/* Header - Fixed height */}
      <header className="h-16 p-4 bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/phoenix-logo.svg" alt="Logo" className="h-10 w-auto" />
            <h1 className="text-2xl font-bold">Phoenix DEX</h1>
          </div>
          <div className="text-sm text-gray-300">
            {wallet?.address ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}` : 'Not connected'}
          </div>
        </div>
        <div className="pb-6 flex flex-col items-center">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-black/30 backdrop-blur-lg">
          <div className="flex items-center space-x-4">
            <LogoGif className="md:hidden" />
            <span className="text-xl font-bold">Phoenix Wallet</span>
          </div>
          <NetworkSwitcher currentNetwork={network.id} onNetworkChange={handleNetworkChange} />
        </header>

        {/* Content */}
        <section className="flex-1 overflow-y-auto px-6 md:px-12 py-12">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-12">
              {activeSection === 'wallet' && (
                <div className="space-y-8">
                  <h1 className="text-3xl font-bold">Wallet Dashboard</h1>
                  <WalletSection 
                    hotWalletAddress={wallet?.address}
                    hotWalletBalance={wallet?.balance}
                    hotWalletTokens={wallet?.tokens}
                    coldWalletAddress={wallet?.coldWalletAddress}
                    coldWalletBalance={wallet?.coldWalletBalance}
                    coldWalletTokens={wallet?.coldWalletTokens}
                    altCoins={wallet?.altCoins}
                    onSend={() => setIsSendModalOpen(true)}
                    onReceive={() => setIsReceiveModalOpen(true)}
                  />
                  <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
                    <ActivityFeed transactions={wallet?.transactions || []} />
                  </div>
                </div>
              )}
              {activeSection === 'swap' && (
                <div>Swap Interface</div>
              )}
              {activeSection === 'portfolio' && (
                <div>Portfolio</div>
              )}
              {activeSection === 'settings' && (
                <div>Settings</div>
              )}
            </div>
          )}
        </section>

        {/* Footer (optional) */}
        <footer className="text-xs text-gray-500 text-center py-2 border-t border-gray-800 bg-black/30">
          &copy; {new Date().getFullYear()} Phoenix Wallet. All rights reserved.
        </footer>
      </main>

      {/* Modals */}
      <Modal isOpen={isSendModalOpen} onClose={() => setIsSendModalOpen(false)}>
        <SendForm
          senderAddress={wallet?.address || demoAddress}
          network={network.id}
          onClose={() => setIsSendModalOpen(false)}
          onSuccess={handleTransactionSuccess}
        />
      </Modal>
      <Modal isOpen={isReceiveModalOpen} onClose={() => setIsReceiveModalOpen(false)}>
        <ReceiveForm
          address={wallet?.address || demoAddress}
          network={network.id}
          onClose={() => setIsReceiveModalOpen(false)}
        />
      </Modal>
      <Modal isOpen={isTxDetailsModalOpen} onClose={() => setIsTxDetailsModalOpen(false)}>
        <TransactionDetails
          txHash={currentTxHash}
          network={network.id}
          onClose={() => setIsTxDetailsModalOpen(false)}
        />
      </Modal>
      <FloatingActionMenu actions={actions} />
    </div>
  );
}
