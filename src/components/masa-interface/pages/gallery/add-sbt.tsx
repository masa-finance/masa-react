import { useLocalStorage } from '../../../../provider';
import React, { useCallback, useState } from 'react';
import { Input } from '../../../../components/input';
import Toggle from '../../../../components/toggle/toggle';
export const AddSBT = ({ back }) => {
  const { localStorageSet } = useLocalStorage();
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');

  const [isCollection, setIsCollection] = useState(false);

  const handleToggle = () => {
    setIsCollection(!isCollection);
  };

  const handleAddSBT = useCallback(() => {
    localStorageSet(`masa-gallery-${isCollection ? 'sbt' : 'badge'}-${name}`, {
      address,
      name,
    });

    back();
  }, [address, setAddress, name, setName, isCollection, back]);

  return (
    <div className="add-sbt-container">
      <div>
        <div>
          <h2>Add an SBT</h2>
          <p>Insert a custom SBT contract to the gallery</p>
        </div>
        <div className="sbt-inputs">
          <Input
            label="SBT Name"
            required
            onChange={(e: any) => setName(e.target.value)}
            placeholder="MySSBT"
          />
          <Input
            label="Address"
            required
            onChange={(e: any) => setAddress(e.target.value)}
            placeholder="0x..."
          />

          <div className="toggle-container">
            <label>Collection</label>
            <Toggle handleToggle={handleToggle} isChecked={isCollection} />
          </div>
        </div>
      </div>
      <div className="add-sbt-button">
        <button onClick={back} className="masa-button">
          Back
        </button>
        <button onClick={handleAddSBT} className="masa-button">
          Add
        </button>
      </div>
    </div>
  );
};
