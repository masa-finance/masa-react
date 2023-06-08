import { Masa } from '@masa-finance/masa-sdk';
import { Signer } from 'ethers';
import { useMemo } from 'react';

export const useMasaSDK = ({ signer }: { signer: Signer }) => {
  const masa = useMemo(
    () =>
      new Masa({
        signer,
      }),
    [signer]
  );

  return masa;
};
