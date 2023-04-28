import { useMasa } from '../../../../provider';
import React, { useEffect, useState } from 'react';
import { InterfaceSubflow } from '../../interface-subflow';
import { AddSBT } from './add-sbt';
import { Gallery, Tabs } from './gallery';
import { GalleryItem } from './galleryItem';
import {
  useCustomGallerySBT,
  useSavedSbts,
} from '../../../../provider/modules/custom-sbts/custom-sbts';

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
      key={SBT.tokenURI}
    />
  );
};

const useTabs = () => {
  const { masa, customGallerySBT, badges } = useMasa();
  const { savedContracts: savedSbtContracts } = useSavedSbts(
    masa,
    'masa-gallery-sbt-'
  );

  const { customContracts } = useCustomGallerySBT(masa, customGallerySBT);

  const [savedTabs, setSavedTabs] = useState<any[]>();
  const [savedBadges, setSavedBadges] = useState<Tabs>();

  useEffect(() => {
    if (masa) {
      (async () => {
        const contracts = [...customContracts, ...savedSbtContracts];
        const newTabs: any[] = [];
        for (const contract of contracts) {
          if (!contract.list) {
            console.log('Skipping', contract);
            continue;
          }
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
    }
  }, [masa, savedSbtContracts, customContracts]);

  useEffect(() => {
    if (masa && badges?.length) {
      (async () => {
        setSavedBadges({
          items: badges ?? [],
          render: (item) => handleRender(item),
          content: function () {
            //@ts-ignore
            return this?.items?.map((item) => this?.render(item));
          },
          title: 'Badges',
        });

        return;
      })();
    }
  }, [masa, badges]);

  return { sbts: savedTabs, badges: savedBadges };
};

const GalleryContainer = () => {
  const pages = [Gallery];
  const { soulnames, greens, creditScores, useModalSize, fullScreenGallery } =
    useMasa();

  useModalSize?.(
    fullScreenGallery
      ? {
          width: window.innerWidth * 0.95,
          height: window.innerHeight * 0.95,
        }
      : { width: 1100, height: 800 }
  );

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
