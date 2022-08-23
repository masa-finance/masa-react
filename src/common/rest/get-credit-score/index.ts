import { MethodMetadata, Parameter } from '..';

import { Headers } from '../../helpers/axios';
import { useMasaQuery } from '../../helpers/rest-calls';

const path = 'sbt/credit-score/:userProfileId/:wallet';

/* PAYLOAD
 * {
 *     "userProfileId": "auth0|62bb24204dd722e042fb0803",
 *     "wallet": "0xeB76146E58F0224Accab28Cb9535C769723BE185"
 * } */

export function useSimpleMethod({ body, settings }: any) {
  const masaQuery = useMasaQuery(
    'get-credit-score',
    {
      headers: Headers,
      body,
      metadata,
    },
    settings
  );
  return masaQuery;
}

const parameters: Parameter[] = [];

export const metadata: MethodMetadata = {
  author: 'Hide on bush',
  authorPicture: '',
  description: 'Get the credit score of a user',
  name: path,
  method: 'GET',
  parameters,
};
