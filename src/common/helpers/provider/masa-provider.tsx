import { MasaContextProvider, MasaContextProviderProps } from './masa-context';
import React from 'react';

import { MasaInterface } from '../../components/masa-interface';
import { useMetamask } from './use-metamask';

import '../../../../styles.scss';

export const MasaProvider = ({
  children,
  ...rest
}: MasaContextProviderProps) => {
  console.log('REST NO WALLET', rest.noWallet);

  useMetamask({ disable: rest.noWallet });

  return (
    <MasaContextProvider {...rest}>
      <MasaInterface disable={rest.noWallet} />
      {children}
    </MasaContextProvider>
  );
};
