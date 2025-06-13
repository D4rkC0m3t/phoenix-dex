import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COMMON_TOKENS, getTokenBalance } from '../services/swapService';
import type { TokenMetadata } from '../services/swapService';

interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  balance: string;
  price: string;
  logoURI: string;
}

interface TokenSelectorProps {
  selectedToken: Token;
  onSelectToken: (token: Token) => void;
  tokens: Token[];
  walletAddress?: string;
  excludeToken?: string;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({
  selectedToken,
  onSelectToken,
  tokens
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Filter tokens based on search query
  const filteredTokens = tokens.filter(token =>
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative" ref={modalRef}>
      <motion.button
        className="flex items-center space-x-1 sm:space-x-2 bg-white/10 hover:bg-white/15 px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {selectedToken.logoURI && (
          <img
            src={selectedToken.logoURI}
            alt={selectedToken.symbol}
            className="w-4 h-4 sm:w-5 sm:h-5 rounded-full"
          />
        )}
        <span>{selectedToken.symbol}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-2 w-56 sm:w-64 md:w-72 bg-[#1E293B] border border-white/10 rounded-lg sm:rounded-xl shadow-xl z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-3 sm:p-4">
              <h3 className="text-lg font-medium mb-2">Select a token</h3>
              <input
                type="text"
                placeholder="Search by name or symbol"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#42A6E3]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />

              <div className="max-h-60 overflow-y-auto">
                {filteredTokens.length > 0 ? (
                  filteredTokens.map((token) => (
                    <motion.div
                      key={token.address}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                        selectedToken.address === token.address ? 'bg-white/10' : 'hover:bg-white/5'
                      }`}
                      onClick={() => {
                        onSelectToken(token);
                        setIsOpen(false);
                        setSearchQuery('');
                      }}
                      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    >
                      <div className="flex items-center">
                        {token.logoURI && (
                          <img
                            src={token.logoURI}
                            alt={token.symbol}
                            className="w-8 h-8 rounded-full mr-3"
                          />
                        )}
                        <div>
                          <div className="font-medium">{token.symbol}</div>
                          <div className="text-xs text-gray-400">{token.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">{token.balance}</div>
                        <div className="text-xs text-gray-400">
                          ${(parseFloat(token.balance) * parseFloat(token.price)).toFixed(2)}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-400">No tokens found</div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TokenSelector;
