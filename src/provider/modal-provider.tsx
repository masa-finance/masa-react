import { WrapperModalProps } from '../components/new-modal/new-modal';
import Modals, {
  ModalContent,
  ModalName,
} from '../components/new-modal/modals/all-modals';

import React, {
  ElementType,
  ReactNode,
  createContext,
  useContext,
} from 'react';
import { useState } from 'react';
import { useToggle } from 'react-use';

interface ModalManagerProviderValue {
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
  const [currentModal, setCurrentModal] = useState<ModalName>('IntroModal');
  const [modalContentProps, setModalContentProps] = useState<any>({});
  const [modalWrapperProps, setModalWrapperProps] = useState<WrapperModalProps>(
    {}
  );
  const openModal = ({
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
    setModalWrapperProps(wrapperProps as WrapperModalProps);
    toggleModal(true);
  };
  // const reset = () => {
  //   setTitle('');
  //   setCurrentModal('IntroModal');
  //   setModalContentProps({});
  //   setModalWrapperProps({});
  // };
  const domNode = document.getElementById('modal-mount');
  let Content = ModalContent[currentModal];
  if (!Content) Content = ModalContent['Default'] as ElementType;

  return (
    <ModalManagerContext.Provider
      value={{
        isModalOpen,
        toggleModal,
        domNode,
        openModal,
      }}
    >
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
};

export const useModalManager = (): ModalManagerProviderValue =>
  useContext(ModalManagerContext);
export default ModalManagerProvider;
