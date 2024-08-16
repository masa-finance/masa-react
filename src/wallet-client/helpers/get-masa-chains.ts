/* eslint-disable unicorn/no-array-reduce */
import { SupportedNetworks, addresses } from '@masa-finance/masa-sdk';
import { Chain } from 'viem/chains';

type Contracts = Record<string, { address: string }>;

const { masa, masatest } = SupportedNetworks;

const masaContracts = addresses.masa
  ? Object.entries(addresses.masa)
      .map(
        ([key, value]: [string, string]) =>
          ({
            [key]: { address: value },
          }) as Contracts
      )
      .reduce((acc: Contracts, val: Contracts) => ({ ...acc, ...val }), {})
  : undefined;
const masaTestnetContracts = addresses.masatest
  ? Object.entries(addresses.masatest)
      .map(
        ([key, value]: [string, string]) =>
          ({
            [key]: { address: value },
          }) as Contracts
      )
      .reduce((acc: Contracts, val: Contracts) => ({ ...acc, ...val }), {})
  : undefined;

export const masaChain: Chain | undefined = masa
  ? {
      id: masa.chainId,
      name: masa.chainName,
      nativeCurrency: {
        name: masa.nativeCurrency?.name as string,
        symbol: masa.nativeCurrency?.symbol as string,
        decimals: masa.nativeCurrency?.decimals as number,
      },
      rpcUrls: {
        default: {
          http: ['https://subnets.avax.network/masanetwork/mainnet/rpc'],
        },
      },
      blockExplorers: {
        default: {
          name: 'Avalanche',
          url: 'https://subnets.avax.network/masa',
        },
      },
      contracts: {
        ...masaContracts,
      },
    }
  : undefined;

export const masaTestnetChain: Chain | undefined = masatest
  ? {
      id: masatest.chainId,
      name: masatest.chainName,
      nativeCurrency: {
        name: masatest.nativeCurrency?.name as string,
        symbol: masatest.nativeCurrency?.symbol as string,
        decimals: masatest.nativeCurrency?.decimals as number,
      },
      rpcUrls: {
        default: {
          http: ['https://subnets.avax.network/masatestne/testnet/rpc'],
        },
      },
      blockExplorers: {
        default: {
          name: 'Avalanche',
          url: 'https://subnets-test.avax.network/masatestnet',
        },
      },
      contracts: {
        ...masaTestnetContracts,
      },
    }
  : undefined;

export const avalanche = {
  id: 43_114,
  name: 'Avalanche',
  //   iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png',
  //   iconBackground: '#fff',
  nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
  rpcUrls: {
    public: { http: ['https://api.avax.network/ext/bc/C/rpc'] },
    default: { http: ['https://api.avax.network/ext/bc/C/rpc'] },
  },
  blockExplorers: {
    default: { name: 'SnowTrace', url: 'https://snowtrace.io' },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 11_907_934,
    },
  },
} as const satisfies Chain;
