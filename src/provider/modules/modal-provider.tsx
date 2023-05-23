import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useToggle } from 'react-use';
import {
  ModalContent,
  ModalName,
  Modals,
  WrapperModalProps,
} from '../../components/new-modal';

export interface ModalManagerProviderValue {
  domNode: Element | DocumentFragment | HTMLElement | null;
  isModalOpen: boolean;
  title?: string;
  toggleModal: (nextValue?: any) => void;
  openModal: ({
    name,
    title,
    wrapperProps,
    contentProps,
  }: {
    name: ModalName;
    title?: ReactNode;
    wrapperProps?: WrapperModalProps;
    contentProps: any;
  }) => void;
}

export const ModalManagerContext = createContext(
  {} as ModalManagerProviderValue
);

export const ModalManagerProvider = ({ children }: { children: ReactNode }) => {
  const [isModalOpen, toggleModal] = useToggle(false);
  const [title, setTitle] = useState<ReactNode>('');
  const [currentModal, setCurrentModal] =
    useState<ModalName>('AuthenticateModal');
  const [modalContentProps, setModalContentProps] = useState({});
  const [modalWrapperProps, setModalWrapperProps] = useState<WrapperModalProps>(
    {}
  );
  const openModal = useCallback(
    ({
      name,
      title,
      wrapperProps,
      contentProps,
    }: {
      name: ModalName;
      title?: ReactNode;
      wrapperProps?: WrapperModalProps;
      contentProps: any;
    }) => {
      setTitle(title);
      setCurrentModal(name);
      setModalContentProps(contentProps);
      setModalWrapperProps(wrapperProps || {});
      toggleModal(true);
    },
    [
      setTitle,
      setCurrentModal,
      setModalContentProps,
      setModalWrapperProps,
      toggleModal,
    ]
  );
  const reset = useCallback(() => {
    setTitle('');
    setCurrentModal('AuthenticateModal');
    setModalContentProps({});
    setModalWrapperProps({});
  }, [setTitle, setCurrentModal, setModalContentProps, setModalWrapperProps]);

  const domNode = document.querySelector('#modal-mount');
  let Content = ModalContent[currentModal];
  if (!Content) Content = ModalContent.Default;

  const modalManagerProviderValue = useMemo(
    () => ({
      isModalOpen,
      toggleModal,
      domNode,
      openModal,
      reset,
    }),
    [isModalOpen, toggleModal, domNode, openModal, reset]
  );
  return (
    <ModalManagerContext.Provider value={modalManagerProviderValue}>
      {children}
      {isModalOpen && (
        <Modals.ModalWrapper
          title={title}
          isOpen={isModalOpen}
          onClose={() => toggleModal(false)}
          {...modalWrapperProps}
        >
          <Content {...modalContentProps} />
        </Modals.ModalWrapper>
      )}
    </ModalManagerContext.Provider>
  );
}

export const useModalManager = (): ModalManagerProviderValue =>
  useContext(ModalManagerContext);
export default ModalManagerProvider;
