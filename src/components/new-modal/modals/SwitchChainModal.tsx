import { Network, SupportedNetworks } from '@masa-finance/masa-sdk';
import React, { useCallback, useMemo } from 'react';
import { MasaLoading } from '../../masa-loading';
import { useMasa } from '../../../provider';

const SwitchChainModal = () => {
  const { isLoading, switchNetwork, forceNetwork } = useMasa();

  const networkData: Network | undefined = useMemo(() => {
    if (forceNetwork) {
      return SupportedNetworks[forceNetwork];
    } else {
      return undefined;
    }
  }, [forceNetwork]);

  const handleSwitch = useCallback(() => {
    if (networkData) {
      switchNetwork?.(networkData.networkName);
    }
  }, [switchNetwork, networkData]);

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

export default SwitchChainModal;
