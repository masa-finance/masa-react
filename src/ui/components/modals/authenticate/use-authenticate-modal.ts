import { useMemo } from 'react';
import { useAsyncFn } from 'react-use';
import { useWallet } from '../../../../wallet-client/wallet/use-wallet';
import { useSession } from '../../../../masa/use-session';
import { useConfig } from '../../../../base-provider';

export const useAuthenticateModal = ({
  onAuthenticateSuccess,
  onAuthenticateError,
}: {
  onAuthenticateSuccess?: (payload: {
    address?: string;
    walletType?: string;
  }) => void;
  onAuthenticateError?: () => void;
  onClose?: () => void;
}) => {
  const { hasAddress, isConnected, signer, connector } = useWallet();
  const { hasSession, loginSession } = useSession();
  const { company } = useConfig();

  const needsWalletConnection = useMemo(
    () => !hasSession && !isConnected && !hasAddress,
    [hasSession, isConnected, hasAddress]
  );
  const showAuthenticateView = useMemo(
    () => isConnected && !hasSession && signer && hasAddress,
    [isConnected, hasSession, signer, hasAddress]
  );

  const successMessage = useMemo(() => {
    switch (company) {
      case 'Masa': {
        return `Your wallet is now connected. Start your soulbound journey by minting
    a Masa Soulbound Identity and claiming a unique Masa Soul Name.`;
      }
      case 'Celo': {
        return `Your wallet is now connected. Start your journey by minting a Prosperity Passport and claiming a unique .celo domain name.`;
      }
      case 'Base': {
        return 'Your wallet is now connected. Start your Base Camp journey by claiming a unique .base domain name.';
      }
      case 'Base Universe': {
        return 'Your wallet is now connected. Start your Base Universe journey by claiming a unique .bu domain name.';
      }
      case 'Brozo': {
        return 'Your wallet is connected. Start your Brozo journey by minting a unique .bro domain name.';
      }
      default: {
        return `Your wallet is now connected. Start your soulbound journey by minting
          a Masa Soulbound Identity and claiming a unique Masa Soul Name.`;
      }
    }
  }, [company]);

  const [{ loading: isAuthenticating }, onAuthenticateStart] =
    useAsyncFn(async () => {
      const result = await loginSession?.();
      if (!result) {
        onAuthenticateError?.();
        return result;
      }

      if (result && result.address) {
        onAuthenticateSuccess?.({
          address: result.address,
          walletType: connector?.name,
        });
      }

      return result;
    }, [loginSession, onAuthenticateError, onAuthenticateSuccess, connector]);

  const showSwitchWalletButton = useMemo(
    () => !hasSession && isConnected,
    [hasSession, isConnected]
  );
  return {
    needsWalletConnection,
    showAuthenticateView,
    successMessage,

    isAuthenticating,
    onAuthenticateStart,
    showSwitchWalletButton,
  };
};
