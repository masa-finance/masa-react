import { useContext, useMemo } from 'react';
import { useAxios, useLazyAxios } from 'use-axios-client';
import { MethodMetadata } from '../../rest';
import { URL } from '../axios';
import { useToken } from '../get-token';
import { useMutation, useQuery } from 'react-query';
import { MASA_TOOLS_CONTEXT } from '../provider';

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
  }, [pathParameters, metadata]);

  const { token, isLoading } = useToken();
  const { apiURL } = useContext(MASA_TOOLS_CONTEXT);

  const [getData, { data, error, loading }] = useLazyAxios({
    url: token ? `${URL(apiURL)}${fullPath}` : undefined,
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    method: metadata.method,
    data: body,
  });

  return {
    data,
    error,
    loading: loading || isLoading,
    getData,
  };
};

export const useSimpleRestCall = ({
  pathParameters,
  metadata,
  headers,
  body,
}: RestCallProps) => {
  const { apiURL } = useContext(MASA_TOOLS_CONTEXT);

  const fullPath = useMemo(() => {
    let newPath = metadata.name;
    if (pathParameters) {
      Object.keys(pathParameters).forEach((key) => {
        //@ts-ignore
        newPath = newPath.replace(':' + key, [pathParameters[key]]);
      });
    }
    return newPath;
  }, [pathParameters, metadata]);

  const { token, isLoading } = useToken();

  const axiosData = useAxios({
    url: token ? `${URL(apiURL)}${fullPath}` : undefined,
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    method: metadata.method,
    data: body,
  });

  return { ...axiosData, loading: axiosData.loading || isLoading };
};

export const useMasaQuery = (
  name: string,
  { pathParameters, metadata, headers, body }: RestCallProps,
  settings?: any
) => {
  const { apiURL } = useContext(MASA_TOOLS_CONTEXT);

  const fullPath = useMemo(() => {
    let newPath = metadata.name;
    if (pathParameters) {
      Object.keys(pathParameters).forEach((key) => {
        //@ts-ignore
        newPath = newPath.replace(':' + key, [pathParameters[key]]);
      });
    }
    return newPath;
  }, [pathParameters, metadata]);

  const { token } = useToken();

  const query = useQuery(
    name,
    () =>
      fetch(`${URL(apiURL)}${fullPath}`, {
        headers: {
          ...headers,
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        credentials: "include",
        method: metadata.method,
        mode: 'cors',
        body: JSON.stringify(body),
      })
        .then(async (res) => {
          //@ts-ignore
          if (!res.ok) {
            console.log('NOT OK');
          }
          if (res.status > 399) {
            throw new Error("ERR");
          }
          return res.json();
        })
        .catch((err) => {
          throw new Error(err);
        }),
    {
      ...settings,
      enabled: process.env.REACT_APP_SOULBOUND
        ? !!settings?.enabled
        : !token
        ? false
        : !!settings?.enabled,
    }
  );

  return query;
};

export const useMasaMutation = (
  name: string,
  { pathParameters, metadata, headers, body }: RestCallProps,
  settings?: any
) => {
  const { apiURL } = useContext(MASA_TOOLS_CONTEXT);

  const fullPath = useMemo(() => {
    let newPath = metadata.name;
    if (pathParameters) {
      Object.keys(pathParameters).forEach((key) => {
        //@ts-ignore
        newPath = newPath.replace(':' + key, [pathParameters[key]]);
      });
    }
    return newPath;
  }, [pathParameters, metadata]);

  const { token } = useToken();

  const query = useMutation(
    name,
    (newBody: any) =>
      fetch(`${URL(apiURL)}${fullPath}`, {
        headers: {
          ...headers,
          Authorization: token ? `Bearer ${token}` : undefined,
          'Content-Type': 'application/json',
        },
        method: metadata.method,
        mode: 'cors',
        body: JSON.stringify(newBody ? newBody : body),
      }).then((res) => res.json()),
    {
      ...settings,
      enabled: process.env.REACT_APP_SOULBOUND
        ? !!settings?.enabled
        : !token
        ? false
        : !!settings?.enabled,
    }
  );

  return query;
};
