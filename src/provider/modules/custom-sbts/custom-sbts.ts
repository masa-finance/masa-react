import { useEffect, useState } from 'react';

export const useCustomGallerySBT = (masa, customGallerySBT): any[] => {
  const [contracts, setContracts] = useState<any[]>();

  useEffect(() => {
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
  }, [customGallerySBT, masa]);

  return contracts ?? [];
};

export const useCustomSBT = (masa, customContracts) => {
  const [hidratatedSBTs, setHidratatedSBTs] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const contracts = customContracts;
      const hidratatedContracts: any[] = [];
      for (const contract of contracts) {
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
  }, [masa]);

  return hidratatedSBTs;
};
