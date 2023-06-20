import { useAsync, useAsyncFn } from 'react-use';
import { useQuery } from '@tanstack/react-query';
import { useMasaClient } from '../masa-client/use-masa-client';
import { useSession } from './use-session';
import { QcContext } from '../masa-provider';
import { useNetwork } from '../wallet-client/network';
import { useWallet } from '../wallet-client/wallet/use-wallet';
// import { useWallet } from '../wallet-client/wallet/use-wallet';

export const useIdentity = () => {
  // const queryClient = useQueryClient({ context: QcContext });
  const { masaAddress, sdk: masa, masaNetwork } = useMasaClient();
  const { isDisconnected } = useWallet();
  const { sessionAddress, hasSession } = useSession();
  const { activeNetwork } = useNetwork();
  // const { address } = useWallet();

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
        console.log('IM IN THIS ERROR', { error });
        throw error;
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
    onSettled: () => console.log('settled identity'),
    queryFn: async () => loadIdentity(),
  });

  useAsync(async () => {
    if (
      masaAddress === sessionAddress &&
      masaNetwork === activeNetwork &&
      identity?.address !== masaAddress
    )
      await loadIdentity();

    return undefined;
  }, [
    loadIdentity,
    masaAddress,
    activeNetwork,
    masaNetwork,
    sessionAddress,
    identity,
  ]);

  return {
    identity,
    isLoadingIdentity,
    isFetchingIdentity,
    getIdentity,
  };
};
