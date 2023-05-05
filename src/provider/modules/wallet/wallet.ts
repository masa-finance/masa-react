import { useQuery } from 'react-query';
import { Masa, NetworkName } from '@masa-finance/masa-sdk';
import { Signer, Wallet } from 'ethers';
import { useEffect, useMemo } from 'react';
import { useAccount, useSigner } from 'wagmi';

export const useWallet = (
  masa?: Masa,
  provider?: Wallet | Signer
): {
  walletAddress?: string;
  isWalletLoading: boolean;
  hasWalletAddress: boolean;
  status: string;
  error: unknown;
} => {
  const { address: wagmiAddress } = useAccount();
  const signer = useSigner();
  const { isRefetching } = signer;
  const queryKey: (string | NetworkName | undefined)[] = useMemo(() => {
    return ['wallet', masa?.config.networkName];
  }, [masa, wagmiAddress, isRefetching]);

  const {
    data: walletAddress,
    status,
    isLoading,
    isFetching,
    error,
  } = useQuery<string | undefined>(
    queryKey,
    () => masa?.config.wallet.getAddress(),
    {
      enabled: !!masa && !!provider,
      retry: false,
    }
  );
  useEffect(() => {
    console.log('isRefetching changed', isRefetching);
  }, [isRefetching]);
  // console.log({
  //   wagmiAddress,

  //   walletAddress,

  //   signer: signer.data?.provider,
  // });
  const hasWalletAddress = useMemo(() => {
    return !!walletAddress;
  }, [walletAddress]);

  return {
    walletAddress: !provider ? undefined : walletAddress,
    isWalletLoading: isLoading || isFetching,
    hasWalletAddress,
    status,
    error,
  };
};
