import React, { useMemo } from 'react';
import * as masaRestClient from '../../rest';
import { AuthProvider } from '../auth-provider';
import { MasaToolsWrapper } from '../masa-tools-wrapper';

export function RestTester() {
  console.log(masaRestClient);

  // @ts-ignore
  const methods = useMemo(() => {
    const methodList = [];
    for (const key in masaRestClient) {
      //@ts-ignore
      methodList.push(masaRestClient[key]);
    }

    return methodList;
  }, []);
  return (
    <AuthProvider>
      <MasaToolsWrapper>
        <p>Unavailable</p>
      </MasaToolsWrapper>
    </AuthProvider>
  );
}
