import React, { useState } from 'react';
import { InterfaceSubflow } from '../../interface-subflow';
import { AirdropPage } from './airdrop';
import { CodeInterface } from './code';
import { Error } from './error';
import { NotBotPage } from './not-a-bot';
import { PhoneInputInterface } from './phone-input';
import { Success } from './success';
import { VerifyAndMintInterface } from './verifiy-and-mint';

export interface MasaGreenProps {}
const InterfaceMasaGreen = () => {
  const pages = [
    AirdropPage,
    NotBotPage,
    PhoneInputInterface,
    CodeInterface,
    VerifyAndMintInterface,
  ];
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();

  const context = {
    phoneNumber,
    setPhoneNumber,
  };

  return (
    <InterfaceSubflow
      pages={pages}
      context={context}
      situationalPages={{
        success: Success,
        error: Error,
      }}
    />
  );
};

export default InterfaceMasaGreen;
