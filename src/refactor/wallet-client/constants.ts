import {
  injectedWallet,
  metaMaskWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { Valora } from '@celo/rainbowkit-celo/wallets';
import type { Wallet } from '@rainbow-me/rainbowkit';
import type { Chain } from 'wagmi';
import { NetworkName } from '@masa-finance/masa-sdk';

export const PROJECT_ID = '04a4088bf7ff775c3de808412c291cc0';

export const walletConnectorsList: Record<
  'metamask' | 'valora' | 'walletconnect',
  (chains: Chain[]) => { groupName: string; wallets: Wallet[] }
> & {
  walletconnect: (
    chains: Chain[],
    networkName?: NetworkName
  ) => { groupName: string; wallets: Wallet[] };
} = {
  metamask: (chains: Chain[]) => ({
    groupName: 'Recommended',
    wallets: [
      injectedWallet({ chains }),
      metaMaskWallet({ chains, projectId: PROJECT_ID }),
    ],
  }),
  valora: (chains: Chain[]) => ({
    groupName: 'Celo',
    wallets: [Valora({ chains, projectId: PROJECT_ID })],
  }),

  walletconnect: (
    chains: Chain[]
    // networkName?: NetworkName
  ) => {
    console.log('x');
    // const singleChain = chains.filter(
    //   (ch: Chain) => ch.network === getWagmiNetworkName(networkName)
    // );
    // const sortedChains = [
    //   ...singleChain,
    //   ...chains.filter(
    //     (ch: Chain) => ch.network !== getWagmiNetworkName(networkName)
    //   ),
    // ];
    // console.log('CHAINS', {
    //   SupportedNetworks,

    //   singleChain,
    //   sortedChains,
    //   networkName,
    // });
    return {
      groupName: 'WalletConnect',
      wallets: [
        walletConnectWallet({
          projectId: PROJECT_ID,
          chains,
          options: {
            qrcode: true,
            projectId: PROJECT_ID,
          },
        }),
      ],
    };
  },
};
