import React from 'react';
import { MasaLoading } from '../masa-loading';

export const ModalError = ({
  subtitle,
  onComplete,
  buttonText,
  isLoading,
}: {
  subtitle?: string;
  onComplete?: () => void;
  buttonText?: string;
  isLoading?: boolean;
}): JSX.Element => {
  if (isLoading) return <MasaLoading />;

  return (
    <div className="interface-error-modal">
      <h3 className="title">Whoops! 💸</h3>
      <p className="subtitle">{subtitle}</p>
      <button type="button" className="masa-button" onClick={onComplete}>
        {buttonText}
      </button>
    </div>
  );
};
