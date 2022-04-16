import { MethodMetadata, Parameter } from '../..';
import { useRestCall } from '../../../helpers/rest-calls';
import { Headers } from '../../../helpers/axios';

const path = 'plaid-account/:accountId';

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
    name: 'accountId',
    description: 'Account ID',
    required: 'yes',
    default: '',
    dataType: 'string'
  },
];

export const metadata: MethodMetadata = {
  author: 'Aaron Knott',
  authorPicture: '',
  description: 'Get Plaid account by account ID',
  name: path,
  method: 'GET',
  parameters,
};
