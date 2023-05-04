import { useCallback } from 'react';
import { useModalManager } from '../modal-provider';

export const useMasaModals = () => {
  const { openModal } = useModalManager();

  const openAuthenticateModal = useCallback(
    () =>
      openModal({
        name: 'AuthenticateModal',
        contentProps: {},
        wrapperProps: {
          confirm: 'Authenticate',
          decline: 'Cancel',
          onConfirm: () => {
            console.log('Authenticated');
          },
        },
      }),
    [openModal]
  );

  const openInterfaceMasaGreen = useCallback(
    () =>
      openModal({
        name: 'InterfaceMasaGreen',
        contentProps: {},
        wrapperProps: {
          confirm: 'Authenticate',
          decline: 'Cancel',
          onConfirm: () => {
            console.log('Authenticated');
          },
        },
      }),
    [openModal]
  );

  const openConnectedModal = useCallback(
    () =>
      openModal({
        name: 'ConnectedModal',
        contentProps: {},
        wrapperProps: {
          confirm: 'Create',
          decline: 'Cancel',
          onConfirm: () => {
            console.log('Connection Confirmed');
          },
        },
      }),
    [openModal]
  );

  const openCreateCreditScoreModal = useCallback(
    () =>
      openModal({
        name: 'CreateCreditScoreModal',
        contentProps: {},
        wrapperProps: {
          confirm: 'Create',
          decline: 'Cancel',
          onConfirm: () => {
            console.log('Create Credit Score Confirmed');
          },
        },
      }),
    [openModal]
  );

  const openCreateIdentityModal = useCallback(
    () =>
      openModal({
        name: 'CreateIdentityModal',
        contentProps: {},
        wrapperProps: {
          confirm: 'Create',
          decline: 'Cancel',
          onConfirm: () => {
            console.log('Create Identity Confirmed');
          },
        },
      }),
    [openModal]
  );

  const openCreateSoulnameModal = useCallback(
    () =>
      openModal({
        name: 'CreateSoulnameModal',
        contentProps: {},
        wrapperProps: {
          confirm: 'Create',
          decline: 'Cancel',
          onConfirm: () => {
            console.log('Create Soulname Confirmed');
          },
        },
      }),
    [openModal]
  );

  const openSuccessCreateIdentityModal = useCallback(
    () =>
      openModal({
        name: 'SuccessCreateIdentityModal',
        contentProps: {},
        wrapperProps: {
          confirm: 'Create',
          decline: 'Cancel',
          onConfirm: () => {
            console.log('Successfully created identity!');
          },
        },
      }),
    [openModal]
  );

  const openSwitchChainModal = useCallback(
    () =>
      openModal({
        name: 'SwitchChainModal',
        contentProps: {},
        wrapperProps: {
          confirm: 'Create',
          decline: 'Cancel',
          onConfirm: () => {
            console.log('Switched chain!');
          },
        },
      }),
    [openModal]
  );

  return {
    openAuthenticateModal,
    openConnectedModal,
    openCreateCreditScoreModal,
    openCreateIdentityModal,
    openCreateSoulnameModal,
    openSuccessCreateIdentityModal,
    openSwitchChainModal,
    openInterfaceMasaGreen
  };
};
