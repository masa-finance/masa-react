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
    canProgramaticallySwitchNetwork,
    walletName,
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
          justifyContent: 'space-evenly',
        }}
      >
        <h3 className="title">
          It looks like you are connected to a different network
        </h3>
        <button
          className="masa-button authenticate-button"
          onClick={handleSwitch}
          disabled={!canProgramaticallySwitchNetwork}
        >
          Switch to{' '}
          <span style={{ textTransform: 'capitalize' }}>
            {networkData?.chainName}
          </span>
        </button>
        {!canProgramaticallySwitchNetwork && (
          <div className="dont-have-a-wallet">
            <p>
              <b>
                It seems that your {walletName} wallet is not able to switch
                networks programmatically.{' '}
              </b>
            </p>
            <p>
              This means that you have to manually switch networks in your
              wallet. Please switch to the <b>{networkData?.chainName}</b> in
              your wallet. This window will update automatically once you
              switched networks.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
