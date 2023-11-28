import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { Query, QueryClient, QueryKey } from '@tanstack/react-query';
import type {
  PersistedClient,
  Persister,
} from '@tanstack/react-query-persist-client';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { noopStorage } from '@wagmi/core';
import { createStorage } from 'wagmi';

export const createQueryClient = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 0, // 1000 * 60 * 60 * 24, // 24 hours
        networkMode: 'offlineFirst',
        refetchOnWindowFocus: false,
        retry: 0,
      },
      mutations: {
        networkMode: 'offlineFirst',
      },
    },
  });

  const storage = createStorage({
    storage:
      typeof window !== 'undefined' && window.localStorage
        ? window.localStorage
        : noopStorage,
  });
  let persister: Persister | undefined;

  if (typeof window !== 'undefined') {
    persister = createSyncStoragePersister({
      key: 'masa-cache',
      storage,
      // Serialization is handled in `storage`.
      serialize: (x: unknown) => x as string,
      // Deserialization is handled in `storage`.
      deserialize: (x: unknown) => x as PersistedClient,
    });
  }

  if (persister)
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
          (query.queryKey[1] as { persist?: boolean } & Record<string, unknown>)
            .persist !== false,
      },
    });

  return queryClient;
};

export const queryClient: QueryClient = createQueryClient();
