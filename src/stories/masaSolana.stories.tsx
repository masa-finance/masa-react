import type { Args, Meta } from '@storybook/react';
import React, { useMemo } from 'react';
// import { AllNetworks } from '../config';
// import MasaProvider from '../masa-provider';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import {
  BaseWalletMultiButton,
  WalletDisconnectButton,
  WalletModalProvider,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

const meta: Meta = {
  title: 'Solana',
  component: () => <div />,
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
    },
  },
};

export default meta;

const Wallet = () => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      /**
       * Wallets that implement either of these standards will be available automatically.
       *
       *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
       *     (https://github.com/solana-mobile/mobile-wallet-adapter)
       *   - Solana Wallet Standard
       *     (https://github.com/anza-xyz/wallet-standard)
       *
       * If you wish to support a wallet that supports neither of those standards,
       * instantiate its legacy wallet adapter here. Common legacy adapters can be found
       * in the npm package `@solana/wallet-adapter-wallets`.
       */
      new UnsafeBurnerWalletAdapter(),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  return (
    <>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets}>
          <WalletModalProvider>
            {/* <BaseWalletMultiButton
              onClick={() => alert('clicked')}
              labels={{
                connecting: 'Connecting',
                'has-wallet': 'Connected',
                'no-wallet': 'Connect Wallet',
                'copy-address': 'Copy Address',
                copied: 'Copied',
                'change-wallet': 'Change Wallet',
                disconnect: 'Disconnect',
              }}
              style={{
                width: '100%',
                height: '50px',
                backgroundColor: 'purple',
                color: 'white',
                borderRadius: '10px',
              }}
            /> */}
            <WalletMultiButton onClick={() => alert('clicked')} />
            <WalletDisconnectButton />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
};

const Component = (): JSX.Element => {
  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: '30px',
      }}
    >
      <h1>Solana</h1>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
        }}
      >
        <Wallet />
      </div>
    </section>
  );
};

const TemplateNewMasaState = (props: Args) => (
  //   <MasaProvider
  //     config={{
  //       forceChain: 'base',
  //       allowedNetworkNames: AllNetworks,
  //       masaConfig: {
  //         networkName: 'base',
  //       },
  //     }}
  //   >
  <Component {...props} />
  //   </MasaProvider>
);

export const Solana = TemplateNewMasaState.bind({
  options: { scope: [] },
});
