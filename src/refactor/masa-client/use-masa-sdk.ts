import {
  Environment,
  EnvironmentName,
  environments,
  IIdentityContracts,
  Masa,
  NetworkName,
} from '@masa-finance/masa-sdk';
import {
  SoulName__factory,
  SoulStore__factory,
} from '@masa-finance/masa-contracts-identity';

import type { Signer } from 'ethers';
import { useMemo } from 'react';
import { ArweaveConfig } from '../config';

export interface UseMasaSdkArgs {
  signer?: Signer;
  environmentName?: EnvironmentName;
  networkName?: NetworkName;
  arweaveConfig?: ArweaveConfig;
  verbose?: boolean;
  apiUrl?: string;
  contractAddressOverrides?: {
    SoulNameAddress: string;
    SoulStoreAddress: string;
  };
}
export const useMasaSDK = (
  {
    signer,
    environmentName,
    networkName = 'unknown',
    arweaveConfig,
    verbose,
    apiUrl,
    contractAddressOverrides,
  }: UseMasaSdkArgs,
  deps: Array<unknown>
): Masa | undefined => {
  const masa = useMemo(() => {
    if (!signer) return undefined;

    const environment: Environment | undefined = environments.find(
      (singleEnvironment: Environment) =>
        singleEnvironment.name === environmentName
    );

    if (!environment) {
      console.error(`Unable to find environment ${environmentName as string}`);
      return undefined;
    }

    let contractOverrides: Partial<IIdentityContracts> | undefined;

    if (contractAddressOverrides) {
      if (verbose) console.log({ contractAddressOverrides });

      contractOverrides = {} as Partial<IIdentityContracts>;
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
    signer
      .getAddress()
      .then((s) => {
        if (verbose)
          console.log('DEBUG: creating new masa', {
            signer: s,
            environment,
            networkName,
            verbose,
            apiUrl,
          });
      })
      .catch((error: unknown) => console.error({ error }));

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
      contractOverrides,
      verbose,
    });
  }, [
    signer,
    apiUrl,
    environmentName,
    networkName,
    arweaveConfig,
    verbose,
    contractAddressOverrides,
    ...deps,
  ]);

  return masa;
};
