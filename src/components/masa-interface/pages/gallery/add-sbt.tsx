import { useLocalStorage } from '../../../../provider';
import React, { useCallback, useState } from 'react';
export const AddSBT = () => {
  const { localStorageSet } = useLocalStorage();
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');

  const handleAddSBT = useCallback(() => {
    localStorageSet(`masa-gallery-sbt-${name}`, { address, name });
  }, [address, setAddress, name, setName]);
  return (
    <div>
      <input placeholder="0x..." onChange={(e) => setAddress(e.target.value)} />
      <input placeholder="My SBT" onChange={(e) => setName(e.target.value)} />
      <button onClick={handleAddSBT}>Add</button>
    </div>
  );
};
