import { MethodMetadata, Parameter } from '..';
import { Headers } from '../../helpers/axios';
import { useRestCall, useSimpleRestCall } from '../../helpers/rest-calls';

const path = 'userEnode/:userProfileId';

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
    name: 'userProfileId',
    description: 'User ID',
    required: 'yes',
    default: '',
    dataType: 'string',
  },
];

export const metadata: MethodMetadata = {
  author: 'Aaron Knott',
  authorPicture: '',
  description: 'Retrieve farming data and rewards for user',
  name: path,
  method: 'GET',
  parameters,
};
