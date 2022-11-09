import { Button } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useMasa } from '../../../../helpers/provider/use-masa';
import { MasaLoading } from '../../../masa-loading';

export const InterfaceConnected = () => {
  const { masa, handleLogout, closeModal } = useMasa();
  const [loading, setLoading] = useState(false);

  const [soulnames, setSoulnames] = useState<any[] | undefined | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading?.(true);

        const soulnameList = await masa?.soulNames.list();
        setLoading?.(false);

        setSoulnames(soulnameList);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [masa, setSoulnames, setLoading]);

  console.log({ soulnames });

  const name = useMemo(() => {
    if (soulnames?.length) {
      return soulnames[0].tokenDetails.sbtName;
    } else {
      return '';
    }
  }, [soulnames]);

  if (loading) return <MasaLoading />;
  return (
    <>
      <h3>Hello, {name}</h3>
      <p>
        Now you that are using your soul, you can unlock all the power of your
        web3 soulbound identity!
      </p>

      <Button className="masa-button" onClick={() => closeModal?.()}>
        Continue with Teller
      </Button>
      <div className="dont-have-a-wallet" onClick={handleLogout}>
        <a>
          <p>I don't want to use this wallet</p>
        </a>
      </div>
    </>
  );
};
