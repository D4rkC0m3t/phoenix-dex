// Wallet related types
export interface Wallet {
  address: string;
  privateKey: string;
  mnemonic: string;
}

export interface Token {
  symbol: string;
  address: string;
  balance: string;
}

export interface Transaction {
  hash: string;
  type: 'send' | 'receive' | 'swap' | 'approve';
  status: 'pending' | 'confirmed' | 'failed';
  amount: string;
  timestamp: number;
  from: string;
  to: string;
}

// Component props types
export interface WalletCardProps {
  balance: string;
  address: string;
  network: string;
  tokens?: Token[];
}

export interface NetworkSwitcherProps {
  currentNetwork: string;
  onNetworkChange: (networkId: string) => void;
}

export interface TokenBadgeProps {
  symbol: string;
  balance: string;
  address: string;
}

export interface CopyButtonProps {
  text: string;
}

export interface ActionButtonProps {
  icon?: string;
  label: string;
  onClick: () => void;
  primary?: boolean;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

export interface Action {
  label: string;
  icon: string;
  onClick: () => void;
}

export interface FloatingActionMenuProps {
  actions: Action[];
}

export interface ActivityFeedProps {
  transactions: Transaction[];
}

export interface ActivityItemProps {
  transaction: Transaction;
}

export interface SendFormProps {
  senderAddress: string;
  network: string;
  onClose: () => void;
  onSuccess: (txHash: string) => void;
}

export interface ReceiveFormProps {
  address: string;
  network: string;
  onClose: () => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export interface WalletFrameProps {
  type: 'hot' | 'cold';
  address: string;
  balance: string;
  tokens?: Token[];
  isActive?: boolean;
  onClick?: () => void;
  onConnectHardware?: () => void;
}

export interface AltCoinCardProps {
  name: string;
  symbol: string;
  balance: string;
  value: string;
  change: number;
  icon?: string;
  color?: 'blue' | 'pink' | 'yellow' | 'green' | 'purple';
}

export interface HardwareWalletCardProps {
  name: string;
  price: string;
  oldPrice?: string;
  image: string;
  description: string;
  badge?: string;
  color?: 'blue' | 'pink' | 'yellow' | 'green' | 'purple';
  onConnect: () => void;
}
