import React, { ReactNode } from 'react';
import { Spinner } from '../spinner';

export const ModalLoading = ({ titleText }: { titleText?: ReactNode }) => (
  <section className="interface-connected">
    <section>
      <h3 className="title">{titleText}</h3>
      <Spinner />
    </section>
  </section>
);
