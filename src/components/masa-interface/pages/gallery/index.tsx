import { useMasa } from '../../../../provider';
import React, { useCallback, useEffect, useState } from 'react';
import { InterfaceSubflow } from '../../interface-subflow';
import { AddSBT } from './add-sbt';
import { Gallery, Tabs } from './gallery';
import { GalleryItem } from './galleryItem';

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
  const { masa, badges, customSBTs } = useMasa();

  const [savedBadges, setSavedBadges] = useState<Tabs>();
  const [savedTabs, setSavedTabs] = useState<Tabs[]>();

  const getTabs = useCallback(async () => {
    if (!customSBTs || (customSBTs && customSBTs.length === 0)) return;

    const newTabs: Tabs[] = [];
    for (const customSBT of customSBTs) {
      if (customSBT.tokens && customSBT.tokens.length === 0) continue; // Skip when no tokens

      const tokens = customSBT.tokens;
      const hidratatedTokens: any[] = [];
      for (const token of tokens) {
        try {
          const metadata = await customSBT.getMetadata(token);
          hidratatedTokens.push({ metadata, ...token });
        } catch (e) {
          console.log('METADTA ERROR', e);
        }
      }

      const tabContent = {
        items: hidratatedTokens.length ? hidratatedTokens : tokens,
        render: (item) => handleRender(item),
        content: function () {
          return this?.items?.map((item) => this.render(item));
        },
        title: customSBT.name,
      };
      newTabs.push(tabContent);
    }

    setSavedTabs(newTabs as any);
  }, [customSBTs]);

  useEffect(() => {
    if (masa) {
      getTabs();
    }
  }, [masa, getTabs]);

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

  const tabs: Tabs[] = [
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
    <>
      <InterfaceSubflow
        pages={pages}
        context={context}
        situationalPages={{ addSbt: AddSBT }}
      />
    </>
  );
};

export { GalleryContainer as Gallery };
