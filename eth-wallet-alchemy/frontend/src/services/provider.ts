import { JsonRpcProvider } from "ethers";
import type { Provider } from "ethers";
import { Web3Provider } from "@ethersproject/providers";

// Sepolia testnet Alchemy RPC URL
const ALCHEMY_SEPOLIA_RPC = "https://eth-sepolia.g.alchemy.com/v2/_43V82zF2JrnEnxBkJz0PTjBq9w-R9dz";

// Create a provider for Sepolia testnet
export const provider = new JsonRpcProvider(ALCHEMY_SEPOLIA_RPC);

// Get the provider instance
export const getProvider = () => {
  return provider;
};

// Create a provider for connecting to MetaMask or other browser wallets
export const getWeb3Provider = () => {
  if (window.ethereum) {
    return new Web3Provider(window.ethereum);
  }
  throw new Error("No Ethereum browser extension detected");
};

// Get the network name based on chainId
export const getNetworkName = async (provider: Provider): Promise<string> => {
  const network = await provider.getNetwork();

  switch (Number(network.chainId)) {
    case 1:
      return "Mainnet";
    case 11155111:
      return "Sepolia";
    case 5:
      return "Goerli";
    case 137:
      return "Polygon";
    case 80001:
      return "Mumbai";
    default:
      return `Unknown (${network.chainId})`;
  }
};

// Switch network in MetaMask
export const switchNetwork = async (chainId: number): Promise<void> => {
  if (!window.ethereum) throw new Error("No Ethereum browser extension detected");

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  } catch (error: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (error.code === 4902) {
      await addSepoliaNetwork();
    } else {
      throw error;
    }
  }
};

// Add Sepolia network to MetaMask if it doesn't exist
export const addSepoliaNetwork = async (): Promise<void> => {
  if (!window.ethereum) throw new Error("No Ethereum browser extension detected");

  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0xaa36a7', // 11155111 in hexadecimal
          chainName: 'Sepolia Testnet',
          nativeCurrency: {
            name: 'Sepolia ETH',
            symbol: 'ETH',
            decimals: 18,
          },
          rpcUrls: ['https://eth-sepolia.g.alchemy.com/v2/_43V82zF2JrnEnxBkJz0PTjBq9w-R9dz'],
          blockExplorerUrls: ['https://sepolia.etherscan.io/'],
        },
      ],
    });
  } catch (error) {
    console.error("Error adding Sepolia network:", error);
    throw error;
  }
};

export default provider;
