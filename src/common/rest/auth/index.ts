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

const parameters: Parameter[] = [
  {
    key: 1,
    name: 'username',
    description: '32',
    required: 'yes',
    default: 'test',
  },
];

export const metadata: MethodMetadata = {
  author: 'Hide on bush',
  authorPicture: '',
  description: 'Hey, this is our first rest call!',
  name: '/users',
  method: 'GET',
  parameters,
};
