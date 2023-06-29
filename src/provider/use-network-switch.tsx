import { NetworkName, SupportedNetworks } from '@masa-finance/masa-sdk';
import { useCallback, useMemo } from 'react';
import { useNetwork, useSwitchNetwork } from 'wagmi';

export const useNetworkSwitch = () => {
  const currentNetwork = useNetwork();
  const { switchNetwork: switchNetworkWagmi } = useSwitchNetwork({
    onSettled(data, error, variables, context) {
      console.log('switchnetwork wagmi in useNetxworkswitch ( onSettled)', {
        data,
        error,
        variables,
        context,
      });
    },
    onError: (err) => console.error('Wagmi Network switch failed', err),
  });

  const switchNetwork = useCallback(
    (forcedNetworkParam: NetworkName) => {
      const networkToSwitchTo = SupportedNetworks[forcedNetworkParam];
      if (networkToSwitchTo) {
        if (networkToSwitchTo.chainId === currentNetwork.chain?.id) {
          return;
        }
        console.log(
          'switchnetwork wagmi in useNetworkswitch ( new)',
          switchNetworkWagmi,
          networkToSwitchTo
        );
        switchNetworkWagmi?.(networkToSwitchTo.chainId);
      }
    },
    [switchNetworkWagmi, currentNetwork.chain?.id]
  );

  const canProgramaticallySwitchNetwork = useMemo(
    () => !!switchNetworkWagmi,
    [switchNetworkWagmi]
  );

  return {
    canProgramaticallySwitchNetwork,
    currentNetwork,
    switchNetwork,
  } as {
    canProgramaticallySwitchNetwork: boolean;
    currentNetwork: ReturnType<typeof useNetwork>;
    switchNetwork: (forcedNetworkParam: NetworkName) => void;
  };
};
