import React, { useEffect } from 'react';
import { SubflowPage } from '../../interface-subflow';

const BOT_DISCLAIMER_TIMEOUT_SECONDS = 5;

export const NotBotPage: React.FunctionComponent<SubflowPage> = ({ next }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      next();
    }, BOT_DISCLAIMER_TIMEOUT_SECONDS * 1000);

    return () => clearTimeout(timer);
  }, [next]);

  return (
    <div>
      To be eligible for Masa Green, we kindly ask that you prove you are not a
      bot.
      <p className="text-6xl">🤖</p>
    </div>
  );
};
