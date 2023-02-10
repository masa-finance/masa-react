import React, { useCallback, useMemo } from 'react';
import { useMasa } from '../../../../helpers';
import { MasaLoading } from '../../../masa-loading';
import { Network } from '../../../../helpers/utils/networks';

export const InterfaceSwitchChain = (): JSX.Element => {
  const { network, loading, switchNetwork, SupportedNetworks } = useMasa();

  const currentNetwork: Network | null = useMemo(() => {
    if (SupportedNetworks && network)
      for (const chainId in SupportedNetworks) {
        if (
          SupportedNetworks[chainId].chainName?.toLowerCase().includes(network)
        ) {
          return SupportedNetworks[chainId];
        }
      }

    return null;
  }, [network, SupportedNetworks]);

  const handleSwitch = useCallback(() => {
    if (switchNetwork && currentNetwork) {
      switchNetwork(currentNetwork.chainId);
    }
  }, [switchNetwork, currentNetwork]);

  if (loading) return <MasaLoading />;

  return (
    <div className="interface-connected">
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <h3 className="title">
          It looks like you are connected to a different network
        </h3>
        <button
          className="masa-button authenticate-button"
          onClick={handleSwitch}
        >
          Switch to{' '}
          <span style={{ textTransform: 'capitalize' }}>{network}</span>
        </button>
      </div>
    </div>
  );
};
