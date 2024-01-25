import {
  Network,
  NetworkName,
  SupportedNetworks,
} from '@masa-finance/masa-sdk';
import { Chain } from '@wagmi/chains';
// import { type Chain } from 'viem';
const rainbowkitChains: Chain[] = Object.keys(SupportedNetworks)
  .filter((networkName: string) => networkName !== 'unknown') // remove unused network
  .map((networkName: string) => {
    const network: Network = SupportedNetworks[networkName] as Network;
    return {
      id: network.chainId,
      name: network.chainName,
      network: network.networkName,
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

export const getRainbowkitChains = (
  networkNames?: NetworkName[]
): readonly Chain[] => {
  if (!networkNames || (networkNames && networkNames.length === 0)) {
    return rainbowkitChains;
  }

  return networkNames
    .map((networkName: NetworkName) => {
      const network = SupportedNetworks[networkName];

      if (network) {
        return rainbowkitChains.find(
          (chain: Chain) => chain.id === network.chainId
        );
      }

      return undefined;
    })
    .filter((chain: Chain | undefined) => !!chain) as readonly Chain[];
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
  chains: readonly Chain[],
  forceChain?: NetworkName
): readonly [Chain, ...Chain[]] => {
  if (!forceChain) return chains as readonly [Chain, ...Chain[]];

  const singleChain = chains.filter(
    (chain: Chain) => chain.network === forceChain
  );

  return [
    ...singleChain,
    ...chains.filter((chain: Chain) => chain.network !== forceChain),
  ] as unknown as readonly [Chain, ...Chain[]];
};
