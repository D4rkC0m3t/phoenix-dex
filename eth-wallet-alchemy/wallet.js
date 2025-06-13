const { ethers } = require("ethers");
const { mainnetProvider, sepoliaProvider } = require("./provider");
require("dotenv").config();

// Default to Sepolia for development
const provider = sepoliaProvider;

// Helper function to get checksummed address
function getChecksumAddress(address) {
  try {
    return ethers.getAddress(address);
  } catch (error) {
    console.error("Invalid address:", error.message);
    return address;
  }
}

// Create new wallet
function createWallet() {
  const wallet = ethers.Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic.phrase
  };
}

// Load wallet from private key
function loadWallet(privateKey) {
  return new ethers.Wallet(privateKey, provider);
}

// Get ETH balance
async function getBalance(address) {
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
}

// Send ETH to another address
async function sendETH(wallet, to, amountInEth) {
  const tx = {
    to,
    value: ethers.parseEther(amountInEth)
  };
  const sentTx = await wallet.connect(provider).sendTransaction(tx);
  return sentTx;
}

// Get ERC-20 token balance
async function getTokenBalance(walletAddress, tokenAddress) {
  const abi = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)"
  ];

  try {
    // Get checksummed addresses
    const checksummedWalletAddress = getChecksumAddress(walletAddress);
    const checksummedTokenAddress = getChecksumAddress(tokenAddress);

    const tokenContract = new ethers.Contract(checksummedTokenAddress, abi, provider);

    const rawBalance = await tokenContract.balanceOf(checksummedWalletAddress);
    const decimals = await tokenContract.decimals();
    const symbol = await tokenContract.symbol();

    const formatted = ethers.formatUnits(rawBalance, decimals);
    return { symbol, balance: formatted };
  } catch (error) {
    console.error("Error fetching token balance:", error.message);
    return { symbol: "ERROR", balance: "0" };
  }
}

module.exports = {
  createWallet,
  loadWallet,
  getBalance,
  sendETH,
  getTokenBalance,
  getChecksumAddress
};
