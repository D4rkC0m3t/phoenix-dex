const { Alchemy, Network } = require("alchemy-sdk");
const { getBalance } = require("./wallet");
require("dotenv").config();

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_SEPOLIA,
};
const alchemy = new Alchemy(settings);

// Subscribe to new blocks
function subscribeToBalance(address) {
  console.log(`Subscribing to balance updates for ${address}...`);

  // Get current block number
  alchemy.core.getBlockNumber().then(blockNumber => {
    console.log(`Current block number: ${blockNumber}`);
  });

  // Set up polling for new blocks instead of WebSocket
  let lastCheckedBlock = 0;
  const pollInterval = 15000; // 15 seconds

  console.log(`Setting up polling every ${pollInterval/1000} seconds for new blocks...`);

  const intervalId = setInterval(async () => {
    try {
      const currentBlock = await alchemy.core.getBlockNumber();

      if (lastCheckedBlock === 0) {
        lastCheckedBlock = currentBlock;
        return;
      }

      if (currentBlock > lastCheckedBlock) {
        const balance = await getBalance(address);
        console.log(`New block(s) detected! Block #${currentBlock} - Balance: ${balance} ETH`);
        lastCheckedBlock = currentBlock;
      }
    } catch (error) {
      console.error("Error polling for new blocks:", error);
    }
  }, pollInterval);

  return () => {
    // Return unsubscribe function
    clearInterval(intervalId);
    console.log("Stopped polling for balance updates");
  };
}

module.exports = {
  subscribeToBalance
};
