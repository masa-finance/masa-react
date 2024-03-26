import {
  coreWallet,
  injectedWallet,
  metaMaskWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { Valora } from '@celo/rainbowkit-celo/wallets';
import type { Wallet } from '@rainbow-me/rainbowkit';
import type { Chain } from 'wagmi';
import { AllowedWallets } from '../config';

export const PROJECT_ID = '04a4088bf7ff775c3de808412c291cc0';

export const walletConnectorsList: Record<
  AllowedWallets,
  (chains: Chain[]) => { groupName: string; wallets: Wallet[] }
> = {
  // recommended
  metamask: (chains: Chain[]) => ({
    groupName: 'Recommended',
    wallets: [
      injectedWallet({ chains }),
      metaMaskWallet({
        chains,
        projectId: PROJECT_ID,
      }),
    ],
  }),

  core: (chains: Chain[]) => ({
    groupName: 'Recommended',
    wallets: [
      coreWallet({
        chains,
        projectId: PROJECT_ID,
      }),
    ],
  }),

  // celo
  valora: (chains: Chain[]) => ({
    groupName: 'Celo',
    wallets: [
      Valora({
        chains,
        projectId: PROJECT_ID,
      }),
    ],
  }),

  // wallet connect
  walletconnect: (chains: Chain[]) => ({
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
  }),
};
