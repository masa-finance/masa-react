import { useMemo } from 'react';
import { useLazyAxios } from 'use-axios-client';
import { MethodMetadata, Parameter } from '..';
import { Headers, URL } from '../../helpers/axios';

const path = 'applications';

export function useMethod({pathParameters}: any) {
  const fullPath = useMemo(() => {
    let newPath = path
    if (pathParameters) {
      Object.keys(pathParameters).forEach((key) => { 
        newPath = newPath.replace(':' + key, [pathParameters[key]])
      })
    }
    return newPath
  },[pathParameters])
  const [getData, { data, error, loading }] = useLazyAxios({
    url: `${URL}${fullPath}`,
    headers: Headers
  });
  return { data, error, loading, getData };
}

const parameters: Parameter[] = [
  {
    key: 1,
    name: 'username',
    description: '32',
    required: 'yes',
    default: 'test',
  },
];

export const metadata: MethodMetadata = {
  author: 'Hide on bush',
  authorPicture: '',
  description: 'Call for getting applications',
  name: path,
  method: 'GET',
  parameters,
};
