import React, { useCallback, useMemo } from 'react';
import { useMasa } from '../../../../provider';
import { MasaLoading } from '../../../masa-loading';
import { Network, SupportedNetworks } from '@masa-finance/masa-sdk';
// import {
//   // useNetwork,
//   // useNetwork,
//   useSwitchNetwork,
// } from 'wagmi';

export const InterfaceSwitchChain = (): JSX.Element => {
  const {
    isLoading,
    // switchNetwork,
    forceNetwork,
    switchNetworkNew,
  } = useMasa();
  // const { chain } = useNetwork();
  // const { switchNetwork: switchNetworkWagmi } = useSwitchNetwork({
  //   onError: (err) => console.error('Wagmi Network switch failed', err),
  // });

  const networkData: Network | undefined = useMemo(() => {
    if (forceNetwork) {
      return SupportedNetworks[forceNetwork];
    }

    return;
  }, [forceNetwork]);

  const handleSwitch = useCallback(() => {
    if (networkData) {
      switchNetworkNew?.(networkData.networkName);
    }
  }, [switchNetworkNew, networkData]);

  if (isLoading) return <MasaLoading />;

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
          <span style={{ textTransform: 'capitalize' }}>
            {networkData?.chainName}
          </span>
        </button>
      </div>
    </div>
  );
};
