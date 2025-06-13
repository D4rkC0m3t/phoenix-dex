const { ethers } = require("ethers");
require("dotenv").config();

// Create providers for different networks
const mainnetProvider = new ethers.JsonRpcProvider(
  `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
);

const sepoliaProvider = new ethers.JsonRpcProvider(
  process.env.ALCHEMY_SEPOLIA_RPC
);

// Export both providers
module.exports = {
  mainnetProvider,
  sepoliaProvider
};
