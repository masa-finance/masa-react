import { MasaContextProvider } from './masa-context';
import React from 'react';

import { MasaInterface } from '../../components/masa-interface';
import { useMetamask } from './use-metamask';

import '../../../../styles.scss';

export const MasaProvider = ({ children, ...rest }: any) => {
  useMetamask();
  return (
    <MasaContextProvider {...rest}>
      <MasaInterface />
      {children}
    </MasaContextProvider>
  );
};
