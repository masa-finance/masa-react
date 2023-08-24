import React, { useCallback, useEffect, useState } from 'react';
import { useMasa } from '../../../../provider';
import { InterfaceSubflow } from '../../interface-subflow';
import { AddSBT } from './add-sbt';
import { Gallery } from './gallery';
import { GalleryItem } from './galleryItem';
import { BigNumber } from 'ethers';
import { TabsInterface } from '../../../../refactor/masa/interfaces';

const handleRender = (SBT: any) => {
  const getMetadata = () => {
    if (SBT.metadata) {
      return SBT.metadata;
    }
    if (SBT.tokenId) {
      return {
        image: SBT.tokenUri,
      };
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
  const { masa, customSBTs } = useMasa();

  const [savedTabs, setSavedTabs] = useState<TabsInterface[]>();

  const getTabs = useCallback(async () => {
    if (!customSBTs || (customSBTs && customSBTs.length === 0)) return;

    const newTabs: TabsInterface[] = [];
    for (const customSBT of customSBTs) {
      if (customSBT.tokens && customSBT.tokens.length === 0) continue; // Skip when no tokens

      const { tokens } = customSBT;
      const hidratatedTokens: {
        tokenId: BigNumber;
        tokenUri: string;
        metadata: {
          image: string;
          name: string;
          description: string;
        };
      }[] = [];
      for (const token of tokens) {
        try {
          const metadata = await customSBT.getMetadata(token);

          const hydratedToken = {
            tokenId: token.tokenId,
            tokenUri: token.tokenUri,
            metadata: {
              image: metadata.image,
              name: metadata.name,
              description: metadata.description,
            },
          };

          hidratatedTokens.push(hydratedToken);
        } catch (error) {
          console.log('METADTA ERROR', error);
        }
      }

      const tabContent = {
        items: hidratatedTokens.length > 0 ? hidratatedTokens : tokens,
        render: (item) => handleRender(item),
        content() {
          return this?.items?.map((item) => this.render(item));
        },
        title: customSBT.name,
      };
      newTabs.push(tabContent as any);
    }

    setSavedTabs(newTabs as any);
  }, [customSBTs]);

  useEffect(() => {
    if (masa) {
      getTabs();
    }
  }, [masa, getTabs]);

  return { sbts: savedTabs };
};

const GalleryContainer = () => {
  const pages = [Gallery];
  const { useModalSize, fullScreenGallery } = useMasa();

  useModalSize?.(
    typeof window !== 'undefined' && fullScreenGallery
      ? {
          width: window.innerWidth * 0.95,
          height: window.innerHeight * 0.95,
        }
      : { width: 1100, height: 800 }
  );

  const { sbts } = useTabs();

  const tabs: TabsInterface[] = [
    // {
    //   items: soulnames ?? [],
    //   render: (item) => handleRender(item),
    //   content: function () {
    //     return this?.items?.map((item) => this.render(item));
    //   },
    //   title: 'Soulnames',
    // },
    // {
    //   items: greens ?? [],
    //   render: (item) => handleRender(item),
    //   content: function () {
    //     return this?.items?.map((item) => this.render(item));
    //   },
    //   title: 'Masa Green',
    // },
    // {
    //   items: creditScores ?? [],
    //   render: (item) => handleRender(item),
    //   content: function () {
    //     return this?.items?.map((item) => this.render(item));
    //   },
    //   title: 'Masa Credit Scores',
    // },
  ];

  // if (badges) tabs.push(badges);
  if (sbts && sbts.length > 0) tabs.push(...sbts);

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
