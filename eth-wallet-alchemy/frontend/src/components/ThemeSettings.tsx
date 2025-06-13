import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Theme, 
  ColorScheme, 
  getSettings, 
  updateSettings 
} from '../services/settingsService';

interface ThemeSettingsProps {
  onUpdate?: () => void;
}

const ThemeSettings: React.FC<ThemeSettingsProps> = ({ onUpdate }) => {
  const [theme, setTheme] = useState<Theme>(Theme.DARK);
  const [colorScheme, setColorScheme] = useState<ColorScheme>(ColorScheme.ORANGE_RED);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load settings
  useEffect(() => {
    const settings = getSettings();
    setTheme(settings.theme);
    setColorScheme(settings.colorScheme);
    setIsLoading(false);
  }, []);

  // Handle theme change
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    updateSettings({ theme: newTheme });
    if (onUpdate) onUpdate();
  };

  // Handle color scheme change
  const handleColorSchemeChange = (newColorScheme: ColorScheme) => {
    setColorScheme(newColorScheme);
    updateSettings({ colorScheme: newColorScheme });
    if (onUpdate) onUpdate();
  };

  // Theme options
  const themeOptions = [
    { value: Theme.DARK, label: 'Dark', icon: '🌙' },
    { value: Theme.LIGHT, label: 'Light', icon: '☀️' },
    { value: Theme.SYSTEM, label: 'System', icon: '🖥️' }
  ];

  // Color scheme options
  const colorSchemeOptions = [
    { 
      value: ColorScheme.ORANGE_RED, 
      label: 'Orange Red', 
      colors: ['#FF5F00', '#B20600'] 
    },
    { 
      value: ColorScheme.BLUE_PURPLE, 
      label: 'Blue Purple', 
      colors: ['#42A6E3', '#9F2FFF'] 
    },
    { 
      value: ColorScheme.GREEN_TEAL, 
      label: 'Green Teal', 
      colors: ['#00FF88', '#00C9FF'] 
    },
    { 
      value: ColorScheme.PINK_PURPLE, 
      label: 'Pink Purple', 
      colors: ['#FF56F6', '#B936EE'] 
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Theme Settings</h2>
      
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
          {/* Theme Selection */}
          <div>
            <h3 className="text-sm text-gray-400 mb-3">Theme Mode</h3>
            <div className="grid grid-cols-3 gap-3">
              {themeOptions.map((option) => (
                <motion.button
                  key={option.value}
                  className={`p-4 rounded-lg flex flex-col items-center justify-center ${
                    theme === option.value 
                      ? 'bg-[var(--color-accent-1)]/20 border border-[var(--color-accent-1)]/30' 
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                  onClick={() => handleThemeChange(option.value)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-2xl mb-2">{option.icon}</span>
                  <span className="text-sm font-medium">{option.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* Color Scheme Selection */}
          <div>
            <h3 className="text-sm text-gray-400 mb-3">Color Scheme</h3>
            <div className="grid grid-cols-2 gap-3">
              {colorSchemeOptions.map((option) => (
                <motion.button
                  key={option.value}
                  className={`p-4 rounded-lg flex items-center ${
                    colorScheme === option.value 
                      ? 'bg-[var(--color-accent-1)]/20 border border-[var(--color-accent-1)]/30' 
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                  onClick={() => handleColorSchemeChange(option.value)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex mr-3">
                    {option.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 rounded-full border border-white/20"
                        style={{ 
                          backgroundColor: color,
                          marginLeft: index > 0 ? '-8px' : '0'
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{option.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* Preview */}
          <div className="mt-6">
            <h3 className="text-sm text-gray-400 mb-3">Preview</h3>
            <div className="p-4 rounded-lg bg-[var(--color-card)] border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-semibold">Phoenix Wallet</div>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-[var(--color-accent-1)]"></div>
                  <div className="w-3 h-3 rounded-full bg-[var(--color-accent-2)]"></div>
                </div>
              </div>
              
              <div className="flex space-x-2 mb-4">
                <button className="px-3 py-1 rounded-full bg-[var(--color-accent-1)] text-white text-xs">
                  Button 1
                </button>
                <button className="px-3 py-1 rounded-full bg-[var(--color-accent-2)] text-white text-xs">
                  Button 2
                </button>
                <button className="px-3 py-1 rounded-full bg-white/10 text-white text-xs">
                  Button 3
                </button>
              </div>
              
              <div className="h-10 rounded-lg bg-white/5 mb-2"></div>
              <div className="h-10 rounded-lg bg-white/5"></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSettings;
