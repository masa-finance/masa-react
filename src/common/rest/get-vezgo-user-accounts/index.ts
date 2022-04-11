import { MethodMetadata } from '..';
import { useRestCall } from '../../helpers/rest-calls';

const path = 'vezgo-accounts/:userProfileId';

export function useMethod({ pathParameters, body }: any) {
    const { data, error, loading, getData } = useRestCall({
        pathParameters,
        headers: Headers,
        body,
        metadata,
    });
    return { data, error, loading, getData };
}

export const metadata: MethodMetadata = {
    author: 'Gabriela Golmar',
    authorPicture: '',
    description: 'This is our get user accounts',
    name: path,
    method: 'GET',
    parameters: [],
};
