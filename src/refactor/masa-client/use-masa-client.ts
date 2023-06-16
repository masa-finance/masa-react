import type { Signer } from 'ethers';
import type { NetworkName } from '@masa-finance/masa-sdk';
import { useMemo } from 'react';
import { useAsync } from 'react-use';
import { useConfig } from '../base-provider';
import { useWallet } from '../wallet-client/wallet/use-wallet';
import { useMasaSDK } from './use-masa-sdk';
import { useNetwork } from '../wallet-client/network';

export const useMasaClient = () => {
  const { masaConfig } = useConfig();
  const { signer, isDisconnected, address } = useWallet();
  const { activeChain } = useNetwork();

  const masa = useMasaSDK(
    {
      address,
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
      address,
      signer,
      masaConfig,
      masaConfig.environment,
      activeChain?.network,
      isDisconnected,
    ]
  );

  const { value: masaAddress } = useAsync(async () => {
    if (masa) {
      const masaAddr = await masa.config.signer.getAddress();
      return masaAddr as `0x${string}`;
    }

    return undefined;
  }, [masa]);

  const masaClient = useMemo(() => {
    if (address !== masaAddress) {
      return {
        masaAddress,
        sdk: undefined,
        masa: undefined,
      };
    }
    return {
      masaAddress,
      sdk: masa,
      masa,
    };
  }, [masa, masaAddress, address]);

  return masaClient;
};
