import { formatEther, parseEther, isAddress } from "ethers";
import { getWeb3Provider } from "./provider";

/**
 * Interface for transaction result
 */
export interface TransactionResult {
  success: boolean;
  hash?: string;
  error?: string;
}

/**
 * Send ETH from the connected wallet to another address
 * @param toAddress The recipient's Ethereum address
 * @param amountInEth The amount to send in ETH
 * @returns Transaction result with success status and hash or error
 */
export const sendETH = async (toAddress: string, amountInEth: string): Promise<TransactionResult> => {
  try {
    // Validate inputs
    if (!isAddress(toAddress)) {
      throw new Error("Invalid recipient address");
    }
    
    if (isNaN(parseFloat(amountInEth)) || parseFloat(amountInEth) <= 0) {
      throw new Error("Invalid amount");
    }
    
    // Get the web3 provider and signer
    const web3Provider = getWeb3Provider();
    const signer = web3Provider.getSigner();
    
    // Create and send the transaction
    const tx = await signer.sendTransaction({
      to: toAddress,
      value: parseEther(amountInEth.toString()),
    });
    
    console.log("Transaction sent:", tx.hash);
    
    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log("Transaction confirmed in block:", receipt.blockNumber);
    
    return {
      success: true,
      hash: tx.hash
    };
  } catch (err: any) {
    console.error("Error sending ETH:", err.message);
    
    // Handle specific error cases
    if (err.code === 4001) {
      // User rejected the transaction
      return {
        success: false,
        error: "Transaction rejected by user"
      };
    }
    
    if (err.code === -32603) {
      // Internal error, likely insufficient funds
      return {
        success: false,
        error: "Insufficient funds for gas * price + value"
      };
    }
    
    return {
      success: false,
      error: err.message
    };
  }
};

/**
 * Estimate gas for an ETH transfer
 * @param toAddress The recipient's Ethereum address
 * @param amountInEth The amount to send in ETH
 * @returns Estimated gas cost in ETH
 */
export const estimateGas = async (toAddress: string, amountInEth: string): Promise<string> => {
  try {
    // Validate inputs
    if (!isAddress(toAddress)) {
      throw new Error("Invalid recipient address");
    }
    
    if (isNaN(parseFloat(amountInEth)) || parseFloat(amountInEth) <= 0) {
      throw new Error("Invalid amount");
    }
    
    // Get the web3 provider and signer
    const web3Provider = getWeb3Provider();
    const signer = web3Provider.getSigner();
    const fromAddress = await signer.getAddress();
    
    // Estimate gas
    const gasEstimate = await web3Provider.estimateGas({
      from: fromAddress,
      to: toAddress,
      value: parseEther(amountInEth.toString())
    });
    
    // Get gas price
    const gasPrice = await web3Provider.getGasPrice();
    
    // Calculate total gas cost
    const gasCost = gasEstimate.mul(gasPrice);
    
    return formatEther(gasCost.toString());
  } catch (err: any) {
    console.error("Error estimating gas:", err.message);
    throw new Error(`Failed to estimate gas: ${err.message}`);
  }
};

export default {
  sendETH,
  estimateGas
};
