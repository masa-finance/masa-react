import { MethodMetadata, Parameter } from '../..';
import { Headers } from '../../../helpers/axios';
import { useRestCall } from '../../../helpers/rest-calls';

const path =
  'vezgo-transactions/:accountId/?pageNbr=:pageNbr&pageSize=:pageSize';

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
    dataType: 'string',
  },
  {
    key: 2,
    name: 'pageNbr',
    description: 'Pagination page number',
    required: 'no',
    default: '',
    dataType: 'number',
  },
  {
    key: 3,
    name: 'pageSize',
    description: 'pageSize',
    required: 'no',
    default: '',
    dataType: 'number',
  },
];

export const metadata: MethodMetadata = {
  author: 'Aaron Knott',
  authorPicture: '',
  description: 'Get list of Vezgo Transactions for a given account',
  name: path,
  method: 'GET',
  parameters,
};
