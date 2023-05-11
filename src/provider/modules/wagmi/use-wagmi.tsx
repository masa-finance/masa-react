import {
  Chain,
  ConnectorData,
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

  const { connector: activeConnector } = useAccount();

  // * detects if we have a new account or chain
  useEffect(() => {
    const handleConnectorUpdate = ({ account, chain }: ConnectorData) => {
      if (account) {
        console.log('new account', account);
        // TODO: set variables that are needed when account is changed
      } else if (chain) {
        console.log('new chain', chain);
      }
    };

    if (activeConnector) {
      activeConnector.on('change', handleConnectorUpdate);
    }

    return () => {
      activeConnector?.off('change', handleConnectorUpdate);
    };
  }, [activeConnector]);

  useEffect(() => {
    setSigner(signer as Signer);
    console.log('setSigner wagmi', { setSigner, signer });
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
