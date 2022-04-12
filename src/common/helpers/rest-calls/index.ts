import { useMemo } from 'react';
import { useLazyAxios } from 'use-axios-client';
import { MethodMetadata } from '../../rest';
import { URL } from '../axios';

export interface RestCallProps {
  pathParameters: string[];
  metadata: MethodMetadata;
  headers?: any;
  body?: any;
}
export const useRestCall = ({
  pathParameters,
  metadata,
  headers,
  body,
}: RestCallProps) => {
  const fullPath = useMemo(() => {
    let newPath = metadata.name;
    if (pathParameters) {
      Object.keys(pathParameters).forEach((key) => {
        newPath = newPath.replace(':' + key, [pathParameters[key]]);
      });
    }
    return newPath;
  }, [pathParameters]);
  console.log(fullPath)
  const [getData, { data, error, loading }] = useLazyAxios({
    url: `${URL}${fullPath}`,
    headers,
    method: metadata.method,
    data: body,
  });
  return { data, error, loading, getData };
};
