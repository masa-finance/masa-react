import { useContext } from 'react';
import { MASA_CONTEXT, MasaShape } from './masa-context';

export const useMasa = (): MasaShape => {
  return useContext<MasaShape>(MASA_CONTEXT);
};
