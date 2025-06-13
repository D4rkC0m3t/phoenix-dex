import { useState } from 'react';
import { motion } from 'framer-motion';
import ActionButton from './ActionButton';
import * as walletService from '../services/walletService.ts';

interface SendFormProps {
  senderAddress: string;
  network: string;
  onClose: () => void;
  onSuccess: (txHash: string) => void;
}

const SendForm: React.FC<SendFormProps> = ({
  senderAddress,
  network,
  onClose,
  onSuccess
}) => {
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [privateKey, setPrivateKey] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [gasPrice, setGasPrice] = useState<string>('');

  // Validate Ethereum address
  const isValidAddress = (address: string): boolean => {
    try {
      return ethers.isAddress(address);
    } catch (error) {
      return false;
    }
  };

  // Validate amount
  const isValidAmount = (value: string): boolean => {
    try {
      const amountFloat = parseFloat(value);
      return !isNaN(amountFloat) && amountFloat > 0;
    } catch (error) {
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate inputs
    if (!isValidAddress(recipient)) {
      setError('Invalid recipient address');
      return;
    }

    if (!isValidAmount(amount)) {
      setError('Invalid amount');
      return;
    }

    if (!privateKey) {
      setError('Private key is required');
      return;
    }

    try {
      setLoading(true);

      // Send transaction
      const txHash = await walletService.sendTransaction(
        privateKey,
        recipient,
        amount,
        network,
        gasPrice || undefined
      );

      onSuccess(txHash);
      onClose();
    } catch (err) {
      console.error('Transaction error:', err);
      setError(err instanceof Error ? err.message : 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="glass-card p-6 w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-space-grotesk font-bold">Send ETH</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">From</label>
          <div className="bg-dark-space-gray/50 p-2 rounded border border-white/10 text-sm">
            {senderAddress}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">To</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="w-full bg-dark-space-gray/50 p-2 rounded border border-white/10 focus:border-safety-green focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Amount (ETH)</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.01"
            className="w-full bg-dark-space-gray/50 p-2 rounded border border-white/10 focus:border-safety-green focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Gas Price (optional, in Gwei)</label>
          <input
            type="text"
            value={gasPrice}
            onChange={(e) => setGasPrice(e.target.value)}
            placeholder="Auto"
            className="w-full bg-dark-space-gray/50 p-2 rounded border border-white/10 focus:border-safety-green focus:outline-none"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Private Key</label>
          <input
            type="password"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            placeholder="Enter your private key"
            className="w-full bg-dark-space-gray/50 p-2 rounded border border-white/10 focus:border-safety-green focus:outline-none"
          />
          <p className="text-xs text-gray-400 mt-1">
            Your private key is never stored or sent to any server
          </p>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-500/20 border border-red-500/50 rounded text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="flex space-x-3">
          <ActionButton
            label="Cancel"
            onClick={onClose}
            type="button"
          />
          <ActionButton
            label={loading ? 'Sending...' : 'Send ETH'}
            onClick={() => {}}
            primary
            type="submit"
            disabled={loading}
          />
        </div>
      </form>
    </motion.div>
  );
};

export default SendForm;
