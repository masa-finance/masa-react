import { useAsync } from 'react-use';
import { useMasaClient } from '../masa-client/use-masa-client';
import { useNetwork } from '../wallet-client/network';
import type { useSession } from './use-session';
import type { useIdentity } from './use-identity';

export const useIdentityListen = ({
  identity,
  getIdentity,
  sessionAddress,
}: {
  identity?: ReturnType<typeof useIdentity>['identity'];
  getIdentity: ReturnType<typeof useIdentity>['getIdentity'];
  sessionAddress?: ReturnType<typeof useSession>['sessionAddress'];
}) => {
  const { masaAddress, masaNetwork } = useMasaClient();
  const { activeNetwork } = useNetwork();
  //   const { identity, getIdentity } = useIdentity();

  useAsync(async () => {
    if (
      masaAddress === sessionAddress &&
      masaNetwork === activeNetwork &&
      identity?.address !== masaAddress
    )
      // * NOTE: we need to make sure the states are in sync before loading the identity
      await getIdentity();

    return undefined;
  }, [
    getIdentity,
    masaAddress,
    activeNetwork,
    masaNetwork,
    sessionAddress,
    identity,
  ]);
};
