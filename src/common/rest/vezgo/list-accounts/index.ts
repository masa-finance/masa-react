import { MethodMetadata, Parameter } from '../..';
import { Headers } from '../../../helpers/axios';
import { useMasaQuery, useRestCall } from '../../../helpers/rest-calls';

const path = 'vezgo-accounts/:userId';

export function useMethod({ pathParameters, body }: any) {
  const { data, error, loading, getData } = useRestCall({
    pathParameters,
    headers: Headers,
    body,
    metadata,
  });
  return { data, error, loading, getData };
}

export function useSimpleMethod({ pathParameters, body, settings }: any) {
  const simpleCall = useMasaQuery(
    'vezgo-accounts',
    {
      pathParameters,
      headers: Headers,
      body,
      metadata,
    },
    settings
  );

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
  description: 'Get all Vezgo Accounts of a user',
  name: path,
  method: 'GET',
  parameters,
};
