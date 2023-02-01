import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { queryClient } from '../../masa-provider';

export const useGreen = (masa, walletAddress, identity) => {
  const { data, status, isLoading, error } = useQuery(
    `green-${walletAddress}`,
    () => masa?.green.load(identity.identityId),
    { enabled: !!masa && !!walletAddress && !!identity?.identityId }
  );

  const handleCreateGreen = useCallback(
    async (phoneNumber, code) => {
      const response = await masa?.green.create(phoneNumber, code);

      await queryClient.invalidateQueries(`green-${walletAddress}`);

      return response;
    },
    [masa, walletAddress]
  );

  const handleGenerateGreen = useCallback(
    async (phoneNumber: string) => {
      if (masa) await masa?.green.generate(phoneNumber);
    },
    [masa]
  );

  return {
    green: data,
    handleGenerateGreen,
    handleCreateGreen,
    status,
    isLoading,
    error,
  };
};
