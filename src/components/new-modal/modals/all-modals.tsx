import ModalWrapper, { WrapperModalProps } from '../new-modal';
import React, { ElementType } from 'react';

export type ModalName =
  | 'Default'
  | 'IntroModal'
  | 'Default'
  | 'DiscordModal'
  | 'TicketModal'
  | 'ConfirmationModal';

const Modals = {
  ModalWrapper,
  // IntroModal,
  // DiscordModal,
  // TicketModal,
  // ConfirmationModal,
};

const Default = () => <div>Default Modal</div>;

export const ModalContent: { [key in ModalName]?: ElementType } = {
  Default,
  //   IntroModal,
  //   DiscordModal,
  //   TicketModal,
  //   ConfirmationModal,
};

export type OpenModalFunc = ({
  name,
  title,
  wrapperProps,
  contentProps,
}: {
  name: ModalName;
  title?: React.ReactNode;
  wrapperProps?: WrapperModalProps | undefined;
  contentProps: any;
}) => void;

export default Modals;
