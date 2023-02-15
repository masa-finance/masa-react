import { ethers } from 'ethers';
import { NetworkName } from '@masa-finance/masa-sdk';

const ethereumChainId = 1;
const goerliChainId = 5;
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
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
};

const BSCTestnet: Network = {
  chainName: 'Binance Smart Chain Testnet',
  chainId: parseInt(ethers.utils.hexValue(BSCTChainId)),
  rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
  nativeCurrency: {
    name: 'tBNB',
    symbol: 'tBNB',
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
    name: 'tMATIC',
    symbol: 'tMATIC', // 2-6 characters long
    decimals: 18,
  },
  rpcUrls: ['https://polygon-testnet-rpc.allthatnode.com:8545'],
  blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
};

const ethereumNetwork: Network = {
  chainId: parseInt(ethers.utils.hexValue(ethereumChainId)),
  chainName: 'Ethereum Mainnet',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH', // 2-6 characters long
    decimals: 18,
  },
};

const goerliNetwork: Network = {
  chainId: parseInt(ethers.utils.hexValue(goerliChainId)),
  chainName: 'Goerli Testnet',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH', // 2-6 characters long
    decimals: 18,
  },
};

export const SupportedNetworks: {
  [key in NetworkName]: Network;
} = {
  // ETH
  mainnet: ethereumNetwork,
  goerli: goerliNetwork,
  // BSC
  bsc: BSCNetwork,
  bsctest: BSCTestnet,
  // Polygon
  polygon: polygonNetwork,
  mumbai: mumbaiNetwork,
  // celo
  celo: celoNetwork,
  alfajores: alfajoresNetwork,
};
