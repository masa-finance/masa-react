import { useAsyncFn } from 'react-use';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useMasaClient } from '../masa-client/use-masa-client';
import { useSession } from './use-session';
import { useIdentityListen } from './use-identity-listen';
import { useCanQuery } from '../hooks/use-can-query';
import { queryClient } from '../masa-client/query-client';

export const useIdentity = () => {
  const { masaAddress, masa, masaNetwork } = useMasaClient();
  const { sessionAddress, hasSession } = useSession();
  const canQuery = useCanQuery();

  const isIdentityAvailableInNetwork = useMemo(
    () => masa?.identity.isContractAvailable ?? false,
    [masa]
  );

  const [{ loading: isLoadingIdentity }, loadIdentity] =
    useAsyncFn(async () => {
      if (!canQuery) return null;

      if (!isIdentityAvailableInNetwork) {
        return null;
      }

      try {
        return await masa?.identity.load(masaAddress);
      } catch (error: unknown) {
        console.error('ERROR loading identity', error);
      }

      return null;
    }, [canQuery, isIdentityAvailableInNetwork, masa?.identity, masaAddress]);

  const {
    data: identity,
    isFetching: isFetchingIdentity,
    refetch: getIdentity,
  } = useQuery(
    {
      enabled:
        !!hasSession && !!masaAddress && !!masaNetwork && !!sessionAddress,
      queryKey: [
        'identity',
        { masaAddress, sessionAddress, masaNetwork, persist: false },
      ],
      queryFn: loadIdentity,
    },
    queryClient
  );

  const hasIdentity = useMemo(
    () => !!identity && identity?.identityId,
    [identity]
  );

  useIdentityListen({ identity, getIdentity, sessionAddress });

  return {
    identity,
    hasIdentity,
    isLoadingIdentity,
    isFetchingIdentity,
    isIdentityAvailableInNetwork,
    getIdentity,

    isIdentityLoading: isLoadingIdentity,
    reloadIdentity: getIdentity,
  };
};
