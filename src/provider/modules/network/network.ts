import { Signer, utils, Wallet } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { Network, SupportedNetworks } from '../../../helpers';

export const useNetwork = (
  provider?: Wallet | Signer
): {
  addNetwork: (networkDetails: Network) => void;
  switchNetwork: (chainId: number) => void;
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

    const chainId = await provider.getChainId();

    const newNetwork = SupportedNetworks[chainId];
    console.log({ newNetwork });

    setCurrentNetwork(newNetwork);
  }, [provider]);

  const switchNetwork = useCallback(
    async (chainId: number) => {
      try {
        if (typeof window !== 'undefined') {
          await window?.ethereum?.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: utils.hexValue(chainId) }],
          });
          console.log(`switched to chainId: ${chainId} successfully`);
        }
      } catch (err) {
        const error = err as { code: number };
        if (error.code === 4902) {
          await addNetwork(SupportedNetworks[chainId]);
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
