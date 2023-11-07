import { useMemo } from 'react';
import { useMasaClient } from '../masa-client/use-masa-client';
import { useSession } from './use-session';

export const useMasaLoading = () => {
  const { isLoadingSession } = useSession();
  const { isLoadingMasa } = useMasaClient();

  const isLoading = useMemo(
    () => isLoadingSession || isLoadingMasa,
    [isLoadingSession, isLoadingMasa]
  );

  return isLoading;
};
