import { useQuery } from 'react-query';
import { Masa } from '@masa-finance/masa-sdk';
import { ethers } from 'ethers';

export const useWallet = (
  masa: Masa | null,
  provider: ethers.Wallet | ethers.Signer | null
): {
  walletAddress: string | undefined;
  status: string;
  isLoading: boolean;
  error: unknown;
} => {
  const {
    data: walletAddress,
    status,
    isLoading,
    error,
  } = useQuery(`wallet`, () => masa?.config.wallet.getAddress(), {
    enabled: !!masa && !!provider,
  });

  return {
    walletAddress: !provider ? undefined : walletAddress,
    status,
    isLoading,
    error,
  };
};
