import { useLazyAxios } from 'use-axios-client';
import { MethodMetadata, Parameter } from '..';
import { URL } from '../../helpers/axios';

const path = 'loans';

export function useMethod() {
  const [getData, { data, error, loading }] = useLazyAxios({
    url: `${URL}${path}`,
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
  description: 'This is our accounts endpoint',
  name: '/loans',
  method: 'GET',
  parameters,
};
