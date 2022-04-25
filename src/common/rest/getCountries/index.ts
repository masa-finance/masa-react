import { MethodMetadata } from "..";
import { useRestCall } from "../../helpers/rest-calls";


const path = 'countries';

export function useMethod() {
    const { data, error, loading, getData } = useRestCall({
      headers: Headers,
      metadata
    });
  
    return { data, error, loading, getData };
}

export const metadata: MethodMetadata = {
    author: 'Hide on bush',
    authorPicture: '',
    description: 'Get for countries from dev api',
    name: path,
    method: 'GET',
    parameters: [],
  };
  






