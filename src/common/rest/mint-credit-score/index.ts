import { MethodMetadata, Parameter } from '..';

import { Headers } from '../../helpers/axios';
import { useMasaMutation, useRestCall } from '../../helpers/rest-calls';

const path = 'contracts/credit-score/mint';

export function useMethod({ body }: any) {
  const { data, error, loading, getData } = useRestCall({
    headers: Headers,
    metadata,
    body,
  });

  return { data, error, loading, getData };
}

export function useSimpleMethod({ pathParameters, body, settings }: any) {
  const masaQuery = useMasaMutation(
    'mint-soulname',
    {
      pathParameters,
      headers: Headers,
      body,
      metadata,
    },
    settings
  );
  return masaQuery;
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
    name: 'name',
    description: 'The name of the Soul Bound Identity',
    required: 'yes',
    default: 'MyName',
    dataType: 'string',
  },
  {
    key: 3,
    name: 'address',
    description: 'The receiver address of the Soul Bound Token',
    required: 'yes',
    default: '0x8ba2D360323e3cA85b94c6F7720B70aAc8D37a7a',
    dataType: 'string',
  },
  {
    key: 4,
    name: 'signature',
    description: 'The signature of the Users wallet',
    required: 'yes',
    default:
      '0x2e3d358b8f61064f7b998f9bb629fed0bcea2883192b1690a56b5c8bc978d4bb3f9ae4b7bccab04a786bd85157fbb2c261c5bfe5f0dd588c9ed7983f0f3fc8231b',
    dataType: 'string',
  },
];
export const metadata: MethodMetadata = {
  author: 'Aaron Knott',
  authorPicture: '',
  description:
    'Mint a credit score from Cred Protocol based on a wallet and store on the backend ( minted in the middleware )',
  name: path,
  method: 'POST',
  parameters,
};
