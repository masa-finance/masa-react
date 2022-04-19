import * as auth from './auth';
import * as getClient from './getUser';
import * as postClient from './post-user';
import * as accounts from './accounts';
import * as getCountries from './get-countries';
import * as postCountry from './post-country';
import * as getVezgoInsight from './get-vezgo-insight';
import * as postVezgoInsight from './post-vezgo-insight';
import * as postVezgoAccounts from './post-vezgo-accounts';
import * as getVezgoAccount from './get-vezgo-account';
import * as getVezgoUserAccounts from './get-vezgo-user-accounts';
import * as postVezgoTransactions from './post-vezgo-transactions';
import * as getVezgoUserTransactions from './get-vezgo-user-transactions';
import * as getVezgoTransaction from './get-vezgo-transaction';
import * as getPlaidAccount from './plaid/get-plaid-account';
import * as getPlaidLinkToken from './plaid/get-plaid-link-token';
import * as getPlaidTransaction from './plaid/get-plaid-transaction';
import * as listPlaidAccounts from './plaid/list-plaid-accounts';
import * as listPlaidTransaction from './plaid/list-plaid-transactions';
import * as getPlaidAccessToken from './plaid/get-plaid-access-token';
import * as savePlaidAccounts from './plaid/save-plaid-accounts';
import * as savePlaidTransaction from './plaid/save-plaid-transactions';
import * as postUser from './post-user';

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
  getVezgoInsight,
  postVezgoInsight,
  postVezgoAccounts,
  getVezgoAccount,
  getVezgoUserAccounts,
  postVezgoTransactions,
  getVezgoUserTransactions,
  getVezgoTransaction,
  getPlaidAccount,
  getPlaidLinkToken,
  getPlaidTransaction,
  listPlaidAccounts,
  listPlaidTransaction,
  getPlaidAccessToken,
  savePlaidAccounts,
  savePlaidTransaction,
  getCountries,
  postUser,
  postCountry,
};
