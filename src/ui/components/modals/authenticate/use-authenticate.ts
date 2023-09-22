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
  showCreateSoulnameModal = true,
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
  showCreateSoulnameModal?: boolean;
} = {}) => {
  const { openConnectModal, isDisconnected } = useWallet();
  const { checkLogin, getSession } = useSession();
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

  const [{ loading: isAuthenticateModalOpen }, openAuthModal] = useAsyncFn(
    async (config?: { disableSoulnamePurchase?: boolean }) => {
      const disable = Boolean(config?.disableSoulnamePurchase);

      console.log({
        disable,
        disablePurchase: config?.disableSoulnamePurchase,
      });

      if (isDisconnected) {
        openConnectModal?.();
      }

      await openAuthenticateModal({
        onAuthenticateSuccess,
        onAuthenticateError,
        onAuthenticateFinish: async () => {
          const { data: identityRefetched } = await reloadIdentity();

          // TODO: this is a quick fix that shoudl be removed soon
          const { data: hasSessionCheck } = await checkLogin();
          if (hasSessionCheck) {
            const { data: session } = await getSession();
            onAuthenticateSuccess?.({
              address: session?.user.address,
              walletType: pendingConnector?.name,
            });
          }

          if (
            showCreateSoulnameModal &&
            !disable &&
            (!identityRefetched || !identityRefetched.identityId)
          )
            await openSoulnameModal();
        },
      });
    },
    [
      reloadIdentity,
      openSoulnameModal,
      isDisconnected,
      openConnectModal,
      onAuthenticateSuccess,
      onAuthenticateError,
      checkLogin,
      getSession,
      pendingConnector?.name,
      showCreateSoulnameModal,
    ]
  );

  return {
    openAuthModal,
    isAuthenticateModalOpen,
  };
};