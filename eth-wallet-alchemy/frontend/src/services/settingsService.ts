/**
 * Service for managing user settings and preferences
 */

// Theme options
export enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
  SYSTEM = 'system'
}

// Color scheme options
export enum ColorScheme {
  ORANGE_RED = 'orange-red', // Default: #FF5F00, #B20600
  BLUE_PURPLE = 'blue-purple', // #42A6E3, #9F2FFF
  GREEN_TEAL = 'green-teal', // #00FF88, #00C9FF
  PINK_PURPLE = 'pink-purple' // #FF56F6, #B936EE
}

// Language options
export enum Language {
  ENGLISH = 'en',
  SPANISH = 'es',
  FRENCH = 'fr',
  GERMAN = 'de',
  CHINESE = 'zh',
  JAPANESE = 'ja',
  KOREAN = 'ko',
  RUSSIAN = 'ru'
}

// Currency options
export enum Currency {
  USD = 'usd',
  EUR = 'eur',
  GBP = 'gbp',
  JPY = 'jpy',
  CNY = 'cny',
  KRW = 'krw',
  RUB = 'rub',
  BTC = 'btc',
  ETH = 'eth'
}

// Security level options
export enum SecurityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

// Settings interface
export interface Settings {
  theme: Theme;
  colorScheme: ColorScheme;
  language: Language;
  currency: Currency;
  securityLevel: SecurityLevel;
  autoLockTimeout: number; // in minutes
  showTestnets: boolean;
  showBalances: boolean;
  gasPreference: 'low' | 'medium' | 'high';
  notifications: {
    transactions: boolean;
    priceAlerts: boolean;
    securityAlerts: boolean;
    newsletter: boolean;
  };
  advanced: {
    customRPC: string;
    slippageTolerance: number; // in percentage
    transactionDeadline: number; // in minutes
    showHexData: boolean;
  };
}

// Default settings
export const DEFAULT_SETTINGS: Settings = {
  theme: Theme.DARK,
  colorScheme: ColorScheme.ORANGE_RED,
  language: Language.ENGLISH,
  currency: Currency.USD,
  securityLevel: SecurityLevel.MEDIUM,
  autoLockTimeout: 15,
  showTestnets: true,
  showBalances: true,
  gasPreference: 'medium',
  notifications: {
    transactions: true,
    priceAlerts: false,
    securityAlerts: true,
    newsletter: false
  },
  advanced: {
    customRPC: '',
    slippageTolerance: 0.5,
    transactionDeadline: 20,
    showHexData: false
  }
};

// Storage key for settings
const SETTINGS_STORAGE_KEY = 'phoenix_settings';

/**
 * Get all settings from storage
 * @returns User settings
 */
export const getSettings = (): Settings => {
  try {
    const settingsJson = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!settingsJson) return DEFAULT_SETTINGS;
    
    const settings = JSON.parse(settingsJson) as Settings;
    return { ...DEFAULT_SETTINGS, ...settings };
  } catch (error) {
    console.error("Error getting settings from storage:", error);
    return DEFAULT_SETTINGS;
  }
};

/**
 * Save settings to storage
 * @param settings User settings
 */
export const saveSettings = (settings: Settings): void => {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    
    // Apply theme
    applyTheme(settings.theme);
    
    // Apply color scheme
    applyColorScheme(settings.colorScheme);
  } catch (error) {
    console.error("Error saving settings to storage:", error);
  }
};

/**
 * Update settings
 * @param updates Partial settings to update
 * @returns Updated settings
 */
export const updateSettings = (updates: Partial<Settings>): Settings => {
  const currentSettings = getSettings();
  const updatedSettings = { ...currentSettings, ...updates };
  
  // Handle nested objects
  if (updates.notifications) {
    updatedSettings.notifications = {
      ...currentSettings.notifications,
      ...updates.notifications
    };
  }
  
  if (updates.advanced) {
    updatedSettings.advanced = {
      ...currentSettings.advanced,
      ...updates.advanced
    };
  }
  
  saveSettings(updatedSettings);
  return updatedSettings;
};

/**
 * Reset settings to defaults
 * @returns Default settings
 */
export const resetSettings = (): Settings => {
  saveSettings(DEFAULT_SETTINGS);
  return DEFAULT_SETTINGS;
};

/**
 * Apply theme to the document
 * @param theme Theme to apply
 */
export const applyTheme = (theme: Theme): void => {
  const root = document.documentElement;
  
  // Remove existing theme classes
  root.classList.remove('theme-dark', 'theme-light');
  
  // Apply theme based on selection
  if (theme === Theme.SYSTEM) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.add(prefersDark ? 'theme-dark' : 'theme-light');
  } else {
    root.classList.add(`theme-${theme}`);
  }
};

/**
 * Apply color scheme to the document
 * @param colorScheme Color scheme to apply
 */
export const applyColorScheme = (colorScheme: ColorScheme): void => {
  const root = document.documentElement;
  
  // Set CSS variables based on color scheme
  switch (colorScheme) {
    case ColorScheme.ORANGE_RED:
      root.style.setProperty('--color-accent-1', '#FF5F00');
      root.style.setProperty('--color-accent-2', '#B20600');
      break;
    case ColorScheme.BLUE_PURPLE:
      root.style.setProperty('--color-accent-1', '#42A6E3');
      root.style.setProperty('--color-accent-2', '#9F2FFF');
      break;
    case ColorScheme.GREEN_TEAL:
      root.style.setProperty('--color-accent-1', '#00FF88');
      root.style.setProperty('--color-accent-2', '#00C9FF');
      break;
    case ColorScheme.PINK_PURPLE:
      root.style.setProperty('--color-accent-1', '#FF56F6');
      root.style.setProperty('--color-accent-2', '#B936EE');
      break;
  }
};

// Initialize settings on load
export const initializeSettings = (): void => {
  const settings = getSettings();
  applyTheme(settings.theme);
  applyColorScheme(settings.colorScheme);
};

export default {
  getSettings,
  saveSettings,
  updateSettings,
  resetSettings,
  applyTheme,
  applyColorScheme,
  initializeSettings
};
