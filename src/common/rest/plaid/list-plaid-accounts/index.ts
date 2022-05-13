import { MethodMetadata, Parameter } from '../..';
import { useRestCall, useSimpleRestCall } from '../../../helpers/rest-calls';
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
    name: 'userId',
    description: 'User ID',
    required: 'yes',
    default: '',
    dataType: 'string',
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
