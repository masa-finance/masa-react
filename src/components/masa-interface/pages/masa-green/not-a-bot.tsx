import { useMasa } from '../../../../provider';
import React, { useEffect } from 'react';
import { SubflowPage } from '../../interface-subflow';

const BOT_DISCLAIMER_TIMEOUT_SECONDS = 5;

export const NotBotPage: React.FunctionComponent<SubflowPage> = ({
  next,
}: SubflowPage) => {
  const { useModalSize } = useMasa();

  useModalSize?.({ width: 800, height: 360 });

  useEffect(() => {
    const timer = setTimeout(() => {
      next();
    }, BOT_DISCLAIMER_TIMEOUT_SECONDS * 1000);

    return () => clearTimeout(timer);
  }, [next]);

  return (
    <div className="not-a-bot-interface">
      <h2>
        To be eligible for Masa Green, we kindly ask that you prove you are not
        a bot.
      </h2>
      <p className="bot-icon">🤖</p>
    </div>
  );
};
