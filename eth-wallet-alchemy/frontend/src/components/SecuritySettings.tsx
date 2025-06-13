import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  SecurityLevel, 
  getSettings, 
  updateSettings 
} from '../services/settingsService';

interface SecuritySettingsProps {
  onUpdate?: () => void;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ onUpdate }) => {
  const [securityLevel, setSecurityLevel] = useState<SecurityLevel>(SecurityLevel.MEDIUM);
  const [autoLockTimeout, setAutoLockTimeout] = useState<number>(15);
  const [showBalances, setShowBalances] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load settings
  useEffect(() => {
    const settings = getSettings();
    setSecurityLevel(settings.securityLevel);
    setAutoLockTimeout(settings.autoLockTimeout);
    setShowBalances(settings.showBalances);
    setIsLoading(false);
  }, []);

  // Handle security level change
  const handleSecurityLevelChange = (newLevel: SecurityLevel) => {
    setSecurityLevel(newLevel);
    updateSettings({ securityLevel: newLevel });
    if (onUpdate) onUpdate();
  };

  // Handle auto lock timeout change
  const handleAutoLockTimeoutChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setAutoLockTimeout(value);
    updateSettings({ autoLockTimeout: value });
    if (onUpdate) onUpdate();
  };

  // Handle show balances change
  const handleShowBalancesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setShowBalances(checked);
    updateSettings({ showBalances: checked });
    if (onUpdate) onUpdate();
  };

  // Security level options
  const securityLevelOptions = [
    { 
      value: SecurityLevel.LOW, 
      label: 'Low', 
      description: 'Basic security features, convenient for frequent use',
      icon: '🔓'
    },
    { 
      value: SecurityLevel.MEDIUM, 
      label: 'Medium', 
      description: 'Balanced security and convenience',
      icon: '🔒'
    },
    { 
      value: SecurityLevel.HIGH, 
      label: 'High', 
      description: 'Maximum security, may require additional verification',
      icon: '🛡️'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
      
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
          {/* Security Level Selection */}
          <div>
            <h3 className="text-sm text-gray-400 mb-3">Security Level</h3>
            <div className="space-y-3">
              {securityLevelOptions.map((option) => (
                <motion.button
                  key={option.value}
                  className={`w-full p-4 rounded-lg flex items-start ${
                    securityLevel === option.value 
                      ? 'bg-[var(--color-accent-1)]/20 border border-[var(--color-accent-1)]/30' 
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                  onClick={() => handleSecurityLevelChange(option.value)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <span className="text-2xl mr-3">{option.icon}</span>
                  <div className="text-left">
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-gray-400">{option.description}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* Auto Lock Timeout */}
          <div>
            <h3 className="text-sm text-gray-400 mb-3">Auto Lock Timeout</h3>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium">Lock after inactivity</div>
                <div className="text-sm text-gray-400">{autoLockTimeout} minutes</div>
              </div>
              
              <input
                type="range"
                min="1"
                max="60"
                step="1"
                value={autoLockTimeout}
                onChange={handleAutoLockTimeoutChange}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, var(--color-accent-1) 0%, var(--color-accent-1) ${(autoLockTimeout / 60) * 100}%, rgba(255, 255, 255, 0.1) ${(autoLockTimeout / 60) * 100}%, rgba(255, 255, 255, 0.1) 100%)`
                }}
              />
              
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <div>1 min</div>
                <div>15 min</div>
                <div>30 min</div>
                <div>60 min</div>
              </div>
            </div>
          </div>
          
          {/* Show Balances */}
          <div>
            <h3 className="text-sm text-gray-400 mb-3">Privacy</h3>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Show Balances</div>
                  <div className="text-sm text-gray-400">Display wallet balances in the UI</div>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showBalances}
                    onChange={handleShowBalancesChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-accent-1)]"></div>
                </label>
              </div>
            </div>
          </div>
          
          {/* Security Tips */}
          <div className="p-4 rounded-lg bg-[var(--color-accent-2)]/20 border border-[var(--color-accent-2)]/30">
            <h3 className="font-medium mb-2">Security Tips</h3>
            <ul className="text-sm space-y-2">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Never share your private keys or seed phrases with anyone</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Use a hardware wallet for large amounts</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Enable two-factor authentication where possible</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Verify all transaction details before confirming</span>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default SecuritySettings;
