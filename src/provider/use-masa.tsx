import { useContext } from 'react';
import { MasaContext } from './masa-context';
import { MasaShape } from './masa-shape';

export const useMasa = (): MasaShape => useContext<MasaShape>(MasaContext);
