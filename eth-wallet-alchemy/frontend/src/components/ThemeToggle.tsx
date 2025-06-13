import { useState } from 'react';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  className?: string;
}

const sunPath = 'M12 16 L16 12 L12 8 L8 12 Z';
const moonPath = 'M12 16 C16 16 20 12 20 8 C16 8 12 12 12 16 Z';

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const [isDark, setIsDark] = useState<boolean>(true);
  
  // Toggle theme function
  const toggleTheme = () => {
    setIsDark(!isDark);
    // In a real implementation, this would update CSS variables or classes
    // For now, we'll just toggle the state for demonstration
  };
  
  return (
    <motion.button
      className={`relative w-12 h-6 rounded-full p-1 ${className}`}
      style={{
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.2)'
      }}
      onClick={toggleTheme}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute w-4 h-4 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: isDark ? 'var(--color-accent-2)' : 'var(--color-accent-3)'
        }}
        animate={{
          x: isDark ? 0 : 24
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30
        }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <motion.path
            d={isDark ? moonPath : sunPath}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </svg>
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
