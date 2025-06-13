import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TokenBadgeProps } from '../types';

const TokenBadge: React.FC<TokenBadgeProps> = ({ symbol, balance, address }) => {
  const [showBalance, setShowBalance] = useState<boolean>(false);

  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.05 }}
    >
      <div
        className="token-badge cursor-pointer"
        onClick={() => setShowBalance(!showBalance)}
      >
        {symbol}
      </div>

      <AnimatePresence>
        {showBalance && (
          <motion.div
            className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs whitespace-nowrap z-10"
            style={{
              background: 'rgba(30, 41, 59, 0.9)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="font-medium">{balance} {symbol}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TokenBadge;
