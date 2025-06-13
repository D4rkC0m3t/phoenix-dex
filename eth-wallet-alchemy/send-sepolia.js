const { ethers } = require("ethers");
const { sepoliaProvider } = require("./provider");
require("dotenv").config();

// This script demonstrates how to send ETH on Sepolia testnet
async function main() {
  try {
    // IMPORTANT: Replace with your actual private key or load from a secure source
    // This is just a placeholder and should be replaced with your actual private key
    const PRIVATE_KEY = process.env.SENDER_PRIVATE_KEY || "YOUR_PRIVATE_KEY_HERE";
    
    // The recipient address - replace with the actual recipient
    const RECIPIENT = process.env.RECIPIENT_ADDRESS || "0x3df3B0E2931A4e2E5F12026011C360b1B7Cc82Ec";
    
    // Amount to send in ETH
    const AMOUNT = process.env.AMOUNT_TO_SEND || "0.01";
    
    // Check if private key is provided
    if (PRIVATE_KEY === "YOUR_PRIVATE_KEY_HERE") {
      console.error("⚠️ Please set your private key in the .env file or directly in this script");
      console.log("Example usage:");
      console.log("1. Create a .env file with:");
      console.log("   SENDER_PRIVATE_KEY=your_private_key_here");
      console.log("   RECIPIENT_ADDRESS=recipient_address_here");
      console.log("   AMOUNT_TO_SEND=0.01");
      console.log("2. Or run with environment variables:");
      console.log("   SENDER_PRIVATE_KEY=your_key RECIPIENT_ADDRESS=recipient AMOUNT_TO_SEND=0.01 node send-sepolia.js");
      return;
    }
    
    // Load the wallet with Sepolia provider
    const wallet = new ethers.Wallet(PRIVATE_KEY, sepoliaProvider);
    console.log(`Sender wallet address: ${wallet.address}`);
    
    // Get initial balances
    const senderInitialBalance = await sepoliaProvider.getBalance(wallet.address);
    const recipientInitialBalance = await sepoliaProvider.getBalance(RECIPIENT);
    
    console.log(`Sender initial balance: ${ethers.formatEther(senderInitialBalance)} ETH`);
    console.log(`Recipient initial balance: ${ethers.formatEther(recipientInitialBalance)} ETH`);
    console.log(`Preparing to send ${AMOUNT} ETH to ${RECIPIENT} on Sepolia testnet...`);
    
    // Confirm before sending
    console.log("\n⚠️ THIS WILL SEND SEPOLIA TESTNET ETH FROM YOUR WALLET ⚠️");
    console.log("Press Ctrl+C now to cancel if you don't want to proceed.");
    
    // Wait for 5 seconds to allow cancellation
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Send ETH
    console.log("\nSending transaction...");
    const tx = await wallet.sendTransaction({
      to: RECIPIENT,
      value: ethers.parseEther(AMOUNT)
    });
    
    console.log(`Transaction sent! Hash: ${tx.hash}`);
    console.log(`View on Etherscan: https://sepolia.etherscan.io/tx/${tx.hash}`);
    
    // Wait for transaction to be mined
    console.log("\nWaiting for transaction to be mined...");
    const receipt = await tx.wait();
    console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    
    // Get updated balances
    const senderFinalBalance = await sepoliaProvider.getBalance(wallet.address);
    const recipientFinalBalance = await sepoliaProvider.getBalance(RECIPIENT);
    
    console.log(`\nSender final balance: ${ethers.formatEther(senderFinalBalance)} ETH`);
    console.log(`Recipient final balance: ${ethers.formatEther(recipientFinalBalance)} ETH`);
    
    // Calculate and display the difference
    const senderDiff = parseFloat(ethers.formatEther(senderInitialBalance)) - parseFloat(ethers.formatEther(senderFinalBalance));
    const recipientDiff = parseFloat(ethers.formatEther(recipientFinalBalance)) - parseFloat(ethers.formatEther(recipientInitialBalance));
    
    console.log(`\nSender spent: ${senderDiff.toFixed(6)} ETH (including gas)`);
    console.log(`Recipient received: ${recipientDiff.toFixed(6)} ETH`);
    console.log(`Gas cost: ${(senderDiff - parseFloat(AMOUNT)).toFixed(6)} ETH`);
    
  } catch (error) {
    console.error("Error:", error.message);
    if (error.reason) {
      console.error("Reason:", error.reason);
    }
  }
}

main();
