# Ethereum Wallet with Alchemy SDK

A real-time Ethereum wallet application built with the Alchemy SDK that allows you to:

- Create new Ethereum wallets
- Check ETH balances in real-time
- Check ERC-20 token balances
- Send ETH transactions
- Work with Sepolia testnet for development

## Setup

1. Make sure you have Node.js installed
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with your Alchemy API keys:
   ```
   ALCHEMY_API_KEY=your_alchemy_api_key
   ALCHEMY_SEPOLIA_RPC=https://eth-sepolia.g.alchemy.com/v2/your_alchemy_key
   ```

## Usage

### Main Application

Run the main application to create a new wallet and monitor your existing wallet:

```
node index.js
```

This will:
- Create a new wallet (address, private key, mnemonic)
- Check the ETH balance of your loaded wallet
- Check token balances for common ERC-20 tokens
- Monitor your wallet for real-time balance updates

### Check Token Balances

Check token balances for any address:

```
node check-tokens.js <wallet_address> [custom_token_address]
```

Or set environment variables:

```
WALLET_ADDRESS=0x... TOKEN_ADDRESS=0x... node check-tokens.js
```

### Send ETH

To send ETH from your wallet to another address:

```
node send-eth.js
```

Before using this script, set up your sender information in the `.env` file:

```
SENDER_PRIVATE_KEY=your_private_key_here
RECIPIENT_ADDRESS=recipient_address_here
AMOUNT_TO_SEND=0.001
```

### Sepolia Testnet

For development and testing, you can use the Sepolia testnet:

```bash
node sepolia.js
```

This will:
- Create a new wallet
- Check your wallet balance on Sepolia
- Monitor your wallet for real-time balance updates on Sepolia

#### Getting Sepolia Testnet ETH

To get free Sepolia testnet ETH for development:

```bash
node faucet-guide.js
```

This script will guide you through the process of getting testnet ETH from faucets.

#### Sending ETH on Sepolia

To send ETH on the Sepolia testnet:

```bash
node send-sepolia.js
```

Before using this script, set up your sender information in the `.env` file:

```bash
SENDER_PRIVATE_KEY=your_private_key_here
RECIPIENT_ADDRESS=recipient_address_here
AMOUNT_TO_SEND=0.01
```

## Files

- `wallet.js` - Core wallet functionality (create, load, balance, send)
- `realtime.js` - Real-time balance monitoring
- `index.js` - Main application entry point
- `check-tokens.js` - Script to check token balances
- `send-eth.js` - Script to send ETH transactions
- `provider.js` - Network providers for Mainnet and Sepolia
- `sepolia.js` - Sepolia testnet wallet operations
- `faucet-guide.js` - Guide to get Sepolia testnet ETH
- `send-sepolia.js` - Script to send ETH on Sepolia testnet

## Security Notes

- Never hardcode private keys in your code
- Store private keys securely
- Use environment variables or secure vaults for sensitive information
- Consider using hardware wallets for production use

## Common ERC-20 Tokens

The application includes support for checking balances of these common tokens:

| Token | Address |
|-------|---------|
| USDC | 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 |
| USDT | 0xdAC17F958D2ee523a2206206994597C13D831ec7 |
| DAI | 0x6B175474E89094C44Da98b954EedeAC495271d0F |
| WETH | 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2 |
| LINK | 0x514910771AF9Ca656af840dff83E8264EcF986CA |
| UNI | 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984 |
| AAVE | 0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9 |
| CRV | 0xD533a949740bb3306d119CC777fa900bA034cd52 |
| COMP | 0xc00e94Cb662C3520282E6f5717214004A7f26888 |
| MKR | 0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2 |
