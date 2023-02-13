import { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { queryClient } from '../../masa-query-client';
import {
  GenerateGreenResult,
  IGreen,
  Masa,
  VerifyGreenResult,
} from '@masa-finance/masa-sdk';
import { BigNumber } from 'ethers';

export const useGreen = (
  masa: Masa | null,
  walletAddress: string | undefined
): {
  greens:
    | {
        tokenId: BigNumber;
        tokenUri: string;
        metadata?: IGreen | undefined;
      }[]
    | undefined;
  handleGenerateGreen: (
    phoneNumber: string
  ) => Promise<GenerateGreenResult | undefined>;
  handleCreateGreen: (
    phoneNumber: string,
    code: string
  ) => Promise<VerifyGreenResult | undefined>;
  status: string;
  isLoading: boolean;
  error: unknown;
} => {
  const queryKey: string = useMemo(() => {
    return `green-${walletAddress}-${masa?.config.network}`;
  }, [walletAddress, masa]);

  const {
    data: greens,
    status,
    isLoading,
    error,
  } = useQuery(queryKey, () => masa?.green.list(), {
    enabled: !!masa && !!walletAddress,
    onSuccess: (
      greens: {
        tokenId: BigNumber;
        tokenUri: string;
        metadata?: IGreen | undefined;
      }[]
    ) => {
      if (masa?.config.verbose) {
        console.log({ greens, network: masa?.config.network });
      }
    },
  });

  const handleCreateGreen = useCallback(
    async (
      phoneNumber: string,
      code: string
    ): Promise<VerifyGreenResult | undefined> => {
      const response = await masa?.green.create(phoneNumber, code);

      await queryClient.invalidateQueries(queryKey);

      return response;
    },
    [masa, queryKey]
  );

  const handleGenerateGreen = useCallback(
    async (phoneNumber: string): Promise<GenerateGreenResult | undefined> => {
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
