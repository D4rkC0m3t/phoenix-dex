import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingActionMenu = ({ actions }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleMenu = () => setIsOpen(!isOpen);
  
  const handleAction = (action) => {
    action.onClick();
    setIsOpen(false);
  };
  
  return (
    <div className="fixed bottom-8 right-8">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="absolute bottom-16 right-0 space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {actions.map((action, index) => (
              <motion.button
                key={action.label}
                className="flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-dark-space-gray border border-white/10 text-white w-full"
                onClick={() => handleAction(action)}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                {action.icon && <span className="w-5 h-5">{action.icon}</span>}
                <span>{action.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        className="w-12 h-12 rounded-full bg-safety-green text-dark-space-gray flex items-center justify-center shadow-lg"
        onClick={toggleMenu}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-6 w-6 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </motion.button>
    </div>
  );
};

export default FloatingActionMenu;
