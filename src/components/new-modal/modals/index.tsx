import AuthenticateModal from './AuthenticateModal';
import ConnectedModal from './ConnectedModal';
import CreateCreditScoreModal from './CreateCreditScoreModal';
import CreateIdentityModal from './CreateIdentityModal';
import CreateSoulnameModal from './CreateSoulnameModal';
import SuccessCreateIdentityModal from './SuccessCreateIdentityModal';
import SwitchChainModal from './SwitchChainModal';
import Backdrop from '../Backdrop';
import { ModalWrapper } from '../Modal';
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

export const ModalContent = {
  AuthenticateModal,
  ConnectedModal,
  CreateCreditScoreModal,
  CreateIdentityModal,
  CreateSoulnameModal,
  SuccessCreateIdentityModal,
  SwitchChainModal,
};
export type ModalName =
  | 'AuthenticateModal'
  | 'ConnectedModal'
  | 'CreateCreditScoreModal'
  | 'CreateIdentityModal'
  | 'CreateSoulnameModal'
  | 'SuccessCreateIdentityModal'
  | 'SwitchChainModal';
