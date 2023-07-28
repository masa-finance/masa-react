import React, { useMemo, useState } from 'react';
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

const SoulnameModal = NiceModal.create(
  ({
    onMintSuccess,
    onMintError,
  }: {
    onMintSuccess?: () => void;
    onMintError?: () => void;
  }) => {
    const { company } = useConfig();
    // const modal = useModal();
    // const { extension } = useSoulnameModal();
    const { extension, soulname, soulNameError } = useCreateSoulnameModal();
    // const { soulname, soulNameError } = useSoulnameInterface();

    const [showError] = useState(false);
    const { onRegisterSoulname, isRegisteringSoulname } = useRegisterSoulname({
      onMintError,
      onMintSuccess,
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
              Claim your <b>{extension}</b> domain name. 5+ character domains
              are <b>FREE,</b> only pay the gas fee.
            </>
          );
        }
      }
    }, [company, extension]);

    if (isRegisteringSoulname) {
      return (
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
      );
    }

    // if (error) {

    // }
    // if (isLoading) {
    //   return <div className='spinner'></Spinner></div>
    // }

    return (
      <Modal
      // className="masa-rodal-container"
      // visible={modal.visible}
      // onClose={() => modal.hide()}
      // width={550}
      // height={615}
      >
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
              onClick={
                onRegisterSoulname
                // soulNameError || !registrationPrice
                //   ? () => setShowError(true)
                //   : handleMinting
              }
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
  }
);

// export const useCreateSoulnameModal = ({
//   onMintSuccess,
//   onMintError,
// }: {
//   onMintSuccess?: () => void;
//   onMintError?: () => void;
// }) => {
//   const [, openCreateSoulnameModal] = useAsyncFn(
//     async () =>
//       NiceModal.show(SoulnameModal, {
//         onMintError,
//         onMintSuccess,
//       }),
//     [onMintError, onMintSuccess]
//   );

//   const closeCreateSoulnameModal = useCallback(
//     () => NiceModal.hide(SoulnameModal),
//     []
//   );

//   return {
//     openCreateSoulnameModal,
//     closeCreateSoulnameModal,
//   };
// };

export const openCreateSoulnameModal = ({
  onMintSuccess,
  onMintError,
}: {
  onMintSuccess?: () => void;
  onMintError?: () => void;
}) =>
  NiceModal.show('create-soulname-modal', {
    onMintError,
    onMintSuccess,
  });

export const CreateSoulnameModal = ({
  onMintSuccess,
  onMintError,
}: {
  onMintSuccess?: () => void;
  onMintError?: () => void;
}) => (
  <CreateSoulnameProvider>
    <SoulnameModal
      id="create-soulname-modal"
      onMintError={onMintError}
      onMintSuccess={onMintSuccess}
    />
  </CreateSoulnameProvider>
);

export default CreateSoulnameModal;
