# Phoenix DEX

## Overview
Phoenix DEX is an open-source Ethereum wallet and decentralized-exchange (DEX) interface built with React 18 + TypeScript. It leverages Alchemy’s SDK and ethers.js to provide secure, high-performance blockchain interactions on both Ethereum Mainnet and test networks such as Sepolia. The project’s goal is to offer developers a modern, extensible code-base that demonstrates best-practice Web3 architecture with a crisp Tailwind-powered UI.

## Core Features
1. **Wallet Management**  
   • Create & import wallets (mnemonic or private-key)  
   • View addresses & balances  
   • Copy address to clipboard  
   • Switch between multiple networks
2. **Token Management**  
   • Real-time ETH & ERC-20 balances  
   • Dynamic token badges (USDC, DAI, WETH, …)  
   • Add / remove custom tokens
3. **Transactions**  
   • Send ETH or tokens with gas-fee estimation  
   • Track pending / confirmed / failed states  
   • View historical transfers
4. **Security**  
   • Private keys kept **in-memory only**  
   • All signing done client-side via ethers.js  
   • Clear network indicators & warnings
5. **UI / UX**  
   • Responsive Tailwind layout  
   • Dark / light mode  
   • Framer-motion animations  
   • Address truncation & copy-to-clipboard helpers

## High-Level Architecture
```
┌──────────────────────┐            ┌──────────────────────┐
│  React UI Components │  ←state→   │  Jotai  Atom Store   │
└─────────┬────────────┘            └─────────┬────────────┘
          │ useWallet / useToken / useTx hooks│
          │                                    │ ethers.js + Alchemy SDK
┌─────────▼────────────┐            ┌─────────▼────────────┐
│   Wallet Controller  │  ─RPC─►    │    Ethereum Node     │
└──────────────────────┘            └──────────────────────┘
```

### Folder Structure
```
eth-wallet-alchemy/
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI widgets
│   │   ├── hooks/           # Custom React hooks (web3, UI)
│   │   ├── atoms/           # Jotai global state
│   │   ├── utils/           # Helper functions (formatting, API)
│   │   ├── api/             # Alchemy & ethers wrappers
│   │   ├── assets/          # Images & animation assets
│   │   └── main.tsx         # App bootstrap
│   ├── public/
│   └── index.html
└── .env.example             # Required environment variables
```

## Tech Stack
| Layer        | Technology                                    |
|--------------|-----------------------------------------------|
| Frontend     | React 18, TypeScript, Vite, Tailwind CSS       |
| State        | Jotai                                          |
| Animations   | Framer Motion                                  |
| Blockchain   | ethers.js, @alch/alchemy-sdk                   |
| Tooling      | ESLint + Prettier + Husky (pre-commit hooks)   |

## Getting Started
1. **Clone & install**
```bash
git clone https://github.com/D4rkC0m3t/phoenix-dex.git
cd phoenix-dex/eth-wallet-alchemy/frontend
npm install   # or pnpm / yarn
```
2. **Environment**  
   Copy `.env.example` to `.env` and fill in your Alchemy API keys:
```
VITE_ALCHEMY_API_KEY=YOUR_KEY
VITE_DEFAULT_NETWORK=sepolia
```
3. **Run Dev Server**
```bash
npm run dev
```
4. **Production Build**
```bash
npm run build
```

## Deployment
The app is static-exportable and can be deployed to Netlify, Vercel or GitHub Pages. A sample Netlify configuration is provided in `netlify.toml` (optional).

## Roadmap
- [ ] Hardware-wallet (Ledger/Trezor) integration
- [ ] Swap aggregator (0x / 1inch)
- [ ] NFT gallery tab
- [ ] i18n support

## Contributing
Pull requests are welcome! Please open an issue first to discuss major changes. Make sure to run `npm run lint` and `npm run test` before committing.

## License
MIT 2025 *D4rkC0m3t*