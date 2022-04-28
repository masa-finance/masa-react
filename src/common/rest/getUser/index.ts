import { MethodMetadata } from '..';
import { Headers } from '../../helpers/axios';
import { useRestCall } from '../../helpers/rest-calls';

const path = 'me';

export function useMethod() {
  const { data, error, loading, getData, refetch } = useRestCall({
    headers: Headers,
    metadata,
  });
  return { data, error, loading, getData, refetch };
}

export const metadata: MethodMetadata = {
  author: 'Gabriela Golmar',
  authorPicture: '',
  description: 'Retrieve user with id given in the URL',
  name: path,
  method: 'GET',
  parameters: [],
};
