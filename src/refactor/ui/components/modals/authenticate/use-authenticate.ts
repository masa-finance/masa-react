import { useAsyncFn } from 'react-use';
import { useCallback } from 'react';
import { useWallet } from '../../../../wallet-client/wallet/use-wallet';
import { openAuthenticateModal } from './authenticate';
import { openCreateSoulnameModal } from '../create-soulname';
import { useIdentity, useSession } from '../../../../masa';
import { useNetwork } from '../../../../wallet-client';

export const useAuthenticate = ({
  onAuthenticateSuccess,
  onAuthenticateError,
  onMintSuccess,
  onMintError,
  onRegisterFinish,
  onSuccess,
  onError,
}: {
  onAuthenticateSuccess?: (payload: {
    address?: string;
    walletType?: string;
  }) => void;
  onAuthenticateError?: () => void;
  onMintSuccess?: () => void;
  onMintError?: () => void;
  onRegisterFinish?: () => void;
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  const { openConnectModal, isDisconnected, signer } = useWallet();
  const { hasSession, checkLogin, getSession } = useSession();
  const { pendingConnector } = useNetwork();
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
            const { data: session } = await getSession();
            console.log('BEFORE AUTH SUCCESS', {
              session,
              pendingConnector,
              name: pendingConnector?.name,
              signer,
            });
            onAuthenticateSuccess?.({
              address: session?.user.address,
              walletType: pendingConnector?.name,
            });
          }

          if (!identityRefetched || !identityRefetched.identityId)
            await openSoulnameModal();
        },
      });
    }, [
      reloadIdentity,
      signer,
      openSoulnameModal,
      isDisconnected,
      openConnectModal,
      onAuthenticateSuccess,
      onAuthenticateError,
      checkLogin,
      hasSession,
      getSession,
      // connector?.name,
      pendingConnector,
    ]);

  return {
    openAuthModal,
    isAuthenticateModalOpen,
  };
};
