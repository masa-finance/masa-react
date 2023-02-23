import { useState } from 'react';
import { Signer, Wallet } from 'ethers';

export const useProvider = (
  signer?: Wallet | Signer
): {
  provider: Wallet | Signer | undefined;
  setProvider: (provider: Wallet | Signer | undefined) => void;
  isProviderMissing?: boolean;
  setIsProviderMissing: (providerMissing: boolean) => void;
} => {
  const [provider, setProvider] = useState<Wallet | Signer | undefined>(signer);
  const [isProviderMissing, setIsProviderMissing] = useState<boolean>();

  return {
    provider,
    setProvider,
    isProviderMissing,
    setIsProviderMissing,
  };
};
