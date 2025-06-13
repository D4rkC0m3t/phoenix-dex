// Import types from the types.d.ts file
interface Token {
  symbol: string;
  name: string;
  balance: string;
  address: string;
  decimals: number;
  logo?: string;
}

interface Transaction {
  hash: string;
  type: 'send' | 'receive';
  status: 'pending' | 'confirmed' | 'failed';
  amount: string;
  timestamp: number;
  from: string;
  to: string;
  token?: string;
  fee?: string;
}

export interface TokenBalance {
  symbol: string;
  balance: string;
  address: string;
  decimals: number;
  logo?: string;
}

export interface AltCoin {
  symbol: string;
  balance: string;
  value: string;
  change: number;
  name: string;
  logo?: string;
  color?: string;
}

export interface Action {
  label: string;
  icon: string;
  onClick: () => void;
  primary?: boolean;
}

export interface WalletState {
  address: string;
  balance: string;
  tokens: Token[];
  transactions: Transaction[];
  altCoins: AltCoin[];
}

export interface AppState {
  wallet: WalletState | null;
  network: string;
  loading: boolean;
  activeSection: string;
  isSendModalOpen: boolean;
  isReceiveModalOpen: boolean;
  isTxDetailsModalOpen: boolean;
  currentTxHash: string;
}
