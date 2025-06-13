import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getPrice } from '../services/priceService';

interface PriceAlertsProps {
  onClose?: () => void;
}

interface PriceAlert {
  id: string;
  asset: string;
  condition: 'above' | 'below';
  price: number;
  createdAt: number;
  isActive: boolean;
  triggered?: boolean;
  triggeredAt?: number;
}

const PriceAlerts: React.FC<PriceAlertsProps> = ({ onClose }) => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [newAlert, setNewAlert] = useState<{
    asset: string;
    condition: 'above' | 'below';
    price: string;
  }>({
    asset: 'ethereum',
    condition: 'above',
    price: ''
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPrices, setCurrentPrices] = useState<Record<string, number>>({});
  const [showAddAlert, setShowAddAlert] = useState<boolean>(false);

  // Available assets for alerts
  const availableAssets = [
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
    { id: 'tether', name: 'Tether', symbol: 'USDT' },
    { id: 'usd-coin', name: 'USD Coin', symbol: 'USDC' },
    { id: 'binancecoin', name: 'Binance Coin', symbol: 'BNB' },
    { id: 'ripple', name: 'XRP', symbol: 'XRP' },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
    { id: 'solana', name: 'Solana', symbol: 'SOL' },
    { id: 'polkadot', name: 'Polkadot', symbol: 'DOT' },
    { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE' }
  ];

  // Load alerts from localStorage
  useEffect(() => {
    const loadAlerts = () => {
      setIsLoading(true);
      
      try {
        const savedAlerts = localStorage.getItem('phoenix_price_alerts');
        if (savedAlerts) {
          setAlerts(JSON.parse(savedAlerts));
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading alerts:", err);
        setError("Failed to load alerts");
        setIsLoading(false);
      }
    };
    
    loadAlerts();
  }, []);

  // Save alerts to localStorage
  useEffect(() => {
    if (alerts.length > 0) {
      localStorage.setItem('phoenix_price_alerts', JSON.stringify(alerts));
    }
  }, [alerts]);

  // Fetch current prices for assets with alerts
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const assetIds = [...new Set(alerts.map(alert => alert.asset))];
        
        if (assetIds.length === 0) {
          // Always fetch Ethereum price for new alerts
          assetIds.push('ethereum');
        }
        
        const prices: Record<string, number> = {};
        
        for (const assetId of assetIds) {
          const priceData = await getPrice(assetId);
          prices[assetId] = priceData.usd;
        }
        
        setCurrentPrices(prices);
        
        // Check if any alerts should be triggered
        checkAlerts(prices);
      } catch (err) {
        console.error("Error fetching prices:", err);
      }
    };
    
    fetchPrices();
    
    // Set up interval to fetch prices every minute
    const interval = setInterval(fetchPrices, 60000);
    
    return () => clearInterval(interval);
  }, [alerts]);

  // Check if any alerts should be triggered
  const checkAlerts = (prices: Record<string, number>) => {
    const updatedAlerts = alerts.map(alert => {
      if (!alert.isActive || alert.triggered) {
        return alert;
      }
      
      const currentPrice = prices[alert.asset];
      if (!currentPrice) {
        return alert;
      }
      
      let isTriggered = false;
      
      if (alert.condition === 'above' && currentPrice >= alert.price) {
        isTriggered = true;
      } else if (alert.condition === 'below' && currentPrice <= alert.price) {
        isTriggered = true;
      }
      
      if (isTriggered) {
        return {
          ...alert,
          triggered: true,
          triggeredAt: Date.now()
        };
      }
      
      return alert;
    });
    
    if (JSON.stringify(updatedAlerts) !== JSON.stringify(alerts)) {
      setAlerts(updatedAlerts);
    }
  };

  // Add new alert
  const handleAddAlert = () => {
    if (!newAlert.price || isNaN(parseFloat(newAlert.price))) {
      setError("Please enter a valid price");
      return;
    }
    
    const price = parseFloat(newAlert.price);
    if (price <= 0) {
      setError("Price must be greater than zero");
      return;
    }
    
    const alert: PriceAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      asset: newAlert.asset,
      condition: newAlert.condition,
      price,
      createdAt: Date.now(),
      isActive: true
    };
    
    setAlerts([...alerts, alert]);
    
    // Reset form
    setNewAlert({
      asset: 'ethereum',
      condition: 'above',
      price: ''
    });
    
    setShowAddAlert(false);
    setError(null);
  };

  // Toggle alert active state
  const toggleAlertActive = (alertId: string) => {
    const updatedAlerts = alerts.map(alert => {
      if (alert.id === alertId) {
        return {
          ...alert,
          isActive: !alert.isActive
        };
      }
      return alert;
    });
    
    setAlerts(updatedAlerts);
  };

  // Delete alert
  const deleteAlert = (alertId: string) => {
    const updatedAlerts = alerts.filter(alert => alert.id !== alertId);
    setAlerts(updatedAlerts);
    
    if (updatedAlerts.length === 0) {
      localStorage.removeItem('phoenix_price_alerts');
    }
  };

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Get asset name by ID
  const getAssetName = (assetId: string): string => {
    const asset = availableAssets.find(a => a.id === assetId);
    return asset ? asset.name : assetId;
  };

  // Get asset symbol by ID
  const getAssetSymbol = (assetId: string): string => {
    const asset = availableAssets.find(a => a.id === assetId);
    return asset ? asset.symbol : assetId.toUpperCase();
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-heading">Price Alerts</h2>
        
        {onClose && (
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40 bg-white/5 rounded-lg">
          <motion.div
            className="w-6 h-6 border-2 border-[#FF5F00] border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Error message */}
          {error && (
            <div className="p-3 bg-[#B20600]/20 border border-[#B20600]/30 rounded-lg">
              <p className="text-sm text-[#B20600]">{error}</p>
            </div>
          )}
          
          {/* Add Alert Form */}
          {showAddAlert ? (
            <motion.div
              className="p-4 bg-white/5 rounded-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-sm font-medium mb-3">Create New Alert</h3>
              
              <div className="space-y-3">
                {/* Asset Selection */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Asset</label>
                  <select
                    value={newAlert.asset}
                    onChange={(e) => setNewAlert({ ...newAlert, asset: e.target.value })}
                    className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#FF5F00]"
                  >
                    {availableAssets.map((asset) => (
                      <option key={asset.id} value={asset.id}>
                        {asset.name} ({asset.symbol})
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Condition */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Condition</label>
                  <div className="flex space-x-2">
                    <button
                      className={`flex-1 py-2 rounded-lg text-center ${
                        newAlert.condition === 'above' 
                          ? 'bg-[#FF5F00]/20 border border-[#FF5F00]/30 text-white' 
                          : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                      onClick={() => setNewAlert({ ...newAlert, condition: 'above' })}
                    >
                      Price Above
                    </button>
                    
                    <button
                      className={`flex-1 py-2 rounded-lg text-center ${
                        newAlert.condition === 'below' 
                          ? 'bg-[#FF5F00]/20 border border-[#FF5F00]/30 text-white' 
                          : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                      onClick={() => setNewAlert({ ...newAlert, condition: 'below' })}
                    >
                      Price Below
                    </button>
                  </div>
                </div>
                
                {/* Price */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Price (USD)
                    {currentPrices[newAlert.asset] && (
                      <span className="ml-2">
                        Current: {formatCurrency(currentPrices[newAlert.asset])}
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={newAlert.price}
                    onChange={(e) => setNewAlert({ ...newAlert, price: e.target.value })}
                    placeholder="Enter price"
                    className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-[#FF5F00]"
                  />
                </div>
                
                {/* Buttons */}
                <div className="flex space-x-2 pt-2">
                  <button
                    className="flex-1 py-2 rounded-lg bg-white/10 text-white"
                    onClick={() => {
                      setShowAddAlert(false);
                      setError(null);
                    }}
                  >
                    Cancel
                  </button>
                  
                  <button
                    className="flex-1 py-2 rounded-lg bg-gradient-to-r from-[#FF5F00] to-[#B20600] text-white"
                    onClick={handleAddAlert}
                  >
                    Create Alert
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.button
              className="w-full py-3 rounded-lg bg-gradient-to-r from-[#FF5F00] to-[#B20600] text-white font-medium"
              onClick={() => setShowAddAlert(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              + Add New Alert
            </motion.button>
          )}
          
          {/* Alerts List */}
          <div className="space-y-3">
            <h3 className="text-sm text-gray-400">
              {alerts.length > 0 ? `Your Alerts (${alerts.length})` : 'No alerts yet'}
            </h3>
            
            {alerts.length === 0 && !showAddAlert && (
              <div className="p-4 bg-white/5 rounded-lg text-center">
                <p className="text-gray-400 mb-3">
                  You don't have any price alerts set up yet.
                </p>
                <p className="text-sm text-gray-400">
                  Create alerts to get notified when assets reach your target prices.
                </p>
              </div>
            )}
            
            {alerts.map((alert) => (
              <motion.div
                key={alert.id}
                className={`p-3 rounded-lg border ${
                  alert.triggered
                    ? 'bg-[#B20600]/20 border-[#B20600]/30'
                    : 'bg-white/5 border-white/10'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium">
                    {getAssetSymbol(alert.asset)}
                    <span className="text-gray-400 ml-2 text-xs">
                      {getAssetName(alert.asset)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={alert.isActive}
                        onChange={() => toggleAlertActive(alert.id)}
                        className="sr-only peer"
                        disabled={alert.triggered}
                      />
                      <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF5F00]"></div>
                    </label>
                    
                    <button
                      className="text-gray-400 hover:text-white"
                      onClick={() => deleteAlert(alert.id)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="currentColor"/>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    Price {alert.condition === 'above' ? 'above' : 'below'} {formatCurrency(alert.price)}
                  </div>
                  
                  {currentPrices[alert.asset] && (
                    <div className="text-xs text-gray-400">
                      Current: {formatCurrency(currentPrices[alert.asset])}
                    </div>
                  )}
                </div>
                
                {alert.triggered && (
                  <div className="mt-2 text-xs text-[#FF5F00]">
                    Triggered {new Date(alert.triggeredAt!).toLocaleString()}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceAlerts;
