import { useAsyncFn } from 'react-use';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useMasaClient } from '../masa-client/use-masa-client';
import { useSession } from './use-session';
import { isIdentityContractAvailible } from './utils';
import { useIdentityListen } from './use-identity-listen';
import { useCanQuery } from '../hooks/use-can-query';
import { MasaQueryClientContext } from '../masa-client/masa-query-client-context';

export const useIdentity = () => {
  const { masaAddress, sdk: masa, masaNetwork } = useMasaClient();
  const { sessionAddress, hasSession } = useSession();
  const canQuery = useCanQuery();
  const [{ loading: isLoadingIdentity }, loadIdentity] =
    useAsyncFn(async () => {
      try {
        if (!canQuery) return null;
        return await masa?.identity.load(masaAddress);
      } catch (error) {
        console.error('ERROR loading identity', error);
        return null;
      }
    }, [masaAddress, masa, canQuery]);

  const {
    data: identity,
    isFetching: isFetchingIdentity,
    refetch: getIdentity,
  } = useQuery({
    context: MasaQueryClientContext,
    enabled: !!hasSession && !!masaAddress && !!masaNetwork && !!sessionAddress,
    queryKey: [
      'identity',
      { masaAddress, sessionAddress, masaNetwork, persist: false },
    ],
    queryFn: loadIdentity,
  });

  const hasIdentity = useMemo(() => !!identity, [identity]);
  const isIdentityAvailibleInNetwork = useMemo(
    () => isIdentityContractAvailible(masa),
    [masa]
  );

  useIdentityListen({ identity, getIdentity, sessionAddress });

  return {
    identity,
    hasIdentity,
    isLoadingIdentity,
    isFetchingIdentity,
    isIdentityAvailibleInNetwork,
    getIdentity,
  };
};