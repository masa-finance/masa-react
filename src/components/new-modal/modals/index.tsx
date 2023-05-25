import React from 'react';
import AuthenticateModal from './AuthenticateModal';
import ConnectedModal from './ConnectedModal';
import CreateCreditScoreModal from './CreateCreditScoreModal';
import CreateIdentityModal from './CreateIdentityModal';
import CreateSoulnameModal from './CreateSoulnameModal';
import SuccessCreateIdentityModal from './SuccessCreateIdentityModal';
import SwitchChainModal from './SwitchChainModal';
import Backdrop from '../Backdrop';
import { ModalWrapper } from '../Modal';
import InterfaceMasaGreen from '../../../components/masa-interface/pages/masa-green';
export const Modals = {
  AuthenticateModal,
  ConnectedModal,
  CreateCreditScoreModal,
  CreateIdentityModal,
  CreateSoulnameModal,
  SuccessCreateIdentityModal,
  SwitchChainModal,
  Backdrop,
  ModalWrapper,
};

const Default = () => <></>;

export const ModalContent = {
  AuthenticateModal,
  ConnectedModal,
  CreateCreditScoreModal,
  CreateIdentityModal,
  CreateSoulnameModal,
  SuccessCreateIdentityModal,
  SwitchChainModal,
  InterfaceMasaGreen,
  Default,
};
export type ModalName =
  | 'AuthenticateModal'
  | 'ConnectedModal'
  | 'CreateCreditScoreModal'
  | 'CreateIdentityModal'
  | 'CreateSoulnameModal'
  | 'SuccessCreateIdentityModal'
  | 'SwitchChainModal'
  | 'InterfaceMasaGreen'
  | 'Default';
