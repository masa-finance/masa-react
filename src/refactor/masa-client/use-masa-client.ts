import { useMemo } from 'react';
import { useAsync } from 'react-use';
import { useConfig } from '../base-provider';
import { useWallet } from '../wallet-client/wallet/use-wallet';
import { useMasaSDK } from './use-masa-sdk';
import { useNetwork } from '../wallet-client/network';
import { getMasaNetworkName } from '../wallet-client/utils';

export const useMasaClient = () => {
  const { masaConfig, contractAddressOverrides } = useConfig();
  const { signer, isDisconnected, address } = useWallet();

  const { activeChainId, currentNetwork } = useNetwork();

  const networkName = getMasaNetworkName(currentNetwork?.networkName);

  const masa = useMasaSDK(
    {
      address,
      signer: isDisconnected ? undefined : signer,
      ...masaConfig,
      environmentName: masaConfig.environment,
      contractAddressOverrides,
      // NOTE: mismatch of homestead (wagmi) vs ethereum (masa)
      networkName,
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

  const { value: masaAddress, loading: isLoadingMasaAddress } =
    useAsync(async () => {
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

  const { value: masaNetwork, loading: isLoadingMasaNetwork } =
    useAsync(async () => {
      if (!masa) return undefined;
      if (masaChainId !== activeChainId) return undefined;

      const network = await masa.config.signer?.provider?.getNetwork();

      if (network?.name === 'unknown') {
        return getMasaNetworkName(currentNetwork?.networkName);
      }
      return getMasaNetworkName(network?.name);
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
      isLoadingMasa: isLoadingMasaAddress || isLoadingMasaNetwork,
    };
  }, [
    masa,
    masaAddress,
    masaChainId,
    masaNetwork,
    address,
    isLoadingMasaAddress,
    isLoadingMasaNetwork,
  ]);

  return masaClient;
};
