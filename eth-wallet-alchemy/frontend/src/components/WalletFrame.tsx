import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CopyButton from './CopyButton';
import type { WalletFrameProps } from '../types';
import { HotWalletIcon, ColdWalletIcon } from './Icons';

const WalletFrame: React.FC<WalletFrameProps> = ({
  type = 'hot',
  address = '',
  balance = '0',
  tokens = [],
  isActive = false,
  onClick = () => {},
  onConnectHardware = () => {}
}) => {
  const [showFullAddress, setShowFullAddress] = useState(false);

  const displayAddress = address
    ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
    : 'Not connected';

  // Different styling based on wallet type
  const getWalletTypeStyles = () => {
    if (type === 'hot') {
      return {
        gradient: 'from-[#FF56F6] to-[#42A6E3]',
        iconComponent: <HotWalletIcon size={20} />,
        title: 'Hot Wallet',
        description: 'For daily transactions',
        bgOpacity: isActive ? 'bg-opacity-10' : 'bg-opacity-5',
        borderColor: isActive ? 'border-[#FF56F6]/30' : 'border-white/5',
        glowColor: 'rgba(255, 86, 246, 0.3)'
      };
    } else {
      return {
        gradient: 'from-[#42A6E3] to-[#00FF88]',
        iconComponent: <ColdWalletIcon size={20} />,
        title: 'Cold Wallet',
        description: 'For long-term storage',
        bgOpacity: isActive ? 'bg-opacity-10' : 'bg-opacity-5',
        borderColor: isActive ? 'border-[#42A6E3]/30' : 'border-white/5',
        glowColor: 'rgba(66, 166, 227, 0.3)'
      };
    }
  };

  const styles = getWalletTypeStyles();

  return (
    <motion.div 
      className={`p-4 rounded-lg border ${isActive ? 'border-orange-500/30' : 'border-gray-700'} ${type === 'hot' ? 'bg-orange-900/10' : 'bg-blue-900/10'}`}
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Active indicator */}
      {isActive && (
        <motion.div
          className={`absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r ${styles.gradient}`}
          layoutId={`wallet-active-${type}`}
          animate={{
            boxShadow: [
              `0 0 5px ${styles.glowColor}`,
              `0 0 15px ${styles.glowColor}`,
              `0 0 5px ${styles.glowColor}`
            ]
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            boxShadow: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          {/* Inner pulse */}
          <motion.div
            className="absolute inset-1 rounded-full bg-white"
            animate={{ opacity: [0.7, 1, 0.7], scale: [0.8, 1, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      )}

      {/* Wallet type header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <motion.div
            className={`w-10 h-10 rounded-full bg-gradient-to-r ${styles.gradient} flex items-center justify-center text-white`}
            initial={{ boxShadow: `0 0 0 ${styles.glowColor}` }}
            animate={{
              boxShadow: [
                `0 0 5px ${styles.glowColor}`,
                `0 0 10px ${styles.glowColor}`,
                `0 0 5px ${styles.glowColor}`
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {styles.iconComponent}
          </motion.div>
          <div className="ml-3">
            <h3 className="font-inter font-medium text-white">{styles.title}</h3>
            <p className="text-xs text-gray-400">{styles.description}</p>
          </div>
        </div>

        <div className={`text-xs ${type === 'hot' ? 'text-[#FF56F6]' : 'text-[#42A6E3]'} bg-black/20 px-2 py-1 rounded-full flex items-center`}>
          <motion.div
            className={`w-2 h-2 rounded-full ${type === 'hot' ? 'bg-[#FF56F6]' : 'bg-[#42A6E3]'} mr-1.5`}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          {type === 'hot' ? 'Online' : 'Offline'}
        </div>
      </div>

      {/* Balance */}
      <div className="mb-4">
        <div className="text-sm text-gray-400 mb-1">Balance</div>
        <div className="text-2xl font-inter font-semibold tracking-tight">
          {balance} <span className="text-lg text-gray-400">ETH</span>
        </div>
      </div>

      {/* Address */}
      <div className="mb-4">
        <div className="text-sm text-gray-400 mb-1">Address</div>
        <div className="flex items-center bg-black/20 rounded-lg px-3 py-2">
          <span
            className="text-mono text-sm mr-2 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setShowFullAddress(!showFullAddress);
            }}
          >
            {displayAddress}
          </span>
          <CopyButton text={address} />
        </div>
      </div>

      {/* Tokens summary or Cold Wallet Connect */}
      {type === 'hot' && tokens.length > 0 ? (
        <div>
          <div className="text-sm text-gray-400 mb-2">Tokens ({tokens.length})</div>
          <div className="flex flex-wrap gap-2 overflow-hidden">
            {tokens.slice(0, 8).map((token, index) => {
              // Generate a gradient based on the token symbol for visual variety
              const gradientClass = index % 5 === 0 ? 'from-[#FF56F6] to-[#42A6E3]' :
                                   index % 5 === 1 ? 'from-[#42A6E3] to-[#FFD166]' :
                                   index % 5 === 2 ? 'from-[#FFD166] to-[#FF56F6]' :
                                   index % 5 === 3 ? 'from-[#00FF88] to-[#42A6E3]' :
                                                    'from-[#9F2FFF] to-[#42A6E3]';

              // Generate glow color based on gradient
              const glowColor = index % 5 === 0 ? 'rgba(255, 86, 246, 0.5)' :
                              index % 5 === 1 ? 'rgba(66, 166, 227, 0.5)' :
                              index % 5 === 2 ? 'rgba(255, 209, 102, 0.5)' :
                              index % 5 === 3 ? 'rgba(0, 255, 136, 0.5)' :
                                              'rgba(159, 47, 255, 0.5)';

              return (
                <motion.div
                  key={index}
                  className={`w-9 h-9 rounded-full bg-gradient-to-r ${gradientClass} flex items-center justify-center text-white text-xs font-bold ring-1 ring-black/30`}
                  title={`${token.symbol}: ${token.balance}`}
                  whileHover={{ scale: 1.15, y: -3 }}
                  animate={{
                    boxShadow: [
                      `0 0 3px ${glowColor}`,
                      `0 0 8px ${glowColor}`,
                      `0 0 3px ${glowColor}`
                    ]
                  }}
                  transition={{
                    scale: { type: 'spring', stiffness: 400, damping: 10 },
                    boxShadow: {
                      duration: 2 + (index * 0.2), // Slightly different timing for each token
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                >
                  <motion.div
                    animate={{
                      opacity: [0.9, 1, 0.9],
                      scale: [0.95, 1, 0.95]
                    }}
                    transition={{
                      duration: 1.5 + (index * 0.1),
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {token.symbol.substring(0, 2)}
                  </motion.div>
                </motion.div>
              );
            })}
            {tokens.length > 8 && (
              <motion.div
                className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center text-white text-xs font-bold ring-1 ring-black/30"
                whileHover={{ scale: 1.15, y: -3 }}
                animate={{
                  boxShadow: [
                    '0 0 3px rgba(255, 255, 255, 0.3)',
                    '0 0 8px rgba(255, 255, 255, 0.5)',
                    '0 0 3px rgba(255, 255, 255, 0.3)'
                  ]
                }}
                transition={{
                  scale: { type: 'spring', stiffness: 400, damping: 10 },
                  boxShadow: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                +{tokens.length - 8}
              </motion.div>
            )}
          </div>
        </div>
      ) : type === 'cold' && (
        <div className="mt-4">
          <div className="flex flex-col items-center">
            {/* Cold Wallet GIF */}
            <motion.div
              className="relative w-full h-48 mb-4 overflow-hidden rounded-lg bg-gradient-to-br from-[#00092C]/30 to-[#FF5F00]/30"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0.9 }}
              animate={{
                opacity: 1,
                boxShadow: [
                  '0 0 0px rgba(255, 95, 0, 0)',
                  '0 0 10px rgba(255, 95, 0, 0.3)',
                  '0 0 0px rgba(255, 95, 0, 0)'
                ]
              }}
              transition={{
                boxShadow: {
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHphYjRrdTcxdmhrdTdhaHdwcTBtZG50NmJkbHhldW5iZHVyNGRoMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/5s1eH45x8XVt81x83r/giphy.gif"
                  alt="Cold Wallet Animation"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
              <motion.div
                className="absolute bottom-2 left-2 text-white text-xs font-medium bg-black/30 px-2 py-1 rounded-full"
                animate={{
                  y: [0, -2, 0],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Secure Hardware Storage
              </motion.div>
            </motion.div>

            {/* Connect Button */}
            <motion.button
              className="w-full py-2.5 px-4 bg-gradient-to-r from-[#FF5F00] to-[#B20600] rounded-lg text-white font-medium flex items-center justify-center"
              whileHover={{ scale: 1.03, boxShadow: '0 0 15px rgba(255, 95, 0, 0.5)' }}
              whileTap={{ scale: 0.97 }}
              onClick={onConnectHardware}
              initial={{ opacity: 0.9 }}
              animate={{
                opacity: 1,
                boxShadow: [
                  '0 0 0px rgba(255, 95, 0, 0)',
                  '0 0 8px rgba(255, 95, 0, 0.3)',
                  '0 0 0px rgba(255, 95, 0, 0)'
                ]
              }}
              transition={{
                boxShadow: {
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }
              }}
            >
              <motion.div
                className="mr-2 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360, 0]
                }}
                transition={{
                  scale: { duration: 2, repeat: Infinity },
                  rotate: { duration: 4, repeat: Infinity }
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
              Connect via USB
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default WalletFrame;
