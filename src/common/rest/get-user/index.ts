import { useLazyAxios } from 'use-axios-client';
import { MethodMetadata, Parameter } from '..';
import { URL } from '../../helpers/axios';

const path = 'users';

export function useMethod() {
  const [getData, { data, error, loading }] = useLazyAxios({
    url: `${URL}${path}/1`,
  });
  return { data, error, loading, getData };
}

export const metadata: MethodMetadata = {
  author: 'Gabriela Golmar',
  authorPicture: '',
  description: 'Retrieve user with id given in the URL',
  name: '/user/:id',
  method: 'GET',
  parameters: [],
};