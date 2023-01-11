import { Masa } from '@masa-finance/masa-sdk';
import { ethers, Wallet } from 'ethers';

const config = {
  ...process.env,
};

const envs = {
  dev: 'https://dev.middleware.masa.finance/',
  beta: 'https://beta.middleware.masa.finance/',
  test: 'https://test.middleware.masa.finance/',
  local: 'http://localhost:4000/',
};


export const createRandomWallet = (): Wallet => {
  console.info("Creating random wallet!");
  const wallet = ethers.Wallet.createRandom();

  wallet.connect(
    new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/eth_goerli")
  );
  return wallet;
};


export const createNewMasa = (
  newWallet,
  env: 'dev' | 'beta' | 'test' | 'local' = 'dev'
) => {

  const signer = newWallet ? newWallet : createRandomWallet()
  return new Masa({
    cookie: config.cookie || undefined,
    wallet: signer,
    apiUrl: envs[env],
    environment: config.environment || 'dev',
    arweave: {
      host: config['arweave-host'] || 'arweave.net',
      port: parseInt(config?.['arweave-port'] || '443'),
      protocol: config['arweave-protocol'] || 'https',
      logging: (!!config['arweave-logging'] as boolean) || false,
    },
  });
};
