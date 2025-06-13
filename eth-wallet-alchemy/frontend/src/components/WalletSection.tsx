import { useState } from 'react';
import { motion } from 'framer-motion';
import HotWalletCard from './HotWalletCard';
import WalletFrame from './WalletFrame';
import type { Token } from '../types';

interface WalletSectionProps {
  hotWalletAddress?: string;
  hotWalletBalance?: string;
  hotWalletTokens?: Token[];
  coldWalletAddress?: string;
  coldWalletBalance?: string;
  coldWalletTokens?: Token[];
  altCoins?: any[];
  onSend?: () => void;
  onReceive?: () => void;
}

const WalletSection: React.FC<WalletSectionProps> = ({
  hotWalletAddress = '',
  hotWalletBalance = '0',
  hotWalletTokens = [],
  coldWalletAddress = '',
  coldWalletBalance = '0',
  coldWalletTokens = [],
  altCoins = [],
  onSend = () => {},
  onReceive = () => {}
}) => {
  const [activeWallet, setActiveWallet] = useState<'hot' | 'cold'>('hot');

  // Convert altCoins to Token format for the hot wallet
  const altCoinsAsTokens = altCoins.map(coin => ({
    symbol: coin.symbol,
    address: coin.address || '',
    balance: coin.balance
  }));

  const formattedTokens = [...hotWalletTokens, ...altCoinsAsTokens];
  const balanceUsd = (parseFloat(hotWalletBalance) * 1800).toFixed(2); // Mock conversion

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-100">My Wallets</h2>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-white font-semibold shadow transition"
          onClick={onSend}
        >
          Send
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <HotWalletCard 
          balance={hotWalletBalance || '0'}
          balanceUsd={balanceUsd}
          changePercent="+0.7%"
          tokens={formattedTokens}
          address={hotWalletAddress || ''}
          onSend={onSend}
          onReceive={onReceive}
        />

        <WalletFrame 
          type="cold"
          address={coldWalletAddress || ''}
          balance={coldWalletBalance || '0'}
          tokens={coldWalletTokens || []}
          isActive={activeWallet === 'cold'}
          onClick={() => setActiveWallet('cold')}
          onConnectHardware={() => window.dispatchEvent(new CustomEvent('navigate-to-hardware'))}
        />
      </div>
    </section>
  );
};

export default WalletSection;
