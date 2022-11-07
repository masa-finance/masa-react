import { MethodMetadata, Parameter } from '..';

import { Headers } from '../../helpers/axios';
import { useMasaMutation, useRestCall } from '../../helpers/rest-calls';

const path = 'session/verify2FA';

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
    'verify-2fa',
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
    name: 'Code',
    description: 'The 2FA code sent to the user',
    required: 'yes',
    default: 'Identity',
    dataType: 'string',
  },
  {
    key: 2,
    name: 'Phone Number',
    description: 'Phone number used for 2FA',
    required: 'yes',
    default: 'Identity',
    dataType: 'string',
  },
];

export const metadata: MethodMetadata = {
  author: 'Aaron Knott',
  authorPicture: '',
  description:
    'Verify 2FA using a code and associated phonenumber',
  name: path,
  method: 'POST',
  parameters,
};
