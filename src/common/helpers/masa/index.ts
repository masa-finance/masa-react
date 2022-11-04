import { Masa } from '@masa-finance/masa-sdk';
import { ethers } from 'ethers';

const config = {
  ...process.env,
};

export const createNewMasa = (newWallet) => {
  return new Masa({
    cookie: config.cookie || undefined,
    wallet: newWallet,
    apiUrl: config['api-url'] || 'http://localhost:4000/',
    environment: config.environment || 'dev',
    arweave: {
      host: config['arweave-host'] || 'arweave.net',
      port: parseInt(config?.['arweave-port'] || '443'),
      protocol: config['arweave-protocol'] || 'https',
      logging: (!!config['arweave-logging'] as boolean) || false,
    },
  });
};
