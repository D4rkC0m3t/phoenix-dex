import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CopyButton from './CopyButton';
import PhoenixBird from './PhoenixBird';

interface TokenData {
  name: string;
  symbol: string;
  balance: string;
  value: string;
  change: number;
  logo?: string;
}

interface HotWalletCardProps {
  balance: string;
  balanceUsd: string;
  changePercent: string;
  tokens: TokenData[];
  onSend?: () => void;
  onReceive?: () => void;
  onBuy?: () => void;
}

const networks = [
  { id: 'ethereum', name: 'Ethereum Main', icon: '🌐' },
  { id: 'sepolia', name: 'Sepolia Testnet', icon: '🧪' },
  { id: 'goerli', name: 'Goerli Testnet', icon: '🔍' },
  { id: 'polygon', name: 'Polygon', icon: '🟣' },
  { id: 'arbitrum', name: 'Arbitrum', icon: '🔵' }
];

const HotWalletCard: React.FC<HotWalletCardProps> = ({
  balance,
  balanceUsd,
  changePercent,
  tokens,
  onSend = () => {},
  onReceive = () => {},
  onBuy = () => {}
}) => {
  const [activeTab, setActiveTab] = useState<'tokens' | 'collectibles'>('tokens');
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(networks[0]);
  const [tokenPriceUpdates, setTokenPriceUpdates] = useState<Record<string, boolean>>({});

  // Simulate real-time price updates with varying frequencies
  useEffect(() => {
    // Function to update a random token
    const updateRandomToken = () => {
      // Select 1-2 random tokens to update simultaneously
      const numTokensToUpdate = Math.random() > 0.7 ? 2 : 1;
      const updatedTokens = new Set();

      for (let i = 0; i < numTokensToUpdate; i++) {
        if (tokens.length > 0) {
          // Ensure we don't select the same token twice
          let randomIndex;
          do {
            randomIndex = Math.floor(Math.random() * tokens.length);
          } while (updatedTokens.has(randomIndex) && updatedTokens.size < tokens.length);

          if (updatedTokens.size < tokens.length) {
            updatedTokens.add(randomIndex);
            const randomToken = tokens[randomIndex];

            setTokenPriceUpdates(prev => ({
              ...prev,
              [randomToken.symbol]: true
            }));

            // Reset the update indicator after animation
            setTimeout(() => {
              setTokenPriceUpdates(prev => ({
                ...prev,
                [randomToken.symbol]: false
              }));
            }, 1200);
          }
        }
      }
    };

    // Initial update after a short delay
    const initialTimeout = setTimeout(() => {
      updateRandomToken();
    }, 1500);

    // Set up interval with varying times between updates
    let intervalId: NodeJS.Timeout;
    const scheduleNextUpdate = () => {
      // Random interval between 1.5 and 4 seconds
      const nextUpdateTime = 1500 + Math.random() * 2500;
      intervalId = setTimeout(() => {
        updateRandomToken();
        scheduleNextUpdate(); // Schedule the next update
      }, nextUpdateTime);
    };

    scheduleNextUpdate();

    // Clean up all timeouts
    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(intervalId);
    };
  }, [tokens]);

  return (
    <motion.div
      className="h-full rounded-xl overflow-hidden bg-gradient-to-br from-[#18181b] to-[#121212] text-slate-100 shadow-xl border border-gray-800 flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-2 flex justify-between items-center">
        <div className="relative">
          <div
            className="flex items-center cursor-pointer gap-x-2"
            onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
          >
            <PhoenixBird />
            <span className="ml-2 text-sm font-medium">{selectedNetwork.name}</span>
            <motion.svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ml-1"
              animate={{ rotate: showNetworkDropdown ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </motion.svg>
          </div>

          {/* Network dropdown */}
          <AnimatePresence>
            {showNetworkDropdown && (
              <motion.div
                className="absolute top-full left-0 mt-1 bg-[#1E1E1E] rounded-lg shadow-lg z-10 w-48 overflow-hidden"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {networks.map((network) => (
                  <motion.div
                    key={network.id}
                    className={`px-4 py-2 flex items-center cursor-pointer hover:bg-[#2A2A2A] ${
                      selectedNetwork.id === network.id ? 'bg-[#2A2A2A]' : ''
                    }`}
                    onClick={() => {
                      setSelectedNetwork(network);
                      setShowNetworkDropdown(false);
                    }}
                    whileHover={{ x: 5 }}
                  >
                    <span className="mr-2">{network.icon}</span>
                    <span className="text-sm">{network.name}</span>
                    {selectedNetwork.id === network.id && (
                      <motion.div
                        className="ml-auto w-2 h-2 rounded-full bg-green-500"
                        layoutId="network-indicator"
                      />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center">
          {/* Network indicator */}
          <div className="flex items-center bg-[#1E1E1E] px-2 py-1 rounded-full">
            <motion.div
              className="w-2 h-2 rounded-full bg-green-500 mr-1"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-xs">Online</span>
          </div>
        </div>
      </div>

      {/* Balance */}
      <div className="px-4 pt-2 pb-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 px-6 pt-4 pb-6">
          <div>
            <div className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              {balance}
              <span className="text-base font-medium text-slate-400">ETH</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">≈ ${balanceUsd} USD</div>
          </div>
          <div className="flex gap-2 mt-2 md:mt-0">
            <button
              className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow transition min-w-[90px]"
              onClick={onSend}
            >
              Send
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow transition min-w-[90px]"
              onClick={onReceive}
            >
              Receive
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold shadow transition min-w-[90px]"
              onClick={onBuy}
            >
              Buy
            </button>
              {/* Ethereum logo */}
              <motion.svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                initial={{ opacity: 0.8 }}
                animate={{
                  opacity: [0.8, 1, 0.8],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <path d="M32 8C18.7452 8 8 18.7452 8 32C8 45.2548 18.7452 56 32 56C45.2548 56 56 45.2548 56 32C56 18.7452 45.2548 8 32 8Z" fill="#4ADE80" fillOpacity="0.1"/>
                <path d="M32 8C18.7452 8 8 18.7452 8 32C8 45.2548 18.7452 56 32 56C45.2548 56 56 45.2548 56 32C56 18.7452 45.2548 8 32 8Z" stroke="#4ADE80" strokeWidth="2"/>
                <path d="M32 16C23.1634 16 16 23.1634 16 32C16 40.8366 23.1634 48 32 48C40.8366 48 48 40.8366 48 32C48 23.1634 40.8366 16 32 16Z" fill="#4ADE80" fillOpacity="0.2"/>
                <path d="M32 24C27.5817 24 24 27.5817 24 32C24 36.4183 27.5817 40 32 40C36.4183 40 40 36.4183 40 32C40 27.5817 36.4183 24 32 24Z" fill="#4ADE80" fillOpacity="0.3"/>

                {/* Ethereum symbol */}
                <path d="M32 14L32 34L42 26L32 14Z" fill="#4ADE80" fillOpacity="0.7"/>
                <path d="M32 14L22 26L32 34L32 14Z" fill="#4ADE80" fillOpacity="0.5"/>
                <path d="M32 36L32 50L42 28L32 36Z" fill="#4ADE80" fillOpacity="0.7"/>
                <path d="M32 50L32 36L22 28L32 50Z" fill="#4ADE80" fillOpacity="0.5"/>
              </motion.svg>

              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  boxShadow: '0 0 20px rgba(74, 222, 128, 0.3)',
                  opacity: 0.5
                }}
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-2 md:mt-0 px-6 pb-6">
          <motion.button
            className="flex-1 bg-[#1E1E1E] hover:bg-[#2A2A2A] rounded-lg py-2 flex items-center justify-center"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onSend}
          >
            <motion.div
              className="flex items-center justify-center"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 text-yellow-500"
                animate={{ y: [0, -1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
              >
                <path d="M12 19L12 5M12 5L5 12M12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </motion.svg>
              <span>Send</span>
            </motion.div>
          </motion.button>

        <motion.button
          className="flex-1 bg-[#1E1E1E] hover:bg-[#2A2A2A] rounded-lg py-2 flex items-center justify-center"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onReceive}
        >
          <motion.div
            className="flex items-center justify-center"
            whileHover={{ y: 2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 text-blue-500"
              animate={{ y: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            >
              <path d="M12 5L12 19M12 19L19 12M12 19L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </motion.svg>
            <span>Receive</span>
          </motion.div>
        </motion.button>

        <motion.button
          className="flex-1 bg-[#1E1E1E] hover:bg-[#2A2A2A] rounded-lg py-2 flex items-center justify-center"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onBuy}
        >
          <motion.div
            className="flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 text-purple-500"
              animate={{
                rotate: [0, 5, 0, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            >
              <path d="M16 3H8C6.89543 3 6 3.89543 6 5V19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19V5C18 3.89543 17.1046 3 16 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 17V17.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </motion.svg>
            <span>Buy</span>
          </motion.div>
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="border-t border-[#2A2A2A] px-4 pt-2">
        <div className="flex">
          <button
            className={`pb-2 px-4 text-sm font-medium ${activeTab === 'tokens' ? 'text-white border-b-2 border-[#4ADE80]' : 'text-gray-400'}`}
            onClick={() => setActiveTab('tokens')}
          >
            Token
          </button>
          <button
            className={`pb-2 px-4 text-sm font-medium ${activeTab === 'collectibles' ? 'text-white border-b-2 border-[#4ADE80]' : 'text-gray-400'}`}
            onClick={() => setActiveTab('collectibles')}
          >
            Collectibles
          </button>
        </div>
      </div>

      {/* Token list */}
      {activeTab === 'tokens' && (
        <div className="px-4 py-2">
          {tokens.map((token, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-between py-3 border-b border-[#2A2A2A] last:border-b-0"
              animate={tokenPriceUpdates[token.symbol] ? { backgroundColor: 'rgba(74, 222, 128, 0.05)' } : { backgroundColor: 'transparent' }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center">
                <motion.div
                  className="w-8 h-8 rounded-full bg-[#2A2A2A] flex items-center justify-center overflow-hidden relative"
                  whileHover={{ scale: 1.1 }}
                  animate={tokenPriceUpdates[token.symbol] ?
                    { boxShadow: ['0 0 0px rgba(255, 255, 255, 0)', '0 0 8px rgba(255, 255, 255, 0.5)', '0 0 0px rgba(255, 255, 255, 0)'] } :
                    {}
                  }
                  transition={{ duration: 1 }}
                >
                  {/* Animated background for real-time effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#2A2A2A] via-[#3A3A3A] to-[#2A2A2A]"
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />

                  {/* Pulse effect when price updates */}
                  {tokenPriceUpdates[token.symbol] && (
                    <motion.div
                      className="absolute inset-0 bg-white rounded-full"
                      initial={{ opacity: 0.7, scale: 0.5 }}
                      animate={{ opacity: 0, scale: 1.5 }}
                      transition={{ duration: 0.8 }}
                    />
                  )}

                  {token.logo ? (
                    <motion.div className="relative z-10 flex items-center justify-center">
                      <motion.img
                        src={token.logo}
                        alt={token.name}
                        className="w-6 h-6"
                        animate={tokenPriceUpdates[token.symbol] ?
                          { scale: [1, 1.15, 1], rotate: [0, 5, 0, -5, 0] } :
                          { rotate: [0, 0.5, 0, -0.5, 0] }
                        }
                        transition={tokenPriceUpdates[token.symbol] ?
                          { duration: 0.8 } :
                          { duration: 5, repeat: Infinity, ease: "linear" }
                        }
                      />

                      {/* Subtle continuous glow */}
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{
                          boxShadow: token.change >= 0 ?
                            '0 0 5px rgba(74, 222, 128, 0.5)' :
                            '0 0 5px rgba(239, 68, 68, 0.5)',
                          opacity: 0.5
                        }}
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      className="relative z-10 w-6 h-6 rounded-full bg-gradient-to-r from-[#FF5F00] to-[#B20600] flex items-center justify-center"
                      animate={tokenPriceUpdates[token.symbol] ?
                        { scale: [1, 1.15, 1], rotate: [0, 5, 0, -5, 0] } :
                        { rotate: [0, 1, 0, -1, 0] }
                      }
                      transition={tokenPriceUpdates[token.symbol] ?
                        { duration: 0.8 } :
                        { duration: 5, repeat: Infinity, ease: "linear" }
                      }
                    >
                      <span className="text-xs font-bold">{token.symbol.substring(0, 2)}</span>

                      {/* Subtle continuous glow */}
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{
                          boxShadow: token.change >= 0 ?
                            '0 0 5px rgba(255, 95, 0, 0.5)' :
                            '0 0 5px rgba(178, 6, 0, 0.5)',
                          opacity: 0.5
                        }}
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      />
                    </motion.div>
                  )}
                </motion.div>
                <div className="ml-3">
                  <motion.div
                    className="font-medium"
                    animate={tokenPriceUpdates[token.symbol] ?
                      { color: token.change >= 0 ? '#FFFFFF' : '#FFFFFF', scale: [1, 1.02, 1] } :
                      {}
                    }
                    transition={{ duration: 0.5 }}
                  >
                    {token.name}
                  </motion.div>
                  <motion.div
                    className="text-xs text-gray-400 flex items-center"
                    animate={tokenPriceUpdates[token.symbol] ?
                      { color: token.change >= 0 ? '#4ADE80' : '#EF4444' } :
                      {}
                    }
                    transition={{ duration: 0.5 }}
                  >
                    <span className="mr-1">$</span>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={`${token.symbol}-${tokenPriceUpdates[token.symbol] ? 'updating' : 'static'}`}
                        initial={tokenPriceUpdates[token.symbol] ? { opacity: 0, y: -10 } : {}}
                        animate={tokenPriceUpdates[token.symbol] ? { opacity: 1, y: 0 } : {}}
                        exit={tokenPriceUpdates[token.symbol] ? { opacity: 0, y: 10 } : {}}
                        transition={{ duration: 0.2 }}
                      >
                        {token.value}
                      </motion.span>
                    </AnimatePresence>

                    {/* Live indicator dot */}
                    {tokenPriceUpdates[token.symbol] && (
                      <motion.div
                        className="ml-1 w-1 h-1 rounded-full bg-green-500"
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.5, repeat: 3 }}
                      />
                    )}
                  </motion.div>
                </div>
              </div>
              <div className="text-right">
                <motion.div
                  className="font-medium flex items-center justify-end"
                  animate={tokenPriceUpdates[token.symbol] ?
                    { scale: [1, 1.02, 1] } :
                    {}
                  }
                  transition={{ duration: 0.5 }}
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={`${token.symbol}-balance-${tokenPriceUpdates[token.symbol] ? 'updating' : 'static'}`}
                      initial={tokenPriceUpdates[token.symbol] ? { opacity: 0, x: -5 } : {}}
                      animate={tokenPriceUpdates[token.symbol] ? { opacity: 1, x: 0 } : {}}
                      exit={tokenPriceUpdates[token.symbol] ? { opacity: 0, x: 5 } : {}}
                      transition={{ duration: 0.2 }}
                    >
                      {token.balance}
                    </motion.span>
                  </AnimatePresence>
                  <span className="ml-1">{token.symbol}</span>
                </motion.div>

                <motion.div
                  className={`text-xs flex items-center justify-end ${token.change >= 0 ? 'text-green-500' : 'text-red-500'}`}
                  animate={tokenPriceUpdates[token.symbol] ?
                    { scale: [1, 1.1, 1], x: [0, 2, 0] } :
                    {}
                  }
                  transition={{ duration: 0.5 }}
                >
                  {/* Arrow indicator */}
                  <motion.span
                    className="mr-1"
                    animate={tokenPriceUpdates[token.symbol] ?
                      { y: token.change >= 0 ? [0, -2, 0] : [0, 2, 0] } :
                      {}
                    }
                    transition={{ duration: 0.5, repeat: 1 }}
                  >
                    {token.change >= 0 ? '↑' : '↓'}
                  </motion.span>

                  {/* Percentage */}
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={`${token.symbol}-change-${tokenPriceUpdates[token.symbol] ? 'updating' : 'static'}`}
                      initial={tokenPriceUpdates[token.symbol] ? { opacity: 0, y: token.change >= 0 ? 5 : -5 } : {}}
                      animate={tokenPriceUpdates[token.symbol] ? { opacity: 1, y: 0 } : {}}
                      exit={tokenPriceUpdates[token.symbol] ? { opacity: 0, y: token.change >= 0 ? -5 : 5 } : {}}
                      transition={{ duration: 0.2 }}
                    >
                      {token.change >= 0 ? '+' : ''}{token.change}%
                    </motion.span>
                  </AnimatePresence>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Collectibles tab (empty for now) */}
      {activeTab === 'collectibles' && (
        <div className="px-4 py-8 text-center text-gray-400">
          <p>No collectibles found</p>
        </div>
      )}
    </motion.div>
  );
};

export default HotWalletCard;
