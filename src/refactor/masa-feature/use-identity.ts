import { useAsync, useAsyncFn } from 'react-use';
import { useMasaClient } from '../masa-client/use-masa-client';
import { useWallet } from '../wallet-client/wallet/use-wallet';

export const useIdentity = () => {
  const { sdk: masa } = useMasaClient();
  const { address } = useWallet();
  
  const [{ value: identity, loading: isLoadingIdentity }, loadIdentity] =
    useAsyncFn(async () => {
      try {
        if (!masa) return undefined;
        return await masa.identity.load(address);
      } catch (error) {
        console.log('IM IN THIS ERROR', { error });
        throw error;
      }
    }, [address, masa]);

  useAsync(async () => {
    await loadIdentity();
  }, [loadIdentity]);

  return {
    identity,
    isLoadingIdentity,
  };
};
