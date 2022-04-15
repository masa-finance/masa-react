import { MethodMetadata, Parameter } from '..';
import { useRestCall } from '../../../helpers/rest-calls';
import { Headers } from '../../../helpers/axios';

const path = 'plaid-accounts/:userId';

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
];

export const metadata: MethodMetadata = {
  author: 'Aaron Knott',
  authorPicture: '',
  description: "Get a list of a user's Plaid accounts",
  name: path,
  method: 'GET',
  parameters,
};
