import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CopyButton from './CopyButton';
import ActionButton from './ActionButton';

interface ReceiveFormProps {
  address: string;
  network: string;
  onClose: () => void;
}

const ReceiveForm: React.FC<ReceiveFormProps> = ({ address, network, onClose }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  
  // Generate QR code for the address
  useEffect(() => {
    // Using Google Charts API to generate QR code
    const url = `https://chart.googleapis.com/chart?cht=qr&chl=ethereum:${address}&chs=250x250&choe=UTF-8&chld=L|0`;
    setQrCodeUrl(url);
  }, [address]);
  
  return (
    <motion.div
      className="glass-card p-6 w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-space-grotesk font-bold">Receive ETH</h2>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      
      <div className="text-center mb-4">
        <div className="bg-white p-2 rounded-lg inline-block mb-4">
          <img 
            src={qrCodeUrl} 
            alt="Wallet QR Code" 
            className="w-48 h-48"
          />
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-2">Your {network} Address</p>
          <div className="flex items-center justify-center space-x-2 bg-dark-space-gray/50 p-2 rounded border border-white/10">
            <span className="text-sm font-mono break-all">{address}</span>
            <CopyButton text={address} />
          </div>
        </div>
        
        <div className="text-sm text-gray-400 mb-6">
          <p>Scan this QR code or share your address to receive ETH on the {network} network.</p>
          <p className="mt-2 text-yellow-400">Always double-check the address before sending funds!</p>
        </div>
        
        <ActionButton
          label="Close"
          onClick={onClose}
          primary
        />
      </div>
    </motion.div>
  );
};

export default ReceiveForm;
