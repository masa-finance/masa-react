import React from 'react';
import { MasaLoading } from '../masa-loading';

export const ModalError = ({
  subtitle,
  handleComplete,
  buttonText,
  isLoading,
}: {
  subtitle: string;
  handleComplete: () => void;
  buttonText: string;
  isLoading?: boolean;
}): JSX.Element => {
  if (isLoading) return <MasaLoading />;

  return (
    <div className="interface-error-modal">
      <h3 className="title">Whoops! 💸</h3>
      <p className="subtitle">{subtitle}</p>
      <button type="button" className="masa-button" onClick={handleComplete}>
        {buttonText}
      </button>
    </div>
  );
};
