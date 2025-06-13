import { motion } from 'framer-motion';
import type { ActivityFeedProps, ActivityItemProps, Transaction } from '../types';

const ActivityItem: React.FC<ActivityItemProps> = ({ transaction }) => {
  const { hash, type, status, amount, timestamp, to, from } = transaction;

  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'var(--color-accent-3)';
      case 'confirmed':
        return 'var(--color-accent-2)';
      case 'failed':
        return 'var(--color-accent-1)';
      default:
        return 'var(--color-accent-2)';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return (
          <motion.div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: getStatusColor() }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        );
      case 'confirmed':
        return (
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: getStatusColor() }}
          />
        );
      case 'failed':
        return (
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: getStatusColor() }}
          />
        );
      default:
        return null;
    }
  };

  const truncateAddress = (address: string): string => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <motion.div
      className="p-4 mb-3 rounded-xl border border-white/5 hover:border-white/10 bg-white/5 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        transition: { duration: 0.2 }
      }}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="font-medium capitalize" style={{ color: getStatusColor() }}>{type}</span>
        </div>
        <span className="text-xs text-gray-400">{new Date(timestamp).toLocaleDateString()} {new Date(timestamp).toLocaleTimeString()}</span>
      </div>

      <div className="mt-2 text-sm">
        {type === 'send' ? (
          <div className="flex items-center">
            <span className="mr-2">Sent</span>
            <span className="font-medium gradient-text">{amount} ETH</span>
            <span className="mx-2">to</span>
            <div className="bg-white/10 px-2 py-0.5 rounded-full text-xs">
              {truncateAddress(to)}
            </div>
          </div>
        ) : (
          <div className="flex items-center">
            <span className="mr-2">Received</span>
            <span className="font-medium gradient-text">{amount} ETH</span>
            <span className="mx-2">from</span>
            <div className="bg-white/10 px-2 py-0.5 rounded-full text-xs">
              {truncateAddress(from)}
            </div>
          </div>
        )}
      </div>

      <div className="mt-2 text-xs text-gray-400 truncate">
        <span className="bg-white/5 px-2 py-0.5 rounded-full">Tx: {hash.substring(0, 10)}...{hash.substring(hash.length - 6)}</span>
      </div>
    </motion.div>
  );
};

const ActivityFeed: React.FC<ActivityFeedProps> = ({ transactions = [] }) => {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-heading">Recent Activity</h3>
        <div className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full">
          {transactions.length} transactions
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center text-gray-400 py-12 border border-dashed border-white/10 rounded-xl">
          <div className="text-4xl mb-3">📭</div>
          <div>No transactions yet</div>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <ActivityItem key={tx.hash} transaction={tx} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
