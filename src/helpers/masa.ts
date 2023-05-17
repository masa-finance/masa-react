import {
  Environment,
  environments,
  Masa,
  NetworkName,
} from '@masa-finance/masa-sdk';
import { ethers } from 'ethers';
import { ArweaveConfig } from '../provider';

export const createNewMasa = ({
  wallet,
  environmentName,
  networkName = 'unknown',
  arweaveConfig,
  verbose,
  apiUrl,
}: {
  wallet: ethers.Signer | ethers.Wallet;
  environmentName: string;
  networkName?: NetworkName;
  arweaveConfig?: ArweaveConfig;
  verbose: boolean;
  apiUrl?: string;
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
    apiUrl: apiUrl ?? environment.apiUrl,
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
