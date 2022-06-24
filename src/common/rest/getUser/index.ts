import { MethodMetadata } from '..';
import { Headers } from '../../helpers/axios';
import { useMasaQuery, useRestCall } from '../../helpers/rest-calls';

const path = 'me';

export function useMethod() {
  const { data, error, loading, getData } = useRestCall({
    headers: Headers,
    metadata,
  });
  return { data, error, loading, getData };
}

export function useSimpleMethod({ pathParameters, body, settings }: any) {
  const masaQuery = useMasaQuery(
    'get-user',
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
  author: 'Gabriela Golmar',
  authorPicture: '',
  description: 'Retrieve user with id given in the URL',
  name: path,
  method: 'GET',
  parameters: [],
};
