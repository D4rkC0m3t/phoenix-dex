import { motion } from 'framer-motion';
import type { ActionButtonProps } from '../types';

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  label,
  onClick,
  primary = false,
  type = 'button',
  disabled = false,
  className = ''
}) => {
  return (
    <motion.button
      type={type}
      className={`relative flex items-center justify-center space-x-2 px-5 py-2.5 rounded-full
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      style={{
        background: primary
          ? 'linear-gradient(90deg, var(--color-accent-2), var(--color-accent-1))'
          : 'rgba(255, 255, 255, 0.05)',
        boxShadow: primary
          ? '0 4px 12px rgba(66, 166, 227, 0.3)'
          : '0 2px 8px rgba(0, 0, 0, 0.1)',
        border: primary
          ? 'none'
          : '1px solid rgba(255, 255, 255, 0.1)',
        color: primary ? '#FFFFFF' : '#FFFFFF'
      }}
      onClick={onClick}
      whileHover={{
        scale: disabled ? 1 : 1.03,
        boxShadow: primary
          ? '0 6px 16px rgba(66, 166, 227, 0.4)'
          : '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      disabled={disabled}
    >
      {icon && <span className="w-5 h-5 mr-2">{icon}</span>}
      <span className="font-medium">{label}</span>
    </motion.button>
  );
};

export default ActionButton;
