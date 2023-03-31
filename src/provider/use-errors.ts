import { useState } from 'react';
import { SoulNameErrorCodes } from '@masa-finance/masa-sdk';

const Errors = {
  arweave: {
    title: 'Darn',
    msg: 'One of our network providers experienced an issue. Please try again.',
    icon: '💸',
  },
  network: {
    title: 'Sorry',
    msg: 'We experienced an issue when trying to confirm your transaction on the blockchain. Please try again.',
    icon: '💸',
  },
  crypto: {
    title: 'Sorry',
    msg: 'It looks like the signing or verification of your transaction failed .Please try again.',
    icon: '💸',
  },
  soulname: {
    title: 'Whoops',
    msg: 'Looks like that soul name is taken or not valid. Try a different name.',
    icon: '💸',
  },
  unknown: {
    title: 'Whoops',
    msg: 'Something went wrong. Please try again.',
    icon: '💸',
  },
};

interface ErrorType {
  title: string;
  msg: string;
  icon: string;
}

export const useErrors = () => {
  const [error, setError] = useState<ErrorType | null>(null);

  const handleErrors = (
    errorCode: SoulNameErrorCodes = SoulNameErrorCodes.UnknownError
  ) => {
    if (errorCode === null) return;
    if (!(errorCode in SoulNameErrorCodes)) return;

    switch (errorCode) {
      case SoulNameErrorCodes.NoError:
        setError(null);
        break;
      case SoulNameErrorCodes.ArweaveError:
        setError(Errors.arweave);
        break;
      case SoulNameErrorCodes.NetworkError:
        setError(Errors.network);
        break;
      case SoulNameErrorCodes.CryptoError:
        setError(Errors.crypto);
        break;
      case SoulNameErrorCodes.SoulNameError:
        setError(Errors.soulname);
        break;
      case SoulNameErrorCodes.UnknownError:
        setError(Errors.unknown);
        break;
    }
  };

  return { handleErrors, error, SoulNameErrorCodes };
};
