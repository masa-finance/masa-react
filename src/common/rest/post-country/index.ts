import { MethodMetadata, Parameter } from '..';
import { Headers } from '../../helpers/axios';
import { useRestCall } from '../../helpers/rest-calls';

const path = 'country';

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
    name: 'bankApproved',
    description: '',
    required: 'yes',
    default: '',
    dataType: 'string',
  },
  {
    key: 2,
    name: 'phoneCode',
    description: '',
    required: 'yes',
    default: '',
    dataType: 'string',
  },
  {
    key: 3,
    name: 'iso2',
    description: '',
    required: 'yes',
    default: '',
    dataType: 'string',
  },
  {
    key: 4,
    name: 'iso3',
    description: '',
    required: 'yes',
    default: '',
    dataType: 'string',
  },
  {
    key: 5,
    name: 'abbreviation',
    description: '',
    required: 'yes',
    default: '',
    dataType: 'string',
  },
  {
    key: 6,
    name: 'name',
    description: '',
    required: 'yes',
    default: '',
    dataType: 'string',
  },
  {
    key: 7,
    name: 'version',
    description: '',
    required: 'yes',
    default: '',
    dataType: 'number',
  },
];

export const metadata: MethodMetadata = {
  author: 'Gabriela Golmar',
  authorPicture: '',
  description: 'upserts a single country record',
  name: path,
  method: 'POST',
  parameters,
};
