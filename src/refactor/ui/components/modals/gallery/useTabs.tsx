import { BigNumber } from 'ethers';
import React, { useCallback, useEffect, useState } from 'react';
import {
  GalleryMetadata,
  TabsInterface,
} from '../../../../../components/masa-interface/pages/gallery/gallery';
import { GalleryItem } from '../../../../../components/masa-interface/pages/gallery/galleryItem';
import { useMasaClient } from '../../../../masa-client';
import { useCustomSBTs } from '../../../../masa/use-custom-sbt';

export const handleRender = (SBT: {
  metadata: GalleryMetadata;
  tokenId: BigNumber;
  tokenUri: string;
}) => {
  const metadata = SBT?.metadata ?? SBT?.tokenUri ?? {};

  return (
    <GalleryItem
      image={metadata.image}
      title={metadata.name}
      description={metadata.description}
      key={metadata?.tokenURI ?? 'gallery-item'}
    />
  );
};

export const useTabs = () => {
  const { customSBTs, isLoading } = useCustomSBTs();
  const { sdk: masa } = useMasaClient();

  const [savedTabs, setSavedTabs] = useState<TabsInterface[]>();

  const getTabs = useCallback(async () => {
    if (!customSBTs || (customSBTs && customSBTs.length === 0)) return;

    const newTabs: TabsInterface[] = [];
    for (const customSBT of customSBTs) {
      // eslint-disable-next-line no-continue
      if (customSBT.tokens && customSBT?.tokens.length === 0) continue; // Skip when no tokens

      const { tokens } = customSBT;
      const hidratatedTokens: {
        tokenId: BigNumber;
        tokenUri: string;
        metadata: GalleryMetadata;
      }[] = [];
      for (const token of tokens) {
        try {
          // eslint-disable-next-line no-await-in-loop
          // const metadata = await customSBT.getMetadata(token);
          const hidratatedToken = { ...token };
          hidratatedTokens.push(hidratatedToken);
        } catch (error) {
          console.log('METADTA ERROR', error);
        }
      }

      const tabContent = {
        items: hidratatedTokens.length > 0 ? hidratatedTokens : [],
        render: (item: {
          metadata: GalleryMetadata;
          tokenId: BigNumber;
          tokenUri: string;
        }) => handleRender(item),
        content(): React.JSX.Element[] {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
          return this?.items?.map((item) => this.render(item));
        },
        title: customSBT.name,
      };
      newTabs.push(tabContent);
    }

    setSavedTabs(newTabs);
  }, [customSBTs]);

  useEffect(() => {
    if (masa) {
      void getTabs();
    }
  }, [masa, getTabs]);

  return { sbts: savedTabs, isLoading };
};
