import { useDisconnect } from 'wagmi';
import { queryClient } from './masa-query-client';
import { useAsyncFn } from 'react-use';
import { DependencyList } from 'react';
import {
  getIdentityQueryKey,
  getSessionDataQueryKey,
  getSessionQueryKey,
  getWalletQueryKey,
} from './modules';
import { Masa } from '@masa-finance/masa-sdk';
import { Signer } from 'ethers';

const QUERIES = [
  'identity',
  'wallet',
  'session',
  'sessionData',
  //   'credit-scores',
  //   'green',
  //   'soulnames',
];

export type QueryKeyRetrievalInput = {
  masa?: Masa;
  signer?: Signer;
  walletAddress?: string;
};

export const getQueryKeys = () => ({
  identity: ({ masa, signer, walletAddress }: QueryKeyRetrievalInput) =>
    getIdentityQueryKey({ masa, signer, walletAddress }),
  session: ({ masa, signer, walletAddress }: QueryKeyRetrievalInput) =>
    getSessionQueryKey({ masa, signer, walletAddress }),
  sessionData: ({ masa, signer, walletAddress }: QueryKeyRetrievalInput) =>
    getSessionDataQueryKey({ masa, signer, walletAddress }),
  wallet: ({ masa, signer, walletAddress }: QueryKeyRetrievalInput) =>
    getWalletQueryKey({ masa, signer, walletAddress }),
});

export const invalidateAllQueries = async ({
  masa,
  signer,
  walletAddress,
}: QueryKeyRetrievalInput) => {
  console.log('invalidate all queries start');
  const res = await Promise.all(
    QUERIES.map((query: string) =>
      queryClient.getQueriesData(
        getQueryKeys()[query]({
          masa,
          signer,
          walletAddress,
        })
      )
    )
  );

  console.log(
    'res inv queries',
    res.map((r) => r[0])
  );

  const resTwo = await Promise.all(
    QUERIES.map(async (query: string) =>
      queryClient.invalidateQueries(
        getQueryKeys()[query]({
          masa,
          signer,
          walletAddress,
        })
      )
    )
  );
  console.log('res after invalidation', resTwo);
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
  const { disconnectAsync } = useDisconnect();

  const [{ value: hasLoggedOut, loading: isLoggingOut, error }, logout] =
    useAsyncFn(async () => {
      try {
        onLogoutStart?.();
        await masa?.session.sessionLogout();
        console.log('before query');
        await invalidateAllQueries({ masa, signer, walletAddress });
        console.log('after query');
        await disconnectAsync();
        return true;
      } catch (error: unknown) {
        console.error(error);
        return false;
      } finally {
        onLogoutFinish?.();
      }
    }, [disconnectAsync, onLogoutStart, onLogoutFinish, masa, ...(deps ?? [])]);

  return {
    hasLoggedOut,
    isLoggingOut,
    logout,
    error,
  };
};
