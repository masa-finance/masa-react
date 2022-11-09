import { MasaContextProvider } from './masa-context';
import React from 'react';

import { MasaInterface } from '../../components/masa-interface';
import { useMetamask } from './use-metamask';

import '../../../../tailwind.css';
import 'antd/dist/antd.css';

export const MasaProvider = ({ children }: any) => {
  useMetamask();
  return (
    <MasaContextProvider>
      <MasaInterface />
      {children}
    </MasaContextProvider>
  );
};
