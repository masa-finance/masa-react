import { MethodMetadata, Parameter } from '..';
import { useMasaMutation, useRestCall } from '../../helpers/rest-calls';

const path = 'storage/store';

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
    'store-metadata',
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
    name: 'soulname',
    description: 'Soulname',
    required: 'yes',
    default: 'Identity',
    dataType: 'string',
  },
];

export const metadata: MethodMetadata = {
  author: 'Hide on bush',
  authorPicture: '',
  description: 'Stores metadata in arweave',
  name: path,
  method: 'POST',
  parameters: parameters,
};
