import { Input } from 'antd';
import { Button } from 'antd/lib/radio';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useMasa,
  useMetamask,
} from '../../../../helpers/provider/masa-provider';

import './styles.css';

export const InterfaceCreateIdentity = () => {
  const { masa, setLoading } = useMasa();
  const [soulName, setSoulName] = useState('');

  const purchaseSoulname = useCallback(async () => {
    const a = await masa?.identity.create(soulName, 1, 'eth');
    console.log(a);
    return 0;
  }, [masa]);

  const [price, setPrice] = useState<any>(0);
  useEffect(() => {
    (async () => {
      setLoading?.(true)
      const p = await masa?.soulNames.getRegistrationPrice(soulName, 1, 'eth');
      setPrice(p);
      setLoading?.(false)
    })();
  }, [masa, soulName]);

  return (
    <div className="masa-soulname-picker-container">
      <div className="masa-soulname-picker-title">
        <h3>It looks like you don't have an identity yet</h3>
        <p>Create your identity and pick your soulname here!</p>
      </div>
      <div className="masa-soulname-picker">
        <div className="masa-soulname-picker-input-container">
          <label>Soul name*</label>
          <Input
            placeholder="Soulname"
            value={soulName}
            className="masa-input"
            onChange={(e) => setSoulName(e.target.value)}
          />
        </div>

        <div className="masa-soulname-row-form">
          <div>
            <label>Registration price</label>
            <Input
              placeholder="0.006 ETH"
              value={price.toString()}
              className="masa-input"
              onChange={(e) => setSoulName(e.target.value)}
            />
          </div>
        </div>
        <Button className="masa-button" onClick={purchaseSoulname}>
          Claim your soul
        </Button>
      </div>
    </div>
  );
};
