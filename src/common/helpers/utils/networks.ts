import { ethers } from 'ethers';

const polygonChainId = 137;
const BSCChainId = 56;
const BSCTChainId = 97;
const mumbaiChainId = 80001;
const alfajoresChainId = 44787;
const celoChainId = 42220;

export interface Network {
  chainName: string;
  chainId: number;
  rpcUrls?: string[];
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrls?: string[];
}

const BSCNetwork: Network = {
  chainName: 'Binance Smart Chain',
  chainId: parseInt(ethers.utils.hexValue(BSCChainId)),
  rpcUrls: ['https://endpoints.omniatech.io/v1/bsc/mainnet/public'],
  nativeCurrency: {
    name: 'BSC',
    symbol: 'BSC',
    decimals: 18,
  },
};

const BSCTestnet: Network = {
  chainName: 'Binance Smart Chain Testnet',
  chainId: parseInt(ethers.utils.hexValue(BSCTChainId)),
  rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
  nativeCurrency: {
    name: 'BSC',
    symbol: 'BSC',
    decimals: 18,
  },
};

const celoNetwork: Network = {
  chainName: 'Celo',
  chainId: parseInt(ethers.utils.hexValue(celoChainId)),
  rpcUrls: ['https://forno.celo.org'],
  nativeCurrency: {
    name: 'CELO',
    symbol: 'CELO',
    decimals: 18,
  },
  blockExplorerUrls: ['https://alfajores-blockscout.celo-testnet.org'],
};

const alfajoresNetwork: Network = {
  chainName: 'Alfajores Network',
  chainId: parseInt(ethers.utils.hexValue(alfajoresChainId)),
  rpcUrls: ['https://alfajores-forno.celo-testnet.org'],
  nativeCurrency: {
    name: 'CELO',
    symbol: 'CELO',
    decimals: 18,
  },
};

const polygonNetwork: Network = {
  chainId: parseInt(ethers.utils.hexValue(polygonChainId)),
  chainName: 'Polygon Mainnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC', // 2-6 characters long
    decimals: 18,
  },
  rpcUrls: ['https://polygon-rpc.com/'],
  blockExplorerUrls: ['https://polygonscan.com/'],
};

const mumbaiNetwork: Network = {
  chainId: parseInt(ethers.utils.hexValue(mumbaiChainId)),
  chainName: 'Mumbai Testnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC', // 2-6 characters long
    decimals: 18,
  },
  rpcUrls: ['https://polygon-testnet-rpc.allthatnode.com:8545'],
  blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
};

export const SupportedNetworks: {
  [key: number]: Network;
} = {
  1: {
    chainId: parseInt(ethers.utils.hexValue(1)),
    chainName: 'Ethereum',
  },
  5: {
    chainId: parseInt(ethers.utils.hexValue(5)),
    chainName: 'Goerli',
  },
  56: BSCNetwork,
  97: BSCTestnet,
  137: polygonNetwork,
  44787: alfajoresNetwork,
  80001: mumbaiNetwork,
  42220: celoNetwork,
};
