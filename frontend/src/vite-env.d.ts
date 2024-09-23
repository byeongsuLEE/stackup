/// <reference types="vite/client" />

interface Ethereum {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
}

// interface Window {
//   ethereum?: any;
// }