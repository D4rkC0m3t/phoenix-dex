import { motion } from 'framer-motion';

const ActivityItem = ({ transaction }) => {
  const { hash, type, status, amount, timestamp, to, from } = transaction;
  
  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return (
          <motion.span 
            className="text-yellow-500"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            🔄
          </motion.span>
        );
      case 'confirmed':
        return <span className="text-safety-green">✅</span>;
      case 'failed':
        return <span className="text-red-500">❌</span>;
      default:
        return null;
    }
  };
  
  const truncateAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  return (
    <motion.div 
      className="glass-card p-4 mb-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="font-medium capitalize">{type}</span>
        </div>
        <span className="text-xs text-gray-400">{new Date(timestamp).toLocaleTimeString()}</span>
      </div>
      
      <div className="mt-2 text-sm">
        {type === 'send' ? (
          <div>
            Sent <span className="font-medium">{amount} ETH</span> to{' '}
            <span className="text-ethereum-purple">{truncateAddress(to)}</span>
          </div>
        ) : (
          <div>
            Received <span className="font-medium">{amount} ETH</span> from{' '}
            <span className="text-ethereum-purple">{truncateAddress(from)}</span>
          </div>
        )}
      </div>
      
      <div className="mt-2 text-xs text-gray-400 truncate">
        Tx: {hash}
      </div>
    </motion.div>
  );
};

const ActivityFeed = ({ transactions = [] }) => {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-space-grotesk font-bold mb-4">Recent Activity</h3>
      
      {transactions.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          No transactions yet
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => (
            <ActivityItem key={tx.hash} transaction={tx} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
