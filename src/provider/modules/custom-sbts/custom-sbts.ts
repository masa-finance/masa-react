import { useLocalStorage } from '../../../provider/use-local-storage';
import { useCallback, useEffect, useState } from 'react';

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
  const [hidratatedSBTs, setHidratatedSBTs] = useState<any[]>([]);

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

  return { customSBTs: hidratatedSBTs };
};
