import { useState } from 'react';
import { motion } from 'framer-motion';

const TokenBadge = ({ symbol, balance, address }) => {
  const [showBalance, setShowBalance] = useState(false);
  
  return (
    <motion.div 
      className="relative"
      whileHover={{ scale: 1.1 }}
    >
      <div 
        className="token-badge cursor-pointer"
        onClick={() => setShowBalance(!showBalance)}
      >
        {symbol}
      </div>
      
      {showBalance && (
        <motion.div 
          className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-dark-space-gray px-2 py-1 rounded text-xs whitespace-nowrap"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          {balance} {symbol}
        </motion.div>
      )}
    </motion.div>
  );
};

export default TokenBadge;
