import { useLazyAxios } from 'use-axios-client';
import { MethodMetadata } from '..';
import { URL } from '../../helpers/axios';

const path = 'countries';

export function useMethod() {
  const [getData, { data, error, loading }] = useLazyAxios({
    url: `${URL}${path}`,
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