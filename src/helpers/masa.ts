import { Environment, environments, Masa } from '@masa-finance/masa-sdk';
import { ethers, Wallet } from 'ethers';
import { ArweaveConfig } from '../provider';
import { getNetworkNameByChainId } from './networks';

export const createRandomWallet = (): Wallet | null => {
  console.info('Creating random wallet!');
  const wallet = ethers.Wallet.createRandom();

  if (typeof window !== 'undefined') {
    if (typeof window?.ethereum !== 'undefined') {
      return wallet.connect(
        new ethers.providers.Web3Provider(window?.ethereum as never)
      );
    } else {
      return null;
    }
  } else {
    return null;
  }
};

export const createNewMasa = async ({
  newWallet,
  environmentName,
  arweaveConfig,
  verbose,
}: {
  newWallet: ethers.Signer | null;
  environmentName: string;
  arweaveConfig?: ArweaveConfig;
  verbose: boolean;
}): Promise<Masa | null> => {
  const signer: ethers.Signer | null = newWallet
    ? newWallet
    : createRandomWallet();

  if (!signer) return null;

  const environment = environments.find(
    (environment: Environment) => environment.name === environmentName
  );
  if (!environment) return null;

  const chainId: number = await signer.getChainId();

  console.log({ NETWORK: chainId });

  return new Masa({
    wallet: signer,
    apiUrl: environment.apiUrl,
    defaultNetwork: getNetworkNameByChainId(chainId),
    environment: environment.environment,
    arweave: {
      host: arweaveConfig?.host || 'arweave.net',
      port: parseInt(arweaveConfig?.port || '443'),
      protocol: arweaveConfig?.protocol || 'https',
      logging: (!!arweaveConfig?.logging as boolean) || false,
    },
    verbose,
  });
};
