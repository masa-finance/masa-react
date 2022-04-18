import { MethodMetadata, Parameter } from '..';
import { Headers } from '../../helpers/axios';
import { useRestCall } from '../../helpers/rest-calls';

const path = 'vesgo-accounts/:userProfileId';

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
      name: 'accounts',
      description: 'accounts list',
      required: 'yes',
      default: '',
      dataType: 'string',
    },
  ];

export const metadata: MethodMetadata = {
    author: 'Gabriela Golmar',
    authorPicture: '',
    description: 'This is our post vezgo accounts',
    name: path,
    method: 'POST',
    parameters,
};
