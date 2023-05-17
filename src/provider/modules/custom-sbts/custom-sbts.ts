import { useLocalStorage } from '../../../provider/use-local-storage';
import { useCallback, useEffect, useState } from 'react';

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

export const useCustomGallerySBT = (
  masa,
  customGallerySBT
): {
  customContracts: any[];
  handleAddSBT: (isCollection: boolean, name: string, address: string) => void;
} => {
  const { localStorageSet } = useLocalStorage();

  const [contracts, setContracts] = useState<any[]>([]);

  const handleAddSBT = useCallback((isCollection, name, address) => {
    localStorageSet(`masa-gallery-${isCollection ? 'sbt' : 'badge'}-${name}`, {
      address,
      name,
    });
  }, []);

  useEffect(() => {
    if (masa) {
      (async () => {
        if (customGallerySBT && customGallerySBT.length) {
          const contracts: any[] = [];
          for (const sbt of customGallerySBT) {
            const sbtContract = await masa?.sbt.connect(sbt.address);
            contracts.push({ ...sbtContract, ...sbt });
          }
          setContracts(contracts);
        }
      })();
    }
  }, [customGallerySBT, masa]);

  return { customContracts: contracts, handleAddSBT };
};

export const useCustomSBT = (masa, customContracts) => {
  const { savedContracts: savedBadgeContracts } = useSavedSbts(
    masa,
    'masa-gallery-badge-'
  );
  const [hidratatedSBTs, setHidratatedSBTs] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);

  useEffect(() => {
    if (masa) {
      (async () => {
        if (!savedBadgeContracts) return [];
        const tokenList: any[] = [];

        for (const contract of savedBadgeContracts) {
          if (!contract.list) continue;

          const tokens: any[] = await contract.list();

          tokenList.push(
            ...tokens.map((t) => ({
              ...t,
              metadata: { name: contract.name, image: t.tokenUri },
            }))
          );
        }

        return setBadges(tokenList);
      })();
    }
  }, [masa, savedBadgeContracts]);

  useEffect(() => {
    if (masa) {
      (async () => {
        const contracts = customContracts;
        const hidratatedContracts: any[] = [];
        for (const contract of contracts) {
          if (!contract.list) continue;
          const tokens: any[] = await contract.list();
          const hidratatedTokens: any[] = [];
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

          hidratatedContracts.push({ ...contract, tokens: hidratatedTokens });
        }
        setHidratatedSBTs(hidratatedContracts);
      })();
    }
  }, [masa, customContracts]);

  return { customSBTs: hidratatedSBTs, badges };
};
