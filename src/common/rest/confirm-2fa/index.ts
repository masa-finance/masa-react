import { MethodMetadata, Parameter } from '..';

import { Headers } from '../../helpers/axios';
import { useMasaMutation, useRestCall } from '../../helpers/rest-calls';

const path = 'session/confirm2FA';

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
    'confirm-2fa',
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
  description: 'Confirm 2FA using a phonenumber',
  name: path,
  method: 'POST',
  parameters,
};
