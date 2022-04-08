import { useLazyAxios } from 'use-axios-client';
import { MethodMetadata, Parameter } from '..';
import { URL } from '../../helpers/axios';

const path = 'users';

export function useMethod() {
  const [postData, { data, error, loading }] = useLazyAxios({
    url: `${URL}${path}/1`,
  });
  return { data, error, loading, postData };
}

const parameters: Parameter[] = [
    {
        key: 1,
        name: 'id',
        description: 'User\'s identification number',
        required: 'yes',
        default: '',
        dataType: 'string'
    },
    {
        key: 2,
        name: 'availableRoles',
        description: '',
        required: 'yes',
        default: '',
        dataType: 'string[]'
    },
    {
        key: 3,
        name: 'activeRole',
        description: '',
        required: 'yes',
        default: '',
        dataType: 'string'
    },
    {
        key: 4,
        name: 'firstName',
        description: 'User\'s first name',
        required: 'yes',
        default: '',
        dataType: 'string'
    },
    {
        key: 5,
        name: 'lastName',
        description: 'User\'s last name',
        required: 'yes',
        default: '',
        dataType: 'string'
    },
    {
        key: 6,
        name: 'email',
        description: 'User\'s email',
        required: 'yes',
        default: '',
        dataType: 'string'
    },
    {
        key: 7,
        name: 'lastLoginDate',
        description: 'Last time user logged in',
        required: 'yes',
        default: '',
        dataType: 'timestamp'
    },
    {
        key: 8,
        name: 'countryId',
        description: 'User\'s country id',
        required: 'yes',
        default: '',
        dataType: 'string'
    },
    {
        key: 9,
        name: 'dateOfBirth',
        description: 'User\'s date of birth',
        required: 'yes',
        default: '',
        dataType: 'timestamp'
    },
    {
        key: 10,
        name: 'phone',
        description: 'User\'s phone',
        required: 'yes',
        default: '',
        dataType: 'string'
    },
  ];

export const metadata: MethodMetadata = {
  author: 'Gabriela Golmar',
  authorPicture: '',
  description: 'Create User with given parameters',
  name: '/users',
  method: 'POST',
  parameters: parameters,
};