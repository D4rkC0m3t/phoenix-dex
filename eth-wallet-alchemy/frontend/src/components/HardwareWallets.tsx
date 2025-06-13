import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import HardwareWalletCard from './HardwareWalletCard';
import './scrollbar-hide.css';

// Hardware wallet images from BlockchainCenter.net
const walletImages = {
  ledgerNanoX: 'https://www.blockchaincenter.net/wp-content/uploads/ledgernanox.png',
  trezorSafe5: 'https://www.blockchaincenter.net/wp-content/uploads/trezorsafe5.png',
  ledgerNanoSPlus: 'https://www.blockchaincenter.net/wp-content/uploads/ledgernanosplus.png',
  trezorSafe3: 'https://www.blockchaincenter.net/wp-content/uploads/trezorsafe3.png',
  bitbox02: 'https://www.blockchaincenter.net/wp-content/uploads/bitbox02.png',
  ledgerStax: 'https://www.blockchaincenter.net/wp-content/uploads/ledgerstax.png',
  trezorOne: 'https://www.blockchaincenter.net/wp-content/uploads/trezorone.png',
  ledgerNanoS: 'https://www.blockchaincenter.net/wp-content/uploads/ledgernanos.png'
};

// Hardware wallet data
const hardwareWallets = [
  {
    id: 'ledger-nano-s-plus',
    name: 'Ledger Nano S Plus',
    price: '79.00',
    oldPrice: '99.00',
    image: walletImages.ledgerNanoSPlus,
    description: 'The successor to the Ledger Nano S has more memory and a larger display',
    badge: 'RECOMMENDED',
    color: 'yellow'
  },
  {
    id: 'bitbox02',
    name: 'BitBox02',
    price: '149.00',
    oldPrice: '169.00',
    image: walletImages.bitbox02,
    description: 'Swiss-made hardware wallet with touch sensors and backup options',
    badge: 'RECOMMENDED FOR BITCOIN',
    color: 'purple'
  },
  {
    id: 'trezor-safe-3',
    name: 'Trezor Safe 3',
    price: '79.00',
    oldPrice: '99.00',
    image: walletImages.trezorSafe3,
    description: 'The Trezor Safe 3 is the new entry-level hardware wallet from Trezor',
    badge: 'NEW',
    color: 'green'
  },
  {
    id: 'ledger-nano-x',
    name: 'Ledger Nano X',
    price: '149.00',
    oldPrice: '189.00',
    image: walletImages.ledgerNanoX,
    description: 'Bluetooth-enabled hardware wallet with support for 5,500+ coins and tokens',
    badge: 'MAXIMUM COMFORT',
    color: 'blue'
  },
  {
    id: 'ledger-stax',
    name: 'Ledger Stax',
    price: '279.00',
    oldPrice: '299.00',
    image: walletImages.ledgerStax,
    description: 'Credit-Card sized Hardware Wallet with e-Ink Touch Display for daily use',
    badge: 'PREMIUM',
    color: 'pink'
  },
  {
    id: 'trezor-safe-5',
    name: 'Trezor Safe 5',
    price: '169.00',
    oldPrice: '199.00',
    image: walletImages.trezorSafe5,
    description: 'Hardware wallet with color touchscreen (gorilla glass) & haptic feedback',
    badge: 'NEW',
    color: 'green'
  },
  {
    id: 'ledger-nano-s',
    name: 'Ledger Nano S',
    price: '59.00',
    oldPrice: '79.00',
    image: walletImages.ledgerNanoS,
    description: 'The affordable hardware wallet for long-term storage of Bitcoin, Ethereum & Co.',
    badge: 'BUDGET',
    color: 'blue'
  },
  {
    id: 'trezor-one',
    name: 'Trezor One',
    price: '57.00',
    oldPrice: '69.00',
    image: walletImages.trezorOne,
    description: 'The compact hardware wallet with all important features and a large screen',
    badge: 'CLASSIC',
    color: 'yellow'
  }
];

// Hardware wallet brands for the filter tabs
const brands = [
  { id: 'all', name: 'All Wallets' },
  { id: 'ledger', name: 'Ledger' },
  { id: 'trezor', name: 'Trezor' },
  { id: 'bitbox', name: 'BitBox' },
  { id: 'recommended', name: 'Recommended' },
  { id: 'new', name: 'New Models' }
];

const HardwareWallets: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [deviceInfo, setDeviceInfo] = useState<string | null>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter wallets based on selected brand or category
  const filteredWallets = selectedBrand === 'all'
    ? hardwareWallets
    : selectedBrand === 'recommended'
      ? hardwareWallets.filter(wallet => wallet.badge.includes('RECOMMENDED'))
      : selectedBrand === 'new'
        ? hardwareWallets.filter(wallet => wallet.badge.includes('NEW'))
        : hardwareWallets.filter(wallet => wallet.id.includes(selectedBrand));

  // Update active card index when scrolling
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const cardWidth = 300; // Width of each card including padding
      const scrollPosition = container.scrollLeft;
      const index = Math.round(scrollPosition / cardWidth);
      setActiveCardIndex(index);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [filteredWallets.length]);

  // Handle USB connection attempt
  const handleConnect = async () => {
    try {
      // This uses the WebUSB API which may not be available in all browsers
      if (navigator.usb) {
        const device = await navigator.usb.requestDevice({ filters: [] });
        await device.open();
        setDeviceInfo(`Connected to ${device.productName || 'hardware wallet'}`);
      } else {
        setDeviceInfo('WebUSB not supported in this browser');
      }
    } catch (err) {
      setDeviceInfo('Connection failed or cancelled');
    }
  };

  return (
    <div className="mb-16 w-full max-w-full">
      {/* Header with title and connection status */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-heading mb-2">Hardware Wallets</h2>
          <p className="text-gray-400 text-sm">Secure your crypto with cold storage solutions</p>
        </div>

        <div className="mt-4 md:mt-0">
          {deviceInfo ? (
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-safety-green animate-pulse mr-2"></div>
              <span className="text-sm text-safety-green">{deviceInfo}</span>
            </div>
          ) : (
            <motion.button
              className="bg-gradient-to-r from-[#FF56F6] to-[#42A6E3] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleConnect}
            >
              <span className="mr-2">🔌</span>
              Connect Hardware Wallet
            </motion.button>
          )}
        </div>
      </div>

      {/* Brand filter tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        {brands.map(brand => (
          <motion.button
            key={brand.id}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
              selectedBrand === brand.id
                ? 'bg-white/10 text-white'
                : 'text-gray-400 hover:bg-white/5'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedBrand(brand.id)}
          >
            {brand.name}
          </motion.button>
        ))}
      </div>

      {/* Hardware wallet cards with auto-scroll on hover */}
      <div className="scroll-wrapper">
        {/* Scrollable container */}
        <div
          id="wallet-scroll-container"
          ref={scrollContainerRef}
          className="scroll-container scrollbar-hide"
        >
          {/* Duplicate the first few cards at the end for seamless looping */}
          {[...filteredWallets, ...filteredWallets.slice(0, 4)].map((wallet, index) => (
            <div
              key={`${wallet.id}-${index}`}
              className="flex-none w-[300px] px-2 snap-start"
            >
              <div className="wallet-card-hover">
                <HardwareWalletCard
                  name={wallet.name}
                  price={wallet.price}
                  oldPrice={wallet.oldPrice}
                  image={wallet.image}
                  description={wallet.description}
                  badge={wallet.badge}
                  color={wallet.color}
                  onConnect={handleConnect}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Manual navigation controls */}
        <div className="flex justify-between mt-6">
          <div className="flex space-x-4">
            <motion.button
              className="bg-white/10 hover:bg-white/20 rounded-full p-2 text-white flex items-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollBy({ left: -600, behavior: 'smooth' });
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              <span className="ml-1 text-sm">Previous</span>
            </motion.button>

            <motion.button
              className="bg-white/10 hover:bg-white/20 rounded-full p-2 text-white flex items-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollBy({ left: 600, behavior: 'smooth' });
                }
              }}
            >
              <span className="mr-1 text-sm">Next</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </motion.button>
          </div>

          <motion.div
            className="text-sm text-gray-400 flex items-center"
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="mr-2">✨</span>
            <span>Hover to auto-scroll</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HardwareWallets;
