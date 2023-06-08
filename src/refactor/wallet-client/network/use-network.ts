import { useMemo } from 'react';
import { useSwitchNetwork, useNetwork as useNetworkWagmi } from 'wagmi';

export const useNetwork = () => {
  const { switchNetwork } = useSwitchNetwork();
  const { chains, chain } = useNetworkWagmi();

  const canProgramaticallySwitchNetwork = useMemo(
    () => !!switchNetwork,
    [switchNetwork]
  );

  return {
    switchNetwork,
    canProgramaticallySwitchNetwork,
    chain,
    chains,
  };
};  
