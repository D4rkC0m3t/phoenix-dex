import { ethers } from 'ethers';
import { getProvider, getWeb3Provider } from './provider';
import { getPrice } from './priceService';
import { getSettings } from './settingsService';

// Uniswap V2 Router address (Mainnet)
const UNISWAP_ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

// Uniswap V2 Router ABI (simplified)
const UNISWAP_ROUTER_ABI = [
  'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
  'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
  'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
];

// ERC20 Token ABI (simplified)
const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function balanceOf(address) view returns (uint)',
  'function allowance(address owner, address spender) view returns (uint)',
  'function approve(address spender, uint value) returns (bool)'
];

// Common token addresses (Mainnet)
export const TOKEN_ADDRESSES: Record<string, string> = {
  ETH: 'ETH', // Special case for ETH
  WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  LINK: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
  UNI: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
  AAVE: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
  COMP: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
  SNX: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
  MKR: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
  YFI: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
  CRV: '0xD533a949740bb3306d119CC777fa900bA034cd52',
  BAL: '0xba100000625a3754423978a60c9317c58a424e3D',
  SUSHI: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2'
};

// Token metadata
export interface TokenMetadata {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
}

// Common tokens with metadata
export const COMMON_TOKENS: TokenMetadata[] = [
  {
    address: 'ETH',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
  },
  {
    address: TOKEN_ADDRESSES.WETH,
    symbol: 'WETH',
    name: 'Wrapped Ethereum',
    decimals: 18,
    logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
  },
  {
    address: TOKEN_ADDRESSES.USDT,
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    logoURI: 'https://cryptologos.cc/logos/tether-usdt-logo.png'
  },
  {
    address: TOKEN_ADDRESSES.USDC,
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoURI: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
  },
  {
    address: TOKEN_ADDRESSES.DAI,
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    logoURI: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png'
  },
  {
    address: TOKEN_ADDRESSES.LINK,
    symbol: 'LINK',
    name: 'Chainlink',
    decimals: 18,
    logoURI: 'https://cryptologos.cc/logos/chainlink-link-logo.png'
  },
  {
    address: TOKEN_ADDRESSES.UNI,
    symbol: 'UNI',
    name: 'Uniswap',
    decimals: 18,
    logoURI: 'https://cryptologos.cc/logos/uniswap-uni-logo.png'
  }
];

// Swap quote
export interface SwapQuote {
  inputAmount: string;
  outputAmount: string;
  executionPrice: string;
  priceImpact: string;
  route: string[];
  minimumReceived: string;
  fee: string;
}

// Get token metadata
export const getTokenMetadata = async (tokenAddress: string): Promise<TokenMetadata> => {
  // Check if it's ETH
  if (tokenAddress === 'ETH') {
    return COMMON_TOKENS[0];
  }
  
  // Check if it's a common token
  const commonToken = COMMON_TOKENS.find(token => token.address.toLowerCase() === tokenAddress.toLowerCase());
  if (commonToken) {
    return commonToken;
  }
  
  // Otherwise, fetch token metadata from the blockchain
  try {
    const provider = getProvider();
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    
    const [name, symbol, decimals] = await Promise.all([
      tokenContract.name(),
      tokenContract.symbol(),
      tokenContract.decimals()
    ]);
    
    return {
      address: tokenAddress,
      name,
      symbol,
      decimals
    };
  } catch (error) {
    console.error("Error fetching token metadata:", error);
    throw new Error("Failed to fetch token metadata");
  }
};

// Get token balance
export const getTokenBalance = async (tokenAddress: string, walletAddress: string): Promise<string> => {
  try {
    const provider = getProvider();
    
    // Handle ETH balance
    if (tokenAddress === 'ETH') {
      const balance = await provider.getBalance(walletAddress);
      return ethers.utils.formatEther(balance);
    }
    
    // Handle ERC20 token balance
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    const balance = await tokenContract.balanceOf(walletAddress);
    const decimals = await tokenContract.decimals();
    
    return ethers.utils.formatUnits(balance, decimals);
  } catch (error) {
    console.error("Error fetching token balance:", error);
    throw new Error("Failed to fetch token balance");
  }
};

// Check token allowance
export const checkAllowance = async (
  tokenAddress: string,
  walletAddress: string,
  amount: string
): Promise<boolean> => {
  try {
    // ETH doesn't need approval
    if (tokenAddress === 'ETH') {
      return true;
    }
    
    const provider = getProvider();
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    
    // Get token decimals
    const decimals = await tokenContract.decimals();
    
    // Get current allowance
    const allowance = await tokenContract.allowance(walletAddress, UNISWAP_ROUTER_ADDRESS);
    
    // Parse amount to wei
    const amountWei = ethers.utils.parseUnits(amount, decimals);
    
    // Check if allowance is sufficient
    return allowance.gte(amountWei);
  } catch (error) {
    console.error("Error checking allowance:", error);
    throw new Error("Failed to check token allowance");
  }
};

// Approve token spending
export const approveToken = async (
  tokenAddress: string,
  amount: string
): Promise<string> => {
  try {
    // ETH doesn't need approval
    if (tokenAddress === 'ETH') {
      return '';
    }
    
    const web3Provider = getWeb3Provider();
    const signer = web3Provider.getSigner();
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
    
    // Get token decimals
    const decimals = await tokenContract.decimals();
    
    // Parse amount to wei (use max uint256 for unlimited approval)
    const amountWei = ethers.constants.MaxUint256;
    
    // Send approval transaction
    const tx = await tokenContract.approve(UNISWAP_ROUTER_ADDRESS, amountWei);
    
    // Wait for transaction to be mined
    await tx.wait();
    
    return tx.hash;
  } catch (error) {
    console.error("Error approving token:", error);
    throw new Error("Failed to approve token");
  }
};

// Get swap quote
export const getSwapQuote = async (
  inputToken: string,
  outputToken: string,
  inputAmount: string
): Promise<SwapQuote> => {
  try {
    // Mock implementation for demo purposes
    // In a real app, you would call the Uniswap SDK or API
    
    // Get token prices
    const inputTokenId = getTokenCoinGeckoId(inputToken);
    const outputTokenId = getTokenCoinGeckoId(outputToken);
    
    const [inputPrice, outputPrice] = await Promise.all([
      getPrice(inputTokenId),
      getPrice(outputTokenId)
    ]);
    
    // Calculate output amount based on prices
    const inputAmountNum = parseFloat(inputAmount);
    const inputValueUsd = inputAmountNum * inputPrice.usd;
    const outputAmountNum = inputValueUsd / outputPrice.usd;
    
    // Apply a mock price impact (0.1% - 2%)
    const priceImpact = 0.1 + Math.random() * 1.9;
    const adjustedOutputAmount = outputAmountNum * (1 - priceImpact / 100);
    
    // Get settings for slippage
    const settings = getSettings();
    const slippageTolerance = settings.advanced.slippageTolerance;
    
    // Calculate minimum received with slippage
    const minimumReceived = adjustedOutputAmount * (1 - slippageTolerance / 100);
    
    // Mock fee (0.3% for Uniswap V2)
    const fee = inputValueUsd * 0.003;
    
    return {
      inputAmount: inputAmount,
      outputAmount: adjustedOutputAmount.toFixed(6),
      executionPrice: (adjustedOutputAmount / inputAmountNum).toFixed(6),
      priceImpact: priceImpact.toFixed(2),
      route: [inputToken, outputToken],
      minimumReceived: minimumReceived.toFixed(6),
      fee: fee.toFixed(2)
    };
  } catch (error) {
    console.error("Error getting swap quote:", error);
    throw new Error("Failed to get swap quote");
  }
};

// Execute swap
export const executeSwap = async (
  inputToken: string,
  outputToken: string,
  inputAmount: string,
  minOutputAmount: string,
  deadline: number = 20 // minutes
): Promise<string> => {
  try {
    const web3Provider = getWeb3Provider();
    const signer = web3Provider.getSigner();
    const walletAddress = await signer.getAddress();
    
    // Create router contract instance
    const router = new ethers.Contract(UNISWAP_ROUTER_ADDRESS, UNISWAP_ROUTER_ABI, signer);
    
    // Get token metadata
    const inputTokenMetadata = await getTokenMetadata(inputToken);
    const outputTokenMetadata = await getTokenMetadata(outputToken);
    
    // Calculate deadline timestamp
    const deadlineTimestamp = Math.floor(Date.now() / 1000) + deadline * 60;
    
    // Parse amounts
    const inputAmountWei = ethers.utils.parseUnits(inputAmount, inputTokenMetadata.decimals);
    const minOutputAmountWei = ethers.utils.parseUnits(minOutputAmount, outputTokenMetadata.decimals);
    
    let tx;
    
    // ETH -> Token
    if (inputToken === 'ETH') {
      const path = [TOKEN_ADDRESSES.WETH, outputToken];
      tx = await router.swapExactETHForTokens(
        minOutputAmountWei,
        path,
        walletAddress,
        deadlineTimestamp,
        { value: inputAmountWei }
      );
    }
    // Token -> ETH
    else if (outputToken === 'ETH') {
      const path = [inputToken, TOKEN_ADDRESSES.WETH];
      tx = await router.swapExactTokensForETH(
        inputAmountWei,
        minOutputAmountWei,
        path,
        walletAddress,
        deadlineTimestamp
      );
    }
    // Token -> Token
    else {
      const path = [inputToken, TOKEN_ADDRESSES.WETH, outputToken];
      tx = await router.swapExactTokensForTokens(
        inputAmountWei,
        minOutputAmountWei,
        path,
        walletAddress,
        deadlineTimestamp
      );
    }
    
    // Wait for transaction to be mined
    await tx.wait();
    
    return tx.hash;
  } catch (error) {
    console.error("Error executing swap:", error);
    throw new Error("Failed to execute swap");
  }
};

// Helper function to get CoinGecko ID for a token
const getTokenCoinGeckoId = (tokenAddress: string): string => {
  const tokenMap: Record<string, string> = {
    'ETH': 'ethereum',
    [TOKEN_ADDRESSES.WETH]: 'weth',
    [TOKEN_ADDRESSES.USDT]: 'tether',
    [TOKEN_ADDRESSES.USDC]: 'usd-coin',
    [TOKEN_ADDRESSES.DAI]: 'dai',
    [TOKEN_ADDRESSES.LINK]: 'chainlink',
    [TOKEN_ADDRESSES.UNI]: 'uniswap',
    [TOKEN_ADDRESSES.AAVE]: 'aave',
    [TOKEN_ADDRESSES.COMP]: 'compound-governance-token',
    [TOKEN_ADDRESSES.SNX]: 'synthetix-network-token',
    [TOKEN_ADDRESSES.MKR]: 'maker',
    [TOKEN_ADDRESSES.YFI]: 'yearn-finance',
    [TOKEN_ADDRESSES.CRV]: 'curve-dao-token',
    [TOKEN_ADDRESSES.BAL]: 'balancer',
    [TOKEN_ADDRESSES.SUSHI]: 'sushi'
  };
  
  return tokenMap[tokenAddress] || 'ethereum';
};
