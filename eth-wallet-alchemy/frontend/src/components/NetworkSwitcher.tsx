import { motion } from 'framer-motion';
import type { NetworkSwitcherProps } from '../types';
import { MainnetIcon, TestnetIcon } from './Icons';

const NetworkSwitcher: React.FC<NetworkSwitcherProps> = ({ currentNetwork, onNetworkChange }) => {
  interface NetworkType {
    id: string;
    name: string;
    color: string;
    icon: (isActive: boolean) => React.ReactNode;
  }

  const networks: NetworkType[] = [
    {
      id: 'ethereum',
      name: 'Ethereum Main',
      color: 'var(--color-accent-2)',
      icon: (isActive: boolean) => <MainnetIcon size={20} animate={isActive} />
    },
    {
      id: 'sepolia',
      name: 'Sepolia',
      color: 'var(--color-accent-3)',
      icon: (isActive: boolean) => <TestnetIcon size={20} animate={isActive} />
    }
  ];

  return (
    <div className="gradient-border p-1 rounded-full inline-block mb-6">
      <div className="flex bg-[#1E293B] rounded-full overflow-hidden">
        {networks.map(network => (
          <motion.button
            key={network.id}
            className={`relative flex items-center space-x-2 px-6 py-2 ${
              currentNetwork === network.id
                ? 'text-white'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => onNetworkChange(network.id)}
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            whileTap={{ scale: 0.98 }}
          >
            {currentNetwork === network.id && (
              <motion.div
                className="absolute inset-0 rounded-full opacity-20"
                style={{ backgroundColor: network.color }}
                layoutId="networkHighlight"
                transition={{ type: 'spring', duration: 0.5 }}
              />
            )}
            <div className="relative flex items-center space-x-2">
              <motion.div
                className="flex items-center justify-center"
                animate={currentNetwork === network.id ?
                  { scale: [1, 1.05, 1], opacity: 1 } :
                  { scale: 1, opacity: 0.7 }
                }
                transition={{
                  duration: 2,
                  repeat: currentNetwork === network.id ? Infinity : 0,
                  ease: "easeInOut"
                }}
              >
                {network.icon(currentNetwork === network.id)}
              </motion.div>
              <span className="text-sm font-medium relative z-10">{network.name}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default NetworkSwitcher;
