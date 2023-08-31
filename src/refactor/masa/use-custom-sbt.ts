import { useQuery } from '@tanstack/react-query';

import { useAsyncFn } from 'react-use';
import { useMemo } from 'react';
import { MasaQueryClientContext, useMasaClient } from '../masa-client';
import { useConfig } from '../base-provider';
import { useCanQuery } from '../hooks/use-can-query';
import { useSession } from './use-session';
import type {
  CustomGallerySBT,
  FullContract,
  FullContractWithTokens,
  HydratedContract,
  Token,
  TokenWithMetadata,
} from './interfaces';

export const useCustomGallerySBT = () => {
  const { masaAddress, masaNetwork, sdk: masa } = useMasaClient();
  const canQuery = useCanQuery();

  const { customSBTs } = useConfig();

  const { hasSession, sessionAddress } = useSession();
  const [, getContractsAsync] = useAsyncFn(async () => {
    if (!canQuery) return null;
    // const result = await fetchContracts(masa, customSBTs);

    if (!masa || !customSBTs || customSBTs.length === 0) return [];

    const filteredSBTs = customSBTs.filter(
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

export const fetchContractsAndTokens = async (
  customContracts: FullContract[]
): Promise<FullContractWithTokens[]> => {
  const contractPromises = customContracts.map(
    async (contract: FullContract) => {
      if (contract.contract) {
        try {
          const tokens: Token[] = await contract.list();
          return {
            ...contract,
            tokens,
          } as FullContractWithTokens;
        } catch (error) {
          console.log('LIST TOKENS ERROR', error);
        }
      }
      return null;
    }
  );
  const contractsAndTokens = await Promise.all(contractPromises);

  return contractsAndTokens.filter(Boolean) as FullContractWithTokens[];
};

export const hydrateTokensWithMetadata = async (
  contractsAndTokens: FullContractWithTokens[]
): Promise<HydratedContract[]> => {
  const contractPromises = contractsAndTokens.map(
    async (contract: FullContractWithTokens) => {
      if (!contract.getMetadata) {
        return { ...contract, tokens: [] };
      }

      const tokenPromises = contract.tokens.map(async (token: Token) => {
        try {
          const metadata = await contract.getMetadata(token);
          return { metadata, ...token };
        } catch (error) {
          console.log('METADATA ERROR', error);
          return null;
        }
      });

      const hydratedTokens = (await Promise.all(tokenPromises)).filter(
        Boolean
      ) as TokenWithMetadata[];
      return { ...contract, tokens: hydratedTokens } as HydratedContract;
    }
  );

  const hydratedContracts = (await Promise.all(
    contractPromises
  )) as HydratedContract[];

  return hydratedContracts;
};

export const useCustomSBTs = () => {
  const { masaAddress, masaNetwork } = useMasaClient();
  const canQuery = useCanQuery();
  const { customContracts } = useCustomGallerySBT();

  const { hasSession, sessionAddress } = useSession();

  const [, getCustomContracts] = useAsyncFn(async () => {
    if (!canQuery) return null;

    const contractsAndTokens = await fetchContractsAndTokens(customContracts);
    const hydratedContracts =
      await hydrateTokensWithMetadata(contractsAndTokens);

    return hydratedContracts;
  }, [canQuery, customContracts]);

  const contracts = useMemo(
    () => customContracts.map((contract: FullContract) => contract.address),
    [customContracts]
  );

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
        contracts,
        persist: false,
      },
    ],
    enabled: !!hasSession && !!sessionAddress && !!masaAddress && !!masaNetwork,
    context: MasaQueryClientContext,
    queryFn: getCustomContracts,
  });

  return {
    customSBTs,
    status,
    isLoading,
    isFetching,
    reloadCustomSBTs,
    error,
  };
};
