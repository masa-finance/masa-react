import React, { useCallback, useMemo } from 'react';
import { useMasa } from '../../../../helpers';
import { MasaLoading } from '../../../masa-loading';

export const InterfaceSwitchChain = (): JSX.Element => {
  const { network, loading, switchNetwork, SupportedNetworks } = useMasa();
  const chain = useMemo(() => {
    if (SupportedNetworks && network)
      for (const chainId in SupportedNetworks) {
        if (
          SupportedNetworks[chainId].chainName?.toLowerCase().includes(network)
        ) {
          return SupportedNetworks[chainId];
        }
      }
    else {
      return null;
    }
  }, [network, SupportedNetworks]);

  const handleSwitch = useCallback(() => {
    switchNetwork?.(chain?.chainId);
  }, [switchNetwork, chain]);

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
          Switch to {network}
        </button>
      </div>
    </div>
  );
};
