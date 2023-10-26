import { useAsyncFn } from 'react-use';
import { useWallet } from '../../../../wallet-client/wallet/use-wallet';
import { openAuthenticateModal } from './authenticate';

export const useAuthenticate = ({
  onAuthenticateSuccess,
  onAuthenticateError,
}: {
  onAuthenticateSuccess?: (payload: {
    address?: string;
    walletType?: string;
  }) => void;
  onAuthenticateError?: () => void;
  onRegisterFinish?: () => void;
  onSuccess?: () => void;
  onError?: () => void;
} = {}) => {
  const { openConnectModal, isDisconnected } = useWallet();

  const [{ loading: isAuthenticateModalOpen }, openAuthModal] =
    useAsyncFn(async () => {
      if (isDisconnected) {
        openConnectModal?.();
      }

      await openAuthenticateModal({
        onAuthenticateSuccess,
        onAuthenticateError,
      });
    }, [
      isDisconnected,
      openConnectModal,
      onAuthenticateSuccess,
      onAuthenticateError,
    ]);

  return {
    openAuthModal,
    isAuthenticateModalOpen,
  };
};
