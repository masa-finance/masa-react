import { useAsyncFn } from 'react-use';
import { useCallback } from 'react';
import { useWallet } from '../../../../wallet-client/wallet/use-wallet';
import { openAuthenticateModal } from './authenticate';
import { openCreateSoulnameModal } from '../create-soulname';
import { useIdentity } from '../../../../masa';

export const useAuthenticate = ({
  onAuthenticateSuccess,
  onAuthenticateError,
  onMintSuccess,
  onMintError,
  onRegisterFinish,
  onSuccess,
  onError,
}: {
  onAuthenticateSuccess?: () => void;
  onAuthenticateError?: () => void;
  onMintSuccess?: () => void;
  onMintError?: () => void;
  onRegisterFinish?: () => void;
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  const { openConnectModal, isDisconnected } = useWallet();
  const { reloadIdentity } = useIdentity();
  // const [, onFinishAuthenticate] = useAsyncFn(async () => {
  //   console.log('ON FINISH AUTH START');
  //   await
  // }, [onMintSuccess, onMintError, onRegisterFinish, onSuccess]);
  const openSoulnameModal = useCallback(
    () =>
      openCreateSoulnameModal({
        onMintSuccess,
        onMintError,
        onRegisterFinish,
        onSuccess,
        onError,
        closeOnSuccess: true,
      }),
    [onMintSuccess, onMintError, onRegisterFinish, onSuccess, onError]
  );

  const [, openAuthModal] = useAsyncFn(async () => {
    if (isDisconnected) {
      openConnectModal?.();
    }

    await openAuthenticateModal({
      onAuthenticateSuccess,
      onAuthenticateError,
      onAuthenticateFinish: async () => {
        const { data: identityRefetched } = await reloadIdentity();
        if (!identityRefetched || !identityRefetched.identityId)
          await openSoulnameModal();
      },
    });
    // await openSoulnameModal();
  }, [
    reloadIdentity,
    openSoulnameModal,
    isDisconnected,
    openConnectModal,
    onAuthenticateSuccess,
    onAuthenticateError,
  ]);

  return {
    openAuthModal,
  };
};
