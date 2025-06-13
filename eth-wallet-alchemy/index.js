const { createWallet, loadWallet, getBalance, getTokenBalance, sendETH, getChecksumAddress } = require("./wallet");
const { subscribeToBalance } = require("./realtime");

// Your loaded wallet address
const LOADED_WALLET_ADDRESS = "0x3df3B0E2931A4e2E5F12026011C360b1B7Cc82Ec";

// Sample ERC-20 token addresses (with correct checksums for ethers v6)
const TOKEN_ADDRESSES = {
  USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
};

async function main() {
  try {
    console.log("=== Ethereum Wallet with Alchemy SDK ===");

    // Option 1: Create a new wallet
    const newWallet = createWallet();
    console.log("\n=== New Wallet Created ===");
    console.log("Address:", newWallet.address);
    console.log("Private Key:", newWallet.privateKey);
    console.log("Mnemonic:", newWallet.mnemonic);

    // Option 2: Use your loaded wallet address
    console.log("\n=== Your Loaded Wallet ===");
    console.log("Address:", LOADED_WALLET_ADDRESS);

    // Get ETH balance of your loaded wallet
    const ethBalance = await getBalance(LOADED_WALLET_ADDRESS);
    console.log(`ETH Balance: ${ethBalance} ETH`);

    // Get token balances for your loaded wallet
    console.log("\n=== Token Balances ===");
    for (const [symbol, address] of Object.entries(TOKEN_ADDRESSES)) {
      try {
        const tokenInfo = await getTokenBalance(LOADED_WALLET_ADDRESS, address);
        console.log(`${symbol} (${tokenInfo.symbol}): ${tokenInfo.balance}`);
      } catch (error) {
        console.log(`Error fetching ${symbol} balance:`, error.message);
      }
    }

    // Example of how to send ETH (commented out for safety)
    /*
    console.log("\n=== Send ETH Example (Commented Out) ===");
    console.log("To send ETH, you would need to:");
    console.log("1. Load your wallet with private key");
    console.log("2. Call sendETH function with recipient and amount");
    console.log("Example: const tx = await sendETH(wallet, recipientAddress, '0.001');");
    */

    // Subscribe to real-time balance updates for your loaded wallet
    console.log("\n=== Real-time Balance Updates ===");
    const unsubscribe = subscribeToBalance(LOADED_WALLET_ADDRESS);

    // Keep the process running
    console.log("Listening for new blocks. Press Ctrl+C to exit.");

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('Shutting down...');
      unsubscribe();
      process.exit(0);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
