import { Chain, useAccount, useNetwork, useProvider, useSigner } from 'wagmi';

export const useWagmi = () => {
  const provider = useProvider();
  const { chain, chains } = useNetwork();
  const {
    data: signer,
    isError: isSignerError,
    isLoading: isSignerLoading,
    refetch: refetchSigner,
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
    refetchSigner,
    chain: chain as Chain,
    chains,
  };
};
