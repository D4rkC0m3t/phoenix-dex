import { motion } from 'framer-motion';

const ActionButton = ({ icon, label, onClick, primary = false }) => {
  return (
    <motion.button
      className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg ${
        primary 
          ? 'bg-safety-green text-dark-space-gray font-medium' 
          : 'bg-ethereum-purple/20 text-white hover:bg-ethereum-purple/30'
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      <span>{label}</span>
    </motion.button>
  );
};

export default ActionButton;
