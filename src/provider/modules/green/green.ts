import { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { queryClient } from '../../masa-query-client';
import {
  BaseResult,
  CreateGreenResult,
  IGreen,
  Masa,
} from '@masa-finance/masa-sdk';
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
  handleGenerateGreen: (phoneNumber: string) => Promise<
    | (BaseResult & {
        status: string;
      })
    | undefined
  >;
  handleCreateGreen: (
    phoneNumber: string,
    code: string
  ) => Promise<CreateGreenResult | undefined>;
  status: string;
  isLoading: boolean;
  error: unknown;
} => {
  const queryKey: string = useMemo(() => {
    return `green-${walletAddress}-${masa?.config.network}`;
  }, [walletAddress, masa?.config.network]);

  const {
    data: greens,
    status,
    isLoading,
    error,
  } = useQuery(queryKey, () => masa?.green.load(identity?.identityId!), {
    enabled: !!masa && !!walletAddress && !!identity?.identityId,
  });

  const handleCreateGreen = useCallback(
    async (
      phoneNumber: string,
      code: string
    ): Promise<CreateGreenResult | undefined> => {
      const response = await masa?.green.create(phoneNumber, code);

      await queryClient.invalidateQueries(queryKey);

      return response;
    },
    [masa, walletAddress]
  );

  const handleGenerateGreen = useCallback(
    async (
      phoneNumber: string
    ): Promise<
      | (BaseResult & {
          status: string;
        })
      | undefined
    > => {
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
