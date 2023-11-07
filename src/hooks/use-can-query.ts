import { useMemo } from 'react';
import { useMasaClient } from '../masa-client/use-masa-client';
import { useNetwork } from '../wallet-client/network';
import { useWallet } from '../wallet-client/wallet/use-wallet';

export const useCanQuery = () => {
  const { sdk: masa } = useMasaClient();
  const { isDisconnected } = useWallet();
  const { activeNetwork } = useNetwork();

  const canQuery = useMemo(
    () => Boolean(masa && activeNetwork && !isDisconnected),
    [masa, activeNetwork, isDisconnected]
  );

  return canQuery;
};
