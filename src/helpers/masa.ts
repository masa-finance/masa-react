import {
  createRandomWallet,
  Environment,
  environments,
  Masa,
} from '@masa-finance/masa-sdk';
import { ethers, providers } from 'ethers';
import { ArweaveConfig } from '../provider';
import { getNetworkNameByChainId } from './networks';

export const getWeb3Provider = (): providers.Web3Provider | undefined => {
  if (
    typeof window !== 'undefined' &&
    typeof window?.ethereum !== 'undefined'
  ) {
    return new providers.Web3Provider(
      window?.ethereum as unknown as providers.ExternalProvider
    );
  }

  return;
};

export const createNewMasa = async ({
  signer,
  environmentName,
  arweaveConfig,
  verbose,
}: {
  signer: ethers.Signer | null;
  environmentName: string;
  arweaveConfig?: ArweaveConfig;
  verbose: boolean;
}): Promise<Masa | undefined> => {
  const newSigner: ethers.Signer | null = signer
    ? signer
    : createRandomWallet(getWeb3Provider());

  if (!newSigner) return;

  const environment = environments.find(
    (environment: Environment) => environment.name === environmentName
  );
  if (!environment) return;

  const chainId: number = await newSigner.getChainId();

  return new Masa({
    wallet: newSigner,
    apiUrl: environment.apiUrl,
    defaultNetwork: getNetworkNameByChainId(chainId),
    environment: environment.environment,
    arweave: {
      host: arweaveConfig?.host || 'arweave.net',
      port: parseInt(arweaveConfig?.port || '443'),
      protocol: arweaveConfig?.protocol || 'https',
      logging: (!!arweaveConfig?.logging as boolean) || false,
    },
    verbose,
  });
};
