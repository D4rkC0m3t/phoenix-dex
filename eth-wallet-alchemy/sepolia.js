const { ethers } = require("ethers");
const { sepoliaProvider } = require("./provider");
const { createWallet, loadWallet, getBalance, getChecksumAddress } = require("./wallet");
require("dotenv").config();

// Your loaded wallet address
const LOADED_WALLET_ADDRESS = "0x3df3B0E2931A4e2E5F12026011C360b1B7Cc82Ec";

async function main() {
  try {
    console.log("=== Ethereum Wallet with Sepolia Testnet ===");
    
    // Create a new wallet
    const newWallet = createWallet();
    console.log("\n=== New Wallet Created ===");
    console.log("Address:", newWallet.address);
    console.log("Private Key:", newWallet.privateKey);
    console.log("Mnemonic:", newWallet.mnemonic);
    
    // Check your loaded wallet balance on Sepolia
    console.log("\n=== Your Loaded Wallet on Sepolia ===");
    console.log("Address:", LOADED_WALLET_ADDRESS);
    
    const balance = await sepoliaProvider.getBalance(LOADED_WALLET_ADDRESS);
    console.log(`Balance: ${ethers.formatEther(balance)} ETH`);
    
    // Set up real-time monitoring for Sepolia
    console.log("\n=== Real-time Balance Updates (Sepolia) ===");
    console.log("Monitoring for new blocks. Press Ctrl+C to exit.");
    
    // Poll for updates every 15 seconds
    let lastCheckedBlock = 0;
    const pollInterval = 15000; // 15 seconds
    
    const intervalId = setInterval(async () => {
      try {
        const currentBlock = await sepoliaProvider.getBlockNumber();
        
        if (lastCheckedBlock === 0) {
          console.log(`Current block number: ${currentBlock}`);
          lastCheckedBlock = currentBlock;
          return;
        }
        
        if (currentBlock > lastCheckedBlock) {
          const updatedBalance = await sepoliaProvider.getBalance(LOADED_WALLET_ADDRESS);
          console.log(`Block #${currentBlock} - Balance: ${ethers.formatEther(updatedBalance)} ETH`);
          lastCheckedBlock = currentBlock;
        }
      } catch (error) {
        console.error("Error polling for new blocks:", error.message);
      }
    }, pollInterval);
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('Shutting down...');
      clearInterval(intervalId);
      process.exit(0);
    });
    
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
