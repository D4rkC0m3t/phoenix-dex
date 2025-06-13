import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Language, 
  Currency, 
  getSettings, 
  updateSettings,
  resetSettings
} from '../services/settingsService';

interface GeneralSettingsProps {
  onUpdate?: () => void;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ onUpdate }) => {
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);
  const [currency, setCurrency] = useState<Currency>(Currency.USD);
  const [showTestnets, setShowTestnets] = useState<boolean>(true);
  const [gasPreference, setGasPreference] = useState<'low' | 'medium' | 'high'>('medium');
  const [notifications, setNotifications] = useState({
    transactions: true,
    priceAlerts: false,
    securityAlerts: true,
    newsletter: false
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Load settings
  useEffect(() => {
    const settings = getSettings();
    setLanguage(settings.language);
    setCurrency(settings.currency);
    setShowTestnets(settings.showTestnets);
    setGasPreference(settings.gasPreference);
    setNotifications(settings.notifications);
    setIsLoading(false);
  }, []);

  // Handle language change
  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as Language;
    setLanguage(value);
    updateSettings({ language: value });
    if (onUpdate) onUpdate();
  };

  // Handle currency change
  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as Currency;
    setCurrency(value);
    updateSettings({ currency: value });
    if (onUpdate) onUpdate();
  };

  // Handle show testnets change
  const handleShowTestnetsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setShowTestnets(checked);
    updateSettings({ showTestnets: checked });
    if (onUpdate) onUpdate();
  };

  // Handle gas preference change
  const handleGasPreferenceChange = (value: 'low' | 'medium' | 'high') => {
    setGasPreference(value);
    updateSettings({ gasPreference: value });
    if (onUpdate) onUpdate();
  };

  // Handle notification change
  const handleNotificationChange = (key: keyof typeof notifications) => {
    const updatedNotifications = {
      ...notifications,
      [key]: !notifications[key]
    };
    setNotifications(updatedNotifications);
    updateSettings({ notifications: updatedNotifications });
    if (onUpdate) onUpdate();
  };

  // Handle reset settings
  const handleResetSettings = () => {
    resetSettings();
    
    // Reload settings
    const settings = getSettings();
    setLanguage(settings.language);
    setCurrency(settings.currency);
    setShowTestnets(settings.showTestnets);
    setGasPreference(settings.gasPreference);
    setNotifications(settings.notifications);
    
    setShowResetConfirm(false);
    
    if (onUpdate) onUpdate();
  };

  // Language options
  const languageOptions = [
    { value: Language.ENGLISH, label: 'English' },
    { value: Language.SPANISH, label: 'Español' },
    { value: Language.FRENCH, label: 'Français' },
    { value: Language.GERMAN, label: 'Deutsch' },
    { value: Language.CHINESE, label: '中文' },
    { value: Language.JAPANESE, label: '日本語' },
    { value: Language.KOREAN, label: '한국어' },
    { value: Language.RUSSIAN, label: 'Русский' }
  ];

  // Currency options
  const currencyOptions = [
    { value: Currency.USD, label: 'USD ($)', symbol: '$' },
    { value: Currency.EUR, label: 'EUR (€)', symbol: '€' },
    { value: Currency.GBP, label: 'GBP (£)', symbol: '£' },
    { value: Currency.JPY, label: 'JPY (¥)', symbol: '¥' },
    { value: Currency.CNY, label: 'CNY (¥)', symbol: '¥' },
    { value: Currency.KRW, label: 'KRW (₩)', symbol: '₩' },
    { value: Currency.RUB, label: 'RUB (₽)', symbol: '₽' },
    { value: Currency.BTC, label: 'BTC (₿)', symbol: '₿' },
    { value: Currency.ETH, label: 'ETH (Ξ)', symbol: 'Ξ' }
  ];

  // Gas preference options
  const gasPreferenceOptions = [
    { value: 'low', label: 'Low', description: 'Cheaper but slower' },
    { value: 'medium', label: 'Medium', description: 'Balanced cost and speed' },
    { value: 'high', label: 'High', description: 'Faster but more expensive' }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">General Settings</h2>
      
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
          {/* Language and Currency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Language */}
            <div>
              <h3 className="text-sm text-gray-400 mb-2">Language</h3>
              <select
                value={language}
                onChange={handleLanguageChange}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-1)]"
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Currency */}
            <div>
              <h3 className="text-sm text-gray-400 mb-2">Currency</h3>
              <select
                value={currency}
                onChange={handleCurrencyChange}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-1)]"
              >
                {currencyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Network Settings */}
          <div>
            <h3 className="text-sm text-gray-400 mb-3">Network Settings</h3>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Show Testnets</div>
                  <div className="text-sm text-gray-400">Display testnet networks in the network selector</div>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showTestnets}
                    onChange={handleShowTestnetsChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-accent-1)]"></div>
                </label>
              </div>
            </div>
          </div>
          
          {/* Gas Preference */}
          <div>
            <h3 className="text-sm text-gray-400 mb-3">Default Gas Preference</h3>
            <div className="grid grid-cols-3 gap-3">
              {gasPreferenceOptions.map((option) => (
                <motion.button
                  key={option.value}
                  className={`p-3 rounded-lg flex flex-col items-center justify-center ${
                    gasPreference === option.value 
                      ? 'bg-[var(--color-accent-1)]/20 border border-[var(--color-accent-1)]/30' 
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                  onClick={() => handleGasPreferenceChange(option.value as 'low' | 'medium' | 'high')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="font-medium mb-1">{option.label}</div>
                  <div className="text-xs text-gray-400">{option.description}</div>
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* Notifications */}
          <div>
            <h3 className="text-sm text-gray-400 mb-3">Notifications</h3>
            <div className="space-y-3">
              {Object.entries(notifications).map(([key, value]) => (
                <div 
                  key={key}
                  className="p-3 rounded-lg bg-white/5 border border-white/10 flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">
                      {key === 'transactions' ? 'Transaction Updates' :
                       key === 'priceAlerts' ? 'Price Alerts' :
                       key === 'securityAlerts' ? 'Security Alerts' :
                       'Newsletter'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {key === 'transactions' ? 'Receive updates about your transactions' :
                       key === 'priceAlerts' ? 'Get notified about significant price changes' :
                       key === 'securityAlerts' ? 'Receive important security notifications' :
                       'Receive news and updates about Phoenix Wallet'}
                    </div>
                  </div>
                  
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => handleNotificationChange(key as keyof typeof notifications)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-accent-1)]"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Reset Settings */}
          <div>
            <h3 className="text-sm text-gray-400 mb-3">Reset Settings</h3>
            {showResetConfirm ? (
              <div className="p-4 rounded-lg bg-[var(--color-accent-2)]/20 border border-[var(--color-accent-2)]/30">
                <p className="text-sm mb-3">Are you sure you want to reset all settings to default?</p>
                <div className="flex space-x-3">
                  <motion.button
                    className="flex-1 py-2 px-4 rounded-lg bg-[var(--color-accent-2)] text-white"
                    onClick={handleResetSettings}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Reset
                  </motion.button>
                  <motion.button
                    className="flex-1 py-2 px-4 rounded-lg bg-white/10 text-white"
                    onClick={() => setShowResetConfirm(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            ) : (
              <motion.button
                className="w-full py-2 px-4 rounded-lg bg-white/10 text-white"
                onClick={() => setShowResetConfirm(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Reset to Default Settings
              </motion.button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default GeneralSettings;
