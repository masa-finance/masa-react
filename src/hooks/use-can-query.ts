import { useMemo } from 'react';
import { useMasaClient } from '../masa-client/use-masa-client';
// import { useSession } from '../masa/use-session';
import { useNetwork } from '../wallet-client/network';
import { useWallet } from '../wallet-client/wallet/use-wallet';

export const useCanQuery = () => {
  const { sdk: masa } = useMasaClient();
  const { isDisconnected } = useWallet();
  // const { hasSession, sessionAddress } = useSession();
  const { activeNetwork } = useNetwork();

  const canQuery = useMemo(
    () =>
      Boolean(
        masa &&
          // sessionAddress &&
          activeNetwork &&
          !isDisconnected
        // &&
        //  hasSession
      ),
    [
      masa,
      // sessionAddress,
      activeNetwork,
      isDisconnected,
      // hasSession
    ]
  );

  return canQuery;
};
