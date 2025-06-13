import { formatEther } from "ethers";
import { provider, getWeb3Provider } from "./provider";

/**
 * Get the balance of a wallet address
 * @param address The Ethereum address to check
 * @returns The balance in ETH as a formatted string
 */
export const getWalletBalance = async (address: string): Promise<string> => {
  try {
    const balance = await provider.getBalance(address);
    return formatEther(balance);
  } catch (err: any) {
    console.error("Error fetching balance:", err.message);
    throw new Error(`Failed to fetch balance: ${err.message}`);
  }
};

/**
 * Get the transaction history for a wallet address
 * @param address The Ethereum address to check
 * @param limit The maximum number of transactions to return
 * @returns Array of transaction objects
 */
export const getTransactionHistory = async (address: string, limit: number = 10): Promise<any[]> => {
  try {
    // This is a simplified version - in a real app, you'd use Alchemy's API or Etherscan API
    // to get a proper transaction history
    const blockNumber = await provider.getBlockNumber();
    const transactions = [];
    
    // Look back through the last 100 blocks (or use a service like Alchemy/Etherscan in production)
    const lookbackBlocks = 100;
    const startBlock = Math.max(0, blockNumber - lookbackBlocks);
    
    for (let i = blockNumber; i >= startBlock && transactions.length < limit; i--) {
      const block = await provider.getBlock(i, true); // 'true' fetches transactions in ethers v6
      
      // Filter transactions involving our address
      if (!block || !block.transactions || !Array.isArray(block.transactions)) continue;
const relevantTxs = (block.transactions as any[]).filter(
  (tx: any) => tx.from?.toLowerCase() === address.toLowerCase() || 
        tx.to?.toLowerCase() === address.toLowerCase()
);
      
      for (const tx of relevantTxs) {
  if (transactions.length >= limit) break;
  transactions.push({
    hash: (tx as any).hash,
    from: (tx as any).from,
    to: (tx as any).to,
    value: formatEther((tx as any).value),
    timestamp: block && 'timestamp' in block ? new Date((block as any).timestamp * 1000).toISOString() : '',
    blockNumber: block && 'number' in block ? (block as any).number : undefined,
    type: (tx as any).from?.toLowerCase() === address.toLowerCase() ? 'sent' : 'received'
  });
}
    }
    
    return transactions;
  } catch (err: any) {
    console.error("Error fetching transaction history:", err.message);
    throw new Error(`Failed to fetch transaction history: ${err.message}`);
  }
};

/**
 * Connect to the user's wallet (MetaMask or other browser extension)
 * @returns The connected wallet address
 */
export const connectWallet = async (): Promise<string> => {
  try {
    const web3Provider = getWeb3Provider();
    await web3Provider.send("eth_requestAccounts", []);
    const signer = web3Provider.getSigner();
    return await signer.getAddress();
  } catch (err: any) {
    console.error("Error connecting wallet:", err.message);
    throw new Error(`Failed to connect wallet: ${err.message}`);
  }
};

/**
 * Set up a listener for real-time balance updates
 * @param address The address to monitor
 * @param callback Function to call when balance changes
 * @returns A function to remove the listener
 */
export const setupBalanceListener = (address: string, callback: (balance: string) => void): (() => void) => {
  let lastBalance: string = '0';
  
  // Check balance on each new block
  const listener = async () => {
    try {
      const balance = await getWalletBalance(address);
      if (balance !== lastBalance) {
        lastBalance = balance;
        callback(balance);
      }
    } catch (error) {
      console.error("Error in balance listener:", error);
    }
  };
  
  // Set up the block listener
  provider.on("block", listener);
  
  // Return a function to remove the listener
  return () => {
    provider.removeListener("block", listener);
  };
};

export default {
  getWalletBalance,
  getTransactionHistory,
  connectWallet,
  setupBalanceListener
};
