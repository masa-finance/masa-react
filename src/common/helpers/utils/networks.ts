import { ethers } from "ethers";

const polygonChainId = 137;
const BSCChainId = 56;
const alfajoresChainId = 44787;

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

export const SupportedNetworks = {
  1: {
    chainId: ethers.utils.hexValue(1),
    chainName: 'Ethereum',
  },
  5: {
    chainId: ethers.utils.hexValue(1),
    chainName: 'Goerli',
  },
  56: BSCNetwork,
  137: polygonNetwork,
  44787: alfajoresNetwork,
};