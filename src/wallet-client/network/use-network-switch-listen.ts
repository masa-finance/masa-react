import { useEffect } from 'react';
import type { Connector } from 'wagmi';
import type { Provider } from '@ethersproject/providers';

export const useNetworkSwitchListen = ({
  activeConnector,
  stopSwitching,
  networkError,
}: {
  activeConnector?: Connector | undefined;
  stopSwitching: () => void;
  networkError: Error | null;
}) => {
  useEffect(() => {
    if (!activeConnector) {
      return undefined;
    }

    let provider: Provider;

    activeConnector
      .getProvider?.()
      .then((provider_: unknown) => {
        provider = provider_ as Provider;
        provider.on('chainChanged', stopSwitching);
      })
      .catch((error: unknown) => {
        console.error("error getting provider's chainChanged event", error);
      });

    return () => {
      provider?.removeListener('chainChanged', stopSwitching);
    };
  }, [activeConnector, stopSwitching]);

  useEffect(() => {
    if (networkError && networkError.name === 'UserRejectedRequestError') {
      stopSwitching();
    }
  }, [networkError, stopSwitching]);
};
