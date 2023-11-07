import { useAsync } from 'react-use';
import { useState } from 'react';
import { useMasaClient } from '../masa-client/use-masa-client';
import { useMasaQueryClient } from '../masa-client/use-masa-query-client';
import type { useSession } from './use-session';

export const useSessionListen = ({
  sessionAddress,
  hasSession,
  logoutSession,
  checkLogin,
}: {
  hasSession?: boolean | null;
  sessionAddress?: string;
  logoutSession: ReturnType<typeof useSession>['logoutSession'];
  checkLogin: ReturnType<typeof useSession>['checkLogin'];
}) => {
  const [isUpdatingSession, setUpdating] = useState(false);
  const { masaAddress } = useMasaClient();
  const queryClient = useMasaQueryClient();

  // * useEffect to handle account switches and disconnect
  useAsync(async () => {
    if (isUpdatingSession) return;

    if (!isUpdatingSession) {
      setUpdating(true);
    }

    if (!!sessionAddress && sessionAddress !== masaAddress && hasSession) {
      await Promise.all([
        queryClient.setQueryData(
          ['session-new-check', { masaAddress, persist: true }],
          false
        ),
      ]);

      await queryClient.invalidateQueries([
        'session-new-check',
        { masaAddress: sessionAddress, persist: true },
      ]);
      await queryClient.invalidateQueries([
        'session-new',
        { masaAddress: sessionAddress, persist: false },
      ]);

      await logoutSession();

      await checkLogin();
    }

    setUpdating(false);
  }, [
    isUpdatingSession,
    setUpdating,
    queryClient,
    masaAddress,
    sessionAddress,
    hasSession,
    logoutSession,
    checkLogin,
  ]);

  return {
    isUpdatingSession,
  };
};
