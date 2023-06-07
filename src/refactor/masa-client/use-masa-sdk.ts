import { Masa } from '@masa-finance/masa-sdk';
import { useMemo } from 'react';

export const useMasa = ({ signer }) => {
  const masa = useMemo(() => new Masa({
      signer,
    }), [signer]);

  return masa;
};
