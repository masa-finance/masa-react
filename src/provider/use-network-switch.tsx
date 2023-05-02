import { NetworkName, SupportedNetworks } from '@masa-finance/masa-sdk';
import { useCallback } from 'react';
import { useNetwork, useSwitchNetwork } from 'wagmi';

export const useNetworkSwitch = () => {
  const currentNetwork = useNetwork();
  const { switchNetwork: switchNetworkWagmi } = useSwitchNetwork({
    onError: (err) => console.error('Wagmi Network switch failed', err),
  });

  const switchNetwork = useCallback(
    (forcedNetworkParam: NetworkName) => {
      const networkToSwitchTo = SupportedNetworks[forcedNetworkParam];
      if (networkToSwitchTo) {
        if (networkToSwitchTo.chainId === currentNetwork.chain?.id) {
          return;
        }
        switchNetworkWagmi?.(networkToSwitchTo.chainId);
        return;
      }
    },
    [switchNetworkWagmi, currentNetwork.chain?.id]
  );
  return {
    currentNetwork,
    switchNetwork,
  };
};
