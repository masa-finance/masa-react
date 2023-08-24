import { BigNumber } from 'ethers';
import React, { useEffect, useState } from 'react';
import { useAsyncFn } from 'react-use';
import { GalleryItem } from '../../../../../components/masa-interface/pages/gallery/galleryItem';
import { useMasaClient } from '../../../../masa-client';
import { useCustomSBTs } from '../../../../masa/use-custom-sbt';
import {
  GalleryMetadata,
  HydratatedContracts,
  TabsInterface,
  TokenWithMetadata,
} from '../../../../masa';

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

    const customSBTsWithTokens = customSBTs.filter(
      (contract: HydratatedContracts) =>
        contract.tokens && contract.tokens.length > 0
    );

    const newTabs: TabsInterface[] = customSBTsWithTokens.map(
      (customSBT: HydratatedContracts) => {
        const { tokens } = customSBT;

        const items = tokens.map((token: TokenWithMetadata) => {
          const metadata = (token?.metadata ?? {
            image: token?.tokenUri,
            name: '',
            description: '',
          }) as GalleryMetadata;
          return {
            image: metadata.image,
            title: metadata.name,
            description: metadata.description,
          };
        });

        return {
          title: customSBT.name,
          items,
        };
      }
    );

    setSavedTabs(newTabs);
  }, [customSBTs]);

  useEffect(() => {
    if (masa) {
      void getTabs();
    }
  }, [masa, getTabs]);

  return { tabs: savedTabs, isLoading };
};
