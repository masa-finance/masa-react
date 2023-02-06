import {
  Environment,
  environments,
  Masa,
  NetworkName,
} from '@masa-finance/masa-sdk';
import { ethers, Wallet } from 'ethers';
import { ArweaveConfig } from '../provider';

const getChainName = (chainId: number): string => {
  switch (chainId) {
    case 1:
      return 'mainnet';
    case 5:
      return 'goerli';
    case 44787:
      return 'alfajores';
    case 42220:
      return 'celo';
    case 137:
      return 'polygon';
    case 80001:
      return 'mumbai';

    default:
      return 'goerli';
  }
};
export const createRandomWallet = (): Wallet | null => {
  console.info('Creating random wallet!');
  const wallet = ethers.Wallet.createRandom();

  if (typeof window !== 'undefined') {
    if (typeof window?.ethereum !== 'undefined') {
      return wallet.connect(
        new ethers.providers.Web3Provider(window?.ethereum as any)
      );
    } else {
      return null;
    }
  } else {
    return null;
  }
};

export const createNewMasa = ({
  newWallet,
  environment,
  arweaveConfig,
  verbose,
}: {
  newWallet?: any;
  environment: string;
  arweaveConfig?: ArweaveConfig;
  verbose: boolean;
}): Masa | null => {
  const signer = newWallet ? newWallet : createRandomWallet();
  if (!signer) return null;

  const env = environments.find((e: Environment) => e.name === environment);
  if (!env) return null;

  return new Masa({
    wallet: signer,
    apiUrl: env.apiUrl,
    defaultNetwork: getChainName(
      signer?.provider?._network?.chainId ?? 5
    ) as NetworkName,
    environment: env.environment,
    arweave: {
      host: arweaveConfig?.host || 'arweave.net',
      port: parseInt(arweaveConfig?.port || '443'),
      protocol: arweaveConfig?.protocol || 'https',
      logging: (!!arweaveConfig?.logging as boolean) || false,
    },
    verbose,
  });
};
