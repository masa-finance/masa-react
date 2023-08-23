import React from 'react';
import NiceModal from '@ebay/nice-modal-react';

import { MasaLoading } from '../../masa-loading';
import { Modal } from '../modal';

import { useWalletClient } from '../../../../wallet-client/wallet-client-provider';
import { useMasaClient } from '../../../../masa-client';
import { useTabs } from './useTabs';
import { Tabs } from '../../../../../components/masa-interface/pages/gallery/tabs';

const Gallery = () => {
  const { isLoadingSigner } = useWalletClient();
  const { sdk: masa } = useMasaClient();

  const { sbts: tabs, isLoading } = useTabs();

  if (isLoadingSigner || isLoading) {
    return (
      <Modal>
        <MasaLoading />
      </Modal>
    );
  }

  return (
    <Modal>
      <article className="masa-gallery-container">
        {masa && tabs && tabs.length > 0 && (
          <Tabs tabs={tabs} wrapperClassName="masa-gallery" />
        )}
        {!masa && (
          <div className="not-connected-message">
            <h2>It looks like you are not connected to Masa</h2>
          </div>
        )}

        {!tabs?.length && (
          <div className="not-connected-message">
            <h2>It looks like you do not have any SBTs</h2>
          </div>
        )}
      </article>
    </Modal>
  );
};

export const GalleryModal = NiceModal.create(() => <Gallery />);

export const OpenGalleryModal = () => NiceModal.show(GalleryModal, {});

export default OpenGalleryModal;
