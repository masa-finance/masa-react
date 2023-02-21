import { Environment, environments, Masa } from '@masa-finance/masa-sdk';
import { ethers, Wallet } from 'ethers';
import { ArweaveConfig, getWeb3Provider } from '../provider';
import { getNetworkNameByChainId } from './networks';

export const createRandomWallet = (): Wallet | null => {
  console.info('Creating random wallet!');
  const wallet = ethers.Wallet.createRandom();
  const provider = getWeb3Provider();

  if (provider) {
    return wallet.connect(provider);
  }

  return null;
};

export const createNewMasa = async ({
  signer,
  environmentName,
  arweaveConfig,
  verbose,
}: {
  signer: ethers.Signer | null;
  environmentName: string;
  arweaveConfig?: ArweaveConfig;
  verbose: boolean;
}): Promise<Masa | null> => {
  const newSigner: ethers.Signer | null = signer
    ? signer
    : createRandomWallet();

  if (!newSigner) return null;

  const environment = environments.find(
    (environment: Environment) => environment.name === environmentName
  );
  if (!environment) return null;

  let defaultNetwork = environment.defaultNetwork;

  try {
    const chainId: number = await newSigner.getChainId();
    console.log({ NETWORK: chainId });
    defaultNetwork = getNetworkNameByChainId(chainId);
  } catch (error) {
    if (error instanceof Error) {
      console.warn('Getting network failed!', error.message);
    }
  }

  return new Masa({
    wallet: newSigner,
    apiUrl: environment.apiUrl,
    defaultNetwork,
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
