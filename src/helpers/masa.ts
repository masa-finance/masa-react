import {
  Environment,
  environments,
  Masa,
  NetworkName,
} from '@masa-finance/masa-sdk';
import { Signer } from 'ethers';
import { ArweaveConfig } from '../provider';

export const createNewMasa = ({
  signer,
  environmentName,
  networkName = 'unknown',
  arweaveConfig,
  verbose,
  apiUrl,
}: {
  signer: Signer;
  environmentName: string;
  networkName?: NetworkName;
  arweaveConfig?: ArweaveConfig;
  verbose: boolean;
  apiUrl?: string;
}): Masa | undefined => {
  const environment = environments.find(
    (singleEnvironment: Environment) =>
      singleEnvironment.name === environmentName
  );

  if (!environment) {
    console.error(`Unable to find environment ${environmentName}`);
    return undefined;
  }

  return new Masa({
    signer,
    apiUrl: apiUrl ?? environment.apiUrl,
    networkName,
    environment: environment.environment,
    arweave: {
      host: arweaveConfig?.host || 'arweave.net',
      port: Number.parseInt(arweaveConfig?.port || '443', 10),
      protocol: arweaveConfig?.protocol || 'https',
      logging: !!arweaveConfig?.logging || false,
    },
    verbose,
  });
};
