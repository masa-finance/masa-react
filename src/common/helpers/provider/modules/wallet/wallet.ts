import { useQuery } from 'react-query';

export const useWallet = function (masa, provider) {
  const { data, status, isLoading, error } = useQuery(
    `wallet`,
    () => masa.config.wallet.getAddress(),
    { enabled: !!masa && !!provider }
  );

  return { wallet: !provider ? null : data, status, isLoading, error };
};
