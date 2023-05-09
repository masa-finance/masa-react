import {
  Chain,
  useAccount,
  useDisconnect,
  useNetwork,
  useProvider,
  useSigner,
} from 'wagmi';
import { Signer } from 'ethers';
import { useEffect } from 'react';

export const useWagmi = ({
  setSigner,
  logout,
}: {
  setSigner: (signer?: Signer) => void;
  logout: () => void;
}) => {
  const provider = useProvider();
  const { chain, chains } = useNetwork();
  const {
    data: signer,
    isError: isSignerError,
    isLoading: isSignerLoading,
  } = useSigner();

  const { isConnecting, isDisconnected } = useAccount({
    onDisconnect: () => logout(),
  });
  const { disconnect } = useDisconnect();

  useEffect(() => {
    setSigner(signer as Signer);
  }, [setSigner, signer]);

  return {
    isLoading: isSignerLoading,
    isError: isSignerError,
    isConnecting,
    isDisconnected,
    provider,
    signer,
    chain: chain as Chain,
    chains,
    disconnect,
  };
};
