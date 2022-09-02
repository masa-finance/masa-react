import { MethodMetadata, Parameter } from '..';
import { useMasaMutation, useRestCall } from '../../helpers/rest-calls';

const path = 'session/logout';

export function useMethod({ body }: any) {
  const { data, error, loading, getData } = useRestCall({
    headers: Headers,
    metadata,
    body,
  });

  return { data, error, loading, getData };
}

export function useSimpleMethod({ pathParameters, body, settings }: any) {
  const masaQuery = useMasaMutation(
    'logout',
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

const parameters: Parameter[] = [];

export const metadata: MethodMetadata = {
  author: 'Hide on bush',
  authorPicture: '',
  description: 'Logout and remove user sesison from backend',
  name: path,
  method: 'POST',
  parameters: parameters,
};
