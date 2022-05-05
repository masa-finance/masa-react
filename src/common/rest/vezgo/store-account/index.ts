import { MethodMetadata, Parameter } from "../..";
import { useRestCall } from "../../../helpers/rest-calls";


const path = 'store-account/';

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
    name: 'code',
    description: 'Vezgo Account ID',
    required: 'yes',
    default: '',
    dataType: 'string',
  },
  {
    key: 2,
    name: 'institution',
    description: 'Vezgo Account Name',
    required: 'yes',
    default: '',
    dataType: 'string',
  },
];

export const metadata: MethodMetadata = {
  author: 'Aaron Knott',
  authorPicture: '',
  description: 'Store account credentials ',
  name: path,
  method: 'POST',
  parameters,
};
