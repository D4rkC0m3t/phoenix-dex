import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TokenSelector from './TokenSelector';
import type { Token } from '../types';

// Sample token data
const tokens = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    decimals: 18,
    balance: '1.5',
    price: '3000',
    logoURI: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTYgMzJDMjQuODM2NiAzMiAzMiAyNC44MzY2IDMyIDE2QzMyIDcuMTYzNDQgMjQuODM2NiAwIDE2IDBDNy4xNjM0NCAwIDAgNy4xNjM0NCAwIDE2QzAgMjQuODM2NiA3LjE2MzQ0IDMyIDE2IDMyWiIgZmlsbD0iIzYyN0VFQSIvPjxwYXRoIGQ9Ik0xNi41OTgzIDRWMTIuODdMMjMuOTk1IDE2LjIxODNMMTYuNTk4MyA0WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42MDIiLz48cGF0aCBkPSJNMTYuNTkxNyA0TDkuMTk1MDEgMTYuMjE4M0wxNi41OTE3IDEyLjg3VjRaIiBmaWxsPSJ3aGl0ZSIvPjxwYXRoIGQ9Ik0xNi41OTgzIDE3LjkzMjVWMjIuOTk1TDI0LjAwMDEgMTMuNjA2N0wxNi41OTgzIDE3LjkzMjVaIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjYwMiIvPjxwYXRoIGQ9Ik0xNi41OTE3IDIyLjk5NVYxNy45MzE3TDkuMTk1MDEgMTMuNjA2N0wxNi41OTE3IDIyLjk5NVoiIGZpbGw9IndoaXRlIi8+PHBhdGggZD0iTTE2LjU5ODMgMjEuMjI1NEwxNi41OTgzIDI4LjAwMDFMMjQuMDAwMSAxMy42MDY3TDE2LjU5ODMgMjEuMjI1NFoiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjxwYXRoIGQ9Ik0xNi41OTE3IDI4LjAwMDFWMjEuMjI1NEw5LjE5NTAxIDEzLjYwNjdMMTYuNTkxNyAyOC4wMDAxWiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42MDIiLz48L3N2Zz4='
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    decimals: 6,
    balance: '1000',
    price: '1',
    logoURI: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNiIgZmlsbD0iIzJEQkE3QSIvPjxwYXRoIGQ9Ik0yMS4zMzMzIDE0LjY2NjdDMjEuMzMzMyAxMi4wODY3IDE5LjI0NjcgMTAuMDAwMSAxNi42NjY3IDEwLjAwMDFDMTQuMDg2NyAxMC4wMDAxIDEyIDEyLjA4NjcgMTIgMTQuNjY2N0MxMiAxNy4wOTM0IDEzLjg0IDE5LjA5MzQgMTYuMjI2NyAxOS4zMjAxVjIyLjAwMDFIMTcuMTA2N1YxOS4zMjAxQzE5LjQ5MzMgMTkuMDkzNCAyMS4zMzMzIDE3LjA5MzQgMjEuMzMzMyAxNC42NjY3Wk0xNi42NjY3IDE4LjQ0MDFDMTQuNTczMyAxOC40NDAxIDEyLjg4IDE2Ljc2MDEgMTIuODggMTQuNjY2N0MxMi44OCAxMi41NzM0IDE0LjU2IDEwLjg5MzQgMTYuNjY2NyAxMC44OTM0QzE4Ljc2IDEwLjg5MzQgMjAuNDUzMyAxMi41NzM0IDIwLjQ1MzMgMTQuNjY2N0MyMC40NTMzIDE2Ljc2MDEgMTguNzYgMTguNDQwMSAxNi42NjY3IDE4LjQ0MDFaIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg=='
  },
  {
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    decimals: 8,
    balance: '0.05',
    price: '60000',
    logoURI: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNiIgZmlsbD0iI0Y3OTMxQSIvPjxwYXRoIGQ9Ik0yMi4wNjUyIDEzLjY4MjZDMjIuMzA4NiAxMS41OTM4IDIwLjY5MTIgMTAuNTI3OSAxOC41MTk5IDkuODI2NTNMMTkuMTg1MiA3LjIxMzMzTDE3LjUzMzIgNi44MjY2N0wxNi44ODUzIDkuMzY5MkMxNi40NTg2IDkuMjY5MiAxNi4wMjUzIDkuMTc0NjcgMTUuNTk0NiA5LjA4TDE2LjI0NzkgNi41MjI2N0wxNC41OTU5IDYuMTM2TDEzLjkzMDYgOC43NDY2N0MxMy41NzU5IDguNjY5MzMgMTMuMjI3OSA4LjU5MzMzIDEyLjg5MDYgOC41MTJWOC41MDI2N0wxMC42MjUzIDcuOTY5MzNMMTAuMjE4NiA5LjczMzMzQzEwLjIxODYgOS43MzMzMyAxMS40NTg2IDEwLjAwOTMgMTEuNDM0NiAxMC4wMjRDMTIuMDg1MyAxMC4xNzA3IDEyLjE5ODYgMTAuNjA1MyAxMi4xODUzIDEwLjk1MkwxMS40MjY2IDEzLjkwOTNDMTEuNDc0NiAxMy45MjEzIDExLjUzNTkgMTMuOTM4NyAxMS42MDI2IDEzLjk2NjdDMTEuNTQ2NiAxMy45NTMzIDExLjQ4NzkgMTMuOTM4NyAxMS40MjY2IDEzLjkyNEwxMC4zNzg2IDE4LjA2QzEwLjMwMTMgMTguMjY5MyAxMC4xMDc5IDE4LjU4OTMgOS42NTg2IDE4LjQ4OEM5LjY3NDYgMTguNTA5MyA4LjQ0MzI2IDE4LjE5MzMgOC40NDMyNiAxOC4xOTMzTDcuNjY2NjYgMjAuMDg4TDkuODEzMzMgMjAuNTk3M0MxMC4yMDUzIDIwLjY5MDcgMTAuNTg5MyAyMC43ODggMTAuOTY2NiAyMC44OEwxMC4yOTQ2IDIzLjUyNEwxMS45NDUzIDIzLjkxMDdMMTIuNjEwNiAyMS4yOTczQzEzLjA1MzMgMjEuNDEwNyAxMy40ODUzIDIxLjUxNzMgMTMuOTA2NiAyMS42MTZMMTMuMjQzOSAyNC4yMTMzTDE0Ljg5NTkgMjQuNkwxNS41Njc5IDIxLjk2MjdDMTguNDI5MyAyMi41MzA3IDIwLjYwMzkgMjIuMzA5MyAyMS41NzU5IDIwLjY5MzNDMjIuMzU3MyAxOS4zNjkzIDIxLjkxOTkgMTguNTY5MyAyMC45MjUzIDE4LjAyNEMyMS42NDc5IDE3Ljg0OTMgMjIuMTk0NiAxNy4zNDkzIDIyLjM0NTMgMTYuNDg4QzIyLjU1MDYgMTUuMjk3MyAyMS43NTk5IDE0LjU2OTMgMjAuNjU1OSAxNC4wODhDMjEuMzk5OSAxMy45MjkzIDIxLjkxOTkgMTMuNDI5MyAyMi4wNjUyIDEzLjY4MjZaTTE4LjY3OTkgMTkuNjI5M0MxOC4xMzg2IDIwLjk1MzMgMTUuNDU4NiAyMC4wNjkzIDEzLjk5NDYgMTkuNzA5M0wxNC44ODc5IDE2LjI0OEMxNi4zNTE5IDE2LjYwOTMgMTkuMjQxMyAxOC4yNDUzIDE4LjY3OTkgMTkuNjI5M1pNMTkuMjIxMyAxNi40NjkzQzE4LjcyNTMgMTcuNjg1MyAxNi40NzQ2IDE2LjkyOTMgMTUuMjQxMyAxNi42MjRMMTYuMDUzMyAxMy40NjkzQzE3LjI4NjYgMTMuNzc0NyAxOS43MzU5IDE1LjE5NzMgMTkuMjIxMyAxNi40NjkzWiIgZmlsbD0id2hpdGUiLz48L3N2Zz4='
  },
  {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    decimals: 18,
    balance: '500',
    price: '1',
    logoURI: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNiIgZmlsbD0iI0Y1QUM0MyIvPjxwYXRoIGQ9Ik0xNiA3LjVDMTEuMzA5NiA3LjUgNy41IDExLjMwOTYgNy41IDE2QzcuNSAyMC42OTA0IDExLjMwOTYgMjQuNSAxNiAyNC41QzIwLjY5MDQgMjQuNSAyNC41IDIwLjY5MDQgMjQuNSAxNkMyNC41IDExLjMwOTYgMjAuNjkwNCA3LjUgMTYgNy41Wk0xMi4wNDI2IDEyLjI5MjZIMTYuMDQyNkMxOC4yNzY5IDEyLjI5MjYgMTkuOTU3NCAxMy4zNzIzIDE5Ljk1NzQgMTUuMjM5NFYxNS4yNzEzQzE5Ljk1NzQgMTcuNDI1NSAxOC4wMDg1IDE4LjM3MjMgMTYuMDQyNiAxOC4zNzIzSDEzLjg1MTFWMjAuMDIxM0gxMi4wNDI2VjEyLjI5MjZaTTEzLjg1MTEgMTYuODI5OEgxNi4wNDI2QzE2Ljk4OTQgMTYuODI5OCAxOC4xMTcgMTYuMzgyOSAxOC4xMTcgMTUuMzAzMlYxNS4yNzEzQzE4LjExNyAxNC4wNjM4IDE3LjA1MzIgMTMuODM1MSAxNi4wNDI2IDEzLjgzNTFIMTMuODUxMVYxNi44Mjk4WiIgZmlsbD0id2hpdGUiLz48L3N2Zz4='
  },
  {
    symbol: 'LINK',
    name: 'Chainlink',
    address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    decimals: 18,
    balance: '100',
    price: '15',
    logoURI: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNiIgZmlsbD0iIzJBNTBGNCIvPjxwYXRoIGQ9Ik0xNiA3LjVMMTIgOS43NVYxNC4yNUw4IDE2LjVMMTIgMTguNzVWMjMuMjVMMTYgMjUuNUwyMCAyMy4yNVYxOC43NUwyNCAyMC41VjEyLjVMMjAgMTAuMjVWOS43NUwxNiA3LjVaIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg=='
  }
];

interface SwapInterfaceProps {
  address: string;
  network: string;
}

const SwapInterface: React.FC<SwapInterfaceProps> = ({ address, network }) => {
  const [fromToken, setFromToken] = useState(tokens[0]);
  const [toToken, setToToken] = useState(tokens[1]);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState('0.5');
  const [isLoading, setIsLoading] = useState(false);
  const [swapRate, setSwapRate] = useState<number | null>(null);
  const [gasEstimate, setGasEstimate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Calculate swap rate when tokens or amounts change
  useEffect(() => {
    if (fromToken && toToken && fromAmount && parseFloat(fromAmount) > 0) {
      // In a real app, this would be a call to a price API or DEX router
      const fromValue = parseFloat(fromAmount) * parseFloat(fromToken.price);
      const toValue = fromValue / parseFloat(toToken.price);
      setToAmount(toValue.toFixed(toToken.decimals > 8 ? 8 : toToken.decimals));
      
      // Set the swap rate (1 fromToken = X toToken)
      const rate = parseFloat(fromToken.price) / parseFloat(toToken.price);
      setSwapRate(rate);
      
      // Simulate gas estimate
      setGasEstimate('0.005');
    } else {
      setToAmount('');
      setSwapRate(null);
      setGasEstimate(null);
    }
  }, [fromToken, toToken, fromAmount]);

  // Handle token swap
  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
    // toAmount will be recalculated by the useEffect
  };

  // Execute swap
  const executeSwap = async () => {
    if (!fromToken || !toToken || !fromAmount || parseFloat(fromAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (parseFloat(fromAmount) > parseFloat(fromToken.balance)) {
      setError('Insufficient balance');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // In a real app, this would call the Uniswap SDK or a similar service
      // For this demo, we'll simulate a successful swap
      setTimeout(() => {
        setIsLoading(false);
        alert(`Swap executed: ${fromAmount} ${fromToken.symbol} → ${toAmount} ${toToken.symbol}`);
      }, 2000);
    } catch (err) {
      setIsLoading(false);
      setError('Swap failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="mb-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-heading">Swap</h2>
        <div className="flex space-x-2">
          <motion.button
            className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full text-gray-300 flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mr-1">⚙️</span> Settings
          </motion.button>
        </div>
      </div>

      <motion.div
        className="glass-card p-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* From Token */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>From</span>
            <span>Balance: {fromToken.balance} {fromToken.symbol}</span>
          </div>
          <div className="flex items-center bg-white/5 rounded-xl p-4">
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              placeholder="0.0"
              className="bg-transparent text-2xl w-full outline-none"
            />
            <div className="flex-shrink-0">
              <TokenSelector
                selectedToken={fromToken}
                onSelectToken={setFromToken}
                tokens={tokens.filter(t => t.symbol !== toToken.symbol)}
              />
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-2">
          <motion.button
            className="bg-white/10 p-2 rounded-full"
            onClick={handleSwapTokens}
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            whileTap={{ scale: 0.9 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
          </motion.button>
        </div>

        {/* To Token */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>To (estimated)</span>
            <span>Balance: {toToken.balance} {toToken.symbol}</span>
          </div>
          <div className="flex items-center bg-white/5 rounded-xl p-4">
            <input
              type="number"
              value={toAmount}
              readOnly
              placeholder="0.0"
              className="bg-transparent text-2xl w-full outline-none"
            />
            <div className="flex-shrink-0">
              <TokenSelector
                selectedToken={toToken}
                onSelectToken={setToToken}
                tokens={tokens.filter(t => t.symbol !== fromToken.symbol)}
              />
            </div>
          </div>
        </div>

        {/* Swap Details */}
        {swapRate && (
          <div className="bg-white/5 rounded-xl p-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-400">Rate</span>
              <span className="text-sm">1 {fromToken.symbol} = {swapRate.toFixed(6)} {toToken.symbol}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-400">Slippage Tolerance</span>
              <span className="text-sm">{slippage}%</span>
            </div>
            {gasEstimate && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Estimated Gas</span>
                <span className="text-sm">{gasEstimate} ETH</span>
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Swap Button */}
        <motion.button
          className={`w-full py-3 px-4 rounded-xl font-medium ${
            isLoading || !fromAmount || parseFloat(fromAmount) <= 0
              ? 'bg-white/10 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#FF56F6] to-[#42A6E3] text-white'
          }`}
          onClick={executeSwap}
          disabled={isLoading || !fromAmount || parseFloat(fromAmount) <= 0}
          whileHover={
            isLoading || !fromAmount || parseFloat(fromAmount) <= 0
              ? {}
              : { scale: 1.02 }
          }
          whileTap={
            isLoading || !fromAmount || parseFloat(fromAmount) <= 0
              ? {}
              : { scale: 0.98 }
          }
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Swapping...
            </div>
          ) : !fromAmount || parseFloat(fromAmount) <= 0 ? (
            'Enter an amount'
          ) : parseFloat(fromAmount) > parseFloat(fromToken.balance) ? (
            'Insufficient balance'
          ) : (
            `Swap ${fromToken.symbol} for ${toToken.symbol}`
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default SwapInterface;
