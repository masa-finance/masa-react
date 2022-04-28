import { useMemo } from 'react';
import { useLazyAxios } from 'use-axios-client';
import { MethodMetadata } from '../../rest';
import { URL } from '../axios';
import { useToken } from '../get-token';

export interface RestCallProps {
  pathParameters?: string[];
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
        //@ts-ignore
        newPath = newPath.replace(':' + key, [pathParameters[key]]);
      });
    }
    return newPath;
  }, [pathParameters]);

  const { token, isLoading } = useToken();

  const [getData, { data, error, loading, refetch }] = useLazyAxios({
    url: token ? `${URL}${fullPath}` : undefined,
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    method: metadata.method,
    data: body,
  });
  return { data, error, loading: loading || isLoading, getData, refetch };
};
