import {
  Environment,
  environments,
  Masa,
  NetworkName,
} from '@masa-finance/masa-sdk';
import { ethers, providers } from 'ethers';
import { ArweaveConfig } from '../provider';

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

export const createNewMasa = ({
  wallet,
  environmentName,
  networkName = 'unknown',
  arweaveConfig,
  verbose,
}: {
  wallet: ethers.Signer | ethers.Wallet;
  environmentName: string;
  networkName?: NetworkName;
  arweaveConfig?: ArweaveConfig;
  verbose: boolean;
}): Masa | undefined => {
  const environment = environments.find(
    (environment: Environment) => environment.name === environmentName
  );
  if (!environment) {
    console.error(`Unable to find environment ${environmentName}`);
    return;
  }

  return new Masa({
    wallet,
    apiUrl: environment.apiUrl,
    networkName,
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
