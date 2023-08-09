import React, { useCallback, useMemo, useState } from 'react';
import NiceModal from '@ebay/nice-modal-react';
import { CreateSoulNameResult } from '@masa-finance/masa-sdk';
import { useConfig } from '../../../../base-provider';
import CreateSoulnameForm from './CreateSoulnameForm';
import { useRegisterSoulname } from './use-register-soulname';
import { MasaLoading } from '../../masa-loading';
import { Modal } from '../modal';
import {
  CreateSoulnameProvider,
  useCreateSoulnameModal,
} from './CreateSoulnameProvider';
import { ModalError } from '../ModalError';
import { useWalletClient } from '../../../../wallet-client/wallet-client-provider';
import { ModalSuccess } from './ModalSuccess';

const SoulnameModal = ({
  onMintError,
  onMintSuccess,
  onRegisterFinish,
  onSuccess,
  onError,
  closeOnSuccess,
}: {
  onMintError?: () => void;
  onMintSuccess?: (result: CreateSoulNameResult) => void;
  onRegisterFinish?: () => void;
  onSuccess?: () => void;
  onError?: () => void;
  closeOnSuccess?: boolean;
}) => {
  const { company } = useConfig();
  const { isLoadingSigner } = useWalletClient();
  const { extension, soulname } = useCreateSoulnameModal();

  const [shouldRestart, setShouldRestart] = useState(false);
  const handleError = useCallback(() => {
    setShouldRestart(true);
    onError?.();
  }, [onError]);

  // const [error, setError] = useState<null | {
  //   title: string;
  //   subtitle: string;
  // }>(null);

  // const handleErrorConfirmed = useCallback(() => setError(null), []);

  const handleMintSuccess = async (result: CreateSoulNameResult) => {
    // // TODO: Remove lint disable
    // // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    // const price = result?.metadata?.value;
    // // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    // const priceValue = (price?.toNumber() as number) ?? '';
    // // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    // const paymentMethod = result?.metadata?.paymentMethod as string;

    // const [symbol, name] = await Promise.all([
    //   masa?.contracts.instances.SoulNameContract.symbol(),
    //   masa?.contracts.instances.SoulNameContract.name(),
    // ]);

    // fireMintEvent(
    //   address ?? '',
    //   masa?.config.networkName ?? '',
    //   masa?.contracts.instances.SoulNameContract.address ?? '',
    //   name ?? '',
    //   symbol ?? '',
    //   'Soulname',
    //   '0', // TODO: Value in USD
    //   'USD',
    //   paymentMethod,
    //   priceValue.toString(),
    //   {
    //     soulname,
    //     wallet_type: connector?.name ?? "Unknown"
    //   }
    // );
    onMintSuccess?.(result);
  };

  const {
    hasRegisteredSoulname,
    onRegisterSoulname,
    isRegisteringSoulname,
    errorRegisterSoulname,
  } = useRegisterSoulname({
    onMintError,
    onMintSuccess: handleMintSuccess,
    onRegisterFinish,
  });
  
  // * handlers
  const handleRegisterSoulname = useCallback(async () => {
    setShouldRestart(false);
    await onRegisterSoulname();
  }, [onRegisterSoulname]);

  const SoulnameTitle = useMemo(() => {
    switch (company) {
      case 'Brozo':
      case 'Base Universe': {
        return `Register a ${company} ${extension ?? ''} Name`;
      }
      default: {
        return `Register a ${extension ?? ''} Name`;
      }
    }
  }, [company, extension]);

  const SoulnameSubtitle = useMemo(() => {
    switch (company) {
      case 'Base Universe': {
        return (
          <>
            Claim your <b>{extension}</b> domain name before it&apos;s taken!
            Domains are <b>FREE on testnet,</b> only pay the gas to mint.
          </>
        );
      }
      case 'Brozo': {
        return (
          <>
            Claim your rare <b>{extension}</b> domain name before it’s taken!
          </>
        );
      }
      default: {
        return (
          <>
            Claim your <b>{extension}</b> domain name. 5+ character domains are{' '}
            <b>FREE,</b> only pay the gas fee.
          </>
        );
      }
    }
  }, [company, extension]);

  if (isRegisteringSoulname) {
    return (
      <Modal>
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
          }}
        >
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <h1 className="title">Minting your domain</h1>
            <h1 className="title">
              {soulname}
              <b>{extension}</b>
            </h1>
            <MasaLoading />
          </div>
        </div>
      </Modal>
    );
  }

  if (errorRegisterSoulname && !shouldRestart) {
    return (
      <Modal>
        <ModalError
          subtitle={errorRegisterSoulname.message}
          onComplete={handleError}
          buttonText="Try again"
        />
      </Modal>
    );
  }

  if (hasRegisteredSoulname && !shouldRestart) {
    return (
      <ModalSuccess
        extension={extension}
        closeOnSuccess={closeOnSuccess}
        onFinish={onSuccess}
      />
    );
  }

  // }
  if (isLoadingSigner) {
    return (
      <Modal>
        <MasaLoading />
      </Modal>
    );
  }

  return (
    <Modal>
      <article className="interface-create-soulname">
        <header className="title-container">
          <h3 className="title">{SoulnameTitle}</h3>
          <p className="subtitle">{SoulnameSubtitle}</p>
        </header>

        <CreateSoulnameForm />

        <div style={{ width: '100%' }}>
          <p id="slippage-disclaimer">
            Prices may vary slightly due to market price and slippage.
          </p>
          <button
            type="button"
            id="gtm_register_domain"
            className="masa-button"
            onClick={handleRegisterSoulname}
          >
            Register your domain
          </button>
          {/* {showError && soulNameError && (
            <p style={{ color: 'red', width: '100%', textAlign: 'center' }}>
              {errorRegisterSoulname}
            </p>
          )} */}
        </div>
      </article>
    </Modal>
  );
};

export const CreateSoulnameModal = NiceModal.create(
  ({
    onMintSuccess,
    onMintError,
    onRegisterFinish,
    onSuccess,
    onError,
    closeOnSuccess,
  }: {
    onMintSuccess?: () => void;
    onMintError?: () => void;
    onRegisterFinish?: () => void;
    onSuccess?: () => void;
    onError?: () => void;
    closeOnSuccess?: boolean;
  }) => (
    <CreateSoulnameProvider>
      <SoulnameModal
        closeOnSuccess={closeOnSuccess}
        onMintError={onMintError}
        onMintSuccess={onMintSuccess}
        onRegisterFinish={onRegisterFinish}
        onSuccess={onSuccess}
        onError={onError}
      />
    </CreateSoulnameProvider>
  )
);

export const openCreateSoulnameModal = ({
  onMintSuccess,
  onMintError,
  onRegisterFinish,
  onSuccess,
  onError,
  closeOnSuccess,
}: {
  onMintSuccess?: () => void;
  onMintError?: () => void;
  onRegisterFinish?: () => void;
  onSuccess?: () => void;
  onError?: () => void;
  closeOnSuccess?: boolean;
}) =>
  NiceModal.show(CreateSoulnameModal, {
    onMintError,
    onMintSuccess,
    onRegisterFinish,
    onSuccess,
    onError,
    closeOnSuccess,
  });

export default CreateSoulnameModal;
