import { Contract, formatUnits, parseUnits, isAddress } from "ethers";
import { provider, getWeb3Provider } from "./provider";

// Standard ERC-20 ABI for the functions we need
const ERC20_ABI = [
  // Read-only functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address owner) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  // Write functions
  "function transfer(address to, uint amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  // Events
  "event Transfer(address indexed from, address indexed to, uint amount)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

// TokenBalance type for portfolio and analytics
export interface TokenBalance {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  balance: string;
  logo?: string;
  [key: string]: any;
}

// Common Sepolia testnet tokens
export const SEPOLIA_TOKENS = [
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", // Sepolia USDC
    decimals: 6,
    logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
  },
  {
    symbol: "DAI",
    name: "Dai Stablecoin",
    address: "0x68194a729C2450ad26072b3D33ADaCbcef39D574", // Sepolia DAI
    decimals: 18,
    logo: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png"
  },
  {
    symbol: "LINK",
    name: "Chainlink",
    address: "0x779877A7B0D9E8603169DdbD7836e478b4624789", // Sepolia LINK
    decimals: 18,
    logo: "https://cryptologos.cc/logos/chainlink-link-logo.png"
  }
];

/**
 * Get the balance of an ERC-20 token for a specific address
 * @param tokenAddress The contract address of the ERC-20 token
 * @param walletAddress The wallet address to check the balance for
 * @returns The token balance as a formatted string
 */
export const getTokenBalance = async (
  tokenAddress: string,
  walletAddress: string
): Promise<string> => {
  try {
    const tokenContract = new Contract(tokenAddress, ERC20_ABI, provider);
    const balance = await tokenContract.balanceOf(walletAddress);
    const decimals = await tokenContract.decimals();
    
    return formatUnits(balance, decimals);
  } catch (err: any) {
    console.error(`Error fetching token balance for ${tokenAddress}:`, err.message);
    throw new Error(`Failed to fetch token balance: ${err.message}`);
  }
};

/**
 * Get the balances of multiple ERC-20 tokens for a specific address
 * @param walletAddress The wallet address to check balances for
 * @param tokenAddresses Optional array of token addresses to check (defaults to SEPOLIA_TOKENS)
 * @returns Array of token objects with balances
 */
export const getTokenBalances = async (
  walletAddress: string,
  tokenAddresses?: string[]
): Promise<TokenBalance[]> => {
  try {
    const tokens = tokenAddresses 
      ? await Promise.all(tokenAddresses.map(address => getTokenDetails(address)))
      : SEPOLIA_TOKENS;
    
    const tokenBalances = await Promise.all(
      tokens.map(async (token) => {
        try {
          const balance = await getTokenBalance(token.address, walletAddress);
          return {
            ...token,
            balance
          };
        } catch (error) {
          console.error(`Error fetching balance for ${token.symbol}:`, error);
          return {
            ...token,
            balance: "0",
            error: true
          };
        }
      })
    );
    
    return tokenBalances;
  } catch (err: any) {
    console.error("Error fetching token balances:", err.message);
    throw new Error(`Failed to fetch token balances: ${err.message}`);
  }
};

/**
 * Get details about an ERC-20 token
 * @param tokenAddress The contract address of the ERC-20 token
 * @returns Token details including name, symbol, and decimals
 */
export const getTokenDetails = async (tokenAddress: string): Promise<TokenBalance> => {
  try {
    const tokenContract = new Contract(tokenAddress, ERC20_ABI, provider);
    
    const [name, symbol, decimals] = await Promise.all([
      tokenContract.name(),
      tokenContract.symbol(),
      tokenContract.decimals()
    ]);
    
    return {
      address: tokenAddress,
      name,
      symbol,
      decimals,
      balance: "0"
    };
  } catch (err: any) {
    console.error(`Error fetching token details for ${tokenAddress}:`, err.message);
    throw new Error(`Failed to fetch token details: ${err.message}`);
  }
};

/**
 * Send ERC-20 tokens from the connected wallet to another address
 * @param tokenAddress The contract address of the ERC-20 token
 * @param toAddress The recipient's address
 * @param amount The amount to send (in token units, not wei)
 * @returns Transaction result with success status and hash or error
 */
export const sendToken = async (
  tokenAddress: string,
  toAddress: string,
  amount: string
): Promise<{ success: boolean; hash?: string; error?: string }> => {
  try {
    // Validate inputs
    if (!isAddress(tokenAddress)) {
      throw new Error("Invalid token address");
    }
    
    if (!isAddress(toAddress)) {
      throw new Error("Invalid recipient address");
    }
    
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      throw new Error("Invalid amount");
    }
    
    // Get the web3 provider and signer
    const web3Provider = getWeb3Provider();
    const signer = web3Provider.getSigner();
    
    // Create contract instance with signer
    const tokenContract = new Contract(tokenAddress, ERC20_ABI, signer as unknown as import('ethers').ContractRunner);
    
    // Get token decimals
    const decimals = await tokenContract.decimals();
    
    // Convert amount to token units
    const amountInTokenUnits = parseUnits(amount, decimals);
    
    // Send the transaction
    const tx = await tokenContract.transfer(toAddress, amountInTokenUnits);
    console.log("Token transfer transaction sent:", tx.hash);
    
    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log("Token transfer confirmed in block:", receipt.blockNumber);
    
    return {
      success: true,
      hash: tx.hash
    };
  } catch (err: any) {
    console.error("Error sending tokens:", err.message);
    
    // Handle specific error cases
    if (err.code === 4001) {
      // User rejected the transaction
      return {
        success: false,
        error: "Transaction rejected by user"
      };
    }
    
    return {
      success: false,
      error: err.message
    };
  }
};

export default {
  getTokenBalance,
  getTokenBalances,
  getTokenDetails,
  sendToken,
  SEPOLIA_TOKENS
};
