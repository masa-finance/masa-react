import { MethodMetadata, Parameter } from '..';
import { useRestCall } from '../../helpers/rest-calls';

const path = 'contracts/mint';

export function useMethod({ body }: any) {
  const { data, error, loading, getData } = useRestCall({
    headers: Headers,
    metadata,
    body,
  });

  return { data, error, loading, getData };
}

const parameters: Parameter[] = [
  {
    key: 1,
    name: 'operation',
    description: 'The Soul Bound Token type to Mint',
    required: 'yes',
    default: 'Identity',
    dataType: 'string',
  },
  {
    key: 2,
    name: 'address',
    description: 'The receiver address of the Soul Bound Token',
    required: 'yes',
    default: '',
    dataType: 'string',
  },
  {
    key: 3,
    name: 'signature',
    description: 'The signature of the Users wallet',
    required: 'yes',
    default: '',
    dataType: 'string',
  },
];

export const metadata: MethodMetadata = {
  author: 'Sebastian Gerske',
  authorPicture: '',
  description: 'Mints an Soul Bound Token to a users Wallet',
  name: path,
  method: 'POST',
  parameters: parameters,
};
