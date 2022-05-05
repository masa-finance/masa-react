
import { MethodMetadata, Parameter } from '../..';
import { Headers } from '../../../helpers/axios';
import { useRestCall } from '../../../helpers/rest-calls';


const path = 'vezgo-connect/:userProfileId/:provider';

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
    name: 'userProfileId',
    description: 'User ID',
    required: 'yes',
    default: '',
    dataType: 'string',
  },
  {
    key: 2,
    name: 'provider',
    description: 'Provider Name',
    required: 'yes',
    default: '',
    dataType: 'string',
  },
];

export const metadata: MethodMetadata = {
  author: 'Aaron Knott',
  authorPicture: '',
  description: 'Get a Vezgo Link for a specific provider',
  name: path,
  method: 'GET',
  parameters,
};
