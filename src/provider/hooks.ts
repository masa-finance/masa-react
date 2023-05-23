import { useDisconnect } from 'wagmi';
import { useAsyncFn } from 'react-use';
import { DependencyList } from 'react';
import { Masa } from '@masa-finance/masa-sdk';
import { Signer } from 'ethers';
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

const QUERIES = [
  'identity',
  'wallet',
  'session',
  'sessionData',
  'soulnames',
  'green',
  'credit-scores',
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
  await Promise.all(
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
  await queryClient.invalidateQueries(getQueryKeys()['custom-sbt']());
};

export const invalidateCustomSBTContracts = async () => {
  await queryClient.invalidateQueries(getQueryKeys()['custom-sbt-contracts']());
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
  const { disconnectAsync } = useDisconnect();

  const [{ value: hasLoggedOut, loading: isLoggingOut, error }, logout] =
    useAsyncFn(async () => {
      try {
        onLogoutStart?.();
        await masa?.session.sessionLogout();
        await invalidateAllQueries({ masa, signer, walletAddress });
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
