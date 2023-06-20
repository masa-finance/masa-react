import { useAsyncFn } from 'react-use';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useMasaClient } from '../masa-client/use-masa-client';
import { useSession } from './use-session';
import { QcContext } from '../masa-provider';
import { useNetwork } from '../wallet-client/network';
import { useWallet } from '../wallet-client/wallet/use-wallet';
import { isIdentityContractAvailible } from './utils';
import { useIdentityListen } from './use-identity-listen';
// import { useWallet } from '../wallet-client/wallet/use-wallet';

export const useIdentity = () => {
  const { masaAddress, sdk: masa, masaNetwork } = useMasaClient();
  const { isDisconnected } = useWallet();
  const { sessionAddress, hasSession } = useSession();
  const { activeNetwork } = useNetwork();

  const [{ loading: isLoadingIdentity }, loadIdentity] =
    useAsyncFn(async () => {
      try {
        if (!masa) return null;
        if (!sessionAddress) return null;
        if (!activeNetwork) return null;
        if (isDisconnected) return null;
        if (!hasSession) return null;
        return await masa.identity.load(masaAddress);
      } catch (error) {
        console.error('ERROR loading identity', error);
        return null;
      }
    }, [
      masaAddress,
      masa,
      activeNetwork,
      sessionAddress,
      isDisconnected,
      hasSession,
    ]);

  const {
    data: identity,
    isFetching: isFetchingIdentity,
    refetch: getIdentity,
  } = useQuery({
    context: QcContext,
    enabled: !!hasSession && !!masaAddress && !!masaNetwork && !!sessionAddress,
    queryKey: [
      'identity',
      { masaAddress, sessionAddress, masaNetwork, persist: false },
    ],
    queryFn: async () => loadIdentity(),
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
