
import { MethodMetadata } from '../..';
import { Headers } from '../../../helpers/axios';
import { useRestCall } from '../../../helpers/rest-calls';

const path = 'vezgo-providers/';

export function useMethod({ pathParameters, body }: any) {
  const { data, error, loading, getData } = useRestCall({
    pathParameters,
    headers: Headers,
    body,
    metadata,
  });
  return { data, error, loading, getData };
}

export const metadata: MethodMetadata = {
  author: 'Aaron Knott',
  authorPicture: '',
  description: 'Get a list of all providers and logos',
  name: path,
  method: 'GET',
  parameters: [],
};
