import { useCallback } from 'react';
import { Masa, MasaSBTWrapper } from '@masa-finance/masa-sdk';
import { BigNumber } from 'ethers';
import { useQuery } from '@tanstack/react-query';

import { MasaSBT } from '@masa-finance/masa-contracts-identity';
import { useAsyncFn } from 'react-use';
import { queryClient } from '../../provider';
import { MasaQueryClientContext, useMasaClient } from '../masa-client';
import { useConfig } from '../base-provider';
import { CustomGallerySBT } from '../../components/masa-interface/pages/gallery/gallery';
import { useCanQuery } from '../hooks/use-can-query';
import { useSession } from './use-session';

export interface Token {
  tokenId: BigNumber;
  tokenUri: string;
}
export interface Metadata {
  image: string;
  name: string;
  description: string;
}
export interface TokenWithMetadata extends Token {
  metadata: Metadata;
}
export interface HydratatedContracts extends FullContract {
  tokens: TokenWithMetadata[];
}

export interface FullContract
  extends CustomGallerySBT,
    MasaSBTWrapper<MasaSBT> {}

const fetchContracts = async (
  masa?: Masa,
  customGallerySBT?: CustomGallerySBT[]
): Promise<FullContract[]> => {
  if (!masa || !customGallerySBT || customGallerySBT.length === 0) return [];

  const filteredSBTs = customGallerySBT.filter(
    (sbt: CustomGallerySBT) =>
      !sbt.network || sbt.network === masa.config.networkName
  );

  const contractPromises = filteredSBTs.map(async (sbt: CustomGallerySBT) => {
    try {
      const sbtContract = await masa.sbt.connect(sbt.address);
      return { ...sbtContract, ...sbt } as FullContract;
    } catch (error) {
      console.log(error);
      return null;
    }
  });

  const contracts = await Promise.all(contractPromises);
  return contracts.filter(Boolean) as FullContract[];
};

export const useCustomGallerySBT = () => {
  const { masaAddress, masaNetwork, sdk: masa } = useMasaClient();
  const canQuery = useCanQuery();

  const { customSBTs } = useConfig();

  const { hasSession, sessionAddress } = useSession();
  const [, getContractsAsync] = useAsyncFn(async () => {
    if (!canQuery) return null;
    const result = await fetchContracts(masa, customSBTs);

    if (!result) return null;
    return result;
  }, [canQuery, customSBTs, masa]);

  const {
    data: contracts,
    status,
    isLoading,
    isFetching,
    refetch: refetchContracts,
    error,
  } = useQuery({
    queryKey: [
      'custom-sbt-contracts',
      { sessionAddress, masaAddress, masaNetwork, persist: false },
    ],
    enabled: !!hasSession && !!sessionAddress && !!masaAddress && !!masaNetwork,
    context: MasaQueryClientContext,
    queryFn: getContractsAsync,
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

// NEXT: refactor this function
export const fetchCustomSBTs = async (
  customContracts: FullContract[]
): Promise<HydratatedContracts[]> => {
  const hydratatedContractsPromises = customContracts.map(
    async (contract: FullContract) => {
      if (!contract.contract) return null;

      try {
        const tokens: Token[] = await contract.list();

        // Fetch metadata for all tokens concurrently if the getMetadata method exists
        const tokensWithMetadataPromises = contract.getMetadata
          ? tokens.map(async (token: Token) => {
              try {
                const metadata = await contract.getMetadata(token);
                return { metadata, ...token } as TokenWithMetadata;
              } catch (error) {
                console.log('METADATA ERROR', error);
                return null;
              }
            })
          : [];

        let tokensWithMetadata = await Promise.all(tokensWithMetadataPromises);
        tokensWithMetadata = tokensWithMetadata.filter(
          Boolean
        ) as TokenWithMetadata[];

        return {
          ...contract,
          tokens: tokensWithMetadata,
        } as HydratatedContracts;
      } catch (error) {
        console.log('LIST TOKENS ERROR', error);
        return null;
      }
    }
  );

  const hydratatedContracts = (
    await Promise.all(hydratatedContractsPromises)
  ).filter(Boolean) as HydratatedContracts[];
  return hydratatedContracts;
};

export const useCustomSBTs = () => {
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
      {
        sessionAddress,
        masaAddress,
        masaNetwork,
        customContracts: customContracts?.length ?? 0,
        persist: false,
      },
    ],
    enabled: !!hasSession && !!sessionAddress && !!masaAddress && !!masaNetwork,
    context: MasaQueryClientContext,
    queryFn: getCustomContracts,
  });

  const invalidateCustomSBTs = useCallback(
    async () => queryClient.invalidateQueries(['custom-sbt']),
    [queryClient]
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
