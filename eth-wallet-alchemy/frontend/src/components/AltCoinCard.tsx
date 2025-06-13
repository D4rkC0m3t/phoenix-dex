import { motion } from 'framer-motion';
import type { AltCoinCardProps } from '../types';

const AltCoinCard: React.FC<AltCoinCardProps> = ({
  name,
  symbol,
  balance,
  value,
  change,
  icon,
  color = 'blue'
}) => {
  // Define color schemes based on the color prop
  const getColorScheme = () => {
    switch (color) {
      case 'pink':
        return {
          gradient: 'from-[#FF56F6] to-[#FF56F6]/70',
          bgLight: 'rgba(255, 86, 246, 0.1)',
          textColor: '#FF56F6'
        };
      case 'yellow':
        return {
          gradient: 'from-[#FFD166] to-[#FFD166]/70',
          bgLight: 'rgba(255, 209, 102, 0.1)',
          textColor: '#FFD166'
        };
      case 'green':
        return {
          gradient: 'from-[#00FF88] to-[#00FF88]/70',
          bgLight: 'rgba(0, 255, 136, 0.1)',
          textColor: '#00FF88'
        };
      case 'purple':
        return {
          gradient: 'from-[#9F2FFF] to-[#9F2FFF]/70',
          bgLight: 'rgba(159, 47, 255, 0.1)',
          textColor: '#9F2FFF'
        };
      default: // blue
        return {
          gradient: 'from-[#42A6E3] to-[#42A6E3]/70',
          bgLight: 'rgba(66, 166, 227, 0.1)',
          textColor: '#42A6E3'
        };
    }
  };
  
  const colorScheme = getColorScheme();
  
  // Format the change value with + or - sign
  const formattedChange = change >= 0 ? `+${change}%` : `${change}%`;
  const changeColor = change >= 0 ? 'text-[#00FF88]' : 'text-[#FF5656]';
  
  return (
    <motion.div
      className="bg-white bg-opacity-5 backdrop-blur-sm border border-white/5 rounded-xl p-4 hover:border-white/10"
      whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.07)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div 
            className={`w-10 h-10 rounded-full bg-gradient-to-br ${colorScheme.gradient} flex items-center justify-center text-white font-bold`}
          >
            {icon || symbol.substring(0, 1)}
          </div>
          <div className="ml-3">
            <h3 className="font-inter font-medium text-white">{name}</h3>
            <p className="text-xs text-gray-400">{symbol}</p>
          </div>
        </div>
        
        <div className={`text-xs ${changeColor} bg-black/20 px-2 py-1 rounded-full`}>
          {formattedChange}
        </div>
      </div>
      
      <div className="flex justify-between items-end">
        <div>
          <div className="text-xs text-gray-400 mb-1">Balance</div>
          <div className="text-mono font-medium">
            {balance} <span className="text-gray-400">{symbol}</span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-xs text-gray-400 mb-1">Value</div>
          <div className="font-inter font-medium" style={{ color: colorScheme.textColor }}>
            ${value}
          </div>
        </div>
      </div>
      
      {/* Simple chart visualization */}
      <div className="mt-3 h-1 bg-black/20 rounded-full overflow-hidden">
        <motion.div 
          className={`h-full bg-gradient-to-r ${colorScheme.gradient}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(Math.abs(change) * 2, 100)}%` }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>
    </motion.div>
  );
};

export default AltCoinCard;
