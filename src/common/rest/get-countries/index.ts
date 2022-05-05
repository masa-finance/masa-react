import { MethodMetadata } from '..';
import { Headers } from '../../helpers/axios';
import { useRestCall } from '../../helpers/rest-calls';

const path = 'countries';

export function useMethod() {
    const { data, error, loading, getData } = useRestCall({
      headers: Headers,
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