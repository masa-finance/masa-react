import type { Signer } from 'ethers';
import type { NetworkName } from '@masa-finance/masa-sdk';
import { useMemo } from 'react';
import { useConfig } from '../base-provider';
import { useWallet } from '../wallet-client/wallet/use-wallet';
import { useMasaSDK } from './use-masa-sdk';
import { useNetwork } from '../wallet-client/network';

export const useMasaClient = () => {
  const { masaConfig } = useConfig();
  const { signer, isDisconnected } = useWallet();
  const { activeChain } = useNetwork();

  const masa = useMasaSDK(
    {
      signer: isDisconnected ? undefined : (signer as Signer | undefined),
      ...masaConfig,
      environmentName: masaConfig.environment,
      // NOTE: mismatch of homestead (wagmi) vs ethereum (masa)
      networkName:
        activeChain?.network === 'homestead'
          ? 'ethereum'
          : (activeChain?.network as NetworkName | undefined),
    },
    [
      signer,
      masaConfig,
      masaConfig.environment,
      activeChain?.network,
      isDisconnected,
    ]
  );

  const masaClient = useMemo(
    () => ({
      sdk: masa,
    }),
    [masa]
  );

  return masaClient;
};
