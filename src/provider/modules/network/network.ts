import { Signer, utils, Wallet } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import {
  getNetworkNameByChainId,
  Network,
  SupportedNetworks,
} from '../../../helpers';
import { NetworkName } from '@masa-finance/masa-sdk';

export const useNetwork = (
  provider?: Wallet | Signer
): {
  addNetwork: (networkDetails: Network) => void;
  switchNetwork: (networkName: NetworkName) => void;
  currentNetwork?: Network;
} => {
  const [currentNetwork, setCurrentNetwork] = useState<Network | undefined>();

  const addNetwork = useCallback(async (networkDetails: Network) => {
    try {
      if (typeof window !== 'undefined' && networkDetails) {
        await window?.ethereum?.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              ...networkDetails,
              chainId: utils.hexValue(networkDetails.chainId),
            },
          ],
        });
      }
    } catch (error) {
      console.error(
        `error occurred while adding new chain with chainId:${networkDetails?.chainId}`
      );
    }
  }, []);

  const loadNetwork = useCallback(async (): Promise<void> => {
    if (!provider) return;

    const chainId: number = await provider.getChainId();
    const network = SupportedNetworks[getNetworkNameByChainId(chainId)];

    console.log({ network });

    setCurrentNetwork(network);
  }, [provider]);

  const switchNetwork = useCallback(
    async (networkName: NetworkName) => {
      const network = SupportedNetworks[networkName];

      try {
        if (typeof window !== 'undefined' && network) {
          await window?.ethereum?.request({
            method: 'wallet_switchEthereumChain',
            params: [
              {
                chainId: utils.hexValue(network.chainId),
              },
            ],
          });
          console.log(`switched to network: ${networkName} successfully`);
        }
      } catch (err) {
        const error = err as { code: number };
        if (error.code === 4902) {
          const newNetwork = SupportedNetworks[networkName];
          if (newNetwork) {
            await addNetwork(newNetwork);
          }
        }
      }

      await loadNetwork();
    },
    [addNetwork, loadNetwork]
  );

  useEffect(() => {
    void loadNetwork();
  }, [loadNetwork]);

  return {
    addNetwork,
    switchNetwork,
    currentNetwork,
  };
};
