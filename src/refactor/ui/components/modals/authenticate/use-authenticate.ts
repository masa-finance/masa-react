import { useAsyncFn } from 'react-use';
import { useCallback } from 'react';
import { useWallet } from '../../../../wallet-client/wallet/use-wallet';
import { openAuthenticateModal } from './authenticate';
import { openCreateSoulnameModal } from '../create-soulname';
import { useIdentity, useSession } from '../../../../masa';

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
  const { hasSession, checkLogin } = useSession();
  const { reloadIdentity } = useIdentity();

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

  const [{ loading: isAuthenticateModalOpen }, openAuthModal] =
    useAsyncFn(async () => {
      if (isDisconnected) {
        openConnectModal?.();
      }

      await openAuthenticateModal({
        onAuthenticateSuccess,
        onAuthenticateError,
        onAuthenticateFinish: async () => {
          const { data: identityRefetched } = await reloadIdentity();
          console.log('in ONAUTHENTICATEFINISH', {
            identityRefetched,
            hasSession,
          });

          // TODO: this is a quick fix that shoudl be removed soon
          const { data: hasSessionCheck } = await checkLogin();
          console.log('ONAUTHENTICATE FINSIH', { hasSessionCheck });
          if (hasSessionCheck) {
            onAuthenticateSuccess?.();
          }

          if (!identityRefetched || !identityRefetched.identityId)
            await openSoulnameModal();
        },
      });
    }, [
      reloadIdentity,
      openSoulnameModal,
      isDisconnected,
      openConnectModal,
      onAuthenticateSuccess,
      onAuthenticateError,
      checkLogin,
      hasSession,
    ]);

  return {
    openAuthModal,
    isAuthenticateModalOpen,
  };
};
