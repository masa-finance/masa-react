import { MethodMetadata, Parameter } from '..';
import { useMasaMutation, useRestCall } from '../../helpers/rest-calls';

const path = 'session/check-signature';

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
    'check-challenge-signature',
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

const parameters: Parameter[] = [
  {
    key: 1,
    name: 'signature',
    description: 'Challenge signature',
    required: 'yes',
    default: '',
    dataType: 'string',
  },
  {
    key: 2,
    name: 'address',
    description: 'User address',
    required: 'yes',
    default: '',
    dataType: 'string',
  },
];

export const metadata: MethodMetadata = {
  author: 'Hide on bush',
  authorPicture: '',
  description: 'Send signed challenge to backend for authentication',
  name: path,
  method: 'POST',
  parameters: parameters,
};
