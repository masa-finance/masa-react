import { MethodMetadata, Parameter } from '..';
import { useMasaQuery } from '../../helpers/rest-calls';
import { Headers } from '../../helpers/axios';

const path = 'sbt-data/credit-score/:userProfileId/:walletAddress';

export function useSimpleMethod({ pathParameters, body, settings }: any) {
  const masaQuery = useMasaQuery(
    'get-credit-score',
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
    name: 'userProfileId',
    description: 'User ID',
    required: 'yes',
    default: '',
    dataType: 'string',
  },
  {
    key: 2,
    name: 'walletAddress',
    description: 'Wallet Address',
    required: 'yes',
    default: '',
    dataType: 'string',
  },
];

export const metadata: MethodMetadata = {
  author: 'Aaron Knott',
  authorPicture: '',
  description:
    'Get a credit score from Cred Protocol based on a wallet and store on the backend',
  name: path,
  method: 'GET',
  parameters,
};
