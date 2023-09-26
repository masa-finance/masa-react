import { useAsync } from 'react-use';
import { useMasaClient } from '../masa-client/use-masa-client';
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
  const { masaAddress } = useMasaClient();
  return useAsync(async () => {
    // * NOTE: we need to make sure the states are in sync before loading the identity
    if (masaAddress === sessionAddress && identity?.address !== masaAddress) {
      await getIdentity();
    }

    return undefined;
  }, [getIdentity, masaAddress, sessionAddress, identity]);
};
