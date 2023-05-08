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
  mainnet,
  polygon,
  polygonMumbai,
} from 'wagmi/chains';

const rainbowkitChains = [
  Alfajores,
  baseGoerli,
  bsc,
  bscTestnet,
  Celo,
  goerli,
  mainnet,
  polygon,
  polygonMumbai,
];

export type MasaNetworks = Partial<{
  goerli: Network;
  ethereum: Network;
  mainnet: Network;
  alfajores: Network;
  celo: Network;
  mumbai: Network;
  polygon: Network;
  bsctest: Network;
  bsc: Network;
  basegoerli: Network;
  unknown: Network;
}>;

export const getRainbowkitChains = (
  networkList?: Array<keyof MasaNetworks>
) => {
  console.log({ networkList });
  if (!networkList || (networkList && !networkList.length)) {
    return rainbowkitChains;
  }

  const masaNetworks = Object.keys(SupportedNetworks)
    .filter((x: string) => x !== 'ethereum' && x !== 'unknown') // remove unused network
    .reduce((acc: MasaNetworks, val: string) => {
      acc[val] = SupportedNetworks[val] as Network;
      return acc;
    }, {});

  const masaNetworkNames = Object.keys(masaNetworks);

  const userNetworksFiltered = networkList.filter((networkName: NetworkName) =>
    masaNetworkNames.includes(networkName)
  );

  const userNetworksMasa = userNetworksFiltered.map((un) => masaNetworks[un]);
  const userNetworksRainbowkit = userNetworksMasa.map((unm) => unm?.chainId);
  const userChainsRainbowkit = rainbowkitChains.filter(
    (rainbowkitChain: Chain) =>
      userNetworksRainbowkit.includes(rainbowkitChain.id)
  );

  return userChainsRainbowkit;
};
