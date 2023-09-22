import { useAsyncFn } from 'react-use';
import type { ISession } from '@masa-finance/masa-sdk';
import { useWallet } from '../wallet-client/wallet/use-wallet';
import { useMasaClient } from '../masa-client/use-masa-client';
import { useMasaQueryClient } from '../masa-client/use-masa-query-client';

export const useSessionConnect = () => {
  const { address, isDisconnected } = useWallet();
  const { sdk: masa, masaAddress } = useMasaClient();
  const queryClient = useMasaQueryClient();

  const [{ loading: isLoggingIn }, loginSessionAsync] = useAsyncFn(async () => {
    if (!masa) return null;
    if (!masaAddress) return null;
    if (masaAddress !== address) return null;
    if (isDisconnected) return null;

    const loginObj = await masa.session.login();

    await queryClient.invalidateQueries([
      'session-new-check',
      { masaAddress, persist: true },
    ]);
    await queryClient.invalidateQueries([
      'session-new',
      { masaAddress, persist: false },
    ]);

    if (!loginObj) {
      return null;
    }

    await queryClient.fetchQuery([
      'session-new-check',
      { persist: true, masaAddress },
    ]);
    await queryClient.fetchQuery([
      'session-new',
      { persist: false, masaAddress },
    ]);

    return loginObj as unknown as ISession & {
      userId: string;
      address: string;
    };
  }, [queryClient, masa, address, masaAddress, isDisconnected]);

  const [{ loading: isLoggingOut }, logoutSession] = useAsyncFn(async () => {
    // if (!masa) return null;
    // if (!masaAddress) return null;
    // if (masaAddress !== address) return null;
    // if (isDisconnected) return null;

    const result = await masa?.session.logout();
    await Promise.all([
      queryClient.invalidateQueries([
        'session-new-check',
        { masaAddress, persist: true },
      ]),
      queryClient.invalidateQueries([
        'session-new',
        { masaAddress, persist: false },
      ]),
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