import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { queryClient } from '../../masa-provider';

export const useGreen = function (masa, walletAddress, identity) {
  const { data, status, isLoading, error } = useQuery(
    `green-${walletAddress}`,
    () => masa?.green.load(identity.identityId),
    { enabled: !!masa && !!walletAddress && !!identity?.identityId }
  );

  const handleCreateMasaGreen = useCallback(
    async (phoneNumber, code) => {
      const response = await masa?.green.create(phoneNumber, code);
      console.log('🚀 ~ file: green.ts:15 ~ response', response);

      queryClient.invalidateQueries(`green-${walletAddress}`);

      return response;
    },
    [masa, walletAddress]
  );

  const handleCreate2FA = useCallback(
    async (phoneNumber: string) => {
      if (masa) await masa?.green?.generate(phoneNumber);
    },
    [masa]
  );

  console.log({ green: data });
  return {
    green: data,
    handleCreateMasaGreen,
    handleCreate2FA,
    status,
    isLoading,
    error,
  };
};
