import * as auth from './auth';
import * as getClient from './get-user'
import * as postClient from './post-user'

export interface Parameter {
  key: number;
  name: string;
  required: 'yes' | 'no';
  description: string;
  default: string;
  dataType?: string;
}

export interface MethodMetadata {
  author: string;
  authorPicture: string;
  description: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';
  parameters: Parameter[];
}

export const masaRestClient = { auth, getClient, postClient };
