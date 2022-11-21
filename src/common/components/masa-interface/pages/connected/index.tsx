import React, { useEffect, useMemo } from 'react';
import { useMasa } from '../../../../helpers/provider/use-masa';
import { MasaLoading } from '../../../masa-loading';

export const InterfaceConnected = () => {
  const {
    handleLogout,
    closeModal,
    company,
    soulnames,
    loadSoulnames,
    loading,
  } = useMasa();

  useEffect(() => {
    loadSoulnames?.();
  }, [loadSoulnames]);

  const name = useMemo(() => {
    if (soulnames?.length) {
      return soulnames[0].tokenDetails.sbtName;
    } else {
      return null;
    }
  }, [soulnames]);

  if (loading) return <MasaLoading />;
  return (
    <div className="interface-connected">
      <div>
        <h3>
          Hello{name ? ', ' : '!'} {name}
        </h3>
        <p>
          Woo hoo!
          <br /> you have successfully connected your wallet.
        </p>
      </div>
      <div>
        <button className="masa-button" onClick={() => closeModal?.()}>
          Continue with {company ?? 'Masa'}
        </button>
        <div className="dont-have-a-wallet" onClick={() => handleLogout?.()}>
          <a>
            <p>I don't want to use this wallet</p>
          </a>
        </div>
      </div>
    </div>
  );
};
