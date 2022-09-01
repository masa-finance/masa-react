import * as auth from './auth';
import * as getClient from './getUser';
import * as postClient from './post-user';
import * as accounts from './accounts';
import * as getCountries from './get-countries';
import * as postCountry from './post-country';
import * as farming from './farming';
import * as getNodeOperators from './get-node-operators';
import * as postNodeOperators from './post-node-operators';

import * as contractsMint from './contracts-mint';
import * as mintCreditScore from './mint-credit-score';
import * as getCreditScore from './get-credit-score';

import * as getVezgoLink from './vezgo/get-link';
import * as listVezgoProviders from './vezgo/list-providers';
import * as listVezgoAccounts from './vezgo/list-accounts';
import * as listVezgoTransactions from './vezgo/list-transactions';
import * as syncVezgo from './vezgo/sync-vezgo';

import * as getPlaidAccount from './plaid/get-plaid-account';
import * as getPlaidLinkToken from './plaid/get-plaid-link-token';
import * as getPlaidTransaction from './plaid/get-plaid-transaction';
import * as listPlaidAccounts from './plaid/list-plaid-accounts';
import * as listPlaidTransaction from './plaid/list-plaid-transactions';
import * as getPlaidAccessToken from './plaid/get-plaid-access-token';
import * as savePlaidAccounts from './plaid/save-plaid-accounts';
import * as savePlaidTransaction from './plaid/save-plaid-transactions';
import * as syncPlaid from './plaid/sync-plaid';

import * as postUser from './post-user';
import * as getProductInterests from './get-product-interests';

import * as balances from './balances';

import * as getIdentity from './get-identity';

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
  farming,
  getClient,
  postClient,
  contractsMint,
  mintCreditScore,
  getVezgoLink,
  listVezgoProviders,
  listVezgoAccounts,
  listVezgoTransactions,
  syncVezgo,
  getPlaidAccount,
  getPlaidLinkToken,
  getPlaidTransaction,
  getPlaidAccessToken,
  listPlaidAccounts,
  listPlaidTransaction,
  savePlaidAccounts,
  savePlaidTransaction,
  syncPlaid,
  getCountries,
  getCreditScore,
  postUser,
  postCountry,
  getProductInterests,
  balances,
  getNodeOperators,
  postNodeOperators,
  getIdentity,
};
