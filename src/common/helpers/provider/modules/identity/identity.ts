import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { queryClient } from '../../masa-query-client';

export const useIdentity = (masa, walletAddress) => {
  const { data, status, isLoading, error } = useQuery(
    `identity-${walletAddress}`,
    () => masa.identity.load(walletAddress),
    { enabled: !!masa && !!walletAddress }
  );

  const handlePurchaseIdentity = useCallback(async () => {
    await masa?.identity.create();
    queryClient.invalidateQueries(`identity-${walletAddress}`);
  }, [masa]);

  return { identity: data, handlePurchaseIdentity, status, isLoading, error };
};
