import type { Signer } from 'ethers';
import { useConfig } from '../base-provider';
import { useWallet } from '../wallet-client/wallet/use-wallet';
import { useMasaSDK } from './use-masa-sdk';

export const useMasaClient = () => {
  const { masaConfig } = useConfig();
  const { signer } = useWallet();

  const masa = useMasaSDK(
    {
      signer: signer as Signer | undefined,
      ...masaConfig,
      environmentName: masaConfig.environment,
    },
    [signer, masaConfig]
  );

  return masa;
};
