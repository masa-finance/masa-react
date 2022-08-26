import { MethodMetadata, Parameter } from '..';
import { useMasaQuery } from '../../helpers/rest-calls';

const path = 'sbt/:profileId';

export function useSimpleMethod({ pathParameters, body, settings }: any) {
  const masaQuery = useMasaQuery(
    'get-identity',
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
  description: 'Gets user identity',
  name: path,
  method: 'GET',
  parameters: parameters,
};
