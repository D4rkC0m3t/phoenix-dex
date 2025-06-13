import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as walletService from '../services/walletService';
import ActionButton from './ActionButton';

interface TransactionDetailsProps {
  txHash: string;
  network: string;
  onClose: () => void;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ 
  txHash, 
  network, 
  onClose 
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [txDetails, setTxDetails] = useState<any>(null);
  
  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const details = await walletService.getTransactionDetails(txHash, network);
        setTxDetails(details);
      } catch (err) {
        console.error('Error fetching transaction details:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch transaction details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactionDetails();
  }, [txHash, network]);
  
  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Pending';
    
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Format address
  const formatAddress = (address: string | null | undefined) => {
    if (!address) return 'N/A';
    
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  return (
    <motion.div
      className="glass-card p-6 w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-space-grotesk font-bold">Transaction Details</h2>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <motion.div 
            className="w-8 h-8 border-4 border-safety-green border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded text-red-300">
          {error}
        </div>
      ) : txDetails ? (
        <div className="space-y-4">
          <div className="p-4 bg-ethereum-purple/10 rounded-lg border border-ethereum-purple/30">
            <h3 className="text-lg font-medium mb-2">Transaction Hash</h3>
            <p className="font-mono text-sm break-all">{txDetails.hash}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-dark-space-gray/50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-400 mb-1">Status</h3>
              <div className={`font-medium ${
                txDetails.status === 'confirmed' 
                  ? 'text-safety-green' 
                  : txDetails.status === 'failed' 
                    ? 'text-red-400' 
                    : 'text-yellow-400'
              }`}>
                {txDetails.status.charAt(0).toUpperCase() + txDetails.status.slice(1)}
              </div>
            </div>
            
            <div className="p-4 bg-dark-space-gray/50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-400 mb-1">Block</h3>
              <div>{txDetails.blockNumber || 'Pending'}</div>
            </div>
            
            <div className="p-4 bg-dark-space-gray/50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-400 mb-1">Timestamp</h3>
              <div>{formatDate(txDetails.timestamp)}</div>
            </div>
            
            <div className="p-4 bg-dark-space-gray/50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-400 mb-1">Confirmations</h3>
              <div>{txDetails.confirmations}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-dark-space-gray/50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-400 mb-1">From</h3>
              <div className="font-mono">{formatAddress(txDetails.from)}</div>
            </div>
            
            <div className="p-4 bg-dark-space-gray/50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-400 mb-1">To</h3>
              <div className="font-mono">{formatAddress(txDetails.to)}</div>
            </div>
          </div>
          
          <div className="p-4 bg-dark-space-gray/50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Value</h3>
            <div className="text-lg font-medium">{txDetails.value} ETH</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-dark-space-gray/50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-400 mb-1">Gas Price</h3>
              <div>{txDetails.gasPrice} Gwei</div>
            </div>
            
            <div className="p-4 bg-dark-space-gray/50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-400 mb-1">Gas Limit</h3>
              <div>{txDetails.gasLimit}</div>
            </div>
            
            <div className="p-4 bg-dark-space-gray/50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-400 mb-1">Gas Used</h3>
              <div>{txDetails.gasUsed}</div>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-6">
            <ActionButton
              label="Close"
              onClick={onClose}
            />
            
            <a 
              href={`https://${network === 'mainnet' ? '' : network + '.'}etherscan.io/tx/${txDetails.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-safety-green hover:underline"
            >
              View on Etherscan
            </a>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8">
          No transaction details found
        </div>
      )}
    </motion.div>
  );
};

export default TransactionDetails;
