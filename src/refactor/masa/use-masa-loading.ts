import { useMemo } from 'react';
import { useMasaClient } from '../masa-client/use-masa-client';
import { useCreditScores } from './use-credit-scores';
import { useGreen } from './use-green';
import { useIdentity } from './use-identity';
import { useSession } from './use-session';
import { useSoulNames } from './use-soulnames';
import { useWallet } from '../wallet-client/wallet/use-wallet';

export const useMasaLoading = () => {
  const { isLoadingSigner, isConnecting } = useWallet();
  const { isLoadingSession } = useSession();
  const { isLoadingIdentity } = useIdentity();
  const { isLoadingSoulnames } = useSoulNames();
  const { isLoadingCreditScores } = useCreditScores();
  const { isLoadingGreens } = useGreen();
  const { sdk: masa } = useMasaClient();

  const isLoading = useMemo(
    () =>
      isLoadingSession ||
      isLoadingIdentity ||
      isLoadingSoulnames ||
      isLoadingCreditScores ||
      isLoadingGreens ||
      isLoadingSigner ||
      isConnecting ||
      !masa,
    [
      isLoadingSession,
      isLoadingIdentity,
      isLoadingSoulnames,
      isLoadingCreditScores,
      isLoadingGreens,
      masa,
      isLoadingSigner,
      isConnecting,
    ]
  );

  return isLoading;
};
