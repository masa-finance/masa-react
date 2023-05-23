import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { Masa, NetworkName } from '@masa-finance/masa-sdk';
import { BigNumber } from 'ethers';

export const useSBT = ({
  tokenAddress,
  masa,
  walletAddress,
}: {
  tokenAddress: string;
  masa?: Masa;
  walletAddress?: string;
}): {
  SBTs?: {
    tokenId: BigNumber;
    tokenUri: string;
  }[];
  status: string;
  isSBTLoading: boolean;
  reloadSBTs: () => void;
  error: unknown;
} => {
  const queryKey: (string | NetworkName | undefined)[] = useMemo(
    () => ['sbt', tokenAddress, walletAddress, masa?.config.networkName],
    [masa, tokenAddress, walletAddress]
  );

  const {
    data: SBTs,
    status,
    isLoading,
    isFetching,
    refetch: reloadSBTs,
    error,
  } = useQuery<
    | {
        tokenId: BigNumber;
        tokenUri: string;
      }[]
    | undefined
  >(
    queryKey,
    async () => {
      const { list } = (await masa?.sbt.connect(tokenAddress)) || {};
      return list?.(walletAddress);
    },
    {
      enabled: !!masa,
      retry: false,
      onSuccess: (
        sbts?: {
          tokenId: BigNumber;
          tokenUri: string;
        }[]
      ) => {
        if (masa?.config.verbose) {
          console.info({ sbts, network: masa?.config.networkName });
        }
      },
    }
  );

  return {
    SBTs,
    isSBTLoading: isLoading || isFetching,
    reloadSBTs,
    status,
    error,
  };
};
