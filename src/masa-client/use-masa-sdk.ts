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
    networkName,
    arweaveConfig,
    verbose,
    apiUrl,
    contractAddressOverrides,
    address,
  }: UseMasaSdkArgs & { address: `0x${string}` | undefined },
  deps: Array<unknown>
): Masa | undefined => {
  const masa = useMemo((): Masa | undefined => {
    if (!address) return undefined;
    if (!signer) {
      if (verbose)
        console.log('DEBUG: no signer, returning undefined for masa object');
      return undefined;
    }

    const environment: Environment | undefined = environments.find(
      ({ environment: singleEnvironment }: Environment) =>
        singleEnvironment === environmentName
    );

    if (!environment) {
      console.error(`Unable to find environment ${environmentName as string}`);
      return undefined;
    }

    let contractOverrides: Partial<IIdentityContracts> | undefined;

    if (contractAddressOverrides) {
      if (verbose) console.log('DEBUG:', { contractAddressOverrides });

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

    if (verbose) {
      signer
        .getAddress()
        .then((s: string) => {
          console.log('DEBUG: creating new masa', {
            signerAddress: s,
            signer,
            environment,
            networkName,
            verbose,
            apiUrl,
          });
        })
        .catch((error: unknown) => console.error({ error }));
    }

    const arweaveConfigToPass = {
      host: arweaveConfig?.host ?? 'arweave.net',
      port: Number.parseInt(arweaveConfig?.port ?? '443', 10),
      protocol: arweaveConfig?.protocol ?? 'https',
      logging: !!arweaveConfig?.logging ?? true,
    };

    return new Masa({
      signer,
      apiUrl: apiUrl ?? environment.apiUrl,
      networkName,
      environment: environment.environment,
      arweave: arweaveConfigToPass,
      contractOverrides,
      verbose,
    });
  }, [
    address,
    signer,
    apiUrl,
    environmentName,
    networkName,
    arweaveConfig,
    verbose,
    contractAddressOverrides,
    ...deps, // eslint-disable-line react-hooks/exhaustive-deps
  ]);

  return masa;
};
