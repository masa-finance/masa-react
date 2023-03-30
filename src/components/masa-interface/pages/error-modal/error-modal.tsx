import React from 'react';
import { useMasa } from '../../../../provider';
import { MasaLoading } from '../../../masa-loading';

export const InterfaceErrorModal = ({
  title,
  subtitle,
  handleComplete,
  buttonText
}): JSX.Element => {
  const { isLoading } = useMasa();

  if (isLoading) return <MasaLoading />;

  return (
    <div className="interface-error-modal">
      <h3 className="title">Whoops! 💸</h3>
      <p className="subtitle">{subtitle}</p>
      <button className="masa-button" onClick={handleComplete}>
        {buttonText}
      </button>
    </div>
  );
};
