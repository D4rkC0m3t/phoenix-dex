import {
  JsonRpcProvider,
  Wallet,
  Contract,
  formatEther,
  parseEther,
  formatUnits,
  parseUnits
} from 'ethers';
import type { Wallet as AppWallet, Token, Transaction } from '../types';

// For transaction status tracking
interface TxStatus {
  hash: string;
  status: 'pending' | 'confirmed' | 'failed';
  confirmations: number;
}

// Providers for different networks
const providers: Record<string, JsonRpcProvider> = {
  mainnet: new JsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/_43V82zF2JrnEnxBkJz0PTjBq9w-R9dz'),
  sepolia: new JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/_43V82zF2JrnEnxBkJz0PTjBq9w-R9dz')
};

// Sample token addresses for different networks
const tokenAddresses: Record<string, Record<string, string>> = {
  mainnet: {
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
  },
  sepolia: {
    LINK: '0x779877A7B0D9E8603169DdbD7836e478b4624789',
    WETH: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9'
  }
};

// Create a new wallet
export const createWallet = (): AppWallet => {
  const wallet = Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic?.phrase || ''
  };
};

// Load wallet from private key
export const loadWallet = (privateKey: string, network: string = 'sepolia'): Wallet => {
  try {
    const provider = providers[network];
    const wallet = new Wallet(privateKey, provider);
    return wallet;
  } catch (error) {
    console.error('Error loading wallet:', error);
    throw error;
  }
};

// Get ETH balance
export const getBalance = async (address: string, network: string = 'sepolia'): Promise<string> => {
  try {
    const provider = providers[network];
    const balance = await provider.getBalance(address);
    return formatEther(balance);
  } catch (error) {
    console.error('Error getting balance:', error);
    return '0.0';
  }
};

// Get token balance
export const getTokenBalance = async (
  walletAddress: string,
  tokenAddress: string,
  network: string = 'sepolia'
): Promise<{ symbol: string, balance: string }> => {
  try {
    const provider = providers[network];
    const abi = [
      'function balanceOf(address owner) view returns (uint256)',
      'function decimals() view returns (uint8)',
      'function symbol() view returns (string)'
    ];

    const tokenContract = new Contract(tokenAddress, abi, provider);

    const rawBalance = await tokenContract.balanceOf(walletAddress);
    const decimals = await tokenContract.decimals();
    const symbol = await tokenContract.symbol();

    const formatted = formatUnits(rawBalance, decimals);
    return { symbol, balance: formatted };
  } catch (error) {
    console.error('Error getting token balance:', error);
    return { symbol: 'ERROR', balance: '0' };
  }
};

// Get all token balances
export const getAllTokenBalances = async (
  address: string,
  network: string = 'sepolia'
): Promise<Token[]> => {
  const tokens = tokenAddresses[network];
  const results: Token[] = [];

  for (const [symbol, tokenAddress] of Object.entries(tokens)) {
    try {
      const tokenInfo = await getTokenBalance(address, tokenAddress, network);
      results.push({
        symbol,
        address: tokenAddress,
        balance: tokenInfo.balance
      });
    } catch (error) {
      console.error(`Error getting ${symbol} balance:`, error);
    }
  }

  return results;
};

// Send ETH transaction
export const sendTransaction = async (
  privateKey: string,
  to: string,
  amount: string,
  network: string = 'sepolia',
  gasPrice?: string
): Promise<string> => {
  try {
    const provider = providers[network];
    const wallet = new Wallet(privateKey, provider);

    // Add gas price if specified
    let overrides: any = {};
    if (gasPrice) {
      overrides.gasPrice = parseUnits(gasPrice, 'gwei');
    }

    // Estimate gas limit
    const gasEstimate = await provider.estimateGas({
      from: wallet.address,
      to: to,
      value: parseEther(amount)
    });

    // Add 20% buffer to gas limit
    overrides.gasLimit = gasEstimate * BigInt(120) / BigInt(100);

    // Send transaction
    const transaction = await wallet.sendTransaction({
      to,
      value: parseEther(amount),
      ...overrides
    });

    // Return transaction hash
    return transaction.hash;
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw error;
  }
};

// Get transaction status
export const getTransactionStatus = async (
  txHash: string,
  network: string = 'sepolia'
): Promise<TxStatus> => {
  try {
    const provider = providers[network];
    const tx = await provider.getTransaction(txHash);

    if (!tx) {
      return {
        hash: txHash,
        status: 'pending',
        confirmations: 0
      };
    }

    const receipt = await provider.getTransactionReceipt(txHash);

    if (!receipt) {
      return {
        hash: txHash,
        status: 'pending',
        confirmations: 0
      };
    }

    const status = receipt.status === 1 ? 'confirmed' : 'failed';
    const confirmations = receipt ? await receipt.confirmations() : 0;

    return {
      hash: txHash,
      status,
      confirmations
    };
  } catch (error) {
    console.error('Error getting transaction status:', error);
    return {
      hash: txHash,
      status: 'pending',
      confirmations: 0
    };
  }
};

// Get detailed transaction information
export const getTransactionDetails = async (
  txHash: string,
  network: string = 'sepolia'
): Promise<any> => {
  try {
    const provider = providers[network];

    // Get transaction data
    const tx = await provider.getTransaction(txHash);
    if (!tx) {
      throw new Error('Transaction not found');
    }

    // Get receipt for confirmation status
    const receipt = await provider.getTransactionReceipt(txHash);

    // Get block information
    const block = tx.blockNumber
      ? await provider.getBlock(tx.blockNumber)
      : null;

    return {
      hash: txHash,
      from: tx.from,
      to: tx.to,
      value: tx.value ? formatEther(tx.value) : '0',
      gasPrice: tx.gasPrice ? formatUnits(tx.gasPrice, 'gwei') : '0',
      gasLimit: tx.gasLimit?.toString() || '0',
      nonce: tx.nonce,
      data: tx.data,
      blockNumber: tx.blockNumber,
      blockHash: tx.blockHash,
      timestamp: block ? new Date(block.timestamp * 1000).toISOString() : null,
      confirmations: receipt ? receipt.confirmations : 0,
      status: receipt ? (receipt.status === 1 ? 'confirmed' : 'failed') : 'pending',
      gasUsed: receipt ? receipt.gasUsed.toString() : '0',
      effectiveGasPrice: receipt && 'effectiveGasPrice' in receipt && typeof (receipt as any).effectiveGasPrice === 'bigint'
        ? formatUnits((receipt as any).effectiveGasPrice, 'gwei')
        : formatUnits(0n, 'gwei'),
      cumulativeGasUsed: receipt ? receipt.cumulativeGasUsed.toString() : '0',
    };
  } catch (error) {
    console.error('Error getting transaction details:', error);
    throw error;
  }
};

// Mock transaction history (for demo purposes)
export const getTransactionHistory = (
  address: string
): Transaction[] => {
  // In a real app, you would fetch this from an API or blockchain
  return [
    {
      hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      type: 'receive',
      status: 'confirmed',
      amount: '0.1',
      timestamp: Date.now() - 3600000, // 1 hour ago
      from: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      to: address
    },
    {
      hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      type: 'send',
      status: 'confirmed',
      amount: '0.05',
      timestamp: Date.now() - 86400000, // 1 day ago
      from: address,
      to: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
    },
    {
      hash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
      type: 'send',
      status: 'pending',
      amount: '0.01',
      timestamp: Date.now() - 300000, // 5 minutes ago
      from: address,
      to: '0x6B175474E89094C44Da98b954EedeAC495271d0F'
    }
  ];
};
