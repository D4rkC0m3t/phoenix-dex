// This file would normally contain API calls to your backend
// For this demo, we're using the wallet service directly

import {
  createWallet,
  getBalance,
  getAllTokenBalances,
  getTransactionHistory,
  loadWallet
} from '../services/walletService';

// In a real application, these would be API calls to your backend
export const api = {
  // Create a new wallet
  createWallet: async () => {
    return createWallet();
  },
  
  // Get wallet balance
  getBalance: async (address, network) => {
    return getBalance(address, network);
  },
  
  // Get all token balances
  getTokenBalances: async (address, network) => {
    return getAllTokenBalances(address, network);
  },
  
  // Get transaction history
  getTransactionHistory: async (address, network) => {
    return getTransactionHistory(address, network);
  },
  
  // Load wallet from private key
  loadWallet: async (privateKey, network) => {
    return loadWallet(privateKey, network);
  }
};
