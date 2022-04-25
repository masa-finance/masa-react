import { List } from 'antd';
import React, { useMemo } from 'react';
import { RestMethod } from '../rest-method';
import { masaRestClient } from '../../rest';
import { AuthProvider } from '../auth-provider';
import { MasaToolsWrapper } from '../masa-tools-wrapper';
export function RestTester() {
  console.log(masaRestClient);

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
        <List
          itemLayout="horizontal"
          dataSource={methods}
          renderItem={(item) => (
            <RestMethod {...item.metadata} useMethod={item.useMethod} />
          )}
        ></List>
      </MasaToolsWrapper>
    </AuthProvider>
  );
}
