import { ethers } from "ethers";
import { provider, getWeb3Provider } from "./provider";

// Gas fee types
export interface GasFeeEstimate {
  maxFeePerGas: ethers.BigNumber;
  maxPriorityFeePerGas: ethers.BigNumber;
  gasLimit: ethers.BigNumber;
  gasPrice?: ethers.BigNumber; // For legacy transactions
  estimatedCost: ethers.BigNumber;
  estimatedTime: string;
  type: 'low' | 'medium' | 'high';
}

// Gas price data from network
export interface GasPriceData {
  low: {
    maxFeePerGas: ethers.BigNumber;
    maxPriorityFeePerGas: ethers.BigNumber;
    estimatedTime: string;
  };
  medium: {
    maxFeePerGas: ethers.BigNumber;
    maxPriorityFeePerGas: ethers.BigNumber;
    estimatedTime: string;
  };
  high: {
    maxFeePerGas: ethers.BigNumber;
    maxPriorityFeePerGas: ethers.BigNumber;
    estimatedTime: string;
  };
  baseFeePerGas: ethers.BigNumber;
  gasPrice: ethers.BigNumber; // For legacy transactions
  lastUpdated: number;
}

// Cache for gas price data
let gasPriceCache: GasPriceData | null = null;
// Cache TTL in milliseconds (30 seconds)
const CACHE_TTL = 30 * 1000;

/**
 * Get current gas price data from the network
 * @returns Gas price data including base fee, priority fees, and estimated times
 */
export const getGasPriceData = async (): Promise<GasPriceData> => {
  // Check cache first
  if (gasPriceCache && Date.now() - gasPriceCache.lastUpdated < CACHE_TTL) {
    return gasPriceCache;
  }
  
  try {
    // Get latest block to extract base fee
    const latestBlock = await provider.getBlock("latest");
    const baseFeePerGas = latestBlock.baseFeePerGas || ethers.BigNumber.from(0);
    
    // Get current gas price (for legacy transactions)
    const gasPrice = await provider.getGasPrice();
    
    // Calculate suggested max fees
    // Low: base fee + small priority fee
    const lowPriorityFee = ethers.utils.parseUnits("1", "gwei");
    const lowMaxFee = baseFeePerGas.mul(12).div(10).add(lowPriorityFee);
    
    // Medium: base fee + medium priority fee
    const mediumPriorityFee = ethers.utils.parseUnits("1.5", "gwei");
    const mediumMaxFee = baseFeePerGas.mul(15).div(10).add(mediumPriorityFee);
    
    // High: base fee + high priority fee
    const highPriorityFee = ethers.utils.parseUnits("2.5", "gwei");
    const highMaxFee = baseFeePerGas.mul(20).div(10).add(highPriorityFee);
    
    // Create gas price data
    const gasPriceData: GasPriceData = {
      low: {
        maxFeePerGas: lowMaxFee,
        maxPriorityFeePerGas: lowPriorityFee,
        estimatedTime: "5-10 min"
      },
      medium: {
        maxFeePerGas: mediumMaxFee,
        maxPriorityFeePerGas: mediumPriorityFee,
        estimatedTime: "1-3 min"
      },
      high: {
        maxFeePerGas: highMaxFee,
        maxPriorityFeePerGas: highPriorityFee,
        estimatedTime: "< 30 sec"
      },
      baseFeePerGas,
      gasPrice,
      lastUpdated: Date.now()
    };
    
    // Update cache
    gasPriceCache = gasPriceData;
    
    return gasPriceData;
  } catch (error) {
    console.error("Error fetching gas price data:", error);
    throw new Error("Failed to fetch gas price data");
  }
};

/**
 * Estimate gas limit for a transaction
 * @param txParams Transaction parameters
 * @returns Estimated gas limit
 */
export const estimateGasLimit = async (
  txParams: {
    from?: string;
    to: string;
    value?: string | ethers.BigNumber;
    data?: string;
  }
): Promise<ethers.BigNumber> => {
  try {
    // Convert parameters
    const params: any = { ...txParams };
    
    // Convert value to BigNumber if it's a string
    if (typeof params.value === 'string') {
      params.value = ethers.utils.parseEther(params.value);
    }
    
    // Estimate gas
    const gasLimit = await provider.estimateGas(params);
    
    // Add a buffer (10%) to the estimated gas limit for safety
    return gasLimit.mul(11).div(10);
  } catch (error) {
    console.error("Error estimating gas limit:", error);
    
    // Return a default gas limit for simple ETH transfers
    return ethers.BigNumber.from(21000);
  }
};

/**
 * Estimate gas fee for a transaction
 * @param txParams Transaction parameters
 * @param feeType Fee type (low, medium, high)
 * @returns Gas fee estimate
 */
export const estimateGasFee = async (
  txParams: {
    from?: string;
    to: string;
    value?: string | ethers.BigNumber;
    data?: string;
  },
  feeType: 'low' | 'medium' | 'high' = 'medium'
): Promise<GasFeeEstimate> => {
  try {
    // Get gas price data
    const gasPriceData = await getGasPriceData();
    
    // Estimate gas limit
    const gasLimit = await estimateGasLimit(txParams);
    
    // Get fee data based on type
    const feeData = gasPriceData[feeType];
    
    // Calculate estimated cost
    const estimatedCost = gasLimit.mul(feeData.maxFeePerGas);
    
    return {
      maxFeePerGas: feeData.maxFeePerGas,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
      gasLimit,
      gasPrice: gasPriceData.gasPrice, // For legacy transactions
      estimatedCost,
      estimatedTime: feeData.estimatedTime,
      type: feeType
    };
  } catch (error) {
    console.error("Error estimating gas fee:", error);
    throw new Error("Failed to estimate gas fee");
  }
};

/**
 * Format gas fee for display
 * @param fee Gas fee in wei
 * @returns Formatted gas fee in ETH and USD
 */
export const formatGasFee = (
  fee: ethers.BigNumber,
  ethPrice: number = 2500 // Default ETH price in USD
): { eth: string; usd: string } => {
  const ethAmount = parseFloat(ethers.utils.formatEther(fee));
  const usdAmount = ethAmount * ethPrice;
  
  return {
    eth: ethAmount.toFixed(6),
    usd: usdAmount.toFixed(2)
  };
};

/**
 * Get network congestion level
 * @returns Congestion level (low, medium, high)
 */
export const getNetworkCongestion = async (): Promise<'low' | 'medium' | 'high'> => {
  try {
    const gasPriceData = await getGasPriceData();
    const baseFeeGwei = parseFloat(ethers.utils.formatUnits(gasPriceData.baseFeePerGas, "gwei"));
    
    if (baseFeeGwei < 20) {
      return 'low';
    } else if (baseFeeGwei < 100) {
      return 'medium';
    } else {
      return 'high';
    }
  } catch (error) {
    console.error("Error getting network congestion:", error);
    return 'medium'; // Default to medium if there's an error
  }
};

export default {
  getGasPriceData,
  estimateGasLimit,
  estimateGasFee,
  formatGasFee,
  getNetworkCongestion
};
