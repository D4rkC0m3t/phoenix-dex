import React from 'react';
import { motion } from 'framer-motion';

interface LogoGifProps {
  className?: string;
}

const LogoGif: React.FC<LogoGifProps> = ({ className = '' }) => {
  // Simple safe path data (no arcs)
  const logoPath = 'M12 2 L22 12 L12 22 L2 12 Z';
  
  return (
    <motion.div 
      className={`relative ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <motion.path
          d={logoPath}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
        />
      </motion.svg>

      {/* Phoenix glow effect */}
      <div
        className="absolute inset-0 -z-10 blur-xl opacity-30"
        style={{
          background: 'linear-gradient(90deg, var(--color-accent-1), var(--color-accent-3))',
        }}
      />

      {/* We don't need the text overlay anymore since the logo has the Phoenix name */}
    </motion.div>
  );
};

export default LogoGif;
