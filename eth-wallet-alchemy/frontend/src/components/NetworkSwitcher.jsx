import { motion } from 'framer-motion';

const NetworkSwitcher = ({ currentNetwork, onNetworkChange }) => {
  const networks = [
    { id: 'mainnet', name: 'Mainnet', color: 'bg-safety-green' },
    { id: 'sepolia', name: 'Sepolia', color: 'bg-yellow-400' }
  ];
  
  return (
    <div className="flex items-center space-x-4 mb-6">
      {networks.map(network => (
        <motion.button
          key={network.id}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
            currentNetwork === network.id 
              ? 'bg-white/10 border border-white/20' 
              : 'bg-transparent hover:bg-white/5'
          }`}
          onClick={() => onNetworkChange(network.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className={`w-2 h-2 rounded-full ${network.color} ${
            currentNetwork === network.id ? 'animate-pulse-slow' : ''
          }`} />
          <span className="text-sm font-medium">{network.name}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default NetworkSwitcher;
