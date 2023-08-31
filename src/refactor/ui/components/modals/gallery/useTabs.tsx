import { useMemo } from 'react';
import { useMasaClient } from '../../../../masa-client';
import { useCustomSBTs } from '../../../../masa/use-custom-sbt';
import {
  GalleryMetadata,
  HydratedContracts,
  TabsInterface,
  TokenWithMetadata,
} from '../../../../masa/interfaces';

export const useTabs = () => {
  const { customSBTs, isLoading } = useCustomSBTs();
  const { sdk: masa } = useMasaClient();

  const savedTabs = useMemo((): TabsInterface[] => {
    if (!masa || !customSBTs || (customSBTs && customSBTs.length === 0))
      return [];

    const customSBTsWithTokens = customSBTs.filter(
      (contract: HydratedContracts) =>
        contract.tokens && contract.tokens.length > 0
    );

    const newTabs: TabsInterface[] = customSBTsWithTokens.map(
      (customSBT: HydratedContracts) => {
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

    return newTabs;
  }, [masa, customSBTs]);

  return { tabs: savedTabs, isLoading };
};
