import { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { queryClient } from '../../masa-query-client';
import {
  GenerateGreenResult,
  IGreen,
  Masa,
  NetworkName,
  VerifyGreenResult,
} from '@masa-finance/masa-sdk';
import { BigNumber } from 'ethers';

export const useGreen = (
  masa?: Masa,
  walletAddress?: string
): {
  greens?: {
    tokenId: BigNumber;
    tokenUri: string;
    metadata?: IGreen;
  }[];
  handleGenerateGreen: (
    phoneNumber: string
  ) => Promise<GenerateGreenResult | undefined>;
  handleCreateGreen: (
    phoneNumber: string,
    code: string
  ) => Promise<VerifyGreenResult | undefined>;
  status: string;
  isGreensLoading: boolean;
  reloadGreens: () => void;
  error: unknown;
} => {
  const queryKey: (string | NetworkName | undefined)[] = useMemo(() => {
    return ['green', walletAddress, masa?.config.networkName];
  }, [masa, walletAddress]);

  const {
    data: greens,
    status,
    isLoading,
    isFetching,
    refetch: reloadGreens,
    error,
  } = useQuery<
    | {
        tokenId: BigNumber;
        tokenUri: string;
        metadata?: IGreen | undefined;
      }[]
    | undefined
  >(queryKey, () => masa?.green.list(), {
    enabled: !!masa && !!walletAddress,
    retry: false,
    onSuccess: (
      greens?: {
        tokenId: BigNumber;
        tokenUri: string;
        metadata?: IGreen;
      }[]
    ) => {
      if (masa?.config.verbose) {
        console.info({ greens, network: masa?.config.networkName });
      }
    },
  });

  const handleCreateGreen = useCallback(
    async (
      phoneNumber: string,
      code: string
    ): Promise<VerifyGreenResult | undefined> => {
      const response = await masa?.green.create('ETH', phoneNumber, code);
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
    isGreensLoading: isLoading || isFetching,
    handleGenerateGreen,
    handleCreateGreen,
    reloadGreens,
    status,
    error,
  };
};
