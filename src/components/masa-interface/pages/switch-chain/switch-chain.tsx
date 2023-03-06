import React, { useCallback, useMemo } from 'react';
import { useMasa } from '../../../../provider';
import { MasaLoading } from '../../../masa-loading';
import { Network } from '../../../../helpers';
import { getNetworkNameByChainId } from '../../../../helpers/networks';

export const InterfaceSwitchChain = (): JSX.Element => {
  const { isLoading, switchNetwork, network, SupportedNetworks, masa } =
    useMasa();

  const currentNetwork: Network | undefined = useMemo(() => {
    if (SupportedNetworks && masa?.config.network)
      for (const networkName in SupportedNetworks) {
        if (
          SupportedNetworks[networkName].chainName
            ?.toLowerCase()
            .includes(masa.config.network)
        ) {
          return SupportedNetworks[networkName];
        }
      }

    return null;
  }, [masa, SupportedNetworks]);

  const handleSwitch = useCallback(() => {
    if (network) {
      switchNetwork?.(network);
    }
  }, [switchNetwork, switchNetwork]);

  const networkData = useMemo(
    () => getNetworkNameByChainId(network ?? 0),
    [network]
  );

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
            {networkData}
          </span>
        </button>
      </div>
    </div>
  );
};
