import { useAsync } from 'react-use';
import { useSession } from './use-session';
import { useWallet } from '../wallet-client/wallet/use-wallet';
import { useMasaClient } from '../masa-client/use-masa-client';

export const useSessionListen = () => {
  const { masaAddress } = useMasaClient();
  const {
    session,
    sessionAddress,
    isLoadingSession,
    logoutSession,
    hasSession,
  } = useSession();
  const { isDisconnected } = useWallet();

  // * useEffect to handle account switches and disconnect
  useAsync(async () => {
    if (isLoadingSession) return;

    if (
      session &&
      masaAddress &&
      masaAddress === session?.user.address &&
      hasSession
    ) {
      return;
    }

    if (isDisconnected) {
      await logoutSession();
      return;
    }

    if (
      hasSession &&
      sessionAddress &&
      masaAddress &&
      sessionAddress !== masaAddress
    ) {
      await logoutSession();
    }
  }, [
    isLoadingSession,
    sessionAddress,
    masaAddress,
    isDisconnected,
    logoutSession,
    hasSession,
    session,
  ]);
};
