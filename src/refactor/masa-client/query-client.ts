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
  //   const queryClient = new QueryClient({
  //     defaultOptions: {
  //       queries: {
  //         cacheTime: 1000 * 60 * 60 * 24, // 24 hours
  //         networkMode: 'offlineFirst',
  //         refetchOnWindowFocus: false,
  //         retry: 0,
  //       },
  //       mutations: {
  //         networkMode: 'offlineFirst',
  //       },
  //     },
  //   });

  //   const storage = createStorage({
  //     storage:
  //       typeof window !== 'undefined' && window.localStorage
  //         ? window.localStorage
  //         : noopStorage,
  //   });
  //   let persister: Persister | undefined;

  //   if (typeof window !== 'undefined') {
  //     persister = createSyncStoragePersister({
  //       key: 'masa-cache',
  //       storage,
  //       // Serialization is handled in `storage`.
  //       serialize: (x: unknown) => x as string,
  //       // Deserialization is handled in `storage`.
  //       deserialize: (x: unknown) => x as PersistedClient,
  //     });
  //   }

  //   if (persister)
  //     persistQueryClient({
  //       queryClient,
  //       persister,
  //       dehydrateOptions: {
  //         shouldDehydrateQuery: (
  //           query: Query<unknown, unknown, unknown, QueryKey>
  //         ) =>
  //           query.cacheTime !== 0 &&
  //           // Note: adding a `persist` flag to a query key will instruct the
  //           // persister whether or not to persist the response of the query.
  //           (query.queryKey[0] as { persist?: boolean }).persist !== false,
  //       },
  //     });

  const test = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        cacheTime: 1000 * 60 * 60 * 24, // 24 hours
      },
    },
  });

  const testPersist = createSyncStoragePersister({
    storage: window.localStorage,
  });

  return test;
  return queryClient;
};
