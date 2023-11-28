import { useMemo } from 'react';
import { useAsync } from 'react-use';
import { getNetworkNameByChainId, NetworkName } from '@masa-finance/masa-sdk';
import { useConfig } from '../base-provider';
import { useWallet } from '../wallet-client/wallet/use-wallet';
import { useMasaSDK } from './use-masa-sdk';
import { useNetwork } from '../wallet-client/network';

export const useMasaClient = () => {
  const { masaConfig, contractAddressOverrides } = useConfig();
  const { signer, isDisconnected, address } = useWallet();
  const { activeChainId, currentNetwork } = useNetwork();

  const masa = useMasaSDK(
    {
      address,
      signer: isDisconnected ? undefined : signer,
      ...masaConfig,
      environmentName: masaConfig.environment,
      contractAddressOverrides,
      networkName: currentNetwork?.networkName ?? 'unknown',
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
    useAsync(async (): Promise<`0x${string}` | undefined> => {
      if (!masa) return undefined;

      const masaAddr = await masa.config.signer.getAddress();
      return masaAddr as `0x${string}`;
    }, [masa]);

  const { value: masaChainId } = useAsync(async (): Promise<
    number | undefined
  > => {
    if (!masa) return undefined;

    const mChainId = await masa.config.signer?.getChainId();

    if (mChainId !== activeChainId) return undefined;

    return mChainId;
  }, [masa, activeChainId]);

  const { value: masaNetwork, loading: isLoadingMasaNetwork } =
    useAsync(async (): Promise<NetworkName | undefined> => {
      if (!masa) return undefined;
      if (masaChainId !== activeChainId) return undefined;

      const network = await masa.config.signer?.provider?.getNetwork();
      if (!network) return undefined;

      return getNetworkNameByChainId(network.chainId);
    }, [masa, activeChainId, masaChainId]);

  return useMemo(() => {
    if (address !== masaAddress) {
      return {
        masaAddress,
        masaChainId,
        masa: undefined,
      };
    }

    return {
      masaAddress,
      masaNetwork,
      masaChainId,
      masa,
      isLoadingMasa: isLoadingMasaAddress || isLoadingMasaNetwork,
    };
  }, [
    address,
    masaAddress,
    masaNetwork,
    masaChainId,
    masa,
    isLoadingMasaAddress,
    isLoadingMasaNetwork,
  ]);
};
