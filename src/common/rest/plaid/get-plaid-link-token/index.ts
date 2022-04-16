import { MethodMetadata, Parameter } from '../..';
import { Headers } from '../../../helpers/axios';
import { useRestCall } from '../../../helpers/rest-calls';

const path = 'plaid-link-token/:clientId';

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
    name: 'clientId',
    description: 'User ID',
    required: 'yes',
    default: '',
  },
];

export const metadata: MethodMetadata = {
  author: 'Aaron Knott',
  authorPicture: '',
  description: 'Get a link token from Plaid',
  name: path,
  method: 'GET',
  parameters,
};
