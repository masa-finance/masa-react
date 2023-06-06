import { useDisconnect } from 'wagmi';
import { useAsyncFn } from 'react-use';
import { DependencyList } from 'react';
import { Masa } from '@masa-finance/masa-sdk';
import { Signer } from 'ethers';
import { InvalidateQueryFilters } from 'react-query';
import {
  getCreditScoresQueryKey,
  getGreenQueryKey,
  getIdentityQueryKey,
  getSessionDataQueryKey,
  getSessionQueryKey,
  getSoulnamesQueryKey,
  getWalletQueryKey,
} from './modules';
import { queryClient } from './masa-query-client';

export type QueryKey =
  | 'identity'
  | 'wallet'
  | 'session'
  | 'sessionData'
  | 'soulnames'
  | 'green'
  | 'credit-scores';
export type QueryKeyRetrievalInput = {
  masa?: Masa;
  signer?: Signer;
  walletAddress?: string;
};

const QUERIES = [
  'identity',
  'wallet',
  'session',
  'sessionData',
  'soulnames',
  'green',
  'credit-scores',
] as QueryKey[];

export const getQueryKeys: () => Record<
  QueryKey,
  ({
    masa,
    signer,
    walletAddress,
  }: QueryKeyRetrievalInput) => (string | undefined)[]
> = () => ({
  identity: ({ masa, signer, walletAddress }: QueryKeyRetrievalInput) =>
    getIdentityQueryKey({ masa, signer, walletAddress }),
  session: ({ masa, signer, walletAddress }: QueryKeyRetrievalInput) =>
    getSessionQueryKey({ masa, signer, walletAddress }),
  sessionData: ({ masa, signer, walletAddress }: QueryKeyRetrievalInput) =>
    getSessionDataQueryKey({ masa, signer, walletAddress }),
  wallet: ({ masa, signer, walletAddress }: QueryKeyRetrievalInput) =>
    getWalletQueryKey({ masa, signer, walletAddress }),
  soulnames: ({ masa, signer, walletAddress }: QueryKeyRetrievalInput) =>
    getSoulnamesQueryKey({ masa, signer, walletAddress }),
  green: ({ masa, signer, walletAddress }: QueryKeyRetrievalInput) =>
    getGreenQueryKey({ masa, signer, walletAddress }),
  'credit-scores': ({ masa, signer, walletAddress }: QueryKeyRetrievalInput) =>
    getCreditScoresQueryKey({ masa, signer, walletAddress }),
  'custom-sbt': () => ['custom-sbt'],
  'custom-sbt-contracts': () => ['custom-sbt-contracts'],
});

export const invalidateAllQueries = async ({
  masa,
  signer,
  walletAddress,
}: QueryKeyRetrievalInput) => {
  console.log('invalidate all queries', { masa, signer, walletAddress });
  await Promise.all(
    QUERIES.map(async (query: QueryKey) =>
      queryClient.invalidateQueries(
        getQueryKeys()[query]({
          masa,
          signer,
          walletAddress,
        } as QueryKeyRetrievalInput) as InvalidateQueryFilters
      )
    )
  );
};

export const invalidateSession = async ({
  masa,
  signer,
  walletAddress,
}: QueryKeyRetrievalInput) => {
  await queryClient.invalidateQueries(
    getQueryKeys().session({
      masa,
      signer,
      walletAddress,
    })
  );
};

export const invalidateWallet = async ({
  masa,
  signer,
  walletAddress,
}: QueryKeyRetrievalInput) => {
  await queryClient.invalidateQueries(
    getQueryKeys().wallet({
      masa,
      signer,
      walletAddress,
    })
  );
};

export const invalidateIdentity = async ({
  masa,
  signer,
  walletAddress,
}: QueryKeyRetrievalInput) => {
  await queryClient.invalidateQueries(
    getQueryKeys().identity({
      masa,
      signer,
      walletAddress,
    })
  );
};

export const invalidateCreditScores = async ({
  masa,
  signer,
  walletAddress,
}: QueryKeyRetrievalInput) => {
  await queryClient.invalidateQueries(
    getQueryKeys()['credit-scores']({
      masa,
      signer,
      walletAddress,
    })
  );
};

export const invalidateCustomSBTs = async () => {
  await queryClient.invalidateQueries(
    getQueryKeys()['custom-sbt' as QueryKey]({})
  );
};

export const invalidateCustomSBTContracts = async () => {
  await queryClient.invalidateQueries(
    getQueryKeys()['custom-sbt-contracts' as QueryKey]({})
  );
};

export const invalidateGreen = async ({
  masa,
  signer,
  walletAddress,
}: QueryKeyRetrievalInput) => {
  await queryClient.invalidateQueries(
    getQueryKeys().green({
      masa,
      signer,
      walletAddress,
    })
  );
};

export const useLogout = (
  options: {
    masa?: Masa;
    signer?: Signer;
    walletAddress?: string;
    onLogoutStart?: () => void;
    onLogoutFinish?: () => void;
  },
  deps?: DependencyList
) => {
  const { onLogoutStart, onLogoutFinish, masa, walletAddress, signer } =
    options;
  const { disconnect } = useDisconnect();

  const [{ value: hasLoggedOut, loading: isLoggingOut, error }, logout] =
    useAsyncFn(async () => {
      try {
        onLogoutStart?.();
        await masa?.session.sessionLogout();
        disconnect();
        await invalidateAllQueries({ masa, signer, walletAddress });
        return true;
      } catch (error_: unknown) {
        console.error(error_);
        return false;
      } finally {
        onLogoutFinish?.();
      }
    }, [
      disconnect,
      onLogoutStart,
      onLogoutFinish,
      masa,
      walletAddress,
      ...(deps ?? []),
    ]);

  return {
    hasLoggedOut,
    isLoggingOut,
    logout,
    error,
  };
};
