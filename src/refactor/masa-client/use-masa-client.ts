import { useMemo } from 'react';
import { useAsync } from 'react-use';
import { useConfig } from '../base-provider';
import { useWallet } from '../wallet-client/wallet/use-wallet';
import { useMasaSDK } from './use-masa-sdk';
import { useNetwork } from '../wallet-client/network';

export const useMasaClient = () => {
  const { masaConfig } = useConfig();
  const { signer, isDisconnected, address } = useWallet();

  const { activeChainId, currentNetwork, activeNetwork } = useNetwork();


  const networkName = activeNetwork === "homestead"
  ? 'ethereum'
  : currentNetwork?.networkName;




  const masa = useMasaSDK(
    {
      address,
      signer: isDisconnected ? undefined : signer,
      ...masaConfig,
      environmentName: masaConfig.environment,
      // NOTE: mismatch of homestead (wagmi) vs ethereum (masa)
      networkName
    },
    [
      address,
      signer,
      masaConfig,
      masaConfig.environment,
      currentNetwork,
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

  const { value: masaChainId } = useAsync(async () => {
    if (masa) {
      const mChainId = await masa.config.signer?.getChainId();

      if (mChainId !== activeChainId) return undefined;

      return mChainId;
    }

    return undefined;
  }, [masa, activeChainId]);

  const { value: masaNetwork } = useAsync(async () => {
    if (!masa) return undefined;
    if (masaChainId !== activeChainId) return undefined;

    const network = await masa.config.signer?.provider?.getNetwork();

    return network?.name === 'unknown'
      ? currentNetwork?.networkName
      : network?.name;
  }, [masa, currentNetwork, activeChainId, masaChainId]);

  const masaClient = useMemo(() => {
    if (address !== masaAddress) {
      return {
        masaAddress,
        masaChainId,
        sdk: undefined,
        masa: undefined,
      };
    }
    return {
      masaAddress,
      masaNetwork,
      masaChainId,
      sdk: masa,
      masa,
    };
  }, [masa, masaAddress, masaChainId, masaNetwork, address]);

  return masaClient;
};
