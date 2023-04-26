import Modals, { ModalContent, ModalName } from './modals/all-modals';
import ModalManagerProvider, {
  useModalManager,
} from '../../provider/modal-provider';
import Backdrop from './backdrop';

export type { ModalName };
export { ModalContent, ModalManagerProvider, useModalManager, Backdrop };
export default Modals;
