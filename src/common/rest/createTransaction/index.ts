import { useQueryClient } from 'react-query';
import { MethodMetadata, Parameter } from '..';
import { useMasaMutation, useRestCall } from '../../helpers/rest-calls';

const path = 'contracts/transaction';

export function useMethod({ body }: any) {
  const { data, error, loading, getData } = useRestCall({
    headers: Headers,
    metadata,
    body,
  });

  return { data, error, loading, getData };
}

export function useSimpleMethod({ pathParameters, body, settings }: any) {
  const queryClient = useQueryClient();

  const masaQuery = useMasaMutation(
    'create-transaction',
    {
      pathParameters,
      headers: Headers,
      body,
      metadata,
    },
    {
      ...settings,
      onSuccess: () => {
        queryClient.invalidateQueries(['get-transactions']);
      },
    }
  );
  return masaQuery;
}

const parameters: Parameter[] = [
  {
    key: 1,
    name: 'txId',
    description: 'Transaction id',
    required: 'yes',
    default: '0x',
    dataType: 'string',
  },
  {
    key: 2,
    name: 'type',
    required: 'yes',
    description: 'Transaction type',
    default: 'Soulname mint',
    dataType: 'string',
  },
];

export const metadata: MethodMetadata = {
  author: 'Hide on bush',
  authorPicture: '',
  description: 'Creates a transaction for watching its state',
  name: path,
  method: 'POST',
  parameters: parameters,
};
