import { useState } from 'react';
import { motion } from 'framer-motion';
import type { HardwareWalletCardProps } from '../types';

const HardwareWalletCard: React.FC<HardwareWalletCardProps> = ({
  name,
  price,
  oldPrice,
  image,
  description,
  badge,
  color = 'blue',
  onConnect
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Define color schemes based on the color prop
  const getColorScheme = () => {
    switch (color) {
      case 'pink':
        return {
          gradient: 'from-[#FF56F6] to-[#FF56F6]/70',
          bgLight: 'rgba(255, 86, 246, 0.1)',
          textColor: '#FF56F6',
          badgeBg: 'bg-[#FF56F6]'
        };
      case 'yellow':
        return {
          gradient: 'from-[#FFD166] to-[#FFD166]/70',
          bgLight: 'rgba(255, 209, 102, 0.1)',
          textColor: '#FFD166',
          badgeBg: 'bg-[#FFD166]'
        };
      case 'green':
        return {
          gradient: 'from-[#00FF88] to-[#00FF88]/70',
          bgLight: 'rgba(0, 255, 136, 0.1)',
          textColor: '#00FF88',
          badgeBg: 'bg-[#00FF88]'
        };
      case 'purple':
        return {
          gradient: 'from-[#9F2FFF] to-[#9F2FFF]/70',
          bgLight: 'rgba(159, 47, 255, 0.1)',
          textColor: '#9F2FFF',
          badgeBg: 'bg-[#9F2FFF]'
        };
      default: // blue
        return {
          gradient: 'from-[#42A6E3] to-[#42A6E3]/70',
          bgLight: 'rgba(66, 166, 227, 0.1)',
          textColor: '#42A6E3',
          badgeBg: 'bg-[#42A6E3]'
        };
    }
  };

  const colorScheme = getColorScheme();

  return (
    <motion.div
      className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden h-full"
      whileHover={{
        borderColor: 'rgba(255, 255, 255, 0.3)',
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Badge */}
      {badge && (
        <div className={`absolute top-3 left-3 ${colorScheme.badgeBg} text-black text-xs font-bold px-2 py-1 rounded-md z-10`}>
          {badge}
        </div>
      )}

      {/* Image container with gradient overlay */}
      <div className="relative h-48 overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0F172A] opacity-70 z-10"
        />

        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -rotate-45 z-0 animate-pulse" />

        <motion.div
          className="w-full h-full flex items-center justify-center p-2 relative z-1"
          animate={{
            scale: isHovered ? 1.1 : 1,
            y: isHovered ? -8 : 0,
            rotateY: isHovered ? 5 : 0
          }}
          transition={{
            duration: 0.5,
            ease: "easeOut"
          }}
        >
          <img
            src={image}
            alt={name}
            className="max-w-full max-h-full object-contain drop-shadow-2xl"
            style={{
              filter: isHovered ? 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))' : 'none'
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMxRTI5M0IiLz48cGF0aCBkPSJNODUgNzBIMTE1VjEzMEg4NVY3MFoiIGZpbGw9IiM0MkE2RTMiLz48cGF0aCBkPSJNNzAgODVIMTMwVjExNUg3MFY4NVoiIGZpbGw9IiNGRjU2RjYiLz48L3N2Zz4=';
            }}
          />
        </motion.div>

        {/* Animated glow effect */}
        <motion.div
          className="absolute -inset-[100px] bg-gradient-to-r from-transparent via-white/5 to-transparent -rotate-45 z-0"
          animate={{
            x: isHovered ? ['-100%', '200%'] : '-100%'
          }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            repeat: isHovered ? Infinity : 0,
            repeatDelay: 0.5
          }}
        />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-inter font-semibold text-lg mb-1">{name}</h3>

        <p className="text-gray-400 text-sm mb-4 line-clamp-2 h-10">
          {description}
        </p>

        <div className="flex justify-between items-center mb-4">
          <div className="text-xs text-white/70 bg-black/30 px-3 py-1.5 rounded-full flex items-center">
            <motion.div
              className="w-2 h-2 rounded-full bg-green-500 mr-2"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            Available
          </div>

          <div className="text-xs text-white/70 bg-black/30 px-3 py-1.5 rounded-full">
            Secure Storage
          </div>
        </div>

        <motion.button
          className={`w-full py-2 rounded-lg flex items-center justify-center font-medium ${
            isHovered
              ? `bg-gradient-to-r ${colorScheme.gradient} text-white`
              : 'bg-white/5 border border-white/10 text-white'
          }`}
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{ scale: 0.95 }}
          onClick={onConnect}
        >
          <span className="mr-2">🔌</span>
          Connect via USB
        </motion.button>
      </div>
    </motion.div>
  );
};

export default HardwareWalletCard;
