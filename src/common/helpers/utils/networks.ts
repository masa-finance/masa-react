import { ethers } from 'ethers';

const polygonChainId = 137;
const BSCChainId = 56;
const BSCTChainId = 97;
const mumbaiChainId = 80001;
const alfajoresChainId = 44787;
const celoChainId = 42220;

const BSCNetwork = {
  chainName: 'Binance Smart Chain',
  chainId: ethers.utils.hexValue(BSCChainId),
  rpcUrls: ['https://endpoints.omniatech.io/v1/bsc/mainnet/public'],
  nativeCurrency: {
    name: 'BSC',
    symbol: 'BSC',
    decimals: 18,
  },
};

const BSCTestnet = {
  chainName: 'Binance Smart Chain Testnet',
  chainId: ethers.utils.hexValue(BSCTChainId),
  rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
  nativeCurrency: {
    name: 'BSC',
    symbol: 'BSC',
    decimals: 18,
  },
};

const celoNetwork = {
  chainName: 'Celo',
  chainId: ethers.utils.hexValue(celoChainId),
  rpcUrls: ['https://forno.celo.org'],
  nativeCurrency: {
    name: 'CELO',
    symbol: 'CELO',
    decimals: 18,
  },
  blockExplorerUrls: ['https://alfajores-blockscout.celo-testnet.org'],
};

const alfajoresNetwork = {
  chainName: 'Alfajores Network',
  chainId: ethers.utils.hexValue(alfajoresChainId),
  rpcUrls: ['https://alfajores-forno.celo-testnet.org'],
  nativeCurrency: {
    name: 'CELO',
    symbol: 'CELO',
    decimals: 18,
  },
};

const polygonNetwork = {
  chainId: ethers.utils.hexValue(polygonChainId),
  chainName: 'Polygon Mainnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC', // 2-6 characters long
    decimals: 18,
  },
  rpcUrls: ['https://polygon-rpc.com/'],
  blockExplorerUrls: ['https://polygonscan.com/'],
};

const mumbaiNetwork = {
  chainId: ethers.utils.hexValue(mumbaiChainId),
  chainName: 'Mumbai Testnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC', // 2-6 characters long
    decimals: 18,
  },
  rpcUrls: ['https://polygon-testnet-rpc.allthatnode.com:8545'],
  blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
};

export const SupportedNetworks = {
  1: {
    chainId: ethers.utils.hexValue(1),
    chainName: 'Ethereum',
  },
  5: {
    chainId: ethers.utils.hexValue(5),
    chainName: 'Goerli',
  },
  56: BSCNetwork,
  97: BSCTestnet,
  137: polygonNetwork,
  44787: alfajoresNetwork,
  80001: mumbaiNetwork,
  42220: celoNetwork,
};
