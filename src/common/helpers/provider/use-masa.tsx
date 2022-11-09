import { useContext } from 'react';
import { MASA_CONTEXT } from './masa-context';

export const useMasa = () => {
  return useContext(MASA_CONTEXT);
};
