// This file would normally contain API calls to your backend
// For this demo, we're using the wallet service directly

import {
  createWallet,
  getBalance,
  getAllTokenBalances,
  getTransactionHistory,
  loadWallet
} from '../services/walletService';
import type { Wallet, Token, Transaction } from '../types';
import { ethers } from 'ethers';

// In a real application, these would be API calls to your backend
export const api = {
  // Create a new wallet
  createWallet: async (): Promise<Wallet> => {
    return createWallet();
  },
  
  // Get wallet balance
  getBalance: async (address: string, network: string): Promise<string> => {
    return getBalance(address, network);
  },
  
  // Get all token balances
  getTokenBalances: async (address: string, network: string): Promise<Token[]> => {
    return getAllTokenBalances(address, network);
  },
  
  // Get transaction history
  getTransactionHistory: async (address: string, network: string): Promise<Transaction[]> => {
    return getTransactionHistory(address, network);
  },
  
  // Load wallet from private key
  loadWallet: async (privateKey: string, network: string): Promise<ethers.Wallet> => {
    return loadWallet(privateKey, network);
  }
};
