import React, { useCallback, useMemo, useState } from 'react';
import NiceModal from '@ebay/nice-modal-react';
// import Rodal from 'rodal';
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

const SoulnameModal = ({
  onMintError,
  onMintSuccess,
  onRegisterFinish,
}: {
  onMintError?: () => void;
  onMintSuccess?: () => void;
  onRegisterFinish?: () => void;
}) => {
  const { company } = useConfig();
  const { isLoadingSigner } = useWalletClient();
  // const modal = useModal();
  // const { extension } = useSoulnameModal();
  const { extension, soulname, soulNameError } = useCreateSoulnameModal();
  // const { soulname, soulNameError } = useSoulnameInterface();
  const [error, setError] = useState<null | {
    title: string;
    subtitle: string;
  }>(null);

  const handleErrorConfirmed = useCallback(() => setError(null), []);

  const [showError] = useState(false);
  const { onRegisterSoulname, isRegisteringSoulname } = useRegisterSoulname({
    onMintError,
    onMintSuccess,
    onRegisterFinish,
  });
  // * handlers

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

  if (error) {
    return (
      <Modal>
        <ModalError
          {...error}
          handleComplete={handleErrorConfirmed}
          buttonText="Try again"
        />
      </Modal>
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
            onClick={onRegisterSoulname}
          >
            Register your domain
          </button>
          {showError && soulNameError && (
            <p style={{ color: 'red', width: '100%', textAlign: 'center' }}>
              {soulNameError}
            </p>
          )}
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
  }: {
    onMintSuccess?: () => void;
    onMintError?: () => void;
    onRegisterFinish?: () => void;
  }) => (
    <CreateSoulnameProvider>
      <SoulnameModal
        onMintError={onMintError}
        onMintSuccess={onMintSuccess}
        onRegisterFinish={onRegisterFinish}
      />
    </CreateSoulnameProvider>
  )
);

export const openCreateSoulnameModal = ({
  onMintSuccess,
  onMintError,
  onRegisterFinish,
}: {
  onMintSuccess?: () => void;
  onMintError?: () => void;
  onRegisterFinish?: () => void;
}) =>
  NiceModal.show(CreateSoulnameModal, {
    onMintError,
    onMintSuccess,
    onRegisterFinish,
  });

export default CreateSoulnameModal;
