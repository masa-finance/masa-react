import { useAsyncFn } from 'react-use';
import { useWallet } from '../wallet-client/wallet/use-wallet';
import { useMasaClient } from '../masa-client/use-masa-client';
import { useMasaQueryClient } from '../masa-client/use-masa-query-client';

export const useSessionConnect = () => {
  const { address, isDisconnected } = useWallet();
  const { masa, masaAddress } = useMasaClient();
  const queryClient = useMasaQueryClient();

  const [{ loading: isLoggingIn }, loginSessionAsync] = useAsyncFn(async () => {
    if (!masa) return null;
    if (!masaAddress) return null;
    if (masaAddress !== address) return null;
    if (isDisconnected) return null;

    const loginObj = await masa.session.login();

    await queryClient.invalidateQueries({
      queryKey: ['session-new-check', { masaAddress, persist: true }],
    });
    await queryClient.invalidateQueries({
      queryKey: ['session-new', { masaAddress, persist: false }],
    });

    if (!loginObj) {
      return null;
    }

    await queryClient.fetchQuery({
      queryKey: ['session-new-check', { persist: true, masaAddress }],
    });
    await queryClient.fetchQuery({
      queryKey: ['session-new', { persist: false, masaAddress }],
    });

    return loginObj;
  }, [queryClient, masa, address, masaAddress, isDisconnected]);

  const [{ loading: isLoggingOut }, logoutSession] = useAsyncFn(async () => {
    const result = await masa?.session.logout();
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ['session-new-check', { masaAddress, persist: true }],
      }),
      queryClient.invalidateQueries({
        queryKey: ['session-new', { masaAddress, persist: false }],
      }),
    ]);

    queryClient.setQueryData(['session-new-check', { masaAddress }], false);
    queryClient.setQueryData(
      ['session-new', { masaAddress, persist: false }],
      null
    );

    return result;
  }, [masa, queryClient, masaAddress]);

  return {
    loginSessionAsync,
    logoutSession,
    isLoggingIn,
    isLoggingOut,
  };
};
