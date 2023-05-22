import { useLocalStorage } from '../../use-local-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Masa, NetworkName } from '@masa-finance/masa-sdk';
import { Signer } from 'ethers';
import { useQuery } from 'react-query';
import { queryClient } from '../../masa-query-client';

function getLocalStorageRecordsByPrefix(
  prefix: string
): { name: string; address: string }[] {
  const records: any[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix)) {
      records.push(JSON.parse(localStorage.getItem(key) ?? ''));
    }
  }
  return records;
}

export const useSavedSbts = (masa, prefix): { savedContracts: any[] } => {
  const [savedContracts, setSavedContracts] = useState<any[]>([]);

  const savedSBTs = getLocalStorageRecordsByPrefix(prefix);

  useEffect(() => {
    if (masa) {
      (async () => {
        const contracts: any[] = [];
        for (const sbt of savedSBTs) {
          const sbtContract = await masa?.sbt.connect(sbt.address);
          contracts.push({ ...sbtContract, ...sbt });
        }
        setSavedContracts(contracts);
      })();
    }
  }, [masa]);

  return { savedContracts };
};

const fetchContracts = async (masa, customGallerySBT) => {
  if (customGallerySBT && customGallerySBT.length) {
    const newContracts: any[] = [];
    for (const sbt of customGallerySBT) {
      const sbtContract = await masa?.sbt.connect(sbt.address);

      const contractObject = { ...sbtContract, ...sbt };

      newContracts.push(contractObject);
    }
    return newContracts;
  } else {
    return [];
  }
};

export const useCustomGallerySBT = ({
  masa,
  walletAddress,
  customGallerySBT,
}) => {
  const { localStorageSet } = useLocalStorage();

  const handleAddSBT = useCallback((isCollection, name, address) => {
    localStorageSet(`masa-gallery-${isCollection ? 'sbt' : 'badge'}-${name}`, {
      address,
      name,
    });
  }, []);

  const queryKey: (string | NetworkName | undefined)[] = useMemo(() => {
    return getCustomSBTsContractsQueryKey({ masa, walletAddress });
  }, [walletAddress, masa, customGallerySBT]);

  const {
    data: contracts,
    status,
    isLoading,
    isFetching,
    refetch: refetchContracts,
    error,
  } = useQuery(queryKey, () => fetchContracts(masa, customGallerySBT), {
    enabled: !!masa && !!walletAddress && !!customGallerySBT?.length,
    retry: false,
    onSuccess: (customSBTs) => {
      if (masa?.config.verbose) {
        console.info('fetchCustomSBTs', customSBTs);
      }
    },
  });

  return {
    customContracts: contracts ?? [],
    status,
    isLoading,
    isFetching,
    handleAddSBT,
    error,
    refetchContracts,
  };
};

export const fetchCustomSBTs = async (customContracts) => {
  const contracts = customContracts;
  const hidratatedContracts: any[] = [];

  for (const contract of contracts) {
    if (!contract.sbtContract) continue;
    const hidratatedTokens: any[] = [];

    try {
      const tokens: any[] = await contract.list();

      if (contract.getMetadata) {
        for (const token of tokens) {
          try {
            const metadata = await contract.getMetadata(token);
            hidratatedTokens.push({ metadata, ...token });
          } catch (e) {
            console.log('METADTA ERROR', e);
          }
        }
      }
    } catch (e) {
      console.log('LIST TOKENS ERROR', e);
    }

    hidratatedContracts.push({ ...contract, tokens: hidratatedTokens });
  }

  return hidratatedContracts;
};

export const useCustomSBTsQuery = ({
  masa,
  walletAddress,
  customContracts,
}: {
  masa?: Masa;
  walletAddress?: string;
  customContracts?: any[];
}) => {
  const queryKey: (string | NetworkName | undefined)[] = useMemo(() => {
    return getCustomSBTsQueryKey({ masa, walletAddress });
  }, [walletAddress, masa, customContracts]);

  const {
    data: customSBTs,
    status,
    isLoading,
    isFetching,
    refetch: reloadCustomSBTs,
    error,
  } = useQuery(queryKey, () => fetchCustomSBTs(customContracts), {
    enabled: !!masa && !!walletAddress && !!customContracts?.length,
    retry: false,
    onSuccess: (customSBTs) => {
      if (masa?.config.verbose) {
        console.info('fetchCustomSBTs', customSBTs);
      }
    },
  });

  const invalidateCustomSBTs = useCallback(
    async () => await queryClient.invalidateQueries(['custom-sbt']),
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

export const getCustomSBTsQueryKey = ({
  masa,
  walletAddress,
}: {
  masa?: Masa;
  signer?: Signer; // unused
  walletAddress?: string; // unused
}) => {
  return ['custom-sbt', walletAddress, masa?.config.networkName];
};

export const getCustomSBTsContractsQueryKey = ({
  masa,
  walletAddress,
}: {
  masa?: Masa;
  signer?: Signer; // unused
  walletAddress?: string; // unused
}) => {
  return ['custom-sbt-contracts', walletAddress, masa?.config.networkName];
};

export const useCustomSBT = ({ masa, customContracts, walletAddress }) => {
  // const { savedContracts: savedBadgeContracts } = useSavedSbts(
  //   masa,
  //   'masa-gallery-badge-'
  // );

  const {
    customSBTs,
    status,
    isLoading,
    isFetching,
    reloadCustomSBTs,
    invalidateCustomSBTs,
    error,
  } = useCustomSBTsQuery({ customContracts, masa, walletAddress });

  return {
    customSBTs,
    status,
    isLoading: isLoading || isFetching,
    isFetching,
    reloadCustomSBTs,
    invalidateCustomSBTs,
    error,
  };
};