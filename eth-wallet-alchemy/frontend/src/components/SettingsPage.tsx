import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ThemeSettings from './ThemeSettings';
import SecuritySettings from './SecuritySettings';
import GeneralSettings from './GeneralSettings';
import { initializeSettings } from '../services/settingsService';

type SettingsTab = 'general' | 'security' | 'theme' | 'advanced';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [settingsUpdated, setSettingsUpdated] = useState<boolean>(false);

  // Initialize settings on mount
  useEffect(() => {
    initializeSettings();
  }, []);

  // Handle settings update
  const handleSettingsUpdate = () => {
    setSettingsUpdated(true);
    
    // Reset the notification after a delay
    setTimeout(() => {
      setSettingsUpdated(false);
    }, 3000);
  };

  // Tab options
  const tabOptions: { value: SettingsTab; label: string; icon: string }[] = [
    { value: 'general', label: 'General', icon: '⚙️' },
    { value: 'security', label: 'Security', icon: '🔒' },
    { value: 'theme', label: 'Theme', icon: '🎨' },
    { value: 'advanced', label: 'Advanced', icon: '🔧' }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-display">Settings</h1>
        
        {/* Settings Updated Notification */}
        <AnimatedNotification 
          show={settingsUpdated} 
          message="Settings updated successfully" 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="glass-card p-4">
            <nav className="space-y-1">
              {tabOptions.map((tab) => (
                <motion.button
                  key={tab.value}
                  className={`w-full p-3 rounded-lg flex items-center ${
                    activeTab === tab.value 
                      ? 'bg-[var(--color-accent-1)]/20 text-white' 
                      : 'text-gray-400 hover:bg-white/5'
                  }`}
                  onClick={() => setActiveTab(tab.value)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="mr-3">{tab.icon}</span>
                  <span>{tab.label}</span>
                </motion.button>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Content */}
        <div className="md:col-span-3">
          <div className="glass-card p-6">
            {activeTab === 'general' && (
              <GeneralSettings onUpdate={handleSettingsUpdate} />
            )}
            
            {activeTab === 'security' && (
              <SecuritySettings onUpdate={handleSettingsUpdate} />
            )}
            
            {activeTab === 'theme' && (
              <ThemeSettings onUpdate={handleSettingsUpdate} />
            )}
            
            {activeTab === 'advanced' && (
              <AdvancedSettings onUpdate={handleSettingsUpdate} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Animated notification component
interface AnimatedNotificationProps {
  show: boolean;
  message: string;
}

const AnimatedNotification: React.FC<AnimatedNotificationProps> = ({ show, message }) => {
  return (
    <motion.div
      className="bg-[var(--color-accent-1)]/20 border border-[var(--color-accent-1)]/30 text-white px-4 py-2 rounded-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ 
        opacity: show ? 1 : 0, 
        y: show ? 0 : -20,
        pointerEvents: show ? 'auto' : 'none'
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center">
        <svg className="w-5 h-5 mr-2 text-[var(--color-accent-1)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        {message}
      </div>
    </motion.div>
  );
};

// Advanced Settings component
interface AdvancedSettingsProps {
  onUpdate?: () => void;
}

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({ onUpdate }) => {
  const [customRPC, setCustomRPC] = useState<string>('');
  const [slippageTolerance, setSlippageTolerance] = useState<number>(0.5);
  const [transactionDeadline, setTransactionDeadline] = useState<number>(20);
  const [showHexData, setShowHexData] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load settings
  useEffect(() => {
    const settings = getSettings();
    setCustomRPC(settings.advanced.customRPC);
    setSlippageTolerance(settings.advanced.slippageTolerance);
    setTransactionDeadline(settings.advanced.transactionDeadline);
    setShowHexData(settings.advanced.showHexData);
    setIsLoading(false);
  }, []);

  // Handle custom RPC change
  const handleCustomRPCChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCustomRPC(value);
    updateSettings({ 
      advanced: { 
        customRPC: value,
        slippageTolerance,
        transactionDeadline,
        showHexData
      } 
    });
    if (onUpdate) onUpdate();
  };

  // Handle slippage tolerance change
  const handleSlippageToleranceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    setSlippageTolerance(value);
    updateSettings({ 
      advanced: { 
        customRPC,
        slippageTolerance: value,
        transactionDeadline,
        showHexData
      } 
    });
    if (onUpdate) onUpdate();
  };

  // Handle transaction deadline change
  const handleTransactionDeadlineChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setTransactionDeadline(value);
    updateSettings({ 
      advanced: { 
        customRPC,
        slippageTolerance,
        transactionDeadline: value,
        showHexData
      } 
    });
    if (onUpdate) onUpdate();
  };

  // Handle show hex data change
  const handleShowHexDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setShowHexData(checked);
    updateSettings({ 
      advanced: { 
        customRPC,
        slippageTolerance,
        transactionDeadline,
        showHexData: checked
      } 
    });
    if (onUpdate) onUpdate();
  };

  // Import settings for type checking
  function getSettings() {
    return {
      advanced: {
        customRPC: '',
        slippageTolerance: 0.5,
        transactionDeadline: 20,
        showHexData: false
      }
    };
  }

  function updateSettings(settings: any) {
    // This is just a stub for type checking
    console.log(settings);
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Advanced Settings</h2>
      
      {isLoading ? (
        <div className="flex justify-center py-4">
          <motion.div
            className="w-6 h-6 border-2 border-[#FF5F00] border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      ) : (
        <>
          {/* Custom RPC URL */}
          <div>
            <h3 className="text-sm text-gray-400 mb-2">Custom RPC URL (Optional)</h3>
            <input
              type="text"
              value={customRPC}
              onChange={handleCustomRPCChange}
              placeholder="https://..."
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-1)]"
            />
            <p className="text-xs text-gray-400 mt-1">
              Enter a custom RPC URL for Ethereum mainnet
            </p>
          </div>
          
          {/* Slippage Tolerance */}
          <div>
            <h3 className="text-sm text-gray-400 mb-2">Slippage Tolerance</h3>
            <div className="flex items-center">
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={slippageTolerance}
                onChange={handleSlippageToleranceChange}
                className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer mr-3"
                style={{
                  background: `linear-gradient(to right, var(--color-accent-1) 0%, var(--color-accent-1) ${(slippageTolerance / 5) * 100}%, rgba(255, 255, 255, 0.1) ${(slippageTolerance / 5) * 100}%, rgba(255, 255, 255, 0.1) 100%)`
                }}
              />
              <div className="w-16 p-2 rounded bg-white/5 text-center">
                {slippageTolerance}%
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Your transaction will revert if the price changes unfavorably by more than this percentage
            </p>
          </div>
          
          {/* Transaction Deadline */}
          <div>
            <h3 className="text-sm text-gray-400 mb-2">Transaction Deadline</h3>
            <div className="flex items-center">
              <input
                type="range"
                min="1"
                max="60"
                step="1"
                value={transactionDeadline}
                onChange={handleTransactionDeadlineChange}
                className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer mr-3"
                style={{
                  background: `linear-gradient(to right, var(--color-accent-1) 0%, var(--color-accent-1) ${(transactionDeadline / 60) * 100}%, rgba(255, 255, 255, 0.1) ${(transactionDeadline / 60) * 100}%, rgba(255, 255, 255, 0.1) 100%)`
                }}
              />
              <div className="w-16 p-2 rounded bg-white/5 text-center">
                {transactionDeadline} min
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Your transaction will revert if it is pending for more than this long
            </p>
          </div>
          
          {/* Show Hex Data */}
          <div>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Show Hex Data</h3>
                <p className="text-sm text-gray-400">
                  Display transaction hex data in transaction details
                </p>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showHexData}
                  onChange={handleShowHexDataChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-accent-1)]"></div>
              </label>
            </div>
          </div>
          
          {/* Warning */}
          <div className="p-4 rounded-lg bg-[var(--color-accent-2)]/20 border border-[var(--color-accent-2)]/30">
            <h3 className="font-medium mb-2">Advanced User Warning</h3>
            <p className="text-sm">
              These settings are intended for advanced users only. Incorrect configuration may result in failed transactions or loss of funds.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default SettingsPage;
