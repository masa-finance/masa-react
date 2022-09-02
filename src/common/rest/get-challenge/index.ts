import { MethodMetadata } from '..';
import { Headers } from '../../helpers/axios';
import { useMasaQuery, useRestCall } from '../../helpers/rest-calls';

const path = 'session/get-challenge';

export function useMethod() {
  const { data, error, loading, getData } = useRestCall({
    headers: Headers,
    metadata,
  });
  return { data, error, loading, getData };
}

export function useSimpleMethod({ pathParameters, body, settings }: any) {
  const masaQuery = useMasaQuery(
    'get-challenge',
    {
      pathParameters,
      headers: Headers,
      body,
      metadata,
    },
    settings
  );
  return masaQuery;
}

export const metadata: MethodMetadata = {
  author: 'Hide on bush',
  authorPicture: '',
  description: 'Get challenge',
  name: path,
  method: 'GET',
  parameters: [],
};
