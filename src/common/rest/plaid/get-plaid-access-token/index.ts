import { MethodMetadata, Parameter } from '..';
import { useRestCall } from '../../../helpers/rest-calls';

const path = '/plaid-access-token/:publicToken';

export function useMethod({ pathParameters, body }: any) {
  const { data, error, loading, getData } = useRestCall({
    pathParameters,
    headers: Headers,
    body,
    metadata,
  });
  return { data, error, loading, getData };
}

const parameters: Parameter[] = [
  {
    key: 1,
    name: 'userId',
    description: 'User ID',
    required: 'yes',
    default: '',
  },
  {
    key: 2,
    name: 'publicToken',
    description: 'Public Token',
    required: 'yes',
    default: '',
  },
];

export const metadata: MethodMetadata = {
  author: 'Aaron Knott',
  authorPicture: '',
  description: 'Exchange Plaid public token for an access token',
  name: path,
  method: 'GET',
  parameters,
};
