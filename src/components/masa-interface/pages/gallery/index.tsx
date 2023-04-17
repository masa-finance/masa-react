import { useMasa } from '../../../../provider';
import React, { useEffect, useMemo, useState } from 'react';
import { InterfaceSubflow } from '../../interface-subflow';
import { AddSBT } from './add-sbt';
import { Gallery, Tabs } from './gallery';
import { GalleryItem } from './galleryItem';
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

const handleRender = (SBT: any) => {
  const getMetadata = () => {
    if (SBT.metadata) {
      return SBT.metadata;
    } else {
      if (SBT.tokenId) {
        return {
          image: SBT.tokenUri,
        };
      }
    }
  };

  const metadata = getMetadata();
  return (
    <GalleryItem
      image={metadata.image}
      title={metadata.name}
      description={metadata.description}
      key={metadata.image}
    />
  );
};

const useCustomGallerySBT = (): any[] => {
  const { customGallerySBT, masa } = useMasa();
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

const useTabs = () => {
  const savedSbtContracts = useSavedSbts('masa-gallery-sbt-');
  const savedBadgeContracts = useSavedSbts('masa-gallery-badge-');
  const customContracts = useCustomGallerySBT();

  const [savedTabs, setSavedTabs] = useState<any[]>();
  const [savedBadges, setSavedBadges] = useState<Tabs>();

  useEffect(() => {
    (async () => {
      const contracts = [...customContracts, ...savedSbtContracts];
      const newTabs: any[] = [];
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
        newTabs.push({
          items: hidratatedTokens.length ? hidratatedTokens : tokens,
          render: (item) => handleRender(item),
          content: function () {
            return this?.items?.map((item) => this.render(item));
          },
          title: contract.name,
        });
      }

      setSavedTabs(newTabs);
    })();
  }, [savedSbtContracts, customContracts]);

  useEffect(() => {
    (async () => {
      if (!savedBadgeContracts) return [];
      const tokenList: any[] = [];
      for (const contract of savedBadgeContracts) {
        const tokens: any[] = await contract.list();
        tokenList.push(...tokens);
      }

      setSavedBadges({
        items: tokenList ?? [],
        render: (item) => handleRender(item),
        content: function () {
          //@ts-ignore
          return this?.items?.map((item) => this?.render(item));
        },
        title: 'Badges',
      });
    })();
  }, [savedBadgeContracts]);

  return { sbts: savedTabs, badges: savedBadges };
};
const useSavedSbts = (prefix): any[] => {
  const { masa } = useMasa();

  const [savedContracts, setSavedContracts] = useState<any[]>();

  const savedSBTs = useMemo(() => {
    const sbts = getLocalStorageRecordsByPrefix(prefix);
    return sbts;
  }, [prefix]);

  useEffect(() => {
    (async () => {
      const contracts: any[] = [];
      for (const sbt of savedSBTs) {
        const sbtContract = await masa?.sbt.connect(sbt.address);
        contracts.push({ ...sbtContract, ...sbt });
      }
      setSavedContracts(contracts);
    })();
  }, [savedSBTs, masa]);
  return savedContracts ?? [];
};

const GalleryContainer = () => {
  const pages = [Gallery];
  const { soulnames, greens, creditScores } = useMasa();
  const { sbts, badges } = useTabs();

  const tabs: Tabs[] = [
    {
      items: soulnames ?? [],
      render: (item) => handleRender(item),
      content: function () {
        return this?.items?.map((item) => this.render(item));
      },
      title: 'Soulnames',
    },
    {
      items: greens ?? [],
      render: (item) => handleRender(item),
      content: function () {
        return this?.items?.map((item) => this.render(item));
      },
      title: 'Masa Green',
    },
    {
      items: creditScores ?? [],
      render: (item) => handleRender(item),
      content: function () {
        return this?.items?.map((item) => this.render(item));
      },
      title: 'Masa Credit Scores',
    },
    badges ? badges : [],
    ...(sbts ?? []),
  ];

  const context = { tabs };
  return (
    <InterfaceSubflow
      pages={pages}
      context={context}
      situationalPages={{ addSbt: AddSBT }}
    />
  );
};

export { GalleryContainer as Gallery };
