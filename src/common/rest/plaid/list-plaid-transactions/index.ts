import { MethodMetadata, Parameter } from '../..';
import { useRestCall, useSimpleRestCall } from '../../../helpers/rest-calls';
import { Headers } from '../../../helpers/axios';

const path =
  'plaid-transactions/:accountId/?pageNbr=:pageNbr&pageSize=:pageSize';

export function useMethod({ pathParameters, body }: any) {
  const { data, error, loading, getData } = useRestCall({
    pathParameters,
    headers: Headers,
    body,
    metadata,
  });
  return { data, error, loading, getData };
}

export function useSimpleMethod({ pathParameters, body }: any) {
  const simpleCall = useSimpleRestCall({
    pathParameters,
    headers: Headers,
    body,
    metadata,
  });

  return simpleCall;
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
  description: 'Get a list of Plaid transactions for a given account',
  name: path,
  method: 'GET',
  parameters,
};
