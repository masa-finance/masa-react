import React from 'react';
import { SubflowPage } from '../../interface-subflow';

export const NotBotPage = ({ next, back }: SubflowPage['props']) => {
  return (
    <div>
      Not a bot
      <button onClick={back}>Go back</button>
      <button onClick={next}>Go next</button>
    </div>
  );
};
