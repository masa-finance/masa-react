import { ethers } from 'ethers';
import { NetworkName } from '@masa-finance/masa-sdk';

// eth
const ethereumChainId = 1;
const goerliChainId = 5;
//polygon
const polygonChainId = 137;
const mumbaiChainId = 80001;
// bsc
const BSCChainId = 56;
const BSCTChainId = 97;
// celo
const celoChainId = 42220;
const alfajoresChainId = 44787;

export interface Network {
  networkName: NetworkName;
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

export const getNetworkNameByChainId = (chainId: number): NetworkName => {
  switch (chainId) {
    // ETH
    case ethereumChainId:
      return 'ethereum';
    case goerliChainId:
      return 'goerli';

    // Celo
    case alfajoresChainId:
      return 'alfajores';
    case celoChainId:
      return 'celo';

    // Polygon
    case polygonChainId:
      return 'polygon';
    case mumbaiChainId:
      return 'mumbai';

    // BSC
    case BSCTChainId:
      return 'bsctest';
    case BSCChainId:
      return 'bsc';

    default:
      throw new Error(`Unsupported network! ${chainId}`);
  }
};

const BSCNetwork: Network = {
  networkName: 'bsc',
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
  networkName: 'bsctest',
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
  networkName: 'celo',
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
  networkName: 'alfajores',
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
  networkName: 'polygon',
  chainName: 'Polygon Mainnet',
  chainId: parseInt(ethers.utils.hexValue(polygonChainId)),
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC', // 2-6 characters long
    decimals: 18,
  },
  rpcUrls: ['https://polygon-rpc.com/'],
  blockExplorerUrls: ['https://polygonscan.com/'],
};

const mumbaiNetwork: Network = {
  networkName: 'mumbai',
  chainName: 'Mumbai Testnet',
  chainId: parseInt(ethers.utils.hexValue(mumbaiChainId)),
  nativeCurrency: {
    name: 'tMATIC',
    symbol: 'tMATIC', // 2-6 characters long
    decimals: 18,
  },
  rpcUrls: ['https://polygon-testnet-rpc.allthatnode.com:8545'],
  blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
};

const ethereumNetwork: Network = {
  networkName: 'ethereum',
  chainName: 'Ethereum Mainnet',
  chainId: parseInt(ethers.utils.hexValue(ethereumChainId)),
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH', // 2-6 characters long
    decimals: 18,
  },
};

const goerliNetwork: Network = {
  networkName: 'goerli',
  chainName: 'Goerli Testnet',
  chainId: parseInt(ethers.utils.hexValue(goerliChainId)),
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
  ethereum: ethereumNetwork,
  goerli: goerliNetwork,
  // deprecated!
  mainnet: ethereumNetwork,
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
