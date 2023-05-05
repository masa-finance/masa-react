import { useModalManager } from '../../provider/modules/modal-provider';
import React, { ReactNode, SyntheticEvent } from 'react';
import { createPortal } from 'react-dom';
import Backdrop from './Backdrop';

export interface WrapperModalProps {
  children?: ReactNode;
  onClose?: () => void;
  onConfirm?: () => void;
  onDecline?: () => void;
  confirm?: string;
  decline?: string;
  title?: ReactNode;
  isOpen?: boolean;
}

export const ModalWrapper = ({
  children,
  onClose,
  onConfirm,
  onDecline,
  title,
  decline,
  confirm,
}: WrapperModalProps) => {
  const { domNode } = useModalManager();

  return createPortal(
    <Backdrop
      onClose={() => {
        if (onClose) onClose();
      }}
    >
      <div
        className="masa-modalwrapper-container masa-modal"
        onClick={(e: SyntheticEvent) => e.stopPropagation()} // needed so modal doesnt close on any click
      >
        <header>
          <div className="masa-modalwrapper-button-container">
            <button
              className="masa-button masa-modalwrapper-button"
              onClick={onClose}
            >
              Close
            </button>
          </div>
          <h3 className="masa-modalwrapper-title">{title}</h3>
        </header>
        <section>{children}</section>
        <ul>
          {onDecline && (
            <li>
              <button
                className="masa-button"
                onClick={() => {
                  if (onDecline) onDecline();
                  if (onClose) onClose();
                }}
              >
                {decline || 'No!'}
              </button>
            </li>
          )}
          <li>
            <button
              className="masa-button"
              onClick={() => {
                if (onConfirm) onConfirm();
                if (onClose) onClose();
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
