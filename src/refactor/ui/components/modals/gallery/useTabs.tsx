import { BigNumber } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useAsyncFn } from 'react-use';
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

  const [, getTabs] = useAsyncFn(async () => {
    if (!customSBTs || (customSBTs && customSBTs.length === 0)) return;

    const newTabs: TabsInterface[] = [];

    const customSBTsWithTokens = customSBTs.filter(
      (contract) => contract.tokens && contract.tokens.length > 0
    );

    for (const customSBT of customSBTsWithTokens) {
      const { tokens } = customSBT;

      const tabContent = {
        items: tokens.length > 0 ? tokens : [],
        render: (item: {
          metadata: GalleryMetadata;
          tokenId: BigNumber;
          tokenUri: string;
        }) => handleRender(item),
        content(): React.JSX.Element[] {
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
