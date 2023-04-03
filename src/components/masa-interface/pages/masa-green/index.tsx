import React from 'react';
import { InterfaceSubflow } from '../../interface-subflow';
import { AirdropPage } from './airdrop';
import { NotBotPage } from './not-a-bot';

const InterfaceMasaGreen = () => {
  const pages = [AirdropPage, NotBotPage];

  return <InterfaceSubflow pages={pages} />;
};

export default InterfaceMasaGreen;
