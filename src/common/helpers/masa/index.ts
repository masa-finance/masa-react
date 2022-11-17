import { Masa } from '@masa-finance/masa-sdk';

const config = {
  ...process.env,
};

const envs = {
  dev: 'https://dev.middleware.masa.finance/',
  beta: 'https://beta.middleware.masa.finance/',
  test: 'https://test.middleware.masa.finance/',
  local: 'http://localhost:4000/',
};
export const createNewMasa = (
  newWallet,
  env: 'dev' | 'beta' | 'test' | 'local' = 'dev'
) => {
  return new Masa({
    cookie: config.cookie || undefined,
    wallet: newWallet,
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
