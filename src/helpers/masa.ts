import {
  Environment,
  environments,
  Masa,
  NetworkName,
} from '@masa-finance/masa-sdk';
import { Signer } from 'ethers';
import { ArweaveConfig } from '../provider';
import {
  SoulName__factory,
  SoulStore__factory,
} from '@masa-finance/masa-contracts-identity';

export const createNewMasa = ({
  signer,
  environmentName,
  networkName = 'unknown',
  arweaveConfig,
  verbose,
  apiUrl,
  contractAddressOverrides,
}: {
  signer: Signer;
  environmentName: string;
  networkName?: NetworkName;
  arweaveConfig?: ArweaveConfig;
  verbose: boolean;
  apiUrl?: string;
  contractAddressOverrides?: {
    SoulNameAddress: string;
    SoulStoreAddress: string;
  };
}): Masa | undefined => {
  const environment = environments.find(
    (environment: Environment) => environment.name === environmentName
  );

  if (!environment) {
    console.error(`Unable to find environment ${environmentName}`);
    return;
  }

  let contractOverrides;
  if (contractAddressOverrides) {
    console.log({ contractAddressOverrides });

    contractOverrides = {};
    contractOverrides.SoulStoreContract = SoulStore__factory.connect(
      contractAddressOverrides.SoulStoreAddress,
      signer
    );
    contractOverrides.SoulStoreContract.hasAddress = true;

    contractOverrides.SoulNameContract = SoulName__factory.connect(
      contractAddressOverrides.SoulNameAddress,
      signer
    );
    contractOverrides.SoulNameContract.hasAddress = true;
  }

  return new Masa({
    signer,
    apiUrl: apiUrl ?? environment.apiUrl,
    networkName,
    environment: environment.environment,
    arweave: {
      host: arweaveConfig?.host || 'arweave.net',
      port: parseInt(arweaveConfig?.port || '443'),
      protocol: arweaveConfig?.protocol || 'https',
      logging: (!!arweaveConfig?.logging as boolean) || false,
    },
    contractOverrides,
    verbose,
  });
};
