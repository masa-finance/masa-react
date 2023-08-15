import type { Connector, Provider } from '@wagmi/core';
import { useEffect } from 'react';

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
      ?.getProvider?.()
      .then((provider_: Provider) => {
        provider = provider_;
        provider.on('chainChanged', stopSwitching);
      })
      .catch((error: unknown) => {
        console.log("error getting provider's chainChanged event", error);
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
