import React, { ReactNode } from 'react';
import cx from 'classnames';

const Backdrop = ({
  children,
  onClose,
  className,
}: {
  children: ReactNode;
  className?: string;
  onClose: () => void;
}) => {
  const backdropClassName = cx('masa-backdrop', className);
  return (
    <aside className={backdropClassName} onClick={onClose}>
      {children}
    </aside>
  );
};

export default Backdrop;
