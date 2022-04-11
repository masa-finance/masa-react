import * as auth from './auth';
import * as getClient from './get-user'
import * as postClient from './post-user'
import * as accounts from './accounts';
import * as getVezgoInsight from './get-vezgo-insight'
import * as postVezgoInsight from './post-vezgo-insight'
import * as postVezgoAccounts from './post-vezgo-accounts'
import * as getVezgoAccount from './get-vezgo-account'
import * as getVezgoUserAccounts from './get-vezgo-user-accounts'
import * as postVezgoTransactions from './post-vezgo-transactions'
import * as getVezgoUserTransactions from './get-vezgo-user-transactions'
import * as getVezgoTransaction from './get-vezgo-transaction'

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

export const masaRestClient = { auth, 
  accounts, 
  getClient, 
  postClient, 
  getVezgoInsight, 
  postVezgoInsight, 
  postVezgoAccounts, 
  getVezgoAccount,
  getVezgoUserAccounts,
  postVezgoTransactions,
  getVezgoUserTransactions,
  getVezgoTransaction,
};
