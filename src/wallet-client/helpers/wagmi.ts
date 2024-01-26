// import { type PublicClient, type WalletClient } from 'wagmi';

// import { providers } from 'ethers';
// import { type HttpTransport } from 'viem';

// export const publicClientToProvider = (publicClient: PublicClient) => {
//   const { chain, transport } = publicClient;
//   const network = {
//     chainId: chain.id,
//     name: chain.name,
//     ensAddress: chain.contracts?.ensRegistry?.address,
//   };
//   if (transport.type === 'fallback')
//     return new providers.FallbackProvider(
//       (transport.transports as ReturnType<HttpTransport>[]).map(
//         ({ value }: ReturnType<HttpTransport>) =>
//           new providers.JsonRpcProvider(value?.url, network)
//       )
//     );
//   return new providers.JsonRpcProvider(transport.url as string, network);
// };

import { providers } from 'ethers';
import { useMemo } from 'react';
import type { Chain, Client, Transport } from 'viem';
import { Config, useClient } from 'wagmi';

export function publicClientToProvider(client: Client<Transport, Chain>) {
  const { chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };

  if (transport.type === 'fallback')
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<Transport>[]).map(
        ({ value }) =>
          new providers.JsonRpcProvider(value?.url as string, network)
      )
    );
  return new providers.JsonRpcProvider(transport.url as string, network);
}

/** Hook to convert a viem Client to an ethers.js Provider. */
export function useEthersProvider({
  chainId,
}: { chainId?: number | undefined } = {}) {
  const client = useClient<Config>({ chainId });
  return useMemo(
    () => publicClientToProvider(client as Client<Transport, Chain>),
    [client]
  );
}

export const walletClientToSigner = (
  walletClient: Client<Transport, Chain>
) => {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account?.address);
  return signer;
};
