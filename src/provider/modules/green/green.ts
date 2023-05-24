import { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import {
  GenerateGreenResult,
  IGreen,
  Masa,
  NetworkName,
  VerifyGreenResult,
} from '@masa-finance/masa-sdk';
import { BigNumber } from 'ethers';
import { queryClient } from '../../masa-query-client';

export const getGreenQueryKey = ({
  masa,
  walletAddress,
}: {
  masa?: Masa;
  walletAddress?: string;
  signer?: any; // unused here
}) => ['green', walletAddress, masa?.config.networkName];

export const useGreenQuery = ({
  masa,
  walletAddress,
}: {
  masa?: Masa;
  walletAddress?: string;
}) => {
  const queryKey: (string | NetworkName | undefined)[] = useMemo(
    () => ['green', walletAddress, masa?.config.networkName],
    [masa, walletAddress]
  );

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
      greensFromQuery?: {
        tokenId: BigNumber;
        tokenUri: string;
        metadata?: IGreen;
      }[]
    ) => {
      if (masa?.config.verbose) {
        console.info({
          greens: greensFromQuery,
          network: masa?.config.networkName,
        });
      }
    },
  });

  const invalidateGreen = useCallback(
    async () => queryClient.invalidateQueries(['green']),
    []
  );

  return {
    greens,
    status,
    isLoading,
    isFetching,
    reloadGreens,
    invalidateGreen,
    error,
  };
};

export type UseGreenReturnValue = {
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
  invalidateGreen: () => void;
};

export const useGreen = (
  masa?: Masa,
  walletAddress?: string
): UseGreenReturnValue => {
  const {
    greens,
    status,
    isLoading,
    isFetching,
    reloadGreens,
    error,
    invalidateGreen,
  } = useGreenQuery({ masa, walletAddress });

  const handleCreateGreen = useCallback(
    async (
      phoneNumber: string,
      code: string
    ): Promise<VerifyGreenResult | undefined> => {
      const response = await masa?.green.create('ETH', phoneNumber, code);
      await invalidateGreen();
      return response;
    },
    [masa, invalidateGreen]
  );

  const handleGenerateGreen = useCallback(
    async (phoneNumber: string): Promise<GenerateGreenResult | undefined> => {
      let response: GenerateGreenResult | undefined;
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
    invalidateGreen,
  };
};
