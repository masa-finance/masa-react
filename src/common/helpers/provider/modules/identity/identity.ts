import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { queryClient } from '../../masa-provider';

const AVAILABLE_NETWORKS = ['goerli', 'eth'];

export const useIdentity = function (masa, walletAddress) {
  console.log('NETWORK', masa?.config.network);

  const { data, status, isLoading, error } = useQuery(
    `identity-${walletAddress}`,
    () => masa.identity.load(walletAddress),
    {
      enabled:
        !!masa &&
        !!walletAddress &&
        AVAILABLE_NETWORKS.includes(masa?.config?.network),
    }
  );

  const handlePurchaseIdentity = useCallback(async () => {
    await masa?.identity.create();
    queryClient.invalidateQueries(`identity-${walletAddress}`);
  }, [masa]);

  return { identity: data, handlePurchaseIdentity, status, isLoading, error };
};
