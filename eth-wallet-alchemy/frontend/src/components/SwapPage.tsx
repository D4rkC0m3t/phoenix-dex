import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SwapForm from './SwapForm';
import { getPrice } from '../services/priceService';
import { COMMON_TOKENS } from '../services/swapService';

interface SwapPageProps {
  walletAddress: string;
}

interface TokenPrice {
  symbol: string;
  price: number;
  change24h: number;
}

const SwapPage: React.FC<SwapPageProps> = ({ walletAddress }) => {
  const [tokenPrices, setTokenPrices] = useState<TokenPrice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch token prices
  useEffect(() => {
    const fetchTokenPrices = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const prices: TokenPrice[] = [];

        // Get price data for common tokens
        for (const token of COMMON_TOKENS) {
          try {
            // Skip if not a common token with a known ID
            if (token.address === 'ETH') {
              const priceData = await getPrice('ethereum');
              prices.push({
                symbol: token.symbol,
                price: priceData.usd,
                change24h: priceData.usd_24h_change || 0
              });
            } else {
              // For other tokens, we would need a mapping to CoinGecko IDs
              // This is simplified for the demo
              const tokenId = getTokenCoinGeckoId(token.symbol.toLowerCase());
              if (tokenId) {
                const priceData = await getPrice(tokenId);
                prices.push({
                  symbol: token.symbol,
                  price: priceData.usd,
                  change24h: priceData.usd_24h_change || 0
                });
              }
            }
          } catch (err) {
            console.error(`Error fetching price for ${token.symbol}:`, err);
            // Continue with other tokens
          }
        }

        setTokenPrices(prices);
        setIsLoading(false);
      } catch (err: any) {
        console.error("Error fetching token prices:", err);
        setError(err.message || "Failed to fetch token prices");
        setIsLoading(false);
      }
    };

    fetchTokenPrices();
  }, []);

  // Helper function to get CoinGecko ID for a token
  const getTokenCoinGeckoId = (symbol: string): string | null => {
    const tokenMap: Record<string, string> = {
      'eth': 'ethereum',
      'weth': 'weth',
      'usdt': 'tether',
      'usdc': 'usd-coin',
      'dai': 'dai',
      'link': 'chainlink',
      'uni': 'uniswap',
      'aave': 'aave',
      'comp': 'compound-governance-token',
      'snx': 'synthetix-network-token',
      'mkr': 'maker',
      'yfi': 'yearn-finance',
      'crv': 'curve-dao-token',
      'bal': 'balancer',
      'sushi': 'sushi'
    };

    return tokenMap[symbol] || null;
  };

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Format percentage
  const formatPercentage = (value: number): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div className="w-full max-w-full">
      <h1 className="text-display mb-4 sm:mb-6">Swap</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Swap Form */}
        <div className="md:col-span-2">
          <motion.div
            className="glass-card p-3 sm:p-4 md:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <SwapForm walletAddress={walletAddress} />
          </motion.div>
        </div>

        {/* Token Prices */}
        <div className="md:col-span-1">
          <motion.div
            className="glass-card p-3 sm:p-4 md:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h2 className="text-heading mb-4">Market Prices</h2>

            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <motion.div
                  className="w-6 h-6 border-2 border-[#FF5F00] border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
            ) : error ? (
              <div className="p-4 bg-[#B20600]/20 border border-[#B20600]/30 rounded-lg">
                <p className="text-sm text-[#B20600]">{error}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tokenPrices.map((token, index) => (
                  <div
                    key={index}
                    className="p-3 bg-white/5 rounded-lg flex justify-between items-center"
                  >
                    <div className="font-medium">{token.symbol}</div>
                    <div className="text-right">
                      <div>{formatCurrency(token.price)}</div>
                      <div className={`text-xs ${token.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {formatPercentage(token.change24h)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Swap Info */}
          <motion.div
            className="glass-card p-3 sm:p-4 md:p-6 mt-4 sm:mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h2 className="text-heading mb-4">Swap Info</h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">About Swaps</h3>
                <p className="text-sm text-gray-400">
                  Phoenix Wallet uses decentralized exchanges to provide the best rates for your swaps.
                  Trades are executed directly on the blockchain with no intermediaries.
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Fees</h3>
                <p className="text-sm text-gray-400">
                  Each swap incurs a 0.3% fee that goes to liquidity providers.
                  Phoenix Wallet does not charge any additional fees.
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Slippage</h3>
                <p className="text-sm text-gray-400">
                  Slippage is the difference between the expected price and the executed price.
                  You can adjust your slippage tolerance in the settings.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SwapPage;
