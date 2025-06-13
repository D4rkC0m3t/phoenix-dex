import React from 'react';
import { motion } from 'framer-motion';
import { switchNetwork } from '../services/provider';
import { MainnetIcon, TestnetIcon } from './Icons';

interface NetworkOption {
  id: number;
  name: string;
  icon: React.ReactNode;
  testnet: boolean;
}

interface SepoliaNetworkSwitcherProps {
  currentNetwork: string;
  onNetworkChange?: (networkName: string) => void;
}

const SepoliaNetworkSwitcher: React.FC<SepoliaNetworkSwitcherProps> = ({ 
  currentNetwork,
  onNetworkChange
}) => {
  // Network options
  const networks: NetworkOption[] = [
    {
      id: 1,
      name: 'Ethereum Mainnet',
      icon: <MainnetIcon size={20} />,
      testnet: false
    },
    {
      id: 11155111,
      name: 'Sepolia Testnet',
      icon: <TestnetIcon size={20} />,
      testnet: true
    }
  ];

  // Handle network switch
  const handleNetworkSwitch = async (network: NetworkOption) => {
    try {
      await switchNetwork(network.id);
      if (onNetworkChange) {
        onNetworkChange(network.name);
      }
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm text-gray-400 mb-2">Network</h3>
      <div className="gradient-border p-1 rounded-full inline-block">
        <div className="flex bg-[#000620] rounded-full overflow-hidden">
          {networks.map((network) => {
            const isActive = currentNetwork.includes(network.name);
            
            return (
              <motion.button
                key={network.id}
                className={`relative flex items-center space-x-2 px-4 py-2 ${
                  isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => handleNetworkSwitch(network)}
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                whileTap={{ scale: 0.98 }}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full opacity-20"
                    style={{ 
                      backgroundColor: network.testnet ? '#B20600' : '#FF5F00'
                    }}
                    layoutId="networkHighlight"
                    transition={{ type: 'spring', duration: 0.5 }}
                  />
                )}
                <div className="relative flex items-center space-x-2">
                  <motion.div
                    className="flex items-center justify-center"
                    animate={isActive ? 
                      { scale: [1, 1.05, 1], opacity: 1 } : 
                      { scale: 1, opacity: 0.7 }
                    }
                    transition={{ 
                      duration: 2,
                      repeat: isActive ? Infinity : 0,
                      ease: "easeInOut"
                    }}
                  >
                    {network.icon}
                  </motion.div>
                  <span className="text-sm font-medium relative z-10">
                    {network.testnet ? 'Sepolia' : 'Mainnet'}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
      
      {/* Testnet Warning */}
      {currentNetwork.includes('Sepolia') && (
        <motion.div 
          className="mt-2 p-2 bg-[#B20600]/20 border border-[#B20600]/30 rounded-lg text-xs text-[#B20600]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>You are connected to Sepolia Testnet. Transactions will not use real ETH.</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SepoliaNetworkSwitcher;
