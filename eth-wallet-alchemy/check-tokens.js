const { ethers } = require("ethers");
const { getBalance, getTokenBalance, getChecksumAddress } = require("./wallet");
const { sepoliaProvider } = require("./provider");
require("dotenv").config();

// Common ERC-20 tokens on Sepolia testnet
// Note: These are example addresses and may not be accurate for Sepolia
const TOKENS = {
  // Sepolia test tokens - these are just examples and may not exist
  SEPOLIA_TEST_TOKEN: "0x779877A7B0D9E8603169DdbD7836e478b4624789", // LINK on Sepolia
  WETH_SEPOLIA: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9", // Example WETH on Sepolia
};

async function main() {
  try {
    // Get the wallet address from command line or environment variable
    const walletAddress = process.env.WALLET_ADDRESS || process.argv[2] || "0x3df3B0E2931A4e2E5F12026011C360b1B7Cc82Ec";

    // Validate the address
    const checksummedAddress = getChecksumAddress(walletAddress);
    console.log(`Checking token balances on Sepolia testnet for: ${checksummedAddress}`);

    // Get ETH balance using Sepolia provider
    const ethBalance = await sepoliaProvider.getBalance(checksummedAddress);
    console.log(`\nSepolia ETH Balance: ${ethers.formatEther(ethBalance)} ETH`);

    // Get token balances
    console.log("\n=== Sepolia Token Balances ===");
    console.log("Symbol | Token Address | Balance");
    console.log("-------|--------------|--------");

    for (const [symbol, address] of Object.entries(TOKENS)) {
      try {
        const tokenInfo = await getTokenBalance(checksummedAddress, address);
        console.log(`${symbol.padEnd(20)} | ${address.slice(0, 10)}...${address.slice(-8)} | ${tokenInfo.balance} ${tokenInfo.symbol}`);
      } catch (error) {
        console.log(`Error fetching ${symbol} balance: ${error.message}`);
      }
    }

    // Check if any custom token address was provided
    const customTokenAddress = process.env.TOKEN_ADDRESS || process.argv[3];
    if (customTokenAddress) {
      try {
        console.log(`\n=== Custom Token ===`);
        const tokenInfo = await getTokenBalance(checksummedAddress, customTokenAddress);
        console.log(`Custom | ${customTokenAddress.slice(0, 10)}...${customTokenAddress.slice(-8)} | ${tokenInfo.balance} ${tokenInfo.symbol}`);
      } catch (error) {
        console.log(`Error fetching custom token balance: ${error.message}`);
      }
    }

    console.log("\nDone!");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();
