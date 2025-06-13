import React from 'react';
import { motion } from 'framer-motion';

const PhoenixBird = () => {
  // Simplified path data without arcs
  const bodyPath = 'M12 6 L18 12 L12 18 L6 12 Z';
  const wingPath = 'M12 8 L16 6 L20 10 L16 12 Z';
  
  return (
    <motion.div 
      className="relative h-12 w-12"
      animate={{ 
        rotate: [0, 5, -5, 0],
        y: [0, -5, 5, 0] 
      }}
      transition={{ 
        duration: 4, 
        repeat: Infinity 
      }}
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        {/* Body */}
        <motion.path
          d={bodyPath}
          fill="#F97316"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Wings */}
        <motion.path
          d={wingPath}
          fill="#F59E0B"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        
        {/* Eyes */}
        <motion.circle 
          cx="10" 
          cy="10" 
          r="1" 
          fill="#000"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        />
      </svg>
    </motion.div>
  );
};

export default PhoenixBird;
