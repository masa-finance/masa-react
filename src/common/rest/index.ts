import * as auth from './auth';
import * as accounts from './accounts';


export interface Parameter {
  key: number;
  name: string;
  required: 'yes' | 'no';
  description: string;
  default: string;
}
export interface MethodMetadata {
  author: string;
  authorPicture: string;
  description: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';
  parameters: Parameter[];
}

export const masaRestClient = { auth, accounts };
