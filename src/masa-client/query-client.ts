import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { Query, QueryClient, QueryKey } from '@tanstack/react-query';
import type { Persister } from '@tanstack/react-query-persist-client';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { noopStorage } from '@wagmi/core';

// import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
// import { QueryClient } from '@tanstack/react-query'

import { deserialize, serialize } from 'wagmi';

export const createQueryClientAndPersister = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 0, // 1000 * 60 * 60 * 24, // 24 hours
        networkMode: 'offlineFirst',
        refetchOnWindowFocus: false,
        retry: 0,
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
      mutations: {
        networkMode: 'offlineFirst',
      },
    },
  });

  const storage =
    typeof window !== 'undefined' && window.localStorage
      ? window.localStorage
      : noopStorage;

  //  createStorage({
  //   storage:
  //     typeof window !== 'undefined' && window.localStorage
  //       ? window.localStorage
  //       : null,
  // });
  let persister: Persister | undefined;

  if (typeof window !== 'undefined') {
    persister = createSyncStoragePersister({
      key: 'masa-cache',
      storage,
      // Serialization is handled in `storage`.
      serialize,
      // Deserialization is handled in `storage`.
      deserialize,
    });
  }

  if (persister)
    void Promise.all(
      persistQueryClient({
        queryClient,
        persister,
        dehydrateOptions: {
          shouldDehydrateQuery: (
            query: Query<unknown, Error, unknown, QueryKey>
          ) =>
            query.gcTime !== 0 &&
            // Note: adding a `persist` flag to a query key will instruct the
            // persister whether or not to persist the response of the query.
            (
              query.queryKey[1] as { persist?: boolean } & Record<
                string,
                unknown
              >
            ).persist !== false,
        },
      })
    );

  return { queryClient, persister };
};

const { queryClient, persister } = createQueryClientAndPersister();

export { queryClient, persister };
