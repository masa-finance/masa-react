import { SupportedNetworks, addresses } from '@masa-finance/masa-sdk';
import { Chain } from '@rainbow-me/rainbowkit';

const { masa, masatest } = SupportedNetworks;
const masaContracts = Object.entries(addresses!.masa!)
  .map(([key, value]) => ({
    [key]: { address: value },
  }))
  .reduce((acc, val) => ({ ...acc, ...val }), {});
const masaTestnetContracts = Object.entries(addresses!.masatest!)
  .map(([key, value]) => ({
    [key]: { address: value },
  }))
  .reduce((acc, val) => ({ ...acc, ...val }), {});

export const masaChain = {
  id: masa!.chainId,
  name: masa!.chainName,
  iconUrl: undefined,
  iconBackground: '#fff',
  nativeCurrency: {
    name: masa!.nativeCurrency?.name as string,
    symbol: masa!.nativeCurrency?.symbol as string,
    decimals: masa!.nativeCurrency?.decimals as number,
  },
  rpcUrls: {
    default: { http: ['https://subnets.avax.network/masanetwork/mainnet/rpc'] },
  },
  blockExplorers: {
    default: { name: 'Avalanche', url: 'https://subnets.avax.network/masa' },
  },
  contracts: {
    ...masaContracts,
  },
} as const satisfies Chain;

export const masaTestnetChain = {
  id: masatest!.chainId,
  name: masatest!.chainName,
  iconUrl: undefined,
  iconBackground: '#fff',
  nativeCurrency: {
    name: masatest!.nativeCurrency?.name as string,
    symbol: masatest!.nativeCurrency?.symbol as string,
    decimals: masatest!.nativeCurrency?.decimals as number,
  },
  rpcUrls: {
    default: { http: ['https://subnets.avax.network/masatestne/testnet/rpc'] },
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
} as const satisfies Chain;
