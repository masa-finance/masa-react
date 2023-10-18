import {
  Network,
  NetworkName,
  SupportedNetworks,
} from '@masa-finance/masa-sdk';
import { Chain } from '@wagmi/chains';

export const getWagmiNetworkName = (masaNetworkName?: NetworkName): string => {
  if (masaNetworkName === 'ethereum') return 'homestead';
  if (masaNetworkName === 'alfajores') return 'celo-alfajores';
  return masaNetworkName as string;
};

export const getMasaNetworkName = (
  wagmiNetworkName: NetworkName | 'homestead' | 'celo-alfajores' | undefined
): NetworkName => {
  if (wagmiNetworkName === 'homestead') return 'ethereum';
  if (wagmiNetworkName === 'celo-alfajores') return 'alfajores';

  return wagmiNetworkName as NetworkName;
};

const rainbowkitChains: Chain[] = Object.keys(SupportedNetworks)
  .filter((x: string) => x !== 'unknown') // remove unused network
  .map((networkName: string) => {
    const network: Network = SupportedNetworks[networkName] as Network;
    return {
      id: network.chainId,
      name: network.chainName,
      network: getWagmiNetworkName(network.networkName),
      nativeCurrency: {
        name: network.nativeCurrency?.symbol ?? 'ETH',
        symbol: network.nativeCurrency?.symbol ?? 'ETH',
        decimals: network.nativeCurrency?.decimals ?? 18,
      },
      rpcUrls: {
        default: {
          http: [network.rpcUrls[0] ?? ''],
          webSocket: network.rpcUrls[2] ? [network.rpcUrls[2]] : undefined,
        },
        public: {
          http: [network.rpcUrls[0] ?? ''],
          webSocket: network.rpcUrls[2] ? [network.rpcUrls[2]] : undefined,
        },
      },
      testnet: network.isTestnet,
    };
  });

export const getRainbowkitChains = (networkNames?: NetworkName[]): Chain[] => {
  if (!networkNames || (networkNames && networkNames.length === 0)) {
    return rainbowkitChains;
  }

  return networkNames
    .map((networkName: NetworkName) => {
      const network = SupportedNetworks[networkName];

      console.log({ networkName });
      if (network) {
        return rainbowkitChains.find(
          (chain: Chain) => chain.id === network.chainId
        );
      }

      return undefined;
    })
    .filter((chain: Chain | undefined) => !!chain) as Chain[];
};

export const getChainIdNetworkMap = (chains?: Chain[]) => {
  const chainIdNetworkMap = {};

  if (!chains) return chainIdNetworkMap;

  for (const chain of chains) {
    if (chain) chainIdNetworkMap[chain.network] = chain.id;
  }

  return chainIdNetworkMap;
};

export const getChainsSortedByForcedNetwork = (
  chains: Chain[],
  forceChain?: NetworkName
) => {
  if (!forceChain) return chains;

  const singleChain = chains.filter(
    (chain: Chain) => chain.network === getWagmiNetworkName(forceChain)
  );

  const sortedChains = [
    ...singleChain,
    ...chains.filter(
      (chain: Chain) => chain.network !== getWagmiNetworkName(forceChain)
    ),
  ];

  return sortedChains;
};
