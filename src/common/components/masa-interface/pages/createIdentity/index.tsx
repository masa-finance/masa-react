import { Input } from 'antd';
import { Button } from 'antd/lib/radio';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useMasa,
  useMetamask,
} from '../../../../helpers/provider/masa-provider';
import { MasaLoading } from '../../../masa-loading';

import './styles.css';

export const InterfaceCreateIdentity = () => {
  const { masa, handlePurchaseSoulname } = useMasa();
  const [loading, setLoading] = useState(false);
  const [soulName, setSoulName] = useState('');

  const [price, setPrice] = useState<any>(0);

  const purchaseName = useCallback(async () => {
    setLoading(true);
    await handlePurchaseSoulname?.(soulName, 1, 'eth');
    setLoading(false);
  }, [handlePurchaseSoulname, soulName, setLoading]);

  useEffect(() => {
    (async () => {
      const p = await masa?.soulNames.getRegistrationPrice(soulName, 1, 'eth');
      setPrice(p);
    })();
  }, [masa, soulName]);

  if (loading) return <MasaLoading />;

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
        <Button className="masa-button" onClick={purchaseName}>
          Claim your soul
        </Button>
      </div>
    </div>
  );
};
