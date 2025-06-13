import { useState } from 'react';
import { motion } from 'framer-motion';
import TokenBadge from './TokenBadge';
import CopyButton from './CopyButton';

const WalletCard = ({ balance, address, network, tokens = [] }) => {
  const [showFullAddress, setShowFullAddress] = useState(false);
  
  const displayAddress = showFullAddress 
    ? address 
    : `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  
  return (
    <motion.div 
      className="glass-card p-6 w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={network === 'sepolia' ? 'network-pulse-sepolia' : 'network-pulse'} />
          <span className="text-sm font-medium capitalize">{network}</span>
        </div>
        <div className="text-xs text-gray-400">Live</div>
      </div>
      
      <h2 className="text-4xl font-space-grotesk font-bold mb-2">{balance} ETH</h2>
      
      <div className="flex items-center space-x-2 mb-6">
        <span 
          className="truncated-address cursor-pointer"
          onClick={() => setShowFullAddress(!showFullAddress)}
        >
          {displayAddress}
        </span>
        <CopyButton text={address} />
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
            className="text-sm font-medium text-safety-green"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {network === 'sepolia' ? '1.2' : '25.4'}
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
};

export default WalletCard;
