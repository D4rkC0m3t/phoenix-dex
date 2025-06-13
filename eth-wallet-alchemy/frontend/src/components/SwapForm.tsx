import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TokenSelector from './TokenSelector';
import SwapSettings from './SwapSettings';
import SwapConfirmation from './SwapConfirmation';
import {
  COMMON_TOKENS,
  getSwapQuote,
  checkAllowance,
  approveToken,
  executeSwap,
  getTokenBalance
} from '../services/swapService';
import type { TokenMetadata, SwapQuote } from '../services/swapService';
import { getSettings } from '../services/settingsService';

interface SwapFormProps {
  walletAddress: string;
}

const SwapForm: React.FC<SwapFormProps> = ({ walletAddress }) => {
  // Token states
  const [fromToken, setFromToken] = useState<TokenMetadata>(COMMON_TOKENS[0]); // ETH by default
  const [toToken, setToToken] = useState<TokenMetadata>(COMMON_TOKENS[2]); // USDT by default
  const [fromAmount, setFromAmount] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('');
  const [fromBalance, setFromBalance] = useState<string>('0');
  const [toBalance, setToBalance] = useState<string>('0');

  // Swap states
  const [swapDirection, setSwapDirection] = useState<'exactIn' | 'exactOut'>('exactIn');
  const [swapQuote, setSwapQuote] = useState<SwapQuote | null>(null);
  const [needsApproval, setNeedsApproval] = useState<boolean>(false);

  // UI states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  // Settings
  const [slippageTolerance, setSlippageTolerance] = useState<number>(0.5);
  const [transactionDeadline, setTransactionDeadline] = useState<number>(20);

  // Load settings
  useEffect(() => {
    const settings = getSettings();
    setSlippageTolerance(settings.advanced.slippageTolerance);
    setTransactionDeadline(settings.advanced.transactionDeadline);
  }, []);

  // Fetch token balances
  useEffect(() => {
    const fetchBalances = async () => {
      if (!walletAddress) return;

      try {
        const fromTokenBalance = await getTokenBalance(fromToken.address, walletAddress);
        const toTokenBalance = await getTokenBalance(toToken.address, walletAddress);

        setFromBalance(fromTokenBalance);
        setToBalance(toTokenBalance);
      } catch (error) {
        console.error("Error fetching token balances:", error);
      }
    };

    fetchBalances();
  }, [walletAddress, fromToken, toToken]);

  // Get swap quote when inputs change
  useEffect(() => {
    const getQuote = async () => {
      if (!fromAmount || parseFloat(fromAmount) === 0) {
        setToAmount('');
        setSwapQuote(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const quote = await getSwapQuote(
          fromToken.address,
          toToken.address,
          fromAmount
        );

        setToAmount(quote.outputAmount);
        setSwapQuote(quote);

        // Check if approval is needed
        if (fromToken.address !== 'ETH') {
          const hasAllowance = await checkAllowance(
            fromToken.address,
            walletAddress,
            fromAmount
          );

          setNeedsApproval(!hasAllowance);
        } else {
          setNeedsApproval(false);
        }
      } catch (err: any) {
        console.error("Error getting swap quote:", err);
        setError(err.message || "Failed to get swap quote");
        setToAmount('');
        setSwapQuote(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the quote request
    const timeoutId = setTimeout(() => {
      if (fromAmount && fromToken && toToken) {
        getQuote();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [fromAmount, fromToken, toToken, walletAddress]);

  // Handle from amount change
  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setFromAmount(value);
    setSwapDirection('exactIn');
  };

  // Handle to amount change
  const handleToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setToAmount(value);
    setSwapDirection('exactOut');
    // Note: We would need to implement reverse quote lookup for exactOut
  };

  // Handle max button click
  const handleMaxClick = () => {
    if (fromToken.address === 'ETH') {
      // Leave some ETH for gas
      const ethBalance = parseFloat(fromBalance);
      const maxAmount = Math.max(ethBalance - 0.01, 0).toString();
      setFromAmount(maxAmount);
    } else {
      setFromAmount(fromBalance);
    }
    setSwapDirection('exactIn');
  };

  // Handle token swap
  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);

    if (swapDirection === 'exactIn') {
      setFromAmount(toAmount);
      setToAmount('');
    } else {
      setFromAmount('');
      setToAmount(fromAmount);
    }

    setSwapDirection('exactIn');
  };

  // Handle token approval
  const handleApprove = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await approveToken(fromToken.address, fromAmount);
      setNeedsApproval(false);
    } catch (err: any) {
      console.error("Error approving token:", err);
      setError(err.message || "Failed to approve token");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle swap execution
  const handleSwap = async () => {
    setShowConfirmation(true);
  };

  // Execute the swap
  const executeSwapTransaction = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!swapQuote) {
        throw new Error("No swap quote available");
      }

      // Calculate minimum output amount with slippage
      const outputAmount = parseFloat(swapQuote.outputAmount);
      const minOutputAmount = outputAmount * (1 - slippageTolerance / 100);

      // Execute the swap
      const txHash = await executeSwap(
        fromToken.address,
        toToken.address,
        fromAmount,
        minOutputAmount.toString(),
        transactionDeadline
      );

      // Reset form
      setFromAmount('');
      setToAmount('');
      setSwapQuote(null);
      setShowConfirmation(false);

      // Show success message
      alert(`Swap successful! Transaction hash: ${txHash}`);
    } catch (err: any) {
      console.error("Error executing swap:", err);
      setError(err.message || "Failed to execute swap");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if swap is valid
  const isSwapValid = () => {
    if (!fromAmount || !toAmount || isLoading) return false;
    if (parseFloat(fromAmount) <= 0 || parseFloat(toAmount) <= 0) return false;
    if (parseFloat(fromAmount) > parseFloat(fromBalance)) return false;
    return true;
  };

  // Format balance
  const formatBalance = (balance: string): string => {
    const balanceNum = parseFloat(balance);
    if (balanceNum === 0) return '0';
    if (balanceNum < 0.0001) return '< 0.0001';
    return balanceNum.toFixed(4);
  };

  // Get button text
  const getButtonText = () => {
    if (isLoading) return 'Loading...';
    if (!fromAmount) return 'Enter an amount';
    if (parseFloat(fromAmount) > parseFloat(fromBalance)) return 'Insufficient balance';
    if (needsApproval) return `Approve ${fromToken.symbol}`;
    return 'Swap';
  };

  // Get button action
  const getButtonAction = () => {
    if (needsApproval) return handleApprove;
    return handleSwap;
  };

  return (
    <div className="w-full">
      {showSettings ? (
        <SwapSettings
          slippageTolerance={slippageTolerance}
          transactionDeadline={transactionDeadline}
          onSlippageChange={setSlippageTolerance}
          onDeadlineChange={setTransactionDeadline}
          onClose={() => setShowSettings(false)}
        />
      ) : showConfirmation && swapQuote ? (
        <SwapConfirmation
          fromToken={fromToken}
          toToken={toToken}
          fromAmount={fromAmount}
          toAmount={toAmount}
          quote={swapQuote}
          slippageTolerance={slippageTolerance}
          transactionDeadline={transactionDeadline}
          onConfirm={executeSwapTransaction}
          onCancel={() => setShowConfirmation(false)}
          isLoading={isLoading}
        />
      ) : (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-heading">Swap</h2>

            <button
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              onClick={() => setShowSettings(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* From Token Input */}
          <div className="p-3 sm:p-4 bg-white/5 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-400">From</div>
              <div className="text-sm text-gray-400">
                Balance: {formatBalance(fromBalance)} {fromToken.symbol}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="text"
                value={fromAmount}
                onChange={handleFromAmountChange}
                placeholder="0.0"
                className="w-full bg-transparent text-2xl font-medium focus:outline-none"
              />

              <div className="flex items-center space-x-2">
                <button
                  className="px-2 py-1 text-xs rounded-lg bg-[#FF5F00] text-white"
                  onClick={handleMaxClick}
                >
                  MAX
                </button>

                <TokenSelector
                  selectedToken={fromToken as any}
                  onSelectToken={(token) => setFromToken(token as any)}
                  tokens={COMMON_TOKENS as any}
                  walletAddress={walletAddress}
                  excludeToken={toToken.address}
                />
              </div>
            </div>
          </div>

          {/* Swap Direction Button */}
          <div className="flex justify-center">
            <motion.button
              className="p-2 rounded-full bg-white/5 hover:bg-white/10"
              onClick={handleSwapTokens}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 10L12 5L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 14L12 19L7 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
          </div>

          {/* To Token Input */}
          <div className="p-3 sm:p-4 bg-white/5 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-400">To</div>
              <div className="text-sm text-gray-400">
                Balance: {formatBalance(toBalance)} {toToken.symbol}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="text"
                value={toAmount}
                onChange={handleToAmountChange}
                placeholder="0.0"
                className="w-full bg-transparent text-2xl font-medium focus:outline-none"
                readOnly={swapDirection === 'exactIn'}
              />

              <TokenSelector
                selectedToken={toToken as any}
                onSelectToken={(token) => setToToken(token as any)}
                tokens={COMMON_TOKENS as any}
                walletAddress={walletAddress}
                excludeToken={fromToken.address}
              />
            </div>
          </div>

          {/* Swap Details */}
          {swapQuote && (
            <div className="p-2 sm:p-3 bg-white/5 rounded-lg text-xs sm:text-sm">
              <div className="flex justify-between items-center mb-1">
                <div className="text-gray-400">Rate</div>
                <div>
                  1 {fromToken.symbol} = {swapQuote.executionPrice} {toToken.symbol}
                </div>
              </div>

              <div className="flex justify-between items-center mb-1">
                <div className="text-gray-400">Price Impact</div>
                <div className={parseFloat(swapQuote.priceImpact) > 5 ? 'text-red-500' : 'text-green-500'}>
                  {swapQuote.priceImpact}%
                </div>
              </div>

              <div className="flex justify-between items-center mb-1">
                <div className="text-gray-400">Minimum Received</div>
                <div>
                  {swapQuote.minimumReceived} {toToken.symbol}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-gray-400">Fee</div>
                <div>${swapQuote.fee}</div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-2 sm:p-3 bg-[#B20600]/20 border border-[#B20600]/30 rounded-lg">
              <p className="text-sm text-[#B20600]">{error}</p>
            </div>
          )}

          {/* Swap Button */}
          <motion.button
            className={`w-full py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-medium ${
              isSwapValid()
                ? 'bg-gradient-to-r from-[#FF5F00] to-[#B20600] text-white'
                : 'bg-white/10 text-gray-400 cursor-not-allowed'
            }`}
            onClick={getButtonAction()}
            disabled={!isSwapValid() && !needsApproval}
            whileHover={isSwapValid() || needsApproval ? { scale: 1.02 } : {}}
            whileTap={isSwapValid() || needsApproval ? { scale: 0.98 } : {}}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              getButtonText()
            )}
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default SwapForm;
