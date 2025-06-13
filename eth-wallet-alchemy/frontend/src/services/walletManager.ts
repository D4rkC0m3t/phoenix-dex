import { ethers } from "ethers";
import { getWeb3Provider } from "./provider";

// Wallet types
export enum WalletType {
  IMPORTED = "imported",
  CONNECTED = "connected",
  HARDWARE = "hardware",
  WATCH = "watch"
}

// Wallet interface
export interface ManagedWallet {
  id: string;
  name: string;
  address: string;
  type: WalletType;
  isActive: boolean;
  privateKey?: string; // Only for imported wallets, encrypted in a real app
  derivationPath?: string; // For hardware wallets
  icon?: string; // Custom icon for the wallet
  createdAt: number;
  lastUsed: number;
  network?: string;
}

// Storage key for wallets
const WALLETS_STORAGE_KEY = "phoenix_wallets";

/**
 * Get all wallets from storage
 * @returns Array of managed wallets
 */
export const getWallets = (): ManagedWallet[] => {
  try {
    const walletsJson = localStorage.getItem(WALLETS_STORAGE_KEY);
    if (!walletsJson) return [];
    
    const wallets = JSON.parse(walletsJson) as ManagedWallet[];
    return wallets;
  } catch (error) {
    console.error("Error getting wallets from storage:", error);
    return [];
  }
};

/**
 * Save wallets to storage
 * @param wallets Array of managed wallets
 */
export const saveWallets = (wallets: ManagedWallet[]): void => {
  try {
    localStorage.setItem(WALLETS_STORAGE_KEY, JSON.stringify(wallets));
  } catch (error) {
    console.error("Error saving wallets to storage:", error);
  }
};

/**
 * Get the active wallet
 * @returns The active wallet or null if none is active
 */
export const getActiveWallet = (): ManagedWallet | null => {
  const wallets = getWallets();
  const activeWallet = wallets.find(wallet => wallet.isActive);
  return activeWallet || null;
};

/**
 * Set a wallet as active
 * @param walletId ID of the wallet to set as active
 * @returns The active wallet or null if not found
 */
export const setActiveWallet = (walletId: string): ManagedWallet | null => {
  const wallets = getWallets();
  
  // Update active status
  const updatedWallets = wallets.map(wallet => ({
    ...wallet,
    isActive: wallet.id === walletId,
    lastUsed: wallet.id === walletId ? Date.now() : wallet.lastUsed
  }));
  
  saveWallets(updatedWallets);
  
  return updatedWallets.find(wallet => wallet.id === walletId) || null;
};

/**
 * Add a new wallet
 * @param wallet Wallet to add
 * @returns The added wallet
 */
export const addWallet = (wallet: Omit<ManagedWallet, "id" | "createdAt" | "lastUsed" | "isActive">): ManagedWallet => {
  const wallets = getWallets();
  
  // Check if wallet with same address already exists
  const existingWallet = wallets.find(w => w.address.toLowerCase() === wallet.address.toLowerCase());
  if (existingWallet) {
    throw new Error("Wallet with this address already exists");
  }
  
  // Create new wallet
  const newWallet: ManagedWallet = {
    ...wallet,
    id: `wallet_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    createdAt: Date.now(),
    lastUsed: Date.now(),
    isActive: wallets.length === 0 // Set as active if it's the first wallet
  };
  
  // Add to wallets
  const updatedWallets = [...wallets];
  
  // If this is the first wallet or we want to set it as active
  if (newWallet.isActive) {
    // Set all other wallets as inactive
    updatedWallets.forEach(wallet => {
      wallet.isActive = false;
    });
  }
  
  updatedWallets.push(newWallet);
  saveWallets(updatedWallets);
  
  return newWallet;
};

/**
 * Update a wallet
 * @param walletId ID of the wallet to update
 * @param updates Updates to apply
 * @returns The updated wallet or null if not found
 */
export const updateWallet = (
  walletId: string, 
  updates: Partial<Omit<ManagedWallet, "id" | "createdAt">>
): ManagedWallet | null => {
  const wallets = getWallets();
  
  // Find wallet index
  const walletIndex = wallets.findIndex(wallet => wallet.id === walletId);
  if (walletIndex === -1) return null;
  
  // Update wallet
  const updatedWallets = [...wallets];
  updatedWallets[walletIndex] = {
    ...updatedWallets[walletIndex],
    ...updates,
    lastUsed: Date.now()
  };
  
  saveWallets(updatedWallets);
  
  return updatedWallets[walletIndex];
};

/**
 * Remove a wallet
 * @param walletId ID of the wallet to remove
 * @returns True if wallet was removed, false otherwise
 */
export const removeWallet = (walletId: string): boolean => {
  const wallets = getWallets();
  
  // Find wallet index
  const walletIndex = wallets.findIndex(wallet => wallet.id === walletId);
  if (walletIndex === -1) return false;
  
  // Check if it's the active wallet
  const isActive = wallets[walletIndex].isActive;
  
  // Remove wallet
  const updatedWallets = wallets.filter(wallet => wallet.id !== walletId);
  
  // If it was the active wallet, set the first wallet as active
  if (isActive && updatedWallets.length > 0) {
    updatedWallets[0].isActive = true;
  }
  
  saveWallets(updatedWallets);
  
  return true;
};

/**
 * Create a new wallet from a private key
 * @param name Name for the wallet
 * @param privateKey Private key for the wallet
 * @returns The created wallet
 */
export const createWalletFromPrivateKey = (name: string, privateKey: string): ManagedWallet => {
  try {
    // Create wallet from private key
    const wallet = new ethers.Wallet(privateKey);
    
    // Add wallet
    return addWallet({
      name,
      address: wallet.address,
      type: WalletType.IMPORTED,
      privateKey // In a real app, this would be encrypted
    });
  } catch (error) {
    console.error("Error creating wallet from private key:", error);
    throw new Error("Invalid private key");
  }
};

/**
 * Create a new wallet from a mnemonic phrase
 * @param name Name for the wallet
 * @param mnemonic Mnemonic phrase
 * @param path Derivation path (optional)
 * @returns The created wallet
 */
export const createWalletFromMnemonic = (
  name: string, 
  mnemonic: string, 
  path?: string
): ManagedWallet => {
  try {
    // Create wallet from mnemonic
    const wallet = ethers.Wallet.fromMnemonic(mnemonic, path);
    
    // Add wallet
    return addWallet({
      name,
      address: wallet.address,
      type: WalletType.IMPORTED,
      privateKey: wallet.privateKey, // In a real app, this would be encrypted
      derivationPath: path
    });
  } catch (error) {
    console.error("Error creating wallet from mnemonic:", error);
    throw new Error("Invalid mnemonic phrase");
  }
};

/**
 * Create a new random wallet
 * @param name Name for the wallet
 * @returns The created wallet
 */
export const createRandomWallet = (name: string): ManagedWallet => {
  try {
    // Create random wallet
    const wallet = ethers.Wallet.createRandom();
    
    // Add wallet
    return addWallet({
      name,
      address: wallet.address,
      type: WalletType.IMPORTED,
      privateKey: wallet.privateKey // In a real app, this would be encrypted
    });
  } catch (error) {
    console.error("Error creating random wallet:", error);
    throw new Error("Failed to create wallet");
  }
};

/**
 * Add a connected wallet (from MetaMask or other browser extension)
 * @param name Name for the wallet
 * @returns The added wallet
 */
export const addConnectedWallet = async (name: string): Promise<ManagedWallet> => {
  try {
    // Get web3 provider
    const web3Provider = getWeb3Provider();
    
    // Request accounts
    await web3Provider.send("eth_requestAccounts", []);
    
    // Get signer
    const signer = web3Provider.getSigner();
    
    // Get address
    const address = await signer.getAddress();
    
    // Add wallet
    return addWallet({
      name,
      address,
      type: WalletType.CONNECTED
    });
  } catch (error) {
    console.error("Error adding connected wallet:", error);
    throw new Error("Failed to connect wallet");
  }
};

/**
 * Add a watch-only wallet
 * @param name Name for the wallet
 * @param address Address to watch
 * @returns The added wallet
 */
export const addWatchWallet = (name: string, address: string): ManagedWallet => {
  try {
    // Validate address
    if (!ethers.utils.isAddress(address)) {
      throw new Error("Invalid address");
    }
    
    // Add wallet
    return addWallet({
      name,
      address,
      type: WalletType.WATCH
    });
  } catch (error) {
    console.error("Error adding watch wallet:", error);
    throw new Error("Failed to add watch wallet");
  }
};

export default {
  getWallets,
  getActiveWallet,
  setActiveWallet,
  addWallet,
  updateWallet,
  removeWallet,
  createWalletFromPrivateKey,
  createWalletFromMnemonic,
  createRandomWallet,
  addConnectedWallet,
  addWatchWallet
};
