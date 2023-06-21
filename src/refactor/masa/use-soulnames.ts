import { useQuery } from '@tanstack/react-query';
import { useAsync, useAsyncFn } from 'react-use';
import { QcContext } from '../masa-provider';
import { useMasaClient } from '../masa-client/use-masa-client';
import { useNetwork } from '../wallet-client/network';
import { useSession } from './use-session';
import { useWallet } from '../wallet-client/wallet/use-wallet';

export const useSoulNames = () => {
  const { masaAddress, masaNetwork, sdk: masa } = useMasaClient();
  const { activeNetwork } = useNetwork();
  const { hasSession, sessionAddress } = useSession();
  const { isDisconnected } = useWallet();
  const [, loadSoulnames] = useAsyncFn(async () => {
    if (!masa) return null;
    if (!sessionAddress) return null;
    if (!activeNetwork) return null;
    if (isDisconnected) return null;
    if (!hasSession) return null;

    const snResult = await masa?.soulName.list();
    if (snResult) return snResult;
    return null;
  }, [activeNetwork, masa, sessionAddress, isDisconnected, hasSession]);
  const {
    data: soulnames,
    isFetching: isLoadingSoulnames,
    refetch: getSoulnames,
  } = useQuery({
    enabled: !!masa && !!masaAddress && !!masaNetwork,
    context: QcContext,
    queryKey: ['soulnames', { masaAddress, masaNetwork, persist: false }],
    queryFn: async () => loadSoulnames(),
  });

  useAsync(async () => getSoulnames(), [getSoulnames]);
  return {
    soulnames,
    isLoadingSoulnames,
    getSoulnames,
  };
};
