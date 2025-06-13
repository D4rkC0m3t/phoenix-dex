import React from 'react';
import { motion } from 'framer-motion';

// Particle animation component for crypto icons
const Particles: React.FC<{color: string, count?: number}> = ({ color, count = 3 }) => {
  // Generate random positions for particles
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 20 - 10,
    y: Math.random() * 20 - 10,
    size: Math.random() * 0.3 + 0.1,
    duration: Math.random() * 2 + 1
  }));

  return (
    <>
      {particles.map(particle => (
        <motion.circle
          key={particle.id}
          cx={12 + particle.x}
          cy={12 + particle.y}
          r={particle.size}
          fill={color}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
            x: [0, particle.x * 1.5, 0],
            y: [0, particle.y * 1.5, 0]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}
    </>
  );
};

interface IconProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

// Holographic Hot Wallet Icon with flame/lightning effect
export const HotWalletIcon: React.FC<IconProps> = ({ size = 24, className = '', animate = true }) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial={animate ? { opacity: 0.8, scale: 0.95 } : undefined}
      animate={animate ? {
        opacity: [0.8, 1, 0.8],
        scale: [0.95, 1, 0.95],
        filter: [
          'drop-shadow(0 0 2px rgba(255, 86, 246, 0.5))',
          'drop-shadow(0 0 5px rgba(255, 86, 246, 0.8))',
          'drop-shadow(0 0 2px rgba(255, 86, 246, 0.5))'
        ]
      } : undefined}
      transition={animate ? {
        repeat: Infinity,
        duration: 3,
        ease: "easeInOut"
      } : undefined}
    >
      {/* Wallet base */}
      <rect x="2" y="5" width="20" height="14" rx="2" fill="url(#hotWalletGradient)" />

      {/* Wallet opening */}
      <rect x="2" y="8" width="20" height="2" fill="#1E293B" />

      {/* Flame effect */}
      <motion.path
        d="M12 9C12 9 14 11 14 13C14 15 12 16 12 16C12 16 10 15 10 13C10 11 12 9 12 9Z"
        fill="url(#flameGradient)"
        animate={animate ? {
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8],
        } : undefined}
        transition={animate ? {
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut"
        } : undefined}
      />

      {/* Glow particles */}
      <motion.circle
        cx="12"
        cy="12"
        r="0.5"
        fill="#FFD166"
        animate={animate ? {
          opacity: [0, 1, 0],
          y: [0, -3, 0],
          x: [0, 1, 0]
        } : undefined}
        transition={animate ? {
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut"
        } : undefined}
      />
      <motion.circle
        cx="13"
        cy="13"
        r="0.3"
        fill="#FF56F6"
        animate={animate ? {
          opacity: [0, 1, 0],
          y: [0, -2, 0],
          x: [0, -1, 0]
        } : undefined}
        transition={animate ? {
          repeat: Infinity,
          duration: 1.7,
          delay: 0.5,
          ease: "easeInOut"
        } : undefined}
      />
      <motion.circle
        cx="11"
        cy="11"
        r="0.4"
        fill="#42A6E3"
        animate={animate ? {
          opacity: [0, 1, 0],
          y: [0, -2.5, 0],
          x: [0, 0.5, 0]
        } : undefined}
        transition={animate ? {
          repeat: Infinity,
          duration: 2.3,
          delay: 0.8,
          ease: "easeInOut"
        } : undefined}
      />

      {/* Gradients */}
      <defs>
        <linearGradient id="hotWalletGradient" x1="2" y1="5" x2="22" y2="19" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF5F00" />
          <stop offset="1" stopColor="#B20600" />
        </linearGradient>
        <linearGradient id="flameGradient" x1="10" y1="9" x2="14" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF5F00" />
          <stop offset="1" stopColor="#B20600" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
};

// Holographic Cold Wallet Icon with vault/shield effect
export const ColdWalletIcon: React.FC<IconProps> = ({ size = 24, className = '', animate = true }) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial={animate ? { opacity: 0.8, scale: 0.95 } : undefined}
      animate={animate ? {
        opacity: [0.8, 1, 0.8],
        scale: [0.95, 1, 0.95],
        filter: [
          'drop-shadow(0 0 2px rgba(66, 166, 227, 0.5))',
          'drop-shadow(0 0 5px rgba(66, 166, 227, 0.8))',
          'drop-shadow(0 0 2px rgba(66, 166, 227, 0.5))'
        ]
      } : undefined}
      transition={animate ? {
        repeat: Infinity,
        duration: 3,
        ease: "easeInOut"
      } : undefined}
    >
      {/* Vault/Shield base */}
      <rect x="4" y="6" width="16" height="12" rx="2" fill="url(#coldWalletGradient)" />

      {/* Lock mechanism */}
      <rect x="10" y="9" width="4" height="6" rx="1" fill="#1E293B" />
      <circle cx="12" cy="12" r="1" fill="#42A6E3" />

      {/* Shield effect */}
      <motion.path
        d="M12 5L16 7V10C16 12.5 14 14 12 15C10 14 8 12.5 8 10V7L12 5Z"
        fill="url(#shieldGradient)"
        fillOpacity="0.3"
        stroke="url(#shieldStrokeGradient)"
        strokeWidth="0.5"
        animate={animate ? {
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.05, 1],
        } : undefined}
        transition={animate ? {
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut"
        } : undefined}
      />

      {/* Ice/Cold effect */}
      <motion.path
        d="M12 8L13 9L12 10L11 9L12 8Z"
        fill="#42A6E3"
        fillOpacity="0.8"
        animate={animate ? {
          opacity: [0.6, 1, 0.6],
          scale: [1, 1.1, 1],
        } : undefined}
        transition={animate ? {
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut"
        } : undefined}
      />

      {/* Glow particles */}
      <motion.circle
        cx="9"
        cy="8"
        r="0.3"
        fill="#42A6E3"
        animate={animate ? {
          opacity: [0, 1, 0],
          scale: [1, 1.5, 1]
        } : undefined}
        transition={animate ? {
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut"
        } : undefined}
      />
      <motion.circle
        cx="15"
        cy="8"
        r="0.3"
        fill="#42A6E3"
        animate={animate ? {
          opacity: [0, 1, 0],
          scale: [1, 1.5, 1]
        } : undefined}
        transition={animate ? {
          repeat: Infinity,
          duration: 2.3,
          delay: 0.5,
          ease: "easeInOut"
        } : undefined}
      />

      {/* Gradients */}
      <defs>
        <linearGradient id="coldWalletGradient" x1="4" y1="6" x2="20" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00092C" />
          <stop offset="1" stopColor="#EEEEEE" />
        </linearGradient>
        <linearGradient id="shieldGradient" x1="8" y1="5" x2="16" y2="15" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00092C" />
          <stop offset="1" stopColor="#EEEEEE" />
        </linearGradient>
        <linearGradient id="shieldStrokeGradient" x1="8" y1="5" x2="16" y2="15" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00092C" />
          <stop offset="1" stopColor="#EEEEEE" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
};

// Holographic Ethereum Icon
export const EthereumIcon: React.FC<IconProps> = ({ size = 24, className = '', animate = true }) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial={animate ? { opacity: 0.8, scale: 0.95 } : undefined}
      animate={animate ? {
        opacity: [0.8, 1, 0.8],
        scale: [0.95, 1, 0.95],
        filter: [
          'drop-shadow(0 0 2px rgba(66, 166, 227, 0.5))',
          'drop-shadow(0 0 5px rgba(66, 166, 227, 0.8))',
          'drop-shadow(0 0 2px rgba(66, 166, 227, 0.5))'
        ]
      } : undefined}
      transition={animate ? {
        repeat: Infinity,
        duration: 3,
        ease: "easeInOut"
      } : undefined}
    >
      {/* ETH Diamond */}
      <motion.path
        d="M12 3L19 12L12 16L5 12L12 3Z"
        fill="url(#ethGradient1)"
        animate={animate ? {
          opacity: [0.8, 1, 0.8],
        } : undefined}
        transition={animate ? {
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut"
        } : undefined}
      />
      <motion.path
        d="M12 16L19 12L12 21L5 12L12 16Z"
        fill="url(#ethGradient2)"
        animate={animate ? {
          opacity: [0.7, 0.9, 0.7],
        } : undefined}
        transition={animate ? {
          repeat: Infinity,
          duration: 2.5,
          ease: "easeInOut"
        } : undefined}
      />

      {/* Particles */}
      {animate && <Particles color="#42A6E3" count={5} />}

      {/* Gradients */}
      <defs>
        <linearGradient id="ethGradient1" x1="5" y1="3" x2="19" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF5F00" />
          <stop offset="1" stopColor="#00092C" />
        </linearGradient>
        <linearGradient id="ethGradient2" x1="5" y1="12" x2="19" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF5F00" />
          <stop offset="1" stopColor="#00092C" stopOpacity="0.8" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
};

// Holographic Bitcoin Icon
export const BitcoinIcon: React.FC<IconProps> = ({ size = 24, className = '', animate = true }) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial={animate ? { opacity: 0.8, scale: 0.95 } : undefined}
      animate={animate ? {
        opacity: [0.8, 1, 0.8],
        scale: [0.95, 1, 0.95],
        filter: [
          'drop-shadow(0 0 2px rgba(255, 209, 102, 0.5))',
          'drop-shadow(0 0 5px rgba(255, 209, 102, 0.8))',
          'drop-shadow(0 0 2px rgba(255, 209, 102, 0.5))'
        ]
      } : undefined}
      transition={animate ? {
        repeat: Infinity,
        duration: 3,
        ease: "easeInOut"
      } : undefined}
    >
      {/* BTC Circle */}
      <motion.circle
        cx="12"
        cy="12"
        r="9"
        fill="url(#btcGradient)"
        animate={animate ? {
          opacity: [0.8, 1, 0.8],
        } : undefined}
        transition={animate ? {
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut"
        } : undefined}
      />

      {/* BTC Symbol */}
      <motion.path
        d="M15.5 10.5C15.5 9 14 8.5 12.5 8.5H10V12.5H12.5C14 12.5 15.5 12 15.5 10.5Z"
        fill="#1E293B"
        animate={animate ? {
          scale: [1, 1.02, 1],
        } : undefined}
        transition={animate ? {
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut"
        } : undefined}
      />
      <motion.path
        d="M14.5 14C14.5 12.5 13 12 11.5 12H10V15.5H11.5C13 15.5 14.5 15.5 14.5 14Z"
        fill="#1E293B"
        animate={animate ? {
          scale: [1, 1.02, 1],
        } : undefined}
        transition={animate ? {
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut"
        } : undefined}
      />
      <motion.path
        d="M11 8.5V7H10V8.5M11 15.5V17H10V15.5M12 8.5V7H13V8.5M12 15.5V17H13V15.5"
        stroke="#1E293B"
        strokeWidth="0.5"
        animate={animate ? {
          opacity: [0.8, 1, 0.8],
        } : undefined}
        transition={animate ? {
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut"
        } : undefined}
      />

      {/* Particles */}
      {animate && <Particles color="#FFD166" count={5} />}

      {/* Gradients */}
      <defs>
        <linearGradient id="btcGradient" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF5F00" />
          <stop offset="1" stopColor="#B20600" stopOpacity="0.8" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
};

// Network type icons
export const MainnetIcon: React.FC<IconProps> = ({ size = 24, className = '', animate = true }) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial={animate ? { opacity: 0.8, scale: 0.95 } : undefined}
      animate={animate ? {
        opacity: [0.8, 1, 0.8],
        scale: [0.95, 1, 0.95],
        filter: [
          'drop-shadow(0 0 2px rgba(66, 166, 227, 0.5))',
          'drop-shadow(0 0 5px rgba(66, 166, 227, 0.8))',
          'drop-shadow(0 0 2px rgba(66, 166, 227, 0.5))'
        ]
      } : undefined}
      transition={animate ? {
        repeat: Infinity,
        duration: 3,
        ease: "easeInOut"
      } : undefined}
    >
      {/* Globe */}
      <motion.circle
        cx="12"
        cy="12"
        r="8"
        fill="url(#mainnetGradient)"
        animate={animate ? {
          opacity: [0.8, 1, 0.8],
        } : undefined}
        transition={animate ? {
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut"
        } : undefined}
      />

      {/* Network lines */}
      <motion.path
        d="M12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20"
        stroke="rgba(255, 255, 255, 0.5)"
        strokeWidth="0.5"
        strokeDasharray="1 1"
        fill="none"
        animate={animate ? {
          opacity: [0.5, 0.8, 0.5],
          rotate: [0, 360]
        } : undefined}
        transition={animate ? {
          repeat: Infinity,
          duration: 20,
          ease: "linear"
        } : undefined}
      />

      {/* Connection nodes */}
      <motion.circle
        cx="12"
        cy="7"
        r="1"
        fill="#FFFFFF"
        animate={animate ? {
          opacity: [0.7, 1, 0.7],
          scale: [1, 1.2, 1]
        } : undefined}
        transition={animate ? {
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut"
        } : undefined}
      />
      <motion.circle
        cx="17"
        cy="12"
        r="1"
        fill="#FFFFFF"
        animate={animate ? {
          opacity: [0.7, 1, 0.7],
          scale: [1, 1.2, 1]
        } : undefined}
        transition={animate ? {
          repeat: Infinity,
          duration: 2.3,
          delay: 0.3,
          ease: "easeInOut"
        } : undefined}
      />
      <motion.circle
        cx="12"
        cy="17"
        r="1"
        fill="#FFFFFF"
        animate={animate ? {
          opacity: [0.7, 1, 0.7],
          scale: [1, 1.2, 1]
        } : undefined}
        transition={animate ? {
          repeat: Infinity,
          duration: 2.6,
          delay: 0.6,
          ease: "easeInOut"
        } : undefined}
      />
      <motion.circle
        cx="7"
        cy="12"
        r="1"
        fill="#FFFFFF"
        animate={animate ? {
          opacity: [0.7, 1, 0.7],
          scale: [1, 1.2, 1]
        } : undefined}
        transition={animate ? {
          repeat: Infinity,
          duration: 2.9,
          delay: 0.9,
          ease: "easeInOut"
        } : undefined}
      />

      {/* Connection lines */}
      <motion.path
        d="M12 7L17 12L12 17L7 12L12 7Z"
        stroke="#FFFFFF"
        strokeWidth="0.5"
        fill="none"
        animate={animate ? {
          opacity: [0.3, 0.7, 0.3],
        } : undefined}
        transition={animate ? {
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut"
        } : undefined}
      />

      {/* Particles */}
      {animate && <Particles color="#FFFFFF" count={3} />}

      {/* Gradients */}
      <defs>
        <linearGradient id="mainnetGradient" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF5F00" />
          <stop offset="1" stopColor="#00092C" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
};

// Testnet Icon
export const TestnetIcon: React.FC<IconProps> = ({ size = 24, className = '', animate = true }) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial={animate ? { opacity: 0.8, scale: 0.95 } : undefined}
      animate={animate ? {
        opacity: [0.8, 1, 0.8],
        scale: [0.95, 1, 0.95],
        filter: [
          'drop-shadow(0 0 2px rgba(255, 209, 102, 0.5))',
          'drop-shadow(0 0 5px rgba(255, 209, 102, 0.8))',
          'drop-shadow(0 0 2px rgba(255, 209, 102, 0.5))'
        ]
      } : undefined}
      transition={animate ? {
        repeat: Infinity,
        duration: 3,
        ease: "easeInOut"
      } : undefined}
    >
      {/* Beaker */}
      <motion.path
        d="M9 4H15V8L18 14V18H6V14L9 8V4Z"
        fill="url(#testnetGradient)"
        animate={animate ? {
          opacity: [0.8, 1, 0.8],
        } : undefined}
        transition={animate ? {
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut"
        } : undefined}
      />

      {/* Liquid */}
      <motion.path
        d="M8 14H16L14 18H10L8 14Z"
        fill="#FFD166"
        fillOpacity="0.8"
        animate={animate ? {
          y: [0, -0.5, 0],
          opacity: [0.7, 0.9, 0.7],
        } : undefined}
        transition={animate ? {
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut"
        } : undefined}
      />

      {/* Bubbles */}
      <motion.circle
        cx="11"
        cy="15"
        r="0.5"
        fill="#FFFFFF"
        animate={animate ? {
          y: [0, -2, -4],
          opacity: [1, 0.5, 0],
          scale: [1, 0.8, 0.6]
        } : undefined}
        transition={animate ? {
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut"
        } : undefined}
      />
      <motion.circle
        cx="13"
        cy="16"
        r="0.5"
        fill="#FFFFFF"
        animate={animate ? {
          y: [0, -2, -4],
          opacity: [1, 0.5, 0],
          scale: [1, 0.8, 0.6]
        } : undefined}
        transition={animate ? {
          repeat: Infinity,
          duration: 1.7,
          delay: 0.5,
          ease: "easeInOut"
        } : undefined}
      />

      {/* Beaker details */}
      <motion.path
        d="M9 4H15V5H9V4Z"
        fill="#1E293B"
        animate={animate ? {
          opacity: [0.8, 1, 0.8],
        } : undefined}
        transition={animate ? {
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut"
        } : undefined}
      />
      <motion.path
        d="M9 7H15M9 10H15"
        stroke="#1E293B"
        strokeWidth="0.5"
        strokeDasharray="1 1"
        animate={animate ? {
          opacity: [0.5, 0.8, 0.5],
        } : undefined}
        transition={animate ? {
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut"
        } : undefined}
      />

      {/* Particles */}
      {animate && <Particles color="#FFD166" count={3} />}

      {/* Gradients */}
      <defs>
        <linearGradient id="testnetGradient" x1="6" y1="4" x2="18" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#B20600" />
          <stop offset="1" stopColor="#EEEEEE" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
};

export const SolanaIcon: React.FC<IconProps> = ({ size = 24, className = '', animate = true }) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial={animate ? { opacity: 0.8, scale: 0.95 } : undefined}
      animate={animate ? {
        opacity: [0.8, 1, 0.8],
        scale: [0.95, 1, 0.95],
        filter: [
          'drop-shadow(0 0 2px rgba(0, 255, 136, 0.5))',
          'drop-shadow(0 0 5px rgba(0, 255, 136, 0.8))',
          'drop-shadow(0 0 2px rgba(0, 255, 136, 0.5))'
        ]
      } : undefined}
      transition={animate ? {
        repeat: Infinity,
        duration: 3,
        ease: "easeInOut"
      } : undefined}
    >
      {/* SOL Lines */}
      <motion.path
        d="M6 8H16L18 6H8L6 8Z"
        fill="url(#solGradient)"
        animate={animate ? {
          opacity: [0.8, 1, 0.8],
          x: [0, 0.2, 0],
        } : undefined}
        transition={animate ? {
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut"
        } : undefined}
      />
      <motion.path
        d="M6 13H16L18 11H8L6 13Z"
        fill="url(#solGradient)"
        animate={animate ? {
          opacity: [0.8, 1, 0.8],
          x: [0, 0.3, 0],
        } : undefined}
        transition={animate ? {
          repeat: Infinity,
          duration: 2.2,
          delay: 0.2,
          ease: "easeInOut"
        } : undefined}
      />
      <motion.path
        d="M6 18H16L18 16H8L6 18Z"
        fill="url(#solGradient)"
        animate={animate ? {
          opacity: [0.8, 1, 0.8],
          x: [0, 0.4, 0],
        } : undefined}
        transition={animate ? {
          repeat: Infinity,
          duration: 2.4,
          delay: 0.4,
          ease: "easeInOut"
        } : undefined}
      />

      {/* Particles */}
      {animate && <Particles color="#00FF88" count={5} />}

      {/* Gradients */}
      <defs>
        <linearGradient id="solGradient" x1="6" y1="6" x2="18" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EEEEEE" />
          <stop offset="1" stopColor="#00092C" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
};