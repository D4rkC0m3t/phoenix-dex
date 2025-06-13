import { useState } from 'react';
import { motion } from 'framer-motion';
import TokenBadge from './TokenBadge';
import CopyButton from './CopyButton';
import type { WalletCardProps } from '../types';


const WalletCard: React.FC<WalletCardProps> = ({ balance, address, network, tokens = [] }) => {
  const [showFullAddress, setShowFullAddress] = useState<boolean>(false);

  const displayAddress = showFullAddress
    ? address
    : `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;

  return (
    <motion.div
      className="gradient-border w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className={network === 'sepolia' ? 'network-pulse-sepolia' : 'network-pulse'} />
            <span className="text-sm font-medium capitalize">{network}</span>
          </div>
          <div className="text-xs text-gray-400">
            {new Date().toLocaleDateString()}
          </div>
        </div>

        <h2 className="text-display mb-2">{balance} <span className="text-2xl">ETH</span></h2>

        <div className="flex items-center space-x-2 mb-6">
          <div className="bg-white/10 px-3 py-1 rounded-full flex items-center">
            <span
              className="truncated-address cursor-pointer"
              onClick={() => setShowFullAddress(!showFullAddress)}
            >
              {displayAddress}
            </span>
            <CopyButton text={address} />
          </div>
        </div>

        {tokens.length > 0 && (
          <div className="token-carousel flex space-x-2 overflow-x-auto py-2">
            {tokens.map(token => (
              <TokenBadge
                key={token.address}
                {...token}
              />
            ))}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Gas Fee (Gwei)</span>
            <motion.span
              className="text-sm font-medium"
              style={{ color: 'var(--color-accent-2)' }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {network === 'sepolia' ? '1.2' : '25.4'}
            </motion.span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/5 text-xs text-center">
          <span className="text-gray-400">Decentralized Trading Platform</span>
          <div className="flex justify-center mt-2 space-x-1">
            <span className="px-2 py-1 bg-white/5 rounded-full">Swap</span>
            <span className="px-2 py-1 bg-white/5 rounded-full">Liquidity</span>
            <span className="px-2 py-1 bg-white/5 rounded-full">Yield</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WalletCard;

