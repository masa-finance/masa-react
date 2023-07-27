import React, { ReactNode, SyntheticEvent } from 'react';
import { createPortal } from 'react-dom';
import cx from 'classnames';
import Backdrop from './Backdrop';
import { useModalManager } from '../../provider/modules/modal-provider';

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
  const buttonClassName = cx({
    'masa-button': true,
    'authenticate-button':
      [onDecline, onConfirm].map(Boolean).filter(Boolean).length === 1,
  });

  const listItemClassName = cx({
    'flex-50': [onDecline, onConfirm].map(Boolean).filter(Boolean).length === 2,
    'flex-100':
      [onDecline, onConfirm].map(Boolean).filter(Boolean).length === 1,
  });

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
            <span onClick={onClose}>x</span>
          </div>
          <h3 className="masa-modalwrapper-title">{title}</h3>
        </header>
        <section>{children}</section>
        <ul>
          {onDecline && (
            <li className={listItemClassName}>
              <button
                className={buttonClassName}
                onClick={() => {
                  if (onDecline) onDecline();
                  if (onClose) onClose();
                }}
              >
                {decline}
              </button>
            </li>
          )}
          <li className={listItemClassName}>
            {onConfirm && (
              <button
                className={buttonClassName}
                onClick={() => {
                  if (onConfirm) onConfirm();
                  if (onClose) onClose();
                }}
              >
                {confirm}
              </button>
            )}
          </li>
        </ul>
      </div>
    </Backdrop>,
    domNode as Element
  );
};
