import { useMemo } from 'react';
import { useMasaClient } from '../masa-client/use-masa-client';
import { useNetwork } from '../wallet-client/network';
import { useWallet } from '../wallet-client/wallet/use-wallet';

export const useCanQuery = () => {
  const { masa } = useMasaClient();
  const { isDisconnected } = useWallet();
  const { activeChain } = useNetwork();

  const canQuery = useMemo(
    () => Boolean(masa && activeChain && !isDisconnected),
    [masa, activeChain, isDisconnected]
  );

  return canQuery;
};
