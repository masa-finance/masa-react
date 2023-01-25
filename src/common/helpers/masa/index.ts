import { EnvironmentName, Masa } from '@masa-finance/masa-sdk';
import { ethers, Wallet } from 'ethers';
import { ArweaveConfig } from '../provider/masa-context';

const envs = {
  dev: 'https://dev.middleware.masa.finance/',
  beta: 'https://beta.middleware.masa.finance/',
  test: 'https://test.middleware.masa.finance/',
  production: 'https://middleware.masa.finance/',
  local: 'http://localhost:4000/',
};

export const createRandomWallet = (): Wallet | null => {
  console.info('Creating random wallet!');
  const wallet = ethers.Wallet.createRandom();

  if (typeof window !== 'undefined') {
    //@ts-ignore
    if (typeof window?.ethereum !== 'undefined') {
      return wallet.connect(
        //@ts-ignore
        new ethers.providers.Web3Provider(window?.ethereum)
      );
    } else {
      return null;
    }
  } else {
    return null;
  }
};

export const createNewMasa = (
  newWallet,
  env: EnvironmentName,
  arweaveConfig?: ArweaveConfig,
  cookie?: string
) => {
  const signer = newWallet ? newWallet : createRandomWallet();

  if (!signer) return null;

  return new Masa({
    cookie: cookie || undefined,
    wallet: signer,
    apiUrl: envs[env],
    environment: env,
    arweave: {
      host: arweaveConfig?.host || 'arweave.net',
      port: parseInt(arweaveConfig?.port || '443'),
      protocol: arweaveConfig?.protocol || 'https',
      logging: (!!arweaveConfig?.logging as boolean) || false,
    },
  });
};
