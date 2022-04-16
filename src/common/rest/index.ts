import * as auth from './auth';
import * as getClient from './get-user';
import * as postClient from './post-user';
import * as accounts from './accounts';
import * as getPlaidAccount from './plaid/get-plaid-account';
import * as getPlaidLinkToken from './plaid/get-plaid-link-token';
import * as getPlaidTransaction from './plaid/get-plaid-transaction';
import * as listPlaidAccounts from './plaid/list-plaid-accounts';
import * as listPlaidTransaction from './plaid/list-plaid-transactions';
import * as getPlaidAccessToken from './plaid/get-plaid-access-token';
import * as savePlaidAccounts from './plaid/save-plaid-accounts';
import * as savePlaidTransaction from './plaid/save-plaid-transactions';

export interface Parameter {
  key: number;
  name: string;
  required: 'yes' | 'no';
  description: string;
  default: string;
  dataType: 'string' | 'number';
}

export interface MethodMetadata {
  author: string;
  authorPicture: string;
  description: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';
  parameters: Parameter[];
}

export const masaRestClient = {
  auth,
  accounts,
  getClient,
  postClient,
  getPlaidAccount,
  getPlaidLinkToken,
  getPlaidTransaction,
  listPlaidAccounts,
  listPlaidTransaction,
  getPlaidAccessToken,
  savePlaidAccounts,
  savePlaidTransaction,
};
