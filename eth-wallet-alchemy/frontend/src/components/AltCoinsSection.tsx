import { motion } from 'framer-motion';
import AltCoinCard from './AltCoinCard';

// Sample alt coin data
export const altCoins = [
  {
    name: 'Binance Coin',
    symbol: 'BNB',
    balance: '19.2371',
    value: '229.69',
    change: 2.5,
    color: 'yellow',
    logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.png'
  },
  {
    name: 'USD Coin',
    symbol: 'USDC',
    balance: '92.3',
    value: '92.30',
    change: 0.3,
    color: 'blue',
    logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
  },
  {
    name: 'Synthetix',
    symbol: 'SNX',
    balance: '42.74',
    value: '120.83',
    change: -1.3,
    color: 'blue',
    logo: 'https://cryptologos.cc/logos/synthetix-network-token-snx-logo.png'
  },
  {
    name: 'Polygon',
    symbol: 'MATIC',
    balance: '245.32',
    value: '198.76',
    change: 5.2,
    color: 'purple',
    logo: 'https://cryptologos.cc/logos/polygon-matic-logo.png'
  },
  {
    name: 'Solana',
    symbol: 'SOL',
    balance: '3.45',
    value: '312.87',
    change: 12.8,
    color: 'pink',
    logo: 'https://cryptologos.cc/logos/solana-sol-logo.png'
  },
  {
    name: 'Cardano',
    symbol: 'ADA',
    balance: '512.67',
    value: '153.80',
    change: -2.4,
    color: 'blue',
    logo: 'https://cryptologos.cc/logos/cardano-ada-logo.png'
  }
];

const AltCoinsSection: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-heading">Alternative Coins</h2>
        <div className="flex space-x-2">
          <motion.button
            className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full text-gray-300 flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mr-1">↓</span> Import
          </motion.button>
          <motion.button
            className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full text-gray-300 flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mr-1">+</span> Add Token
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {altCoins.map((coin, index) => (
          <AltCoinCard
            key={index}
            name={coin.name}
            symbol={coin.symbol}
            balance={coin.balance}
            value={coin.value}
            change={coin.change}
            color={coin.color as any}
          />
        ))}
      </div>
    </div>
  );
};

export default AltCoinsSection;
