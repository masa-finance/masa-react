import {
  Network,
  NetworkName,
  SupportedNetworks,
} from '@masa-finance/masa-sdk';
import { Alfajores, Celo } from '@celo/rainbowkit-celo/chains';
import {
  baseGoerli,
  bsc,
  bscTestnet,
  Chain,
  goerli,
  mainnet as ethereum,
  polygon,
  polygonMumbai,
} from 'wagmi/chains';

const rainbowkitChains = [
  ethereum,
  Alfajores,
  Celo,
  baseGoerli,
  bsc,
  bscTestnet,
  goerli,
  polygon,
  polygonMumbai,
];

export type MasaNetworks = Partial<{
  goerli: Network;
  ethereum: Network;
  alfajores: Network;
  celo: Network;
  mumbai: Network;
  polygon: Network;
  bsctest: Network;
  bsc: Network;
  basegoerli: Network;
  unknown: Network;
  homestead: Network;
}>;

type NetworkNameWithHomestead = NetworkName | 'homestead';

export const correctNetworkListForWagmi = (networkList: NetworkName[]) => {
  const networkListCorrectedForWagmi:
    | Array<NetworkName | 'homestead'>
    | undefined = networkList?.map((nl: NetworkName) => {
    if (nl === 'ethereum') return 'homestead';
    return nl;
  });

  return networkListCorrectedForWagmi;
};
export const getRainbowkitChains = (
  networkList?: Array<keyof MasaNetworks>
) => {
  if (!networkList || (networkList && networkList.length === 0)) {
    return rainbowkitChains;
  }

  const masaNetworksNew: Partial<{
    goerli: Network;
    ethereum: Network;
    alfajores: Network;
    celo: Network;
    mumbai: Network;
    polygon: Network;
    bsctest: Network;
    bsc: Network;
    basegoerli: Network;
    unknown: Network;
    homestead: Network;
  }> = {};

  for (const networkName of Object.keys(SupportedNetworks)) {
    if (networkName !== 'unknown' && networkName !== 'ethereum') {
      masaNetworksNew[networkName] = SupportedNetworks[networkName] as Network;
    }

    if (networkName === 'ethereum') {
      masaNetworksNew.homestead = SupportedNetworks.ethereum as Network;
    }
  }
  const masaNetworks = Object.keys(SupportedNetworks)
    .filter((x: string) => x !== 'unknown') // remove unused network
    .reduce(
      (acc: MasaNetworks, val: string) => {
        acc[val] = SupportedNetworks[val] as Network;
        if (val === 'ethereum') {
          // NOTE: ethereum is called homestead in wagmi so we have to adjust our networks a bit
          acc.homestead = SupportedNetworks.ethereum as Network;
          acc.homestead.networkName = 'homestead' as NetworkName;
        }
        return acc;
      },
      {
        homestead: SupportedNetworks.ethereum as Network & {
          networkName: NetworkName | 'homestead';
        },
      }
    );

  const masaNetworkNames = Object.keys(masaNetworksNew);

  const userNetworksFiltered = networkList.filter(
    (networkName: NetworkNameWithHomestead) =>
      masaNetworkNames.includes(
        // NOTE: this is a hack to make sure we can use wagmi's homestead network
        networkName === 'ethereum' ? 'homestead' : networkName
      )
  );

  const userNetworksMasa = userNetworksFiltered.map((un) => masaNetworks[un]);
  const userNetworksRainbowkit = new Set(
    userNetworksMasa.map((unm) => unm?.chainId)
  );
  const userChainsRainbowkit = rainbowkitChains.filter(
    (rainbowkitChain: Chain) => userNetworksRainbowkit.has(rainbowkitChain.id)
  );

  return userChainsRainbowkit;
};

export const getChainIdNetworkMap = (chains?: Chain[]) => {
  const chainIdNetworkMap = {};

  if (!chains) return chainIdNetworkMap;

  for (const chain of chains) {
    chainIdNetworkMap[chain.network] = chain.id;
  }

  return chainIdNetworkMap;
};
