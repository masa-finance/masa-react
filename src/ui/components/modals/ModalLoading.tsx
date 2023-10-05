import React, { ReactNode } from 'react';
import { Spinner } from '../spinner';

export const ModalLoading = ({ titleText }: { titleText?: ReactNode }) => (
  <section className="interface-connected">
    <section className="loading">
      <h3 className="title">{titleText}</h3>
      <Spinner />
    </section>
  </section>
);
