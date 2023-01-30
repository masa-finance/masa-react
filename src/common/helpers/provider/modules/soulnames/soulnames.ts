import { useQuery } from 'react-query';

export const useSoulnames = function (masa, walletAddress, identity) {
  const { data, status, isLoading, error } = useQuery(
    `soulnames-${walletAddress}`,
    () => masa?.soulName.list(),
    { enabled: !!masa && !!walletAddress && !!identity?.identityId }
  );

  return { soulnames: data, status, isLoading, error };
};
