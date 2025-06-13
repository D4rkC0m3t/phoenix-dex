import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ModalProps } from '../types';

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  // Close modal on escape key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);

    // Prevent scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur effect */}
          <motion.div
            className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-md z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Modal container */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Modal content with gradient border */}
            <motion.div
              className="relative max-w-md w-full"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 300,
                delay: 0.1
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Animated gradient border */}
              <motion.div
                className="absolute -inset-0.5 rounded-xl opacity-50 z-0"
                style={{
                  background: 'linear-gradient(90deg, var(--color-accent-1), var(--color-accent-2), var(--color-accent-3), var(--color-accent-2), var(--color-accent-1))',
                  backgroundSize: '200% 100%'
                }}
                animate={{
                  backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />

              {/* Close button */}
              <motion.button
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 z-10"
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>

              {/* Content container */}
              <div className="relative z-1 bg-[#1E293B] rounded-xl overflow-hidden">
                {children}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
