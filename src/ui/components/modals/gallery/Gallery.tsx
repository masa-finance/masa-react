import React from 'react';
import NiceModal from '@ebay/nice-modal-react';

import { MasaLoading } from '../../masa-loading';
import { Modal } from '../modal';

import { useWalletClient } from '../../../../wallet-client/wallet-client-provider';
import { useMasaClient } from '../../../../masa-client';
import { useTabs } from './useTabs';
import { Gallery } from '../../gallery';

const GalleryModal = () => {
  const { isLoadingSigner } = useWalletClient();
  const { sdk: masa } = useMasaClient();

  const { tabs, isLoading } = useTabs();

  if (isLoadingSigner || isLoading) {
    return (
      <Modal>
        <MasaLoading />
      </Modal>
    );
  }

  return (
    <Modal>
      <section className="masa-gallery-container">
        {masa && tabs && tabs?.length > 0 && (
          <Gallery tabs={tabs} wrapperClassName="masa-gallery" />
        )}
        {!masa && (
          <aside className="not-connected-message">
            <h2>It looks like you are not connected to Masa</h2>
          </aside>
        )}

        {!tabs?.length && (
          <aside className="not-connected-message">
            <h2>It looks like you do not have any SBTs</h2>
          </aside>
        )}
      </section>
    </Modal>
  );
};

export const GalleryModalWrapper = NiceModal.create(() => <GalleryModal />);

export const openGalleryModal = () => NiceModal.show(GalleryModalWrapper, {});

export default openGalleryModal;
