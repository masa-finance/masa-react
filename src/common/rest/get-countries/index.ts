import { MethodMetadata } from '..';
import { Headers } from '../../helpers/axios';
import { useRestCall } from '../../helpers/rest-calls';

const path = 'countries';

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
  author: 'Gabriela Golmar',
  authorPicture: '',
  description: 'pulls the full list of countries',
  name: path,
  method: 'GET',
  parameters: [],
};