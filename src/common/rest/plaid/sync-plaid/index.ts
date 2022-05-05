import { MethodMetadata, Parameter } from '../..';
import { useRestCall } from '../../../helpers/rest-calls';
import { Headers } from '../../../helpers/axios';

const path = 'sync-plaid/:userId/?publicToken=:publicToken';

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
    dataType: 'string',
  },
  {
    key: 2,
    name: 'publicToken',
    description: 'Public Token',
    required: 'yes',
    default: '',
    dataType: 'string',
  },
];

export const metadata: MethodMetadata = {
  author: 'Aaron Knott',
  authorPicture: '',
  description:
    'Send Public Token to be exchanged for access token and to sync plaid data with user accounts',
  name: path,
  method: 'GET',
  parameters,
};
