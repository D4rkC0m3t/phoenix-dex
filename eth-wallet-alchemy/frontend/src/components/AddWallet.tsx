import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import { 
  createWalletFromPrivateKey,
  createWalletFromMnemonic,
  createRandomWallet,
  addConnectedWallet,
  addWatchWallet,
  type ManagedWallet
} from '../services/walletManager';

interface AddWalletProps {
  onWalletAdded?: (wallet: ManagedWallet) => void;
  onCancel?: () => void;
}

type WalletMethod = 'create' | 'import' | 'connect' | 'watch';

const AddWallet: React.FC<AddWalletProps> = ({
  onWalletAdded,
  onCancel
}) => {
  const [method, setMethod] = useState<WalletMethod>('create');
  const [importType, setImportType] = useState<'privateKey' | 'mnemonic'>('privateKey');
  const [walletName, setWalletName] = useState<string>('');
  const [privateKey, setPrivateKey] = useState<string>('');
  const [mnemonic, setMnemonic] = useState<string>('');
  const [derivationPath, setDerivationPath] = useState<string>("m/44'/60'/0'/0/0");
  const [watchAddress, setWatchAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [newMnemonic, setNewMnemonic] = useState<string | null>(null);
  
  // Validate wallet name
  const isValidName = walletName.trim().length > 0;
  
  // Validate private key
  const isValidPrivateKey = () => {
    try {
      if (!privateKey) return false;
      return privateKey.startsWith('0x') && privateKey.length === 66;
    } catch {
      return false;
    }
  };
  
  // Validate mnemonic
  const isValidMnemonic = () => {
    try {
      if (!mnemonic) return false;
      return ethers.utils.isValidMnemonic(mnemonic);
    } catch {
      return false;
    }
  };
  
  // Validate watch address
  const isValidWatchAddress = () => {
    try {
      if (!watchAddress) return false;
      return ethers.utils.isAddress(watchAddress);
    } catch {
      return false;
    }
  };
  
  // Handle wallet creation
  const handleCreateWallet = async () => {
    if (!isValidName) {
      setError("Please enter a wallet name");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Create random wallet
      const wallet = createRandomWallet(walletName);
      
      // Get mnemonic for display
      const ethersWallet = ethers.Wallet.createRandom();
      setNewMnemonic(ethersWallet.mnemonic.phrase);
      
      if (onWalletAdded) {
        onWalletAdded(wallet);
      }
    } catch (err: any) {
      console.error("Error creating wallet:", err);
      setError(err.message || "Failed to create wallet");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle wallet import
  const handleImportWallet = async () => {
    if (!isValidName) {
      setError("Please enter a wallet name");
      return;
    }
    
    if (importType === 'privateKey' && !isValidPrivateKey()) {
      setError("Please enter a valid private key");
      return;
    }
    
    if (importType === 'mnemonic' && !isValidMnemonic()) {
      setError("Please enter a valid mnemonic phrase");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      let wallet: ManagedWallet;
      
      if (importType === 'privateKey') {
        wallet = createWalletFromPrivateKey(walletName, privateKey);
      } else {
        wallet = createWalletFromMnemonic(walletName, mnemonic, derivationPath);
      }
      
      if (onWalletAdded) {
        onWalletAdded(wallet);
      }
    } catch (err: any) {
      console.error("Error importing wallet:", err);
      setError(err.message || "Failed to import wallet");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle wallet connection
  const handleConnectWallet = async () => {
    if (!isValidName) {
      setError("Please enter a wallet name");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const wallet = await addConnectedWallet(walletName);
      
      if (onWalletAdded) {
        onWalletAdded(wallet);
      }
    } catch (err: any) {
      console.error("Error connecting wallet:", err);
      setError(err.message || "Failed to connect wallet");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle watch-only wallet
  const handleWatchWallet = async () => {
    if (!isValidName) {
      setError("Please enter a wallet name");
      return;
    }
    
    if (!isValidWatchAddress()) {
      setError("Please enter a valid Ethereum address");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const wallet = addWatchWallet(walletName, watchAddress);
      
      if (onWalletAdded) {
        onWalletAdded(wallet);
      }
    } catch (err: any) {
      console.error("Error adding watch wallet:", err);
      setError(err.message || "Failed to add watch wallet");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    switch (method) {
      case 'create':
        await handleCreateWallet();
        break;
      case 'import':
        await handleImportWallet();
        break;
      case 'connect':
        await handleConnectWallet();
        break;
      case 'watch':
        await handleWatchWallet();
        break;
    }
  };
  
  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-heading">Add Wallet</h2>
        {onCancel && (
          <button 
            onClick={onCancel}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>
      
      {newMnemonic ? (
        <div>
          <div className="mb-4 p-4 bg-[#B20600]/20 border border-[#B20600]/30 rounded-lg">
            <h3 className="text-[#FF5F00] font-medium mb-2">Backup Your Mnemonic Phrase</h3>
            <p className="text-sm text-white mb-4">
              Write down these 12 words and keep them in a safe place. You will need them to recover your wallet.
            </p>
            <div className="p-3 bg-white/5 rounded-lg break-all font-mono text-sm">
              {newMnemonic}
            </div>
          </div>
          
          <motion.button
            className="w-full py-3 px-4 rounded-xl font-medium bg-gradient-to-r from-[#FF5F00] to-[#B20600] text-white"
            onClick={onCancel}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            I've Saved My Mnemonic
          </motion.button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Method Selection */}
          <div className="mb-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                className={`p-3 rounded-lg text-center ${
                  method === 'create' 
                    ? 'bg-[#FF5F00]/20 border border-[#FF5F00]/30 text-white' 
                    : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                }`}
                onClick={() => setMethod('create')}
              >
                <div className="text-xl mb-1">🔑</div>
                <div className="text-sm font-medium">Create</div>
              </button>
              
              <button
                type="button"
                className={`p-3 rounded-lg text-center ${
                  method === 'import' 
                    ? 'bg-[#FF5F00]/20 border border-[#FF5F00]/30 text-white' 
                    : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                }`}
                onClick={() => setMethod('import')}
              >
                <div className="text-xl mb-1">📥</div>
                <div className="text-sm font-medium">Import</div>
              </button>
              
              <button
                type="button"
                className={`p-3 rounded-lg text-center ${
                  method === 'connect' 
                    ? 'bg-[#FF5F00]/20 border border-[#FF5F00]/30 text-white' 
                    : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                }`}
                onClick={() => setMethod('connect')}
              >
                <div className="text-xl mb-1">🔌</div>
                <div className="text-sm font-medium">Connect</div>
              </button>
              
              <button
                type="button"
                className={`p-3 rounded-lg text-center ${
                  method === 'watch' 
                    ? 'bg-[#FF5F00]/20 border border-[#FF5F00]/30 text-white' 
                    : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                }`}
                onClick={() => setMethod('watch')}
              >
                <div className="text-xl mb-1">👁️</div>
                <div className="text-sm font-medium">Watch</div>
              </button>
            </div>
          </div>
          
          {/* Wallet Name */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Wallet Name</label>
            <input
              type="text"
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)}
              placeholder="My Wallet"
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-[#FF5F00]"
            />
          </div>
          
          {/* Method-specific inputs */}
          {method === 'import' && (
            <div className="mb-4">
              <div className="flex space-x-2 mb-4">
                <button
                  type="button"
                  className={`flex-1 py-2 rounded-lg text-center ${
                    importType === 'privateKey' 
                      ? 'bg-[#FF5F00]/20 border border-[#FF5F00]/30 text-white' 
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                  onClick={() => setImportType('privateKey')}
                >
                  Private Key
                </button>
                
                <button
                  type="button"
                  className={`flex-1 py-2 rounded-lg text-center ${
                    importType === 'mnemonic' 
                      ? 'bg-[#FF5F00]/20 border border-[#FF5F00]/30 text-white' 
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                  onClick={() => setImportType('mnemonic')}
                >
                  Mnemonic
                </button>
              </div>
              
              {importType === 'privateKey' ? (
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Private Key</label>
                  <input
                    type="password"
                    value={privateKey}
                    onChange={(e) => setPrivateKey(e.target.value)}
                    placeholder="0x..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-[#FF5F00]"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Mnemonic Phrase</label>
                  <textarea
                    value={mnemonic}
                    onChange={(e) => setMnemonic(e.target.value)}
                    placeholder="Enter your 12 or 24 word mnemonic phrase..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-[#FF5F00] min-h-[80px]"
                  />
                  
                  <label className="block text-sm text-gray-400 mt-4 mb-2">Derivation Path (Optional)</label>
                  <input
                    type="text"
                    value={derivationPath}
                    onChange={(e) => setDerivationPath(e.target.value)}
                    placeholder="m/44'/60'/0'/0/0"
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-[#FF5F00]"
                  />
                </div>
              )}
            </div>
          )}
          
          {method === 'watch' && (
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Ethereum Address</label>
              <input
                type="text"
                value={watchAddress}
                onChange={(e) => setWatchAddress(e.target.value)}
                placeholder="0x..."
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-[#FF5F00]"
              />
            </div>
          )}
          
          {/* Method descriptions */}
          <div className="mb-6 p-3 bg-white/5 rounded-lg">
            {method === 'create' && (
              <p className="text-sm text-gray-400">
                Create a new wallet with a randomly generated private key and mnemonic phrase.
              </p>
            )}
            
            {method === 'import' && (
              <p className="text-sm text-gray-400">
                Import an existing wallet using a private key or mnemonic phrase.
              </p>
            )}
            
            {method === 'connect' && (
              <p className="text-sm text-gray-400">
                Connect to an external wallet like MetaMask or WalletConnect.
              </p>
            )}
            
            {method === 'watch' && (
              <p className="text-sm text-gray-400">
                Add a watch-only wallet to monitor balances and transactions without the ability to send funds.
              </p>
            )}
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-[#B20600]/20 border border-[#B20600]/30 rounded-lg">
              <p className="text-sm text-[#B20600]">{error}</p>
            </div>
          )}
          
          {/* Submit Button */}
          <div className="flex space-x-3">
            {onCancel && (
              <motion.button
                type="button"
                className="flex-1 py-3 px-4 rounded-xl font-medium bg-white/10 text-white"
                onClick={onCancel}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
            )}
            
            <motion.button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl font-medium bg-gradient-to-r from-[#FF5F00] to-[#B20600] text-white"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                method === 'create' ? 'Create Wallet' :
                method === 'import' ? 'Import Wallet' :
                method === 'connect' ? 'Connect Wallet' :
                'Add Watch Wallet'
              )}
            </motion.button>
          </div>
        </form>
      )}
    </motion.div>
  );
};

export default AddWallet;
