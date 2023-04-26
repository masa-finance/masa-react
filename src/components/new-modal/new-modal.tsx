import './styles.scss';
import ReactDOM from 'react-dom';
import React, { ReactNode, SyntheticEvent } from 'react';
import Backdrop from './backdrop';
import { useModalManager } from '../../provider/modal-provider';

export interface WrapperModalProps {
  children?: ReactNode;
  onClose?: any;
  onConfirm?: () => void;
  onDecline?: () => void;
  confirm?: string;
  decline?: string;
  title?: ReactNode;
  isOpen?: boolean;
}

const ModalWrapper = ({
  children,
  onClose,
  onConfirm,
  onDecline,
  title,
  decline,
  confirm,
  isOpen,
}: WrapperModalProps) => {
  console.log({ isOpen });
  const { domNode } = useModalManager();
  return ReactDOM.createPortal(
    <Backdrop onClose={onClose}>
      <div // Backdrop
        className="masa-backdrop-content-container"
        onClick={(e: SyntheticEvent) => e.stopPropagation()} // needed so modal doesnt close on any click
      >
        <header>
          <li>
            <button
              onClick={() => {
                if (onDecline) onDecline();
                onClose();
              }}
            >
              X
            </button>
          </li>
          <h3>{title}</h3>
        </header>
        <section>{children}</section>
        <ul>
          {decline && (
            <li>
              <button
                onClick={() => {
                  if (onDecline) onDecline();
                  onClose();
                }}
              >
                {decline || 'No!'}
              </button>
            </li>
          )}
          <li>
            <button
              onClick={() => {
                if (onConfirm) onConfirm();
                onClose();
              }}
            >
              {confirm || 'Okay'}
            </button>
          </li>
        </ul>
      </div>
    </Backdrop>,
    domNode as Element
  );
};

export default ModalWrapper;
