import { useContext } from 'react';
import { MASA_CONTEXT } from './masa-context';
import { MasaShape } from './masa-shape';

export const useMasa = (): MasaShape => {
  return useContext<MasaShape>(MASA_CONTEXT);
};
