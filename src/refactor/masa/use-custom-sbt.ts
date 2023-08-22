import { useCallback, useMemo } from 'react';
import { Masa, MasaSBTWrapper } from '@masa-finance/masa-sdk';
import { BigNumber } from 'ethers';
import { useQuery } from '@tanstack/react-query';

import { MasaSBT } from '@masa-finance/masa-contracts-identity';
import { useAsyncFn } from 'react-use';
import { queryClient } from '../../provider';
import { MasaQueryClientContext, useMasaClient } from '../masa-client';
import { useWallet } from '../wallet-client';
import { useConfig } from '../base-provider';
import { CustomGallerySBT } from '../../components/masa-interface/pages/gallery/gallery';
import { useCanQuery } from '../hooks/use-can-query';
import { useSession } from './use-session';

export const getCustomSBTsContractsQueryKey = ({
  masa,
  walletAddress,
}: {
  masa?: Masa;
  walletAddress?: string; // unused
}) => ['custom-sbt-contracts', walletAddress, masa?.config.networkName];

export const getCustomSBTsQueryKey = ({
  masa,
  walletAddress,
}: {
  masa?: Masa;
  walletAddress?: string;
}) => ['custom-sbt', walletAddress, masa?.config.networkName];

interface FullContract extends CustomGallerySBT, MasaSBTWrapper<MasaSBT> {}
const fetchContracts = async (
  masa?: Masa,
  customGallerySBT?: CustomGallerySBT[]
) => {
  if (!masa) return [];
  if (customGallerySBT && customGallerySBT.length > 0) {
    const newContracts: FullContract[] = [];
    for (const sbt of customGallerySBT) {
      if (sbt.network && sbt.network !== masa.config.networkName) {
        // eslint-disable-next-line no-continue
        continue;
      }

      try {
        // eslint-disable-next-line no-await-in-loop
        const sbtContract = await masa?.sbt.connect(sbt.address);

        const contractObject = { ...sbtContract, ...sbt } as FullContract;

        newContracts.push(contractObject);
      } catch (error) {
        console.log(error);
      }
    }
    return newContracts;
  }
  return [];
};

export const useCustomGallerySBT = () => {
  const { sdk: masa } = useMasaClient();
  const { address: walletAddress } = useWallet();
  const { customSBTs } = useConfig();

  const queryKey: (string | undefined)[] = useMemo(
    () => getCustomSBTsContractsQueryKey({ masa, walletAddress }),
    [walletAddress, masa, customSBTs]
  );

  const {
    data: contracts,
    status,
    isLoading,
    isFetching,
    refetch: refetchContracts,
    error,
  } = useQuery(queryKey, () => fetchContracts(masa, customSBTs), {
    enabled: !!masa && !!walletAddress && !!customSBTs?.length,
    retry: false,
    onSuccess: (SBTs) => {
      if (masa?.config.verbose) {
        console.info('fetchCustomSBTs', SBTs);
      }
    },
  });

  return {
    customContracts: contracts ?? [],
    status,
    isLoading,
    isFetching,
    error,
    refetchContracts,
  };
};

interface Token {
  tokenId: BigNumber;
  tokenUri: string;
}
interface Metadata {
  image: string;
  name: string;
  description: string;
}
interface TokenWithMetadata extends Token {
  metadata: Metadata;
}
interface HidratatedContracts extends FullContract {
  tokens: TokenWithMetadata[];
}

export const fetchCustomSBTs = async (
  customContracts: FullContract[]
): Promise<HidratatedContracts[]> => {
  const contracts = customContracts;
  const hidratatedContracts: HidratatedContracts[] = []; // TBD

  for (const contract of contracts) {
    // eslint-disable-next-line no-continue
    if (!contract.contract) continue;
    const hidratatedTokens: TokenWithMetadata[] = [];

    try {
      // eslint-disable-next-line no-await-in-loop
      const tokens: Token[] = await contract.list();

      if (contract.getMetadata) {
        for (const token of tokens) {
          try {
            // eslint-disable-next-line no-await-in-loop
            const metadata = await contract.getMetadata(token);
            const tokenAndMetadata = { metadata, ...token };
            hidratatedTokens.push(tokenAndMetadata);
          } catch (error) {
            console.log('METADTA ERROR', error);
          }
        }
      }
    } catch (error) {
      console.log('LIST TOKENS ERROR', error);
    }

    const hidratatedContract = {
      ...contract,
      tokens: hidratatedTokens,
    } as HidratatedContracts;
    hidratatedContracts.push(hidratatedContract);
  }

  return hidratatedContracts;
};

export const useCustomSBTsQuery = () => {
  const { masaAddress, masaNetwork } = useMasaClient();
  const canQuery = useCanQuery();
  const { customContracts } = useCustomGallerySBT();

  const { hasSession, sessionAddress } = useSession();

  const [, getCustomContracts] = useAsyncFn(async () => {
    if (!canQuery) return null;

    const result = await fetchCustomSBTs(customContracts);
    if (!result) return null;

    return result;
  }, [canQuery, customContracts]);

  const {
    data: customSBTs,
    status,
    isLoading,
    isFetching,
    refetch: reloadCustomSBTs,
    error,
  } = useQuery({
    queryKey: [
      'custom-sbt',
      { sessionAddress, masaAddress, masaNetwork, persist: false },
    ],
    enabled: !!hasSession && !!sessionAddress && !!masaAddress && !!masaNetwork,
    context: MasaQueryClientContext,
    queryFn: getCustomContracts,
  });

  const invalidateCustomSBTs = useCallback(
    async () => queryClient.invalidateQueries(['custom-sbt']),
    []
  );

  return {
    customSBTs,
    status,
    isLoading,
    isFetching,
    reloadCustomSBTs,
    invalidateCustomSBTs,
    error,
  };
};
