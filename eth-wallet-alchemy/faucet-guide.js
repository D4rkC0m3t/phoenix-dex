/**
 * This script provides information on how to get Sepolia testnet ETH from faucets.
 * It doesn't actually request ETH automatically, but guides you through the process.
 */

const { createWallet } = require("./wallet");

function main() {
  console.log("=== How to Get Sepolia Testnet ETH ===");
  
  // Create a new wallet if needed
  const newWallet = createWallet();
  console.log("\n=== Your New Wallet ===");
  console.log("Address:", newWallet.address);
  console.log("Private Key:", newWallet.privateKey);
  console.log("Mnemonic:", newWallet.mnemonic);
  
  console.log("\n=== Sepolia Faucet Instructions ===");
  console.log("1. Visit one of these Sepolia faucets:");
  console.log("   - Alchemy Sepolia Faucet: https://sepoliafaucet.com/");
  console.log("   - Infura Sepolia Faucet: https://www.infura.io/faucet/sepolia");
  console.log("   - QuickNode Sepolia Faucet: https://faucet.quicknode.com/ethereum/sepolia");
  
  console.log("\n2. Connect your wallet or paste your wallet address:");
  console.log(`   ${newWallet.address}`);
  
  console.log("\n3. Complete any verification steps required by the faucet");
  
  console.log("\n4. Wait for the testnet ETH to be sent to your wallet");
  
  console.log("\n5. Check your balance using our sepolia.js script:");
  console.log("   node sepolia.js");
  
  console.log("\n=== Important Notes ===");
  console.log("- Sepolia testnet ETH has no real value");
  console.log("- Faucets typically have rate limits (e.g., once per day)");
  console.log("- If one faucet doesn't work, try another");
  console.log("- Save your wallet information securely");
}

main();
