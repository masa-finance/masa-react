import {
  injectedWallet,
  metaMaskWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { Valora } from '@celo/rainbowkit-celo/wallets';
import type { Wallet } from '@rainbow-me/rainbowkit';
import type { Chain } from 'wagmi';

export const PROJECT_ID = '04a4088bf7ff775c3de808412c291cc0';

export const walletConnectorsList: Record<
  string,
  (chains: Chain[]) => { groupName: string; wallets: Wallet[] }
> = {
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

  walletconnect: (chains: Chain[]) => {
    console.log('CHAINS', {
      chains,
      filtered: chains.filter((ch) => ch.name === 'Celo'),
    });
    return {
      groupName: 'WalletConnect',
      wallets: [
        walletConnectWallet({
          projectId: PROJECT_ID,
          chains: chains.filter((chain: Chain) => chain.name === 'Celo'),
          options: {
            qrcode: true,
            projectId: PROJECT_ID,
          },
        }),
      ],
    };
  },
};
