import { Chain, useSigner } from 'wagmi';
import { useNetwork, useProvider } from 'wagmi';
import { useAccount } from 'wagmi';

export const useWagmi = () => {
  const provider = useProvider();
  const { chain, chains } = useNetwork();
  const {
    data: signer,
    isError: isSignerError,
    isLoading: isSignerLoading,
  } = useSigner();
  const { address, isConnecting, isDisconnected } = useAccount();

  return {
    isLoading: isSignerLoading,
    isError: isSignerError,
    address,
    isConnecting,
    isDisconnected,
    provider,
    signer,
    chain,
    chains,
  };
};
