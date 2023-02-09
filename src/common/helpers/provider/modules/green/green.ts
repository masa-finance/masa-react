import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { queryClient } from '../../masa-query-client';
import { IGreen, Masa } from '@masa-finance/masa-sdk';
import { BigNumber } from 'ethers';

export const useGreen = (
  masa: Masa | null,
  walletAddress: string | undefined,
  identity:
    | {
        identityId?: BigNumber | undefined;
        address?: string | undefined;
      }
    | undefined
): {
  greens:
    | {
        tokenId: BigNumber;
        tokenUri: string;
        metadata?: IGreen | undefined;
      }[]
    | undefined;
  handleGenerateGreen: (phoneNumber: string) => void;
  handleCreateGreen: (phoneNumber: string, code: string) => void;
  status: string;
  isLoading: boolean;
  error: unknown;
} => {
  const {
    data: greens,
    status,
    isLoading,
    error,
  } = useQuery(
    `green-${walletAddress}`,
    () => masa?.green.load(identity?.identityId!),
    { enabled: !!masa && !!walletAddress && !!identity?.identityId }
  );

  const handleCreateGreen = useCallback(
    async (phoneNumber: string, code: string) => {
      const response = await masa?.green.create(phoneNumber, code);

      await queryClient.invalidateQueries(`green-${walletAddress}`);

      return response;
    },
    [masa, walletAddress]
  );

  const handleGenerateGreen = useCallback(
    async (phoneNumber: string) => {
      let response;
      if (masa) {
        response = await masa?.green.generate(phoneNumber);
      }

      return response;
    },
    [masa]
  );

  return {
    greens,
    handleGenerateGreen,
    handleCreateGreen,
    status,
    isLoading,
    error,
  };
};
