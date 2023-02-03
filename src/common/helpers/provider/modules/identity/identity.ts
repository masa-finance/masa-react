import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { queryClient } from '../../masa-provider';

export const useIdentity = function (masa, walletAddress) {
  const { data, status, isLoading, error } = useQuery(
    `identity-${walletAddress}`,
    () => masa.identity.load(walletAddress),
    {
      enabled: !!masa && !!walletAddress,
    }
  );
  console.log('IDENTITYU', { data, error, ENABLED: !!masa && !!walletAddress });

  const handlePurchaseIdentity = useCallback(async () => {
    await masa?.identity.create();
    queryClient.invalidateQueries(`identity-${walletAddress}`);
  }, [masa]);

  return { identity: data, handlePurchaseIdentity, status, isLoading, error };
};
