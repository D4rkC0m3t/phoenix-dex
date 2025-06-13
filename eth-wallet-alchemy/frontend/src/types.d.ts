// Ethereum window type
interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    selectedAddress?: string;
    request: (request: { method: string; params?: any[] }) => Promise<any>;
    on: (eventName: string, callback: (...args: any[]) => void) => void;
    removeListener: (eventName: string, callback: (...args: any[]) => void) => void;
  };
}

// Wallet type
export interface Wallet {
  address: string;
  privateKey?: string;
}

// Token type
export interface Token {
  symbol: string;
  name: string;
  balance: string;
  address: string;
  decimals: number;
  logo?: string;
}

// Transaction type
export interface Transaction {
  hash: string;
  type: 'send' | 'receive' | 'swap' | 'approve';
  status: 'pending' | 'confirmed' | 'failed';
  amount: string;
  timestamp: number;
  from: string;
  to: string;
  token?: string;
  fee?: string;
}

// Action type for action menu
export interface Action {
  label: string;
  icon: string;
  onClick: () => void;
}

// Props for WalletCard component


// Props for WalletFrame component
export interface WalletFrameProps {
  type: 'hot' | 'cold';
  address: string;
  balance: string;
  tokens?: Token[];
  isActive?: boolean;
  onClick?: () => void;
}

// Props for NetworkSwitcher component
export interface NetworkSwitcherProps {
  currentNetwork: string;
  onNetworkChange: (network: string) => void;
}

// Props for SendForm component
export interface SendFormProps {
  senderAddress: string;
  network: string;
  onClose: () => void;
  onSuccess: (txHash: string) => void;
}

// Props for ReceiveForm component
export interface ReceiveFormProps {
  address: string;
  network: string;
  onClose: () => void;
}

// Props for TransactionDetails component
export interface TransactionDetailsProps {
  txHash: string;
  network: string;
  onClose: () => void;
}

// Props for SwapInterface component
export interface SwapInterfaceProps {
  address: string;
  network: string;
}

// Props for ActionButton component
export interface ActionButtonProps {
  label: string;
  icon: string;
  onClick: () => void;
  primary?: boolean;
}

// Props for Modal component
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

// Props for ActivityFeed component
export interface ActivityFeedProps {
  transactions: Transaction[];
}

// Props for ThemeToggle component
export interface ThemeToggleProps {
  className?: string;
}

// Props for LogoGif component
export interface LogoGifProps {
  className?: string;
}

// Props for WalletSection component
export interface WalletSectionProps {
  hotWalletAddress: string;
  hotWalletBalance: string;
  hotWalletTokens: Token[];
  coldWalletAddress: string;
  coldWalletBalance: string;
  coldWalletTokens: Token[];
  altCoins: Token[];
}

// Props for HardwareDevice component
export interface HardwareDeviceProps {
  name: string;
  image: string;
  description: string;
}

// Props for ChainSupport component
export interface ChainSupportProps {
  className?: string;
}
