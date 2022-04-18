import { MethodMetadata, Parameter } from '..';
import { Headers } from '../../helpers/axios';
import { useRestCall } from '../../helpers/rest-calls';

const path = 'applications';

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
    name: 'username',
    description: '32',
    required: 'yes',
    default: 'test',
    dataType: 'string'
  },
];

export const metadata: MethodMetadata = {
  author: 'Hide on bush',
  authorPicture: '',
  description: 'Call for getting applications',
  name: path,
  method: 'GET',
  parameters,
};